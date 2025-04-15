import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerateTripCommand, TripPlanDTO, CreatePlanCommand } from "../../types";

/**
 * Serwis odpowiedzialny za generowanie planu podróży z wykorzystaniem zewnętrznego serwisu AI.
 * W obecnej implementacji zwraca mockowane dane, docelowo będzie korzystać z OpenRouter.ai.
 */
export class TripGenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

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

      // 2. W przyszłej implementacji - wywołanie zewnętrznego API AI
      // TODO: Zaimplementować wywołanie OpenRouter.ai lub innego serwisu AI

      // 3. Generowanie planu podróży (obecnie mockowane dane)
      const planContent = this.generateMockPlan(command, notesContent);

      const tripPlan: TripPlanDTO = {
        plan: planContent,
        notes_used: command.selected_note_ids || [],
        generated_at: new Date().toISOString(),
      };

      // 4. Zapisanie wyniku generacji w bazie danych
      await this.savePlanToDatabase(userId, command, planContent);

      return tripPlan;
    } catch (error) {
      // Na tym etapie nie logujemy błędów do bazy danych
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

      const { error } = await this.supabase.from("plans").insert(newPlan);

      if (error) {
        console.error("Błąd podczas zapisywania planu do bazy danych:", error);
      } else {
        console.log("Plan podróży został pomyślnie zapisany do bazy danych");
      }
    } catch (saveError) {
      console.error("Wystąpił nieoczekiwany błąd podczas zapisywania planu:", saveError);
      // Nie rzucamy wyjątku, aby nie przerywać głównego przepływu
    }
  }

  /**
   * Tymczasowa metoda generująca mock planu podróży.
   * W przyszłości zostanie zastąpiona rzeczywistym wywołaniem API AI.
   */
  private generateMockPlan(command: GenerateTripCommand, notesContent: string[]): string {
    const { start_city, start_country, max_distance } = command;

    let plan = `🌍 Plan podróży z ${start_city}, ${start_country} (maksymalna odległość: ${max_distance} km):\n\n`;
    plan += "🗓️ Dzień 1:\n";
    plan += `🏙️ Rozpocznij podróż w ${start_city}\n`;
    plan += "🏛️ Zwiedzanie lokalnych atrakcji\n";
    plan += "🏨 Nocleg w centrum miasta\n\n";

    plan += "🗓️ Dzień 2:\n";
    plan += `🚗 Wycieczka do pobliskich miejscowości (odległość < ${max_distance / 2} km)\n`;
    plan += "🌆 Powrót do bazy wieczorem\n\n";

    plan += "🗓️ Dzień 3:\n";
    plan += `🚂 Dalsza podróż do miejsc oddalonych o maks. ${max_distance} km\n`;
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
