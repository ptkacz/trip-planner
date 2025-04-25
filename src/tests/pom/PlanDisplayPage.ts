import { type Page, type Locator } from "@playwright/test";

/**
 * Klasa Page Object Model reprezentująca komponent wyświetlający plan podróży
 */
export class PlanDisplayPage {
  readonly page: Page;
  readonly planDisplay: Locator;
  readonly emptyPlanDisplay: Locator;
  readonly planMetadata: Locator;
  readonly planContent: Locator;
  readonly planImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.planDisplay = page.locator('[data-test-id="plan-display"]');
    this.emptyPlanDisplay = page.locator('[data-test-id="empty-plan-display"]');
    this.planMetadata = page.locator('[data-test-id="plan-metadata"]');
    this.planContent = page.locator('[data-test-id="plan-content"]');
    this.planImage = page.locator('[data-test-id="plan-image"]');
  }

  /**
   * Sprawdza, czy plan podróży jest widoczny
   */
  async isPlanVisible() {
    return await this.planDisplay.isVisible();
  }

  /**
   * Sprawdza, czy komunikat o braku planu jest widoczny
   */
  async isEmptyPlanVisible() {
    return await this.emptyPlanDisplay.isVisible();
  }

  /**
   * Pobiera zawartość planu podróży
   */
  async getPlanContent() {
    return await this.planContent.textContent();
  }

  /**
   * Sprawdza, czy metadane planu są widoczne
   */
  async areMetadataVisible() {
    return await this.planMetadata.isVisible();
  }

  /**
   * Sprawdza, czy zdjęcie w planie jest widoczne i załadowane
   */
  async isPlanImageLoaded() {
    const image = this.planImage.locator("img");
    await image.waitFor({ state: "attached" });
    return await image.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
  }

  /**
   * Sprawdza, czy plan zawiera określony tekst z możliwością ponownych prób
   * @param text Tekst do znalezienia w planie
   * @param maxRetries Maksymalna liczba prób
   * @param retryInterval Czas oczekiwania między próbami (ms)
   * @param caseSensitive Czy wyszukiwanie ma uwzględniać wielkość liter (domyślnie false)
   */
  async planContainsText(text: string, maxRetries = 3, retryInterval = 500, caseSensitive = false) {
    for (let i = 0; i < maxRetries; i++) {
      const content = await this.getPlanContent();
      if (content) {
        if (caseSensitive) {
          if (content.includes(text)) {
            return true;
          }
        } else {
          // Ignoruj wielkość liter
          if (content.toLowerCase().includes(text.toLowerCase())) {
            return true;
          }
        }
      }

      if (i < maxRetries - 1) {
        // Poczekaj przed kolejną próbą, ale z krótszym interwałem
        await this.page.waitForTimeout(retryInterval);
      }
    }

    // Jeśli po wszystkich próbach nadal nie znaleziono tekstu, zwróć false
    const finalContent = await this.getPlanContent();
    if (finalContent) {
      return caseSensitive ? finalContent.includes(text) : finalContent.toLowerCase().includes(text.toLowerCase());
    }
    return false;
  }

  /**
   * Czeka, aż plan się załaduje i zawiera treść
   */
  async waitForPlanToLoad(timeout = 5000) {
    // Czekaj, aż elementy planu będą widoczne
    await this.planDisplay.waitFor({ state: "visible", timeout });
    await this.planContent.waitFor({ state: "visible", timeout });

    // Dodatkowo czekaj, aż pojawi się treść w elemencie, ale maksymalnie przez określony czas
    const startTime = Date.now();
    const maxWaitTime = 3000; // Maksymalny czas czekania na treść - 3 sekundy

    while (Date.now() - startTime < maxWaitTime) {
      const content = await this.getPlanContent();
      if (content && content.trim().length > 0) {
        return;
      }
      await this.page.waitForTimeout(200); // Krótsze przerwy między sprawdzeniami
    }
  }
}
