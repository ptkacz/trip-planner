import { test, expect } from "@playwright/test";
import { TripGeneratorViewPage } from "../pom/TripGeneratorViewPage";

test.describe("Generowanie planu podróży", () => {
  test("powinno poprawnie wygenerować plan podróży po wypełnieniu formularza", async ({ page }) => {
    // Inicjalizacja Page Object Model
    const tripGeneratorView = new TripGeneratorViewPage(page);

    // Przejdź do strony generowania planu
    await tripGeneratorView.goto();

    // Sprawdź, czy strona została załadowana
    expect(await tripGeneratorView.isLoaded()).toBeTruthy();

    // Wypełnij formularz i wygeneruj plan podróży
    await tripGeneratorView.formPOM.fillForm("Polska", "Warszawa", 500);

    // Wykonaj zrzut ekranu wypełnionego formularza
    await tripGeneratorView.takeScreenshot("test-results/formularz-wypelniony.png");

    // Kliknij przycisk generowania planu
    await tripGeneratorView.formPOM.generateTrip();

    // Czekaj na wygenerowanie planu
    await tripGeneratorView.waitForPlanGeneration();

    // Sprawdź, czy plan został wygenerowany
    expect(await tripGeneratorView.isPlanGenerated()).toBeTruthy();

    // Sprawdź, czy w planie zawiera się pewien tekst (może być inny w zależności od implementacji)
    expect(await tripGeneratorView.planDisplayPOM.planContainsText("Plan podróży")).toBeTruthy();

    // Wykonaj zrzut ekranu wygenerowanego planu
    await tripGeneratorView.takeScreenshot("test-results/plan-wygenerowany.png");
  });

  test("powinno wyświetlić błędy walidacji przy pustym formularzu", async ({ page }) => {
    // Inicjalizacja Page Object Model
    const tripGeneratorView = new TripGeneratorViewPage(page);

    // Przejdź do strony generowania planu
    await tripGeneratorView.goto();

    // Sprawdź, czy strona została załadowana
    expect(await tripGeneratorView.isLoaded()).toBeTruthy();

    // Kliknij przycisk generowania bez wypełniania formularza
    await tripGeneratorView.formPOM.generateTrip();

    // Sprawdź, czy pojawiły się błędy walidacji
    expect(await tripGeneratorView.formPOM.hasValidationErrors()).toBeTruthy();

    // Sprawdź konkretne komunikaty błędów
    expect(await tripGeneratorView.formPOM.getErrorMessage("country")).toContain("Kraj jest wymagany");
    expect(await tripGeneratorView.formPOM.getErrorMessage("city")).toContain("Miasto jest wymagane");
    expect(await tripGeneratorView.formPOM.getErrorMessage("distance")).toContain("Odległość musi być większa od 0");

    // Wykonaj zrzut ekranu z błędami walidacji
    await tripGeneratorView.takeScreenshot("test-results/bledy-walidacji.png");
  });
});
