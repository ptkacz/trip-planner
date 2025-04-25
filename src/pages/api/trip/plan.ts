import type { APIRoute } from "astro";
import { supabaseClient } from "../../../db/supabase.client";
import { TripPlanService } from "../../../lib/services/tripPlanService";

// Endpoint nie jest prerenderowany, dynamiczny
export const prerender = false;

// Handler dla metody GET
export const GET: APIRoute = async ({ locals }) => {
  try {
    // Inicjalizacja serwisu
    const tripPlanService = new TripPlanService(supabaseClient);

    // Jeśli użytkownik jest zalogowany, pobieramy jego plan
    if (locals.userId) {
      // Pobranie planu podróży z bazy danych
      const tripPlanData = await tripPlanService.getPlan(locals.userId);

      // Jeśli nie znaleziono planu, zwracamy odpowiedź z informacją o braku planu
      if (!tripPlanData) {
        return new Response(
          JSON.stringify({
            status: "success",
            data: null,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Zwrócenie odpowiedzi
      return new Response(
        JSON.stringify({
          status: "success",
          data: tripPlanData,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Dla niezalogowanego użytkownika zwracamy null (co spowoduje wyświetlenie mocka)
      return new Response(
        JSON.stringify({
          status: "success",
          data: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Błąd podczas pobierania planu podróży:", error);

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Wystąpił błąd podczas przetwarzania żądania",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
