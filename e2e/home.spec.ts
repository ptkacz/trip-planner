import { test } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Strona główna", () => {
  test("powinna załadować się poprawnie", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.expectTitleVisible();
  });

  test.skip("powinna wyglądać tak jak oczekiwano", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.takeScreenshot("home-page");
  });
});
