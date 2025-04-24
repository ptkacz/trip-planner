import React from "react";
import type { TripPlanDTO } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface PlanDisplayProps {
  plan: TripPlanDTO | null;
  hideTimestamp?: boolean;
}

/**
 * Komponent do wyświetlania wygenerowanego planu podróży
 */
const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, hideTimestamp = false }) => {
  if (!plan) {
    return (
      <Card className="bg-white" data-test-id="empty-plan-display">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nie wygenerowano jeszcze planu podróży.</p>
          <p className="text-gray-500 text-sm mt-2">
            Wypełnij formularz i kliknij &quot;Generuj plan podróży&quot;, aby utworzyć swój plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Funkcja do formatowania tekstu z gwiazdkami
  const formatTextWithAsterisks = (text: string) => {
    // Najpierw znajdujemy tekst między gwiazdkami i formatujemy go
    const parts = text.split(/(\*[^*]+\*)/);
    const formattedParts = parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        // Usuń gwiazdki i zastosuj pogrubienie
        return <strong key={index}>{part.slice(1, -1)}</strong>;
      }
      // Usuń pozostałe gwiazdki z tekstu
      return part.replace(/\*/g, "");
    });
    return formattedParts;
  };

  // Funkcja do formatowania całej linii
  const formatLine = (line: string) => {
    // Sprawdź czy linia zaczyna się od #
    const hashMatch = line.match(/^#+/);
    if (hashMatch) {
      const hashCount = hashMatch[0].length;
      const textContent = line.slice(hashCount).trim();
      return <p className="font-bold mb-4">{formatTextWithAsterisks(textContent)}</p>;
    }
    return <p className="mb-4">{formatTextWithAsterisks(line)}</p>;
  };

  return (
    <Card className="bg-white" data-test-id="plan-display">
      <CardContent className="p-6">
        {!hideTimestamp && (
          <div className="flex justify-between mb-4" data-test-id="plan-metadata">
            <div className="text-sm text-gray-500">Wygenerowano: {new Date(plan.generated_at).toLocaleString()}</div>
            {plan.notes_used.length > 0 && (
              <div className="text-xs text-gray-500">Wykorzystane notatki: {plan.notes_used.length}</div>
            )}
          </div>
        )}

        <div className="whitespace-pre-wrap mb-6 text-center" data-test-id="plan-content">
          {plan.plan.split("\n").map((line, idx) => (
            <React.Fragment key={idx}>{formatLine(line)}</React.Fragment>
          ))}
        </div>

        {/* Przykładowe zdjęcie */}
        <div className="mt-4 rounded-md overflow-hidden" data-test-id="plan-image">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
            alt="Przykładowe zdjęcie z podróży"
            className="w-full h-64 object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDisplay;
