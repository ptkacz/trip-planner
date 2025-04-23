import type { APIRoute } from "astro";
import { authService } from "../../../lib/services/authService";

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const response = await authService.logout();

    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas wylogowywania:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił błąd podczas wylogowywania",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
