import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Konfiguracja MSW dla mockowania API
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
