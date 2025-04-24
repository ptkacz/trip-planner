import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
  private page: Page;
  private title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator("h1");
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  async takeScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`);
  }
}
