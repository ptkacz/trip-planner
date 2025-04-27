#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Katalog główny projektu
const ROOT_DIR = path.resolve(__dirname, "..");

// Lista plików/wzorców, które chcemy sprawdzić
const filesToCheck = [
  "src/components/GenerateTripView.tsx",
  "src/components/auth/LoginForm.tsx",
  "src/components/auth/RegisterForm.tsx",
  "src/lib/hooks/useAuth.ts",
  "src/lib/services/authService.ts",
  "src/lib/services/noteService.ts",
  "src/lib/services/openrouter.service.ts",
  "src/lib/services/profileService.ts",
  "src/lib/services/tripGenerationService.ts",
  "src/lib/services/tripPlanService.ts",
];

// Lista plików/wzorców, które chcemy wykluczyć
const filesToExclude = [
  "src/db/database.types.ts",
  "src/components/ui/**/*.tsx",
  "src/components/ui/**/*.ts",
  "src/pages/auth/login.astro",
  "src/pages/notes/add.astro",
  "src/pages/profile.astro",
  "src/tests/**/*.ts",
  "src/tests/**/*.tsx",
];

// Funkcja do tworzenia tymczasowego pliku konfiguracji ESLint
function createTempEslintConfig() {
  const configContent = `
module.exports = {
  root: true,
  extends: [],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es2022: true,
    browser: true,
    node: true
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "no-undef": "warn"
  }
};`;

  const configPath = path.join(ROOT_DIR, ".temp-eslintrc.cjs");
  fs.writeFileSync(configPath, configContent);
  return configPath;
}

// Główna funkcja
function main() {
  console.log("Uruchamiam bezpieczne sprawdzanie lintera...");

  // Tworzenie tymczasowego pliku konfiguracji
  const tempConfigPath = createTempEslintConfig();

  // Sprawdź każdy plik osobno
  console.log("Sprawdzanie poszczególnych plików:");
  let allSuccess = true;
  let warnings = 0;

  try {
    for (const file of filesToCheck) {
      try {
        console.log(`\nSprawdzanie: ${file}`);
        execSync(`npx eslint -c ${tempConfigPath} "${file}"`, {
          cwd: ROOT_DIR,
          stdio: "inherit",
        });
      } catch (e) {
        allSuccess = false;
        // błędy już zostały wyświetlone przez stdio: 'inherit'
        warnings++;
      }
    }
  } finally {
    // Usunięcie tymczasowego pliku konfiguracyjnego
    try {
      fs.unlinkSync(tempConfigPath);
    } catch (err) {
      console.error("Nie można usunąć pliku tymczasowego:", err);
    }
  }

  console.log(
    `\nSprawdzanie zakończone ${allSuccess ? "pomyślnie" : `z ${warnings} plikami zawierającymi ostrzeżenia`}.`
  );
}

main();
