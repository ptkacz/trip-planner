import { type Page, type Locator } from "@playwright/test";
import { TripGeneratorFormPage } from "./TripGeneratorFormPage";
import { PlanDisplayPage } from "./PlanDisplayPage";

/**
 * Klasa Page Object Model reprezentująca widok generowania planu podróży
 */
export class TripGeneratorViewPage {
  readonly page: Page;
  readonly container: Locator;
  readonly tripGeneratorCard: Locator;
  readonly tripPlanContainer: Locator;
  readonly errorBanner: Locator;
  readonly formPOM: TripGeneratorFormPage;
  readonly planDisplayPOM: PlanDisplayPage;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="generate-trip-view"]');
    this.tripGeneratorCard = page.locator('[data-test-id="trip-generator-card"]');
    this.tripPlanContainer = page.locator('[data-test-id="trip-plan-container"]');
    this.errorBanner = page.locator('[data-test-id="error-banner"]');
    this.formPOM = new TripGeneratorFormPage(page);
    this.planDisplayPOM = new PlanDisplayPage(page);
  }

  /**
   * Nawiguje do strony generowania planu podróży
   */
  async goto() {
    await this.formPOM.goto();
    await this.container.waitFor({ state: "visible" });
  }

  /**
   * Sprawdza, czy widok generowania planu jest załadowany
   */
  async isLoaded() {
    return (await this.container.isVisible()) && (await this.tripGeneratorCard.isVisible());
  }

  /**
   * Wykonuje pełny przepływ generowania planu podróży
   */
  async generateTripPlan(country: string, city: string, distance: number) {
    await this.goto();
    await this.formPOM.fillFormAndGenerate(country, city, distance);
    await this.waitForPlanGeneration();
  }

  /**
   * Czeka, aż plan zostanie wygenerowany
   */
  async waitForPlanGeneration(maxTimeout = 15000) {
    const startTime = Date.now();

    // Czekamy aż przycisk przestanie być w stanie ładowania, ale nie dłużej niż maxTimeout
    while (await this.formPOM.isGenerateButtonLoading()) {
      if (Date.now() - startTime > maxTimeout) {
        // Jeśli przekroczono maksymalny czas oczekiwania, przerywamy pętlę
        break;
      }
      await this.page.waitForTimeout(300);
    }

    // Czekamy na wyświetlenie planu
    await this.planDisplayPOM.waitForPlanToLoad();
  }

  /**
   * Sprawdza, czy wystąpił błąd podczas generowania planu
   */
  async hasError() {
    return await this.errorBanner.isVisible();
  }

  /**
   * Pobiera treść komunikatu o błędzie
   */
  async getErrorMessage() {
    if (await this.hasError()) {
      return await this.errorBanner.textContent();
    }
    return null;
  }

  /**
   * Sprawdza, czy plan został wygenerowany
   */
  async isPlanGenerated() {
    return await this.planDisplayPOM.isPlanVisible();
  }

  /**
   * Wykonuje zrzut ekranu widoku generowania planu
   */
  async takeScreenshot(path: string) {
    await this.container.screenshot({ path });
  }
}
