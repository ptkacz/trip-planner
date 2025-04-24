import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TripGeneratorForm from "@/components/TripGeneratorForm";
import type { GenerateTripCommand } from "@/types";

describe("TripGeneratorForm", () => {
  const defaultProps = {
    formData: {
      start_country: "",
      start_city: "",
      max_distance: 0,
    } as GenerateTripCommand,
    formErrors: {},
    isLoading: false,
    onChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renderuje poprawnie wszystkie pola formularza", () => {
    render(<TripGeneratorForm {...defaultProps} />);

    // Sprawdzenie czy wszystkie pola są wyrenderowane
    expect(screen.getByLabelText(/kraj początkowy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/miasto początkowe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maksymalna odległość/i)).toBeInTheDocument();
    expect(screen.getByText(/generuj plan podróży/i)).toBeInTheDocument();
  });

  it("wywołuje onChange z poprawnymi wartościami dla kraju", () => {
    render(<TripGeneratorForm {...defaultProps} />);

    // Pole kraju
    const countryInput = screen.getByLabelText(/kraj początkowy/i);
    fireEvent.change(countryInput, { target: { value: "Polska" } });

    // Sprawdzenie czy onChange zostało wywołane z oczekiwanym parametrem
    expect(defaultProps.onChange).toHaveBeenCalledWith({ start_country: "Polska" });
  });

  it("wywołuje onChange z poprawnymi wartościami dla miasta", () => {
    render(<TripGeneratorForm {...defaultProps} />);

    // Pole miasta
    const cityInput = screen.getByLabelText(/miasto początkowe/i);
    fireEvent.change(cityInput, { target: { value: "Warszawa" } });

    // Sprawdzenie czy onChange zostało wywołane z oczekiwanym parametrem
    expect(defaultProps.onChange).toHaveBeenCalledWith({ start_city: "Warszawa" });
  });

  it("wywołuje onChange z poprawnymi wartościami dla maksymalnej odległości", () => {
    render(<TripGeneratorForm {...defaultProps} />);

    // Pole odległości
    const distanceInput = screen.getByLabelText(/maksymalna odległość/i);
    fireEvent.change(distanceInput, { target: { value: "500" } });

    // Sprawdzenie czy onChange zostało wywołane z oczekiwanym parametrem
    expect(defaultProps.onChange).toHaveBeenCalledWith({ max_distance: 500 });
  });

  it("wywołuje onSubmit po kliknięciu przycisku", async () => {
    render(<TripGeneratorForm {...defaultProps} />);

    // Kliknięcie przycisku
    const submitButton = screen.getByText(/generuj plan podróży/i);
    fireEvent.click(submitButton);

    // Sprawdzenie czy onSubmit zostało wywołane
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it("wyświetla tekst 'Generowanie...' podczas ładowania", () => {
    render(<TripGeneratorForm {...defaultProps} isLoading={true} />);

    // Sprawdzenie czy przycisk pokazuje tekst 'Generowanie...'
    expect(screen.getByText(/generowanie.../i)).toBeInTheDocument();
  });

  it("wyświetla komunikaty o błędach, gdy są one dostarczone", () => {
    const errorsProps = {
      ...defaultProps,
      formErrors: {
        start_country: "Kraj jest wymagany",
        start_city: "Miasto jest wymagane",
        max_distance: "Odległość musi być większa od 0",
      },
    };

    render(<TripGeneratorForm {...errorsProps} />);

    // Sprawdzenie czy komunikaty o błędach są wyświetlane
    expect(screen.getByText(/kraj jest wymagany/i)).toBeInTheDocument();
    expect(screen.getByText(/miasto jest wymagane/i)).toBeInTheDocument();
    expect(screen.getByText(/odległość musi być większa od 0/i)).toBeInTheDocument();
  });

  it("dodaje klasę border-red-500 do pól z błędami", () => {
    const errorsProps = {
      ...defaultProps,
      formErrors: {
        start_country: "Kraj jest wymagany",
      },
    };

    render(<TripGeneratorForm {...errorsProps} />);

    // Sprawdzenie czy pole z błędem ma odpowiednią klasę
    const countryInput = screen.getByLabelText(/kraj początkowy/i);
    expect(countryInput).toHaveClass("border-red-500");

    // Sprawdzenie czy pole bez błędu nie ma tej klasy
    const cityInput = screen.getByLabelText(/miasto początkowe/i);
    expect(cityInput).not.toHaveClass("border-red-500");
  });
});
