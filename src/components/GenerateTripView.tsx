import React, { useState } from "react";
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

// Przykładowy plan podróży
const MOCK_PLAN: TripPlanDTO = {
  plan: `Plan podróży: Warszawa -> Góry Świętokrzyskie

Dzień 1: Wyjazd z Warszawy w kierunku Gór Świętokrzyskich. Po drodze zatrzymaj się w Radomiu, aby zwiedzić Muzeum Wsi Radomskiej - skansen przedstawiający tradycyjną architekturę regionu.

Dzień 2: Zwiedzanie Kielc - stolicy regionu. Koniecznie odwiedź Kadzielnia - rezerwat geologiczny z amfiteatrem, oraz Pałac Biskupów Krakowskich z XVII wieku. Na obiad spróbuj lokalnych specjałów w restauracji "Żurek Świętokrzyski".

Dzień 3: Wycieczka do Św. Krzyża - najwyższego szczytu Gór Świętokrzyskich. Zwiedzanie zabytkowego opactwa i podziwianie panoramy z wieży widokowej. Po południu wypożycz rower i przejedź fragment Wschodniego Szlaku Rowerowego Green Velo.

Dzień 4: Zwiedzanie Jaskini Raj - jednej z najpiękniejszych jaskiń krasowych w Polsce. Po południu odwiedź Park Etnograficzny w Tokarni, prezentujący tradycyjną architekturę regionu.

Dzień 5: Powrót do Warszawy przez Sandomierz - jedno z najstarszych i najpiękniejszych miast Polski. Spacer po starówce, zwiedzanie podziemnej trasy turystycznej i Zamku Królewskiego.`,
  notes_used: ["1", "2", "3"],
  generated_at: "2023-10-20T10:30:00Z",
};

// Główny komponent widoku generowania planu podróży
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

  // Stan notatek - w rzeczywistej aplikacji pobieralibyśmy je z API
  const [notes] = useState<NoteDTO[]>(MOCK_NOTES);

  // Stan wyniku generacji
  const [generatedPlan, setGeneratedPlan] = useState<TripPlanDTO | null>(MOCK_PLAN);

  // Stan ładowania
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Stan błędu
  const [error, setError] = useState<string>("");

  // Obsługa kliknięcia przycisku profilu
  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  // Obsługa kliknięcia przycisku dodawania notatki
  const handleAddNoteClick = () => {
    window.location.href = "/notes/add";
  };

  // Obsługa zmiany formularza
  const handleFormChange = (data: Partial<GenerateTripCommand>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Obsługa wyboru notatki
  const handleNoteSelect = (noteId: string) => {
    setFormData((prev) => {
      const selectedIds = prev.selected_note_ids || [];
      if (selectedIds.includes(noteId)) {
        return {
          ...prev,
          selected_note_ids: selectedIds.filter((id) => id !== noteId),
        };
      } else {
        return {
          ...prev,
          selected_note_ids: [...selectedIds, noteId],
        };
      }
    });
  };

  // Obsługa kliknięcia notatki
  const handleNoteClick = (note: NoteDTO) => {
    // W rzeczywistej aplikacji przekazalibyśmy ID notatki jako parametr URL
    console.log(`Przekierowuję do widoku notatki o ID: ${note.id}`);
    window.location.href = "/notes/view";
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

            {/* Wyświetlanie planu */}
            {generatedPlan && <PlanDisplay plan={generatedPlan} />}
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
