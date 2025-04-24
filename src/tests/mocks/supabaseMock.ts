import { vi } from "vitest";

// Mock klienta Supabase
export const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
  },
  // Dodatkowe wymagane właściwości
  supabaseUrl: "https://test-url.supabase.co",
  supabaseKey: "test-key",
  realtime: {
    channel: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
  realtimeUrl: "https://test-url.supabase.co/realtime",
  rpc: vi.fn(),
  storage: {
    from: vi.fn(),
  },
  functions: {
    invoke: vi.fn(),
  },
};

// Eksportujemy typ, aby być kompatybilnym z oryginałem
export type MockSupabaseClient = typeof mockSupabaseClient;
