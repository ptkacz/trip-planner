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

// Przykładowe dane notatek
const MOCK_NOTES: NoteDTO[] = [
  {
    id: "1",
    note_text: "Lubię zwiedzać stare miasta i architekturę. Interesuje mnie historia miejsc, które odwiedzam.",
    note_summary: "Architektura i historia",
    created_at: "2023-10-15T12:30:00Z",
  },
  {
    id: "2",
    note_text: "Preferuję aktywny wypoczynek, górskie wędrówki i sporty wodne. Chętnie wypożyczam rower.",
    note_summary: "Aktywny wypoczynek",
    created_at: "2023-10-16T14:45:00Z",
  },
  {
    id: "3",
    note_text: "Lubię lokalną kuchnię, chętnie próbuję regionalnych specjałów. Unikam fastfoodów w podróży.",
    note_summary: "Lokalna kuchnia",
    created_at: "2023-10-17T09:15:00Z",
  },
];

const GenerateTripView: React.FC = () => {
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

  // Stan komunikatu o błędzie
  const [error, setError] = useState<string>("");

  // Wygenerowany plan podróży
  const [generatedPlan, setGeneratedPlan] = useState<TripPlanDTO | null>(null);

  // Stan listy notatek
  const [notes] = useState<NoteDTO[]>(MOCK_NOTES);

  // Efekt do ładowania planu podróży przy inicjalizacji komponentu
  useEffect(() => {
    fetchTripPlan();
  }, []);

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
              `🌍 Plan podróży (przykład):\n\n` +
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
    // W rzeczywistej aplikacji przekazalibyśmy ID notatki jako parametr URL
    console.log(`Przekierowuję do widoku notatki o ID: ${noteId}`);
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
    <div className="container mx-auto py-6">
      <TopBar onProfileClick={handleProfileClick} onAddNoteClick={handleAddNoteClick} />

      <div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Generator planu podróży</h2>

            <ErrorBanner message={error} />

            {/* Formularz generatora */}
            <div className="mb-4">
              <TripGeneratorForm formData={formData} onFormChange={handleFormChange} errors={formErrors} />
            </div>

            {/* Przycisk generowania */}
            <div className="flex justify-end">
              <Button disabled={isLoading} onClick={handleGeneratePlan}>
                {isLoading ? "Generowanie..." : "Generuj plan podróży"}
              </Button>
            </div>

            {/* Wyświetlanie planu lub informacji o ładowaniu */}
            {isLoadingPlan ? (
              <div className="mt-6 p-4 text-center text-gray-500">Ładowanie planu podróży...</div>
            ) : (
              generatedPlan && <PlanDisplay plan={generatedPlan} />
            )}
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-3">Twoje notatki</h3>

              {/* Lista notatek */}
              <NoteList
                notes={notes}
                selectedNoteIds={formData.selected_note_ids || []}
                onNoteSelect={handleNoteSelect}
                onNoteClick={handleNoteClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateTripView;
