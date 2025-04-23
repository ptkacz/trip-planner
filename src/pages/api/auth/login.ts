import type { APIRoute } from "astro";
import { z } from "zod";
import { authService } from "../../../lib/services/authService";

export const prerender = false;

const loginSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowe dane logowania",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Logowanie użytkownika
    const { email, password } = result.data;
    const response = await authService.login({ email, password });

    // Zwracanie odpowiedzi
    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas logowania:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił błąd podczas logowania",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
