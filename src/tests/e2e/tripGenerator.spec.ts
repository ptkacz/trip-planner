import { test, expect } from "@playwright/test";
import { TripGeneratorViewPage } from "../pom/TripGeneratorViewPage";

// Zwiększamy timeout dla testów
test.setTimeout(60000);

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

    // Poczekaj dodatkowe 2 sekundy, aby mieć pewność, że plan jest w pełni załadowany
    await page.waitForTimeout(2000);

    // Sprawdź, czy plan został wygenerowany
    expect(await tripGeneratorView.isPlanGenerated()).toBeTruthy();

    try {
      // Sprawdź, czy w planie zawiera się pewien tekst
      // Używamy ogólnego tekstu "plan podróży" z ignorowaniem wielkości liter,
      // co uczyni test bardziej odpornym na zmiany w treści planu
      const planContainsText = await tripGeneratorView.planDisplayPOM.planContainsText("plan podróży", 3, 500, false);
      expect(planContainsText).toBeTruthy();

      // Wykonaj zrzut ekranu wygenerowanego planu
      await tripGeneratorView.takeScreenshot("test-results/plan-wygenerowany.png");
    } catch (error) {
      // W przypadku błędu wykonaj zrzut ekranu i wyrzuć oryginalny błąd
      await page.screenshot({ path: "test-results/error-screen.png" });
      throw error;
    }
  });

  test("powinno wyświetlić błędy walidacji przy pustym formularzu", async ({ page }) => {
    // Inicjalizacja Page Object Model
    const tripGeneratorView = new TripGeneratorViewPage(page);

    // Przejdź do strony generowania planu
    await tripGeneratorView.goto();

    // Sprawdź, czy strona została załadowana
    expect(await tripGeneratorView.isLoaded()).toBeTruthy();

    // Wyczyść formularz (upewnij się, że jest pusty)
    await tripGeneratorView.formPOM.clearForm();

    // Kliknij przycisk generowania bez wypełniania formularza
    await tripGeneratorView.formPOM.generateTrip();

    // Poczekaj chwilę na pojawienie się błędów walidacji
    await page.waitForTimeout(500);

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
