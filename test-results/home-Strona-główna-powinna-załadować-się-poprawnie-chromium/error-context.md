# Test info

- Name: Strona główna >> powinna załadować się poprawnie
- Location: /home/ptk/repoArch/10xdevs/trip-planner/e2e/home.spec.ts:5:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/ptk/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test } from "@playwright/test";
   2 | import { HomePage } from "./pages/HomePage";
   3 |
   4 | test.describe("Strona główna", () => {
>  5 |   test("powinna załadować się poprawnie", async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/ptk/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
   6 |     const homePage = new HomePage(page);
   7 |
   8 |     await homePage.goto();
   9 |     await homePage.expectTitleVisible();
  10 |   });
  11 |
  12 |   test.skip("powinna wyglądać tak jak oczekiwano", async ({ page }) => {
  13 |     const homePage = new HomePage(page);
  14 |
  15 |     await homePage.goto();
  16 |     await homePage.takeScreenshot("home-page");
  17 |   });
  18 | });
  19 |
```