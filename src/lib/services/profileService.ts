import type { SupabaseClient } from "../../db/supabase.client";
import type { ProfileDTO, CreateProfileCommand } from "../../types";

/**
 * Serwis odpowiedzialny za operacje na profilach użytkowników.
 */
export class ProfileService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Pobiera profil użytkownika na podstawie ID.
   * @param userId ID użytkownika
   * @returns Profil użytkownika lub null, jeśli profil nie istnieje
   */
  async getProfile(userId: string): Promise<ProfileDTO | null> {
    try {
      console.log("Próba pobrania profilu dla użytkownika:", userId);

      // Pobieramy profil z bazy danych
      const { data: profileData, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Błąd podczas pobierania profilu:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return null;
      }

      // Jeśli nie znaleziono profilu, zwracamy null
      if (!profileData) {
        console.log("Nie znaleziono profilu dla użytkownika:", userId);
        return null;
      }

      console.log("Pobrano profil dla użytkownika:", userId);
      return profileData;
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas pobierania profilu:", error);
      return null;
    }
  }

  /**
   * Zapisuje profil użytkownika.
   * Jeśli profil istnieje, aktualizuje go. Jeśli nie, tworzy nowy.
   * @param userId ID użytkownika
   * @param profileData Dane profilu do zapisania
   * @returns Zapisany profil lub null w przypadku błędu
   */
  async saveProfile(userId: string, profileData: CreateProfileCommand): Promise<ProfileDTO | null> {
    try {
      console.log("Próba zapisania profilu dla użytkownika:", userId);

      // Sprawdzamy, czy profil już istnieje
      const existingProfile = await this.getProfile(userId);

      if (existingProfile) {
        console.log("Aktualizacja istniejącego profilu dla użytkownika:", userId);

        // Aktualizacja istniejącego profilu
        const { data: updatedProfile, error } = await this.supabase
          .from("profiles")
          .update({
            travel_type: profileData.travel_type,
            travel_style: profileData.travel_style,
            meal_preference: profileData.meal_preference,
          })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) {
          console.error("Błąd podczas aktualizacji profilu:", {
            code: error.code,
            message: error.message,
            details: error.details,
          });
          return null;
        }

        console.log("Profil został zaktualizowany pomyślnie");
        return updatedProfile;
      } else {
        console.log("Tworzenie nowego profilu dla użytkownika:", userId);

        // Tworzenie nowego profilu
        const { data: newProfile, error } = await this.supabase
          .from("profiles")
          .insert({
            user_id: userId,
            travel_type: profileData.travel_type,
            travel_style: profileData.travel_style,
            meal_preference: profileData.meal_preference,
          })
          .select()
          .single();

        if (error) {
          console.error("Błąd podczas tworzenia profilu:", {
            code: error.code,
            message: error.message,
            details: error.details,
          });
          return null;
        }

        console.log("Profil został utworzony pomyślnie");
        return newProfile;
      }
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas zapisywania profilu:", error);
      return null;
    }
  }
}
