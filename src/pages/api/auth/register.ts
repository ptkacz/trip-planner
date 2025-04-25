import type { APIRoute } from "astro";
import { z } from "zod";
import { authService } from "@/lib/services/authService";

const registerSchema = z
  .object({
    email: z.string().email("Niepoprawny format adresu email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną dużą literę")
      .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
    password_confirmation: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Hasła nie są identyczne",
    path: ["password_confirmation"],
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowe dane rejestracji",
          details: result.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Rejestracja użytkownika
    const { email, password } = result.data;
    const response = await authService.register({
      email,
      password,
      password_confirmation: result.data.password_confirmation,
    });

    // Zwracanie odpowiedzi
    return new Response(JSON.stringify(response), {
      status: response.success ? 201 : 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas rejestracji:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił błąd podczas rejestracji",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
