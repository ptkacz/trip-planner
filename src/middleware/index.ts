import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";

export const onRequest = defineMiddleware(async (context, next) => {
  // Inicjalizacja klienta Supabase w kontekście
  context.locals.supabase = supabaseClient;

  // Pobranie sesji użytkownika
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Dodanie informacji o użytkowniku do kontekstu
  context.locals.session = session;
  context.locals.user = session?.user;
  context.locals.isLoggedIn = !!session;

  // Autoryzacja dostępu do chronionych stron
  const isProtectedRoute = context.url.pathname.startsWith("/profile") || context.url.pathname.startsWith("/notes");

  if (isProtectedRoute && !context.locals.isLoggedIn) {
    // Przekierowanie na stronę logowania
    return context.redirect("/auth/login?redirect=" + encodeURIComponent(context.url.pathname));
  }

  return next();
});
