import type { APIRoute } from "astro";
import { authService } from "../../../lib/services/authService";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const session = await authService.getSession();
    const isLoggedIn = !!session;

    return new Response(
      JSON.stringify({
        isLoggedIn,
        user:
          isLoggedIn && session?.user
            ? {
                id: session.user.id,
                email: session.user.email,
                created_at: session.user.created_at,
              }
            : null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Błąd podczas sprawdzania statusu autentykacji:", error);

    return new Response(
      JSON.stringify({
        isLoggedIn: false,
        error: "Wystąpił błąd podczas sprawdzania statusu autentykacji",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
