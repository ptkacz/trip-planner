import React from "react";
import type { GenerateTripCommand } from "@/types";

interface TripGeneratorFormProps {
  formData: GenerateTripCommand;
  onFormChange: (data: Partial<GenerateTripCommand>) => void;
  errors: {
    start_country?: string;
    start_city?: string;
    max_distance?: string;
  };
}

/**
 * Formularz do wprowadzania danych potrzebnych do wygenerowania planu podróży
 */
const TripGeneratorForm: React.FC<TripGeneratorFormProps> = ({ formData, onFormChange, errors }) => {
  // Obsługa zmiany kraju
  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({ start_country: e.target.value });
  };

  // Obsługa zmiany miasta
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({ start_city: e.target.value });
  };

  // Obsługa zmiany maksymalnej odległości
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    onFormChange({ max_distance: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="start_country" className="block text-sm font-medium mb-1">
          Kraj początkowy
        </label>
        <input
          type="text"
          id="start_country"
          className={`w-full p-2 border rounded-md ${errors.start_country ? "border-red-500" : "border-gray-300"}`}
          value={formData.start_country}
          onChange={handleCountryChange}
          placeholder="Wpisz kraj początkowy"
        />
        {errors.start_country && <p className="text-red-500 text-xs mt-1">{errors.start_country}</p>}
      </div>

      <div>
        <label htmlFor="start_city" className="block text-sm font-medium mb-1">
          Miasto początkowe
        </label>
        <input
          type="text"
          id="start_city"
          className={`w-full p-2 border rounded-md ${errors.start_city ? "border-red-500" : "border-gray-300"}`}
          value={formData.start_city}
          onChange={handleCityChange}
          placeholder="Wpisz miasto początkowe"
        />
        {errors.start_city && <p className="text-red-500 text-xs mt-1">{errors.start_city}</p>}
      </div>

      <div>
        <label htmlFor="max_distance" className="block text-sm font-medium mb-1">
          Maksymalna odległość (km)
        </label>
        <input
          type="number"
          id="max_distance"
          className={`w-full p-2 border rounded-md ${errors.max_distance ? "border-red-500" : "border-gray-300"}`}
          value={formData.max_distance || ""}
          onChange={handleDistanceChange}
          placeholder="Wpisz maksymalną odległość"
          min="0"
        />
        {errors.max_distance && <p className="text-red-500 text-xs mt-1">{errors.max_distance}</p>}
      </div>
    </div>
  );
};

export default TripGeneratorForm;
