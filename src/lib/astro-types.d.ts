import type { SupabaseClient } from "@supabase/supabase-js";
import type { Session, User } from "@supabase/supabase-js";

declare namespace App {
  interface Locals {
    supabase: SupabaseClient;
    session?: Session | null;
    user?: User | null;
    isLoggedIn: boolean;
  }
}
