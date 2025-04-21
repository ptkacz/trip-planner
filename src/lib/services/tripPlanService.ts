import type { SupabaseClient } from "../../db/supabase.client";
import type { PlanDTO, TripPlanDTO } from "../../types";

/**
 * Serwis odpowiedzialny za pobieranie planu podróży z bazy danych.
 */
export class TripPlanService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Pobiera ostatnio zapisany plan podróży dla określonego użytkownika.
   * @param userId ID użytkownika
   * @returns Plan podróży lub null, jeśli plan nie istnieje
   */
  async getPlan(userId: string): Promise<TripPlanDTO | null> {
    try {
      console.log("Próba pobrania planu podróży dla użytkownika:", userId);

      // Pobieramy plan podróży z bazy danych
      const { data: planData, error } = await this.supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Błąd podczas pobierania planu podróży:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return null;
      }

      // Jeśli nie znaleziono planu, zwracamy null
      if (!planData) {
        console.log("Nie znaleziono planu podróży dla użytkownika:", userId);
        return null;
      }

      console.log("Pobrano plan podróży dla użytkownika:", userId);

      // Konwertujemy dane z bazy na DTO
      return this.convertToTripPlanDTO(planData);
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas pobierania planu:", error);
      return null;
    }
  }

  /**
   * Konwertuje dane planu z bazy danych na format TripPlanDTO.
   * @param planData Dane planu z bazy danych
   * @returns Plan podróży w formacie TripPlanDTO
   */
  private convertToTripPlanDTO(planData: PlanDTO): TripPlanDTO {
    return {
      plan: planData.plan || "",
      notes_used: [], // Brak informacji o użytych notatkach w bazie danych
      generated_at: planData.created_at,
      start_country: planData.start_country || "",
      start_city: planData.start_city || "",
      max_distance: planData.max_distance || 0,
    };
  }

  /**
   * Generuje mockowy plan podróży jako rozwiązanie awaryjne.
   * @returns Wygenerowany mock planu podróży
   */
  generateMockPlan(): TripPlanDTO {
    const plan = `🌍 Plan podróży (przykład):\n\n`;
    const mockPlan =
      plan +
      "🗓️ Dzień 1:\n" +
      "🏙️ Rozpocznij podróż w mieście startowym\n" +
      "🏛️ Zwiedzanie lokalnych atrakcji\n" +
      "🍽️ Obiad w lokalnej restauracji\n" +
      "🏨 Nocleg w centrum miasta\n\n" +
      "🗓️ Dzień 2:\n" +
      "🚗 Wycieczka do pobliskich miejscowości\n" +
      "🏞️ Zwiedzanie okolicznych atrakcji przyrodniczych\n" +
      "🍦 Przerwa na lokalny przysmak\n" +
      "🌆 Powrót do bazy wieczorem\n\n" +
      "🗓️ Dzień 3:\n" +
      "🚂 Dalsza podróż do ciekawych miejsc\n" +
      "🏰 Zwiedzanie zabytków historycznych\n" +
      "🍷 Kolacja w regionalnej restauracji\n" +
      "🏠 Powrót do domu\n\n";

    return {
      plan: mockPlan,
      notes_used: [],
      generated_at: new Date().toISOString(),
      start_country: "",
      start_city: "",
      max_distance: 0,
    };
  }
}
