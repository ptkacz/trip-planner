import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerateTripCommand, TripPlanDTO, CreatePlanCommand, ProfileDTO } from "../../types";
import { OpenRouterService } from "./openrouter.service";
import { ProfileService } from "./profileService";

/**
 * Serwis odpowiedzialny za generowanie planu podróży z wykorzystaniem zewnętrznego serwisu AI.
 * Korzysta z OpenRouter.ai do generowania planów podróży.
 */
export class TripGenerationService {
  private openRouterService: OpenRouterService;

  constructor(private readonly supabase: SupabaseClient) {
    this.openRouterService = new OpenRouterService({
      systemMessage:
        "Jesteś ekspertem w planowaniu podróży. Tworzysz szczegółowe i interesujące plany podróży zawierające emotikony związane z podróżowaniem.",
      modelName: "gpt-4o-mini",
      modelParameters: {
        temperature: 0.8,
        max_tokens: 2000,
      },
    });
  }

  /**
   * Generuje plan podróży na podstawie podanych parametrów.
   * @param userId ID zalogowanego użytkownika
   * @param command Obiekt zawierający parametry generowania trasy
   * @returns Wygenerowany plan podróży
   */
  async generateTrip(userId: string, command: GenerateTripCommand): Promise<TripPlanDTO> {
    try {
      // 1. Pobranie notatek użytkownika, jeśli zostały określone
      let notesContent: string[] = [];

      if (command.selected_note_ids && command.selected_note_ids.length > 0) {
        const { data: notes, error } = await this.supabase
          .from("notes")
          .select("note_text")
          .in("id", command.selected_note_ids)
          .eq("user_id", userId);

        if (error) {
          console.error("Błąd podczas pobierania notatek:", error);
          throw new Error(`Błąd podczas pobierania notatek: ${error.message}`);
        }

        notesContent = notes?.map((note) => note.note_text) || [];
      }

      // 2. Pobranie profilu użytkownika
      const profileService = new ProfileService(this.supabase);
      const userProfile = await profileService.getProfile(userId);

      // 3. Generowanie planu podróży za pomocą OpenRouter
      const planContent = await this.generateAIPlan(command, notesContent, userProfile);

      const tripPlan: TripPlanDTO = {
        plan: planContent,
        notes_used: command.selected_note_ids || [],
        generated_at: new Date().toISOString(),
        start_country: command.start_country,
        start_city: command.start_city,
        max_distance: command.max_distance,
      };

      // 4. Zapisanie wyniku generacji w bazie danych
      await this.savePlanToDatabase(userId, command, planContent);

      return tripPlan;
    } catch (error) {
      console.error("Wystąpił błąd podczas generowania planu podróży:", error);
      throw error;
    }
  }

  /**
   * Zapisuje wygenerowany plan podróży do bazy danych.
   * @param userId ID użytkownika
   * @param command Parametry generowania planu
   * @param planContent Treść wygenerowanego planu
   */
  private async savePlanToDatabase(userId: string, command: GenerateTripCommand, planContent: string): Promise<void> {
    try {
      const newPlan: CreatePlanCommand = {
        user_id: userId,
        plan: planContent,
        start_city: command.start_city,
        start_country: command.start_country,
        max_distance: command.max_distance,
      };

      console.log("Próba zapisu planu do bazy danych:", {
        userId,
        start_city: command.start_city,
        start_country: command.start_country,
      });

      // Najpierw sprawdzamy czy istnieje już plan dla tego użytkownika
      const { data: existingPlan, error: fetchError } = await this.supabase
        .from("plans")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 to "Did not find any rows matching the query"
        console.error("Błąd podczas sprawdzania istniejącego planu:", {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
        });
        return;
      }

      let error;
      if (existingPlan?.id) {
        // Aktualizujemy istniejący plan
        console.log("Aktualizacja istniejącego planu dla użytkownika:", userId);
        const { error: updateError } = await this.supabase.from("plans").update(newPlan).eq("id", existingPlan.id);
        error = updateError;
      } else {
        // Tworzymy nowy plan
        console.log("Tworzenie nowego planu dla użytkownika:", userId);
        const { error: insertError } = await this.supabase.from("plans").insert(newPlan);
        error = insertError;
      }

      if (error) {
        console.error("Błąd podczas zapisywania planu do bazy danych:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
      } else {
        console.log("Plan podróży został pomyślnie zapisany do bazy danych");
      }
    } catch (saveError) {
      console.error("Wystąpił nieoczekiwany błąd podczas zapisywania planu:", saveError);
    }
  }

  /**
   * Generuje plan podróży przy użyciu OpenRouter API.
   * @param command Parametry generowania planu
   * @param notesContent Treść notatek użytkownika
   * @param userProfile Profil użytkownika
   * @returns Wygenerowany plan podróży
   */
  private async generateAIPlan(
    command: GenerateTripCommand,
    notesContent: string[],
    userProfile: ProfileDTO | null
  ): Promise<string> {
    const { start_city, start_country, max_distance } = command;

    // Przygotowanie promptu dla LLM
    let prompt = `Stwórz plan podróży zaczynającej się w mieście ${start_city}, ${start_country}. `;
    prompt += `Maksymalna odległość podróży to ${max_distance} km. `;
    prompt += `Plan powinien być szczegółowy - z uwzględnieniem atrakcji, miejsc noclegowych, transportu i rekomendacji dotyczących lokalnych potraw. `;
    prompt += `Plan powinien być podzielony na dni i zawierać nagłówki z numerami dni. `;
    prompt += `Używaj różnorodnych emoji związanych z podróżowaniem przy każdym punkcie planu (np. 🌍, 🏨, 🍽️, 🚆, 🏛️, 🏖️, 🏔️, 🏞️, itp.). `;

    // Dodanie informacji z profilu użytkownika
    if (userProfile) {
      prompt += `\nPlan powinien uwzględniać następujące preferencje użytkownika:\n`;

      if (userProfile.travel_type) {
        prompt += `- Preferowany typ podróży: ${userProfile.travel_type}\n`;
      }

      if (userProfile.travel_style) {
        prompt += `- Preferowany styl podróżowania: ${userProfile.travel_style}\n`;
      }

      if (userProfile.meal_preference) {
        prompt += `- Preferencje kulinarne: ${userProfile.meal_preference}\n`;
      }

      prompt += `\n`;
    }

    // Dodanie informacji z notatek użytkownika
    if (notesContent.length > 0) {
      prompt += `Uwzględnij następujące notatki użytkownika w planie podróży (w tym preferencje dotyczące długości wycieczki): \n\n`;
      notesContent.forEach((note, index) => {
        prompt += `Notatka ${index + 1}: ${note}\n\n`;
      });
    }

    try {
      // Wywołanie OpenRouter API
      console.log("Wysyłanie zapytania do OpenRouter API...");
      const response = await this.openRouterService.sendChatRequest(prompt);

      // Parsowanie odpowiedzi
      if (typeof response === "object" && response.content) {
        console.log("OpenRouter API zwrócił prawidłową odpowiedź z treścią");
        return response.content as string;
      } else if (
        typeof response === "object" &&
        response.choices &&
        Array.isArray(response.choices) &&
        response.choices.length > 0
      ) {
        const firstChoice = response.choices[0] as Record<string, unknown>;
        if (firstChoice.message && typeof firstChoice.message === "object") {
          const message = firstChoice.message as Record<string, unknown>;
          if (typeof message.content === "string") {
            console.log("OpenRouter API zwrócił prawidłową odpowiedź z wiadomością");
            return message.content as string;
          }
        }
      }

      // Jeśli doszliśmy do tego miejsca, odpowiedź nie zawiera treści w oczekiwanym formacie
      console.error("Nieprawidłowy format odpowiedzi API:", response);

      // Fallback do danych mockowych w przypadku błędu
      console.warn("Używanie danych mockowych jako fallback");
      return this.generateMockPlan(command, notesContent, userProfile);
    } catch (error) {
      console.error("Błąd podczas generowania planu podróży z API:", error);

      // Fallback do danych mockowych w przypadku błędu
      console.warn("Używanie danych mockowych jako fallback");
      return this.generateMockPlan(command, notesContent, userProfile);
    }
  }

  /**
   * Generuje mock planu podróży jako rozwiązanie awaryjne.
   * @param command Parametry generowania planu
   * @param notesContent Treść notatek użytkownika
   * @param userProfile Profil użytkownika
   * @returns Wygenerowany mock planu podróży
   */
  private generateMockPlan(
    command: GenerateTripCommand,
    notesContent: string[],
    userProfile: ProfileDTO | null = null
  ): string {
    const { start_city, start_country, max_distance } = command;

    let plan = `🌍 Plan podróży z ${start_city}, ${start_country} (maksymalna odległość: ${max_distance} km):\n\n`;

    // Dodanie informacji o profilu użytkownika
    if (userProfile) {
      plan += "👤 Preferencje użytkownika:\n";
      if (userProfile.travel_type) {
        plan += `- Typ podróży: ${userProfile.travel_type}\n`;
      }
      if (userProfile.travel_style) {
        plan += `- Styl podróżowania: ${userProfile.travel_style}\n`;
      }
      if (userProfile.meal_preference) {
        plan += `- Preferencje kulinarne: ${userProfile.meal_preference}\n`;
      }
      plan += "\n";
    }

    plan += "🗓️ Dzień 1:\n";
    plan += `🏙️ Rozpocznij podróż w ${start_city}\n`;
    plan += "🏛️ Zwiedzanie lokalnych atrakcji\n";
    plan += "🍽️ Obiad w lokalnej restauracji\n";
    plan += "🏨 Nocleg w centrum miasta\n\n";

    plan += "🗓️ Dzień 2:\n";
    plan += `🚗 Wycieczka do pobliskich miejscowości (odległość < ${max_distance / 2} km)\n`;
    plan += "🏞️ Zwiedzanie okolicznych atrakcji przyrodniczych\n";
    plan += "🍦 Przerwa na lokalny przysmak\n";
    plan += "🌆 Powrót do bazy wieczorem\n\n";

    plan += "🗓️ Dzień 3:\n";
    plan += `🚂 Dalsza podróż do miejsc oddalonych o maks. ${max_distance} km\n`;
    plan += "🏰 Zwiedzanie zabytków historycznych\n";
    plan += "🍷 Kolacja w regionalnej restauracji\n";
    plan += "🏠 Powrót do domu\n\n";

    // Dodanie informacji z notatek, jeśli są dostępne
    if (notesContent.length > 0) {
      plan += "📝 Uwzględnione notatki:\n";
      notesContent.forEach((note, index) => {
        // Dodajemy tylko fragment notatki w celu zachowania czytelności
        const notePreview = note.length > 100 ? `${note.substring(0, 100)}...` : note;
        plan += `- Notatka ${index + 1}: ${notePreview}\n`;
      });
    }

    return plan;
  }
}
