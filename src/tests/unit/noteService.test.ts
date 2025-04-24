import { describe, it, expect, vi, beforeEach } from "vitest";
import { NoteService } from "@/lib/services/noteService";
import type { NoteDTO, CreateNoteCommand } from "@/types";
import { mockSupabaseClient } from "../mocks/supabaseMock";

describe("NoteService", () => {
  let noteService: NoteService;
  const mockUserId = "test-user-id";

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Create a new instance of the service with the mock Supabase client
    noteService = new NoteService(mockSupabaseClient as any);
  });

  describe("getAllNotes", () => {
    it("powinien zwrócić listę notatek dla użytkownika", async () => {
      // Mock data dla notatek
      const mockNotes: NoteDTO[] = [
        {
          id: "1",
          note_text: "Tekst notatki 1",
          note_summary: "Podsumowanie 1",
          created_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          note_text: "Tekst notatki 2",
          note_summary: "Podsumowanie 2",
          created_at: "2023-01-02T00:00:00Z",
        },
      ];

      // Konfiguracja mocków dla chain z Supabase
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const orderMock = vi.fn().mockResolvedValue({
        data: mockNotes,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Wywołanie metody do testowania
      const result = await noteService.getAllNotes(mockUserId);

      // Sprawdzenie czy metody zostały wywołane z odpowiednimi parametrami
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("notes");
      expect(selectMock).toHaveBeenCalledWith("id, note_text, note_summary, created_at");
      expect(eqMock).toHaveBeenCalledWith("user_id", mockUserId);
      expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });

      // Sprawdzenie rezultatu
      expect(result).toEqual(mockNotes);
    });

    it("powinien zwrócić pustą tablicę, jeśli wystąpi błąd", async () => {
      // Konfiguracja mocków dla zwrócenia błędu
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const orderMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "error", message: "Database error", details: "" },
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        order: orderMock,
      });

      // Wywołanie metody do testowania
      const result = await noteService.getAllNotes(mockUserId);

      // Sprawdzenie rezultatu
      expect(result).toEqual([]);
    });
  });

  describe("getNote", () => {
    it("powinien zwrócić pojedynczą notatkę na podstawie ID", async () => {
      const mockNoteId = "note-123";
      const mockNote: NoteDTO = {
        id: mockNoteId,
        note_text: "Tekst notatki",
        note_summary: "Podsumowanie",
        created_at: "2023-01-01T00:00:00Z",
      };

      // Konfiguracja mocków
      const selectMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const maybeSingleMock = vi.fn().mockResolvedValue({
        data: mockNote,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      });

      // Wywołanie metody do testowania
      const result = await noteService.getNote(mockNoteId, mockUserId);

      // Weryfikacja
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("notes");
      expect(selectMock).toHaveBeenCalledWith("id, note_text, note_summary, created_at");
      expect(eqMock).toHaveBeenCalledTimes(2); // Dwa wywołania eq (dla id i user_id)
      expect(result).toEqual(mockNote);
    });

    it("powinien zwrócić null, jeśli notatka nie istnieje", async () => {
      const mockNoteId = "non-existent-note";

      // Konfiguracja mocków
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
      const result = await noteService.getNote(mockNoteId, mockUserId);

      // Weryfikacja
      expect(result).toBeNull();
    });
  });

  describe("createNote", () => {
    it("powinien utworzyć nową notatkę", async () => {
      const mockCreateData: CreateNoteCommand = {
        note_text: "Nowa notatka",
        note_summary: "Podsumowanie nowej notatki",
      };

      const mockCreatedNote: NoteDTO = {
        id: "new-note-id",
        ...mockCreateData,
        created_at: "2023-01-01T00:00:00Z",
      };

      // Konfiguracja mocków
      const insertMock = vi.fn().mockReturnThis();
      const selectMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValue({
        data: mockCreatedNote,
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: insertMock,
        select: selectMock,
        single: singleMock,
      });

      // Wywołanie metody do testowania
      const result = await noteService.createNote(mockCreateData, mockUserId);

      // Weryfikacja
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("notes");
      expect(insertMock).toHaveBeenCalledWith({
        ...mockCreateData,
        user_id: mockUserId,
      });
      expect(result).toEqual(mockCreatedNote);
    });

    it("powinien zwrócić null w przypadku błędu podczas tworzenia", async () => {
      const mockCreateData: CreateNoteCommand = {
        note_text: "Nowa notatka",
        note_summary: "Podsumowanie nowej notatki",
      };

      // Konfiguracja mocków dla zwrócenia błędu
      const insertMock = vi.fn().mockReturnThis();
      const selectMock = vi.fn().mockReturnThis();
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: "error", message: "Database error", details: "", hint: "" },
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: insertMock,
        select: selectMock,
        single: singleMock,
      });

      // Wywołanie metody do testowania
      const result = await noteService.createNote(mockCreateData, mockUserId);

      // Weryfikacja
      expect(result).toBeNull();
    });
  });

  describe("deleteNote", () => {
    it("powinien usunąć notatkę i zwrócić true", async () => {
      const mockNoteId = "note-to-delete";

      // Konfiguracja mocków
      const deleteMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const secondEqMock = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        delete: deleteMock,
        eq: eqMock,
      });

      // Musimy ustawić drugie wywołanie eq do zwrócenia wyniku
      eqMock.mockImplementationOnce(() => ({ eq: secondEqMock }));

      // Wywołanie metody do testowania
      const result = await noteService.deleteNote(mockNoteId, mockUserId);

      // Weryfikacja
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("notes");
      expect(deleteMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith("id", mockNoteId);
      expect(secondEqMock).toHaveBeenCalledWith("user_id", mockUserId);
      expect(result).toBe(true);
    });

    it("powinien zwrócić false w przypadku błędu podczas usuwania", async () => {
      const mockNoteId = "note-to-delete";

      // Konfiguracja mocków dla zwrócenia błędu
      const deleteMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockReturnThis();
      const secondEqMock = vi.fn().mockResolvedValue({
        error: { code: "error", message: "Database error", details: "" },
      });

      mockSupabaseClient.from.mockReturnValue({
        delete: deleteMock,
        eq: eqMock,
      });

      // Musimy ustawić drugie wywołanie eq do zwrócenia wyniku
      eqMock.mockImplementationOnce(() => ({ eq: secondEqMock }));

      // Wywołanie metody do testowania
      const result = await noteService.deleteNote(mockNoteId, mockUserId);

      // Weryfikacja
      expect(result).toBe(false);
    });
  });
});
