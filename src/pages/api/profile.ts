import type { APIRoute } from "astro";
import { supabaseClient } from "../../db/supabase.client";
import { ProfileService } from "../../lib/services/profileService";
import type { CreateProfileCommand } from "../../types";

// Endpoint nie jest prerenderowany, dynamiczny
export const prerender = false;

// Handler dla metody GET
export const GET: APIRoute = async ({ locals }) => {
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

    // Inicjalizacja serwisu
    const profileService = new ProfileService(supabaseClient);

    // Pobranie profilu z bazy danych
    const profileData = await profileService.getProfile(userId);

    // Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify({
        status: "success",
        data: profileData || null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Błąd podczas pobierania profilu:", error);

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

    // Inicjalizacja serwisu
    const profileService = new ProfileService(supabaseClient);

    // Parsowanie ciała żądania
    const body = await request.json();
    const profileData: CreateProfileCommand = {
      travel_type: body.travel_type,
      travel_style: body.travel_style,
      meal_preference: body.meal_preference,
    };

    // Zapisanie profilu użytkownika
    const savedProfile = await profileService.saveProfile(userId, profileData);

    // Jeśli nie udało się zapisać profilu, zwracamy błąd
    if (!savedProfile) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Nie udało się zapisać profilu",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify({
        status: "success",
        data: savedProfile,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Błąd podczas zapisywania profilu:", error);

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

// Handler dla metody PUT - działa tak samo jak POST, ale zwraca status 200
export const PUT: APIRoute = async ({ request, locals }) => {
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

    // Inicjalizacja serwisu
    const profileService = new ProfileService(supabaseClient);

    // Parsowanie ciała żądania
    const body = await request.json();
    const profileData: CreateProfileCommand = {
      travel_type: body.travel_type,
      travel_style: body.travel_style,
      meal_preference: body.meal_preference,
    };

    // Zapisanie profilu użytkownika
    const savedProfile = await profileService.saveProfile(userId, profileData);

    // Jeśli nie udało się zapisać profilu, zwracamy błąd
    if (!savedProfile) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Nie udało się zapisać profilu",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify({
        status: "success",
        data: savedProfile,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error);

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
