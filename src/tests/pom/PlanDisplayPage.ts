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
   * Sprawdza, czy plan zawiera określony tekst
   */
  async planContainsText(text: string) {
    const content = await this.getPlanContent();
    return content ? content.includes(text) : false;
  }

  /**
   * Czeka, aż plan się załaduje
   */
  async waitForPlanToLoad() {
    await this.planDisplay.waitFor({ state: "visible" });
    await this.planContent.waitFor({ state: "visible" });
  }
}
