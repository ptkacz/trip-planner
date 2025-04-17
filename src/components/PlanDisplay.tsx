import React from "react";
import type { TripPlanDTO } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface PlanDisplayProps {
  plan: TripPlanDTO;
}

/**
 * Komponent do wyświetlania wygenerowanego planu podróży
 */
const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Twój plan podróży</h3>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-500">Wygenerowano: {new Date(plan.generated_at).toLocaleString()}</div>
            {plan.notes_used.length > 0 && (
              <div className="text-xs text-gray-500">Wykorzystane notatki: {plan.notes_used.length}</div>
            )}
          </div>

          <div className="whitespace-pre-wrap mb-6">
            {plan.plan.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Przykładowe zdjęcie */}
          <div className="mt-4 rounded-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
              alt="Przykładowe zdjęcie z podróży"
              className="w-full h-64 object-cover"
            />
            <div className="text-xs text-center text-gray-500 mt-1">Przykładowy widok z trasy</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanDisplay;
