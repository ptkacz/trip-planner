import { z } from "zod";
import type { APIRoute } from "astro";
import { supabaseClient } from "../../../db/supabase.client";
import type { GenerateTripCommand } from "../../../types";
import { TripGenerationService } from "../../../lib/services/tripGenerationService";

// Walidacja danych wejściowych za pomocą Zod
const GenerateTripCommandSchema = z.object({
  start_country: z.string().min(1, "Kraj początkowy jest wymagany"),
  start_city: z.string().min(1, "Miasto początkowe jest wymagane"),
  max_distance: z.number().positive("Maksymalna odległość musi być dodatnia"),
  selected_note_ids: z.array(z.string().uuid()).optional(),
});

// Endpoint nie jest prerenderowany, dynamiczny
export const prerender = false;

// Handler dla metody POST
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Pobierz ID użytkownika z sesji
    const userId = locals.userId;
    if (!userId) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Brak autoryzacji",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Parsowanie i walidacja danych wejściowych
    const requestData = await request.json();
    const validationResult = GenerateTripCommandSchema.safeParse(requestData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Nieprawidłowe dane wejściowe",
          errors: validationResult.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validatedData: GenerateTripCommand = validationResult.data;

    // 2. Wywołanie serwisu generacji trasy
    const tripGenerationService = new TripGenerationService(supabaseClient);
    const tripPlanData = await tripGenerationService.generateTrip(userId, validatedData);

    // 3. Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify({
        status: "success",
        data: tripPlanData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Błąd podczas generowania planu podróży:", error);

    // Obsługa różnych typów błędów
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Błąd walidacji danych",
          errors: error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ogólny błąd serwera dla pozostałych przypadków
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Wystąpił błąd podczas przetwarzania żądania",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
