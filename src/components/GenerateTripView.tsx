import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GenerateTripCommand, TripPlanDTO, NoteDTO } from "@/types";
import TopBar from "./TopBar";
import TripGeneratorForm from "./TripGeneratorForm";
import NoteList from "./NoteList";
import PlanDisplay from "./PlanDisplay";

// Komponent wyświetlający komunikaty o błędach
const ErrorBanner: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

const GenerateTripView: React.FC = () => {
  // Stan logowania użytkownika
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Stan formularza
  const [formData, setFormData] = useState<GenerateTripCommand>({
    start_country: "",
    start_city: "",
    max_distance: 0,
    selected_note_ids: [],
  });

  // Stan błędów formularza
  const [formErrors, setFormErrors] = useState<{
    start_country?: string;
    start_city?: string;
    max_distance?: string;
  }>({});

  // Stan ładowania podczas generowania planu
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Stan ładowania planu z bazy danych
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(true);

  // Stan ładowania notatek
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(true);

  // Stan komunikatu o błędzie
  const [error, setError] = useState<string>("");

  // Stan błędu ładowania notatek
  const [notesError, setNotesError] = useState<string>("");

  // Wygenerowany plan podróży
  const [generatedPlan, setGeneratedPlan] = useState<TripPlanDTO | null>(null);

  // Stan listy notatek
  const [notes, setNotes] = useState<NoteDTO[]>([]);

  // Sprawdzenie stanu logowania
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Błąd podczas sprawdzania stanu logowania:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Efekty do ładowania danych przy inicjalizacji komponentu
  useEffect(() => {
    if (isLoggedIn && !isCheckingAuth) {
      fetchTripPlan();
      fetchNotes();
    }
  }, [isLoggedIn, isCheckingAuth]);

  // Funkcja pobierająca notatki z API
  const fetchNotes = async () => {
    setIsLoadingNotes(true);
    setNotesError("");

    try {
      const response = await fetch("/api/notes");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd podczas pobierania notatek");
      }

      const responseData = await response.json();

      if (responseData.status === "success" && Array.isArray(responseData.data)) {
        setNotes(responseData.data);
        console.log(`Pobrano ${responseData.data.length} notatek z API`);
      } else {
        throw new Error("Nieprawidłowy format odpowiedzi z serwera");
      }
    } catch (err) {
      console.error("Błąd podczas pobierania notatek:", err);
      setNotesError(err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania notatek");
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Funkcja pobierająca plan podróży z API
  const fetchTripPlan = async () => {
    setIsLoadingPlan(true);
    setError("");

    try {
      const response = await fetch("/api/trip/plan");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd podczas pobierania planu");
      }

      const responseData = await response.json();

      if (responseData.status === "success") {
        if (responseData.data === null) {
          // Brak planu w bazie - generujemy mocka
          const mockPlan: TripPlanDTO = {
            plan:
              `🌍 Plan podróży:\n\n` +
              "🗓️ Dzień 1:\n" +
              "🏙️ Rozpocznij podróż w mieście startowym\n" +
              "🏛️ Zwiedzanie lokalnych atrakcji\n" +
              "🍽️ Obiad w lokalnej restauracji\n" +
              "🏨 Nocleg w centrum miasta\n\n" +
              "🗓️ Dzień 2:\n" +
              "🚗 Wycieczka do pobliskich miejscowości\n" +
              "🏞️ Zwiedzanie okolicznych atrakcji przyrodniczych\n" +
              "🍦 Przerwa na lokalny przysmak\n" +
              "🌆 Powrót do bazy wieczorem\n\n" +
              "🗓️ Dzień 3:\n" +
              "🚂 Dalsza podróż do ciekawych miejsc\n" +
              "🏰 Zwiedzanie zabytków historycznych\n" +
              "🍷 Kolacja w regionalnej restauracji\n" +
              "🏠 Powrót do domu\n\n",
            notes_used: [],
            generated_at: new Date().toISOString(),
            start_country: "",
            start_city: "",
            max_distance: 0,
          };

          setGeneratedPlan(mockPlan);
          console.log("Ustawiono mockowy plan podróży");
        } else {
          const planData = responseData.data;

          // Aktualizujemy stan formularza z danymi z planu
          if (planData.start_country || planData.start_city || planData.max_distance) {
            setFormData((prevData) => ({
              ...prevData,
              start_country: planData.start_country || "",
              start_city: planData.start_city || "",
              max_distance: planData.max_distance || 0,
            }));
          }

          setGeneratedPlan(planData);
          console.log("Ustawiono plan podróży z bazy danych");
        }
      } else {
        throw new Error("Nieprawidłowy format odpowiedzi z serwera");
      }
    } catch (err) {
      console.error("Błąd podczas pobierania planu podróży:", err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania planu");
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Obsługa zmiany danych formularza
  const handleFormChange = (updatedFormData: Partial<GenerateTripCommand>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedFormData,
    }));
  };

  // Obsługa kliknięcia na profil
  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  // Obsługa dodawania nowej notatki
  const handleAddNoteClick = () => {
    window.location.href = "/notes/add";
  };

  // Obsługa kliknięcia na notatkę
  const handleNoteClick = (noteId: string) => {
    window.location.href = `/notes/view?id=${noteId}`;
  };

  // Obsługa wyboru notatki
  const handleNoteSelect = (noteId: string, selected: boolean) => {
    setFormData((prevData) => {
      const selectedNoteIds = prevData.selected_note_ids || [];
      if (selected) {
        // Dodanie ID notatki, jeśli nie istnieje
        return {
          ...prevData,
          selected_note_ids: [...selectedNoteIds, noteId].filter((id, index, array) => array.indexOf(id) === index),
        };
      } else {
        // Usunięcie ID notatki
        return {
          ...prevData,
          selected_note_ids: selectedNoteIds.filter((id) => id !== noteId),
        };
      }
    });
  };

  // Walidacja formularza
  const validateForm = (): boolean => {
    const errors: {
      start_country?: string;
      start_city?: string;
      max_distance?: string;
    } = {};

    if (!formData.start_country) {
      errors.start_country = "Kraj jest wymagany";
    }

    if (!formData.start_city) {
      errors.start_city = "Miasto jest wymagane";
    }

    if (!formData.max_distance || formData.max_distance <= 0) {
      errors.max_distance = "Odległość musi być większa od 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Obsługa generowania planu
  const handleGeneratePlan = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Wywołanie API poprzez endpoint
      const response = await fetch("/api/trip/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd podczas generowania planu");
      }

      const responseData = await response.json();

      if (responseData.status === "success" && responseData.data) {
        setGeneratedPlan(responseData.data);
      } else {
        throw new Error("Nieprawidłowy format odpowiedzi z serwera");
      }
    } catch (err) {
      console.error("Błąd podczas generowania planu:", err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas generowania planu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar onProfileClick={handleProfileClick} />

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Lewa kolumna - formularz i plan podróży */}
          <div className="col-span-12 lg:col-span-8">
            {/* Formularz generatora */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <TripGeneratorForm
                  formData={formData}
                  formErrors={formErrors}
                  isLoading={isLoading}
                  onChange={handleFormChange}
                  onSubmit={handleGeneratePlan}
                />
              </CardContent>
            </Card>

            {/* Wyświetlanie wygenerowanego planu */}
            <div>
              <h2 className="text-xl font-bold mb-4">Twój plan podróży</h2>

              {error && <ErrorBanner message={error} />}

              {isLoadingPlan ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <PlanDisplay
                    plan={{
                      plan:
                        `🌍 Plan podróży:\n\n` +
                        "🗓️ Dzień 1:\n" +
                        "🏙️ Rozpocznij podróż w mieście startowym\n" +
                        "🏛️ Zwiedzanie lokalnych atrakcji\n" +
                        "🍽️ Obiad w lokalnej restauracji\n" +
                        "🏨 Nocleg w centrum miasta\n\n" +
                        "🗓️ Dzień 2:\n" +
                        "🚗 Wycieczka do pobliskich miejscowości\n" +
                        "🏞️ Zwiedzanie okolicznych atrakcji przyrodniczych\n" +
                        "🍦 Przerwa na lokalny przysmak\n" +
                        "🌆 Powrót do bazy wieczorem\n\n" +
                        "🗓️ Dzień 3:\n" +
                        "🚂 Dalsza podróż do ciekawych miejsc\n" +
                        "🏰 Zwiedzanie zabytków historycznych\n" +
                        "🍷 Kolacja w regionalnej restauracji\n" +
                        "🏠 Powrót do domu\n\n",
                      notes_used: [],
                      generated_at: new Date().toISOString(),
                      start_country: "",
                      start_city: "",
                      max_distance: 0,
                    }}
                  />
                </div>
              ) : (
                <PlanDisplay plan={generatedPlan} />
              )}
            </div>
          </div>

          {/* Prawa kolumna - notatki */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {isCheckingAuth ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    <span>Ładowanie...</span>
                  </div>
                ) : isLoggedIn ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Moje notatki</h2>
                      <Button variant="outline" size="sm" onClick={handleAddNoteClick} className="text-sm">
                        Dodaj notatkę
                      </Button>
                    </div>

                    {notesError && <ErrorBanner message={notesError} />}

                    <NoteList
                      notes={notes}
                      isLoading={isLoadingNotes}
                      onNoteClick={handleNoteClick}
                      onNoteSelect={handleNoteSelect}
                      selectedNoteIds={formData.selected_note_ids || []}
                    />
                  </>
                ) : (
                  <div className="text-center py-4">
                    <h2 className="text-lg font-semibold mb-2">Notatki podróżnicze</h2>
                    <p className="text-gray-600 mb-4">
                      Zaloguj się, aby korzystać ze wszystkich funkcjonalności serwisu.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild variant="default" size="sm">
                        <a href="/auth/login">Logowanie</a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href="/auth/register">Rejestracja</a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTripView;
