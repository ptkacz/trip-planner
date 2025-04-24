import { describe, it, expect, vi, beforeEach } from "vitest";
import { TripPlanService } from "@/lib/services/tripPlanService";
import type { TripPlanDTO } from "@/types";
import { mockSupabaseClient } from "../mocks/supabaseMock";

// Definicja typu dla mockowanych danych planu
interface MockPlanDTO {
  id: string;
  user_id: string;
  plan: string | null;
  start_country: string | null;
  start_city: string | null;
  max_distance: number | null;
  created_at: string;
}

describe("TripPlanService", () => {
  let tripPlanService: TripPlanService;
  const mockUserId = "test-user-id";

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Create a new instance of the service with the mock Supabase client
    tripPlanService = new TripPlanService(mockSupabaseClient as any);
  });

  describe("getPlan", () => {
    it("powinien zwrócić plan podróży, jeśli istnieje w bazie danych", async () => {
      // Mock data dla planu podróży
      const mockPlanData: MockPlanDTO = {
        id: "1",
        user_id: mockUserId,
        plan: "Plan podróży do Paryża",
        start_country: "Francja",
        start_city: "Paryż",
        max_distance: 100,
        created_at: "2023-01-01T00:00:00Z",
      };

      // Konfiguracja mocka supabase
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: mockPlanData,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      });

      // Wywołanie metody do testowania
      const result = await tripPlanService.getPlan(mockUserId);

      // Sprawdzenie czy metody zostały wywołane z odpowiednimi parametrami
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("plans");
      expect(selectMock).toHaveBeenCalledWith("*");
      expect(eqMock).toHaveBeenCalledWith("user_id", mockUserId);
      expect(maybeSingleMock).toHaveBeenCalled();

      // Sprawdzenie rezultatu
      expect(result).toEqual({
        plan: mockPlanData.plan || "",
        notes_used: [],
        generated_at: mockPlanData.created_at,
        start_country: mockPlanData.start_country || "",
        start_city: mockPlanData.start_city || "",
        max_distance: mockPlanData.max_distance || 0,
      } as TripPlanDTO);
    });

    it("powinien zwrócić null, jeśli wystąpi błąd podczas pobierania planu", async () => {
      // Konfiguracja mocka supabase zwracającego błąd
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "error", message: "Database error", details: "" },
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      });

      // Wywołanie metody do testowania
      const result = await tripPlanService.getPlan(mockUserId);

      // Sprawdzenie czy metody zostały wywołane
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("plans");
      expect(result).toBeNull();
    });

    it("powinien zwrócić null, jeśli nie znaleziono planu dla użytkownika", async () => {
      // Konfiguracja mocka supabase zwracającego null (brak planu)
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      });

      // Wywołanie metody do testowania
      const result = await tripPlanService.getPlan(mockUserId);

      // Sprawdzenie czy metody zostały wywołane
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("plans");
      expect(result).toBeNull();
    });
  });

  describe("generateMockPlan", () => {
    it("powinien generować mockowy plan podróży", () => {
      // Wywołanie metody do testowania
      const result = tripPlanService.generateMockPlan();

      // Weryfikacja struktury wyniku
      expect(result).toHaveProperty("plan");
      expect(result).toHaveProperty("notes_used");
      expect(result).toHaveProperty("generated_at");
      expect(result.notes_used).toEqual([]);
      expect(typeof result.plan).toBe("string");
      expect(result.plan).toContain("Plan podróży");
      expect(result.plan).toContain("Dzień 1");
    });
  });
});
