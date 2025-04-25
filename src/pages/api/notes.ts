import type { APIRoute } from "astro";
import { supabaseClient } from "../../db/supabase.client";
import { NoteService } from "../../lib/services/noteService";

export const GET: APIRoute = async ({ locals }) => {
  try {
    console.log("Otrzymano żądanie GET dla endpointu /api/notes");

    // Pobierz ID użytkownika z sesji
    const userId = locals.userId;
    if (!userId) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Brak autoryzacji",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Inicjalizacja serwisu
    const noteService = new NoteService(supabaseClient);

    // Pobieranie notatek
    const notes = await noteService.getAllNotes(userId);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Pobrano notatki pomyślnie",
        data: notes,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Błąd podczas obsługi żądania GET /api/notes:", error);

    return new Response(
      JSON.stringify({
        status: "error",
        message: "Wystąpił błąd podczas pobierania notatek",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log("Otrzymano żądanie POST dla endpointu /api/notes");

    // Pobierz ID użytkownika z sesji
    const userId = locals.userId;
    if (!userId) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Brak autoryzacji",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Sprawdzamy czy przesłano prawidłowe dane
    let requestData;
    try {
      requestData = await request.json();
      console.log("Odebrane dane:", requestData);
    } catch (error) {
      console.error("Nieprawidłowy format danych:", error);
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Nieprawidłowy format danych",
          error: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Walidacja danych
    const { note_text, note_summary } = requestData;

    if (!note_text || !note_summary) {
      console.error("Brak wymaganych pól:", { note_text, note_summary });
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Brak wymaganych pól: note_text, note_summary",
          received_data: requestData,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Inicjalizacja serwisu
    const noteService = new NoteService(supabaseClient);
    console.log("Serwis notatek zainicjalizowany");

    // Tworzenie nowej notatki - używamy userId z sesji
    console.log("Próba utworzenia notatki z danymi:", { note_text, note_summary });
    const newNote = await noteService.createNote(
      {
        note_text,
        note_summary,
      },
      userId
    );

    console.log("Wynik operacji utworzenia notatki:", newNote);

    if (!newNote) {
      console.error("Nie udało się utworzyć notatki - serwis zwrócił null");
      throw new Error("Nie udało się utworzyć notatki");
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Notatka została utworzona pomyślnie",
        data: newNote,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Błąd podczas obsługi żądania POST /api/notes:", error);

    return new Response(
      JSON.stringify({
        status: "error",
        message: "Wystąpił błąd podczas tworzenia notatki",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
