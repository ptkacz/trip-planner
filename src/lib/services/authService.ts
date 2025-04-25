import { supabaseClient } from "../../db/supabase.client";
import type { LoginCommand, RegisterCommand, ResetPasswordCommand, AuthResponse, UserDTO } from "../../types";

export const authService = {
  /**
   * Logowanie użytkownika
   */
  async login({ email, password }: LoginCommand): Promise<AuthResponse> {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user: Partial<UserDTO> = {
        id: data.user.id,
        email: data.user.email || "",
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: data.user.updated_at || new Date().toISOString(),
      };

      return {
        success: true,
        user: user as UserDTO,
      };
    } catch (error) {
      console.error("Błąd logowania:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd podczas logowania",
      };
    }
  },

  /**
   * Rejestracja nowego użytkownika
   */
  async register({ email, password }: RegisterCommand): Promise<AuthResponse> {
    try {
      // 1. Zarejestruj użytkownika w Supabase Auth
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        return { success: true };
      }

      // 2. Utwórz rekord w tabeli public.users
      const { error: insertError } = await supabaseClient.from("users").insert({
        id: data.user.id,
        email: data.user.email || "",
        hashed_password: "auth.stored_in_auth", // Hasło jest przechowywane w systemie auth, tutaj tylko placeholder
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: data.user.updated_at || new Date().toISOString(),
      });

      if (insertError) {
        console.error("Błąd tworzenia użytkownika w bazie danych:", insertError);
        // Jeśli wystąpił błąd przy tworzeniu rekordu w public.users, ale użytkownik został już utworzony w auth,
        // zwracamy sukces, aby użytkownik nie był zdezorientowany, ale logujemy błąd
        // TODO: Lepsze rozwiązanie to dodanie procesu naprawy tych niezgodności
      }

      const user: Partial<UserDTO> = {
        id: data.user.id,
        email: data.user.email || "",
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: data.user.updated_at || new Date().toISOString(),
      };

      return {
        success: true,
        user: user as UserDTO,
      };
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd podczas rejestracji",
      };
    }
  },

  /**
   * Wylogowanie użytkownika
   */
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Błąd wylogowania:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd podczas wylogowania",
      };
    }
  },

  /**
   * Resetowanie hasła
   */
  async resetPassword({ email }: ResetPasswordCommand): Promise<AuthResponse> {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirmation`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Błąd resetowania hasła:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd podczas resetowania hasła",
      };
    }
  },

  /**
   * Pobranie aktualnej sesji
   */
  async getSession() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error("Błąd pobierania sesji:", error);
      return null;
    }
  },

  /**
   * Sprawdzenie czy użytkownik jest zalogowany
   */
  async isLoggedIn(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  },
};
