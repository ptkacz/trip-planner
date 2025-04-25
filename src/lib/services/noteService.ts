import type { SupabaseClient } from "../../db/supabase.client";
import type { NoteDTO, CreateNoteCommand, UpdateNoteCommand } from "../../types";

/**
 * Serwis odpowiedzialny za operacje na notatkach użytkowników.
 */
export class NoteService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Pobiera wszystkie notatki dla danego użytkownika.
   * @param userId ID użytkownika
   * @returns Lista notatek użytkownika lub pusta tablica w przypadku błędu
   */
  async getAllNotes(userId: string): Promise<NoteDTO[]> {
    if (!userId) {
      console.error("getAllNotes: Brak ID użytkownika");
      return [];
    }

    try {
      console.log("Próba pobrania wszystkich notatek dla użytkownika:", userId);

      const { data: notes, error } = await this.supabase
        .from("notes")
        .select("id, note_text, note_summary, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Błąd podczas pobierania notatek:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return [];
      }

      console.log(`Pobrano ${notes?.length || 0} notatek dla użytkownika:`, userId);
      return notes || [];
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas pobierania notatek:", error);
      return [];
    }
  }

  /**
   * Pobiera pojedynczą notatkę na podstawie ID.
   * @param noteId ID notatki
   * @param userId ID użytkownika
   * @returns Notatka lub null, jeśli notatka nie istnieje
   */
  async getNote(noteId: string, userId: string): Promise<NoteDTO | null> {
    if (!userId) {
      console.error("getNote: Brak ID użytkownika");
      return null;
    }

    try {
      console.log("Próba pobrania notatki o ID:", noteId);

      const { data: note, error } = await this.supabase
        .from("notes")
        .select("id, note_text, note_summary, created_at")
        .eq("id", noteId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Błąd podczas pobierania notatki:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return null;
      }

      if (!note) {
        console.log("Nie znaleziono notatki o ID:", noteId);
        return null;
      }

      console.log("Pobrano notatkę o ID:", noteId);
      return note;
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas pobierania notatki:", error);
      return null;
    }
  }

  /**
   * Tworzy nową notatkę dla użytkownika.
   * @param noteData Dane notatki do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzona notatka lub null w przypadku błędu
   */
  async createNote(noteData: CreateNoteCommand, userId: string): Promise<NoteDTO | null> {
    if (!userId) {
      console.error("createNote: Brak ID użytkownika");
      return null;
    }

    try {
      console.log("Próba utworzenia nowej notatki dla użytkownika:", userId);
      console.log("Dane notatki:", JSON.stringify(noteData));

      // Przygotowanie danych
      const insertData = {
        ...noteData,
        user_id: userId,
      };
      console.log("Dane do wstawienia:", JSON.stringify(insertData));

      // Tworzymy nową notatkę
      console.log("Wykonuję query insert do tabeli notes...");
      const result = await this.supabase.from("notes").insert(insertData).select().single();

      console.log("Surowy wynik zapytania:", JSON.stringify(result));

      if (result.error) {
        console.error("Błąd podczas tworzenia notatki:", {
          code: result.error.code,
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
        });
        return null;
      }

      console.log("Notatka została utworzona pomyślnie:", result.data);
      return result.data;
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas tworzenia notatki:", error);
      if (error instanceof Error) {
        console.error("Stack trace:", error.stack);
      }
      return null;
    }
  }

  /**
   * Aktualizuje istniejącą notatkę użytkownika.
   * @param noteId ID notatki do aktualizacji
   * @param noteData Dane notatki do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowana notatka lub null w przypadku błędu
   */
  async updateNote(noteId: string, noteData: UpdateNoteCommand, userId: string): Promise<NoteDTO | null> {
    if (!userId) {
      console.error("updateNote: Brak ID użytkownika");
      return null;
    }

    try {
      console.log("Próba aktualizacji notatki o ID:", noteId);

      // Sprawdzamy, czy notatka istnieje i należy do użytkownika
      const existingNote = await this.getNote(noteId, userId);
      if (!existingNote) {
        console.log("Nie znaleziono notatki o ID:", noteId);
        return null;
      }

      // Aktualizacja notatki
      const { data: updatedNote, error } = await this.supabase
        .from("notes")
        .update(noteData)
        .eq("id", noteId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Błąd podczas aktualizacji notatki:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return null;
      }

      console.log("Notatka została zaktualizowana pomyślnie");
      return updatedNote;
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas aktualizacji notatki:", error);
      return null;
    }
  }

  /**
   * Usuwa notatkę użytkownika.
   * @param noteId ID notatki do usunięcia
   * @param userId ID użytkownika
   * @returns true jeśli operacja się powiodła, false w przeciwnym razie
   */
  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    if (!userId) {
      console.error("deleteNote: Brak ID użytkownika");
      return false;
    }

    try {
      console.log("Próba usunięcia notatki o ID:", noteId);

      // Usuwamy notatkę
      const { error } = await this.supabase.from("notes").delete().eq("id", noteId).eq("user_id", userId);

      if (error) {
        console.error("Błąd podczas usuwania notatki:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        return false;
      }

      console.log("Notatka została usunięta pomyślnie");
      return true;
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd podczas usuwania notatki:", error);
      return false;
    }
  }
}
