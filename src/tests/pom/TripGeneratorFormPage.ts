import { type Page, type Locator } from "@playwright/test";

/**
 * Klasa Page Object Model reprezentująca formularz generowania planu podróży
 */
export class TripGeneratorFormPage {
  readonly page: Page;
  readonly formContainer: Locator;
  readonly startCountryInput: Locator;
  readonly startCityInput: Locator;
  readonly maxDistanceInput: Locator;
  readonly generateButton: Locator;
  readonly startCountryError: Locator;
  readonly startCityError: Locator;
  readonly maxDistanceError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formContainer = page.locator('[data-test-id="trip-generator-form"]');
    this.startCountryInput = page.locator('[data-test-id="start-country-input"]');
    this.startCityInput = page.locator('[data-test-id="start-city-input"]');
    this.maxDistanceInput = page.locator('[data-test-id="max-distance-input"]');
    this.generateButton = page.locator('[data-test-id="generate-trip-button"]');
    this.startCountryError = page.locator('[data-test-id="start-country-error"]');
    this.startCityError = page.locator('[data-test-id="start-city-error"]');
    this.maxDistanceError = page.locator('[data-test-id="max-distance-error"]');
  }

  /**
   * Nawiguje do strony generowania planu podróży
   */
  async goto() {
    await this.page.goto("/generate");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wypełnia formularz generowania planu podróży
   */
  async fillForm(country: string, city: string, distance: number) {
    await this.startCountryInput.fill(country);
    await this.startCityInput.fill(city);
    await this.maxDistanceInput.fill(distance.toString());
  }

  /**
   * Wysyła formularz generowania planu podróży
   */
  async generateTrip() {
    await this.generateButton.click();
  }

  /**
   * Sprawdza, czy przycisk generowania jest wyłączony
   */
  async isGenerateButtonDisabled() {
    return await this.generateButton.isDisabled();
  }

  /**
   * Sprawdza, czy przycisk pokazuje stan ładowania
   */
  async isGenerateButtonLoading() {
    const buttonText = await this.generateButton.textContent();
    return buttonText?.includes("Generowanie...");
  }

  /**
   * Sprawdza, czy formularz zawiera błędy walidacji
   */
  async hasValidationErrors() {
    const countryErrorVisible = await this.startCountryError.isVisible();
    const cityErrorVisible = await this.startCityError.isVisible();
    const distanceErrorVisible = await this.maxDistanceError.isVisible();

    return countryErrorVisible || cityErrorVisible || distanceErrorVisible;
  }

  /**
   * Sprawdza konkretny komunikat błędu dla pola
   */
  async getErrorMessage(field: "country" | "city" | "distance") {
    const errorLocators = {
      country: this.startCountryError,
      city: this.startCityError,
      distance: this.maxDistanceError,
    };

    const locator = errorLocators[field];

    if (await locator.isVisible()) {
      return await locator.textContent();
    }

    return null;
  }

  /**
   * Wypełnia formularz i generuje plan podróży
   */
  async fillFormAndGenerate(country: string, city: string, distance: number) {
    await this.fillForm(country, city, distance);
    await this.generateTrip();
  }
}
