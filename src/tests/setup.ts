import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";
import { mockSupabaseClient } from "./mocks/supabaseMock";

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Konfiguracja MSW dla mockowania API
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mockowanie modułu Supabase
vi.mock("@/db/supabase.client", async () => {
  return {
    supabaseClient: mockSupabaseClient,
    DEFAULT_USER_ID: "test-user-id",
  };
});
