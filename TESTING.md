# Dokumentacja Testowania

## Testy Jednostkowe (Vitest + React Testing Library)

Testy jednostkowe są pisane za pomocą frameworka Vitest oraz React Testing Library dla komponentów React.

### Struktura katalogów

```
src/
└── tests/
    ├── setup.ts          # Konfiguracja testów jednostkowych
    ├── mocks/            # Mocki API i innych zależności
    │   └── handlers.ts   # Handlery MSW dla mockowania API
    └── unit/             # Testy jednostkowe komponentów
        ├── BackToHomeButton.test.tsx    # Testy dla komponentu przycisku powrotu
        ├── TripGeneratorForm.test.tsx   # Testy dla formularza generatora podróży
        ├── noteService.test.ts          # Testy dla serwisu notatek
        └── tripPlanService.test.ts      # Testy dla serwisu planów podróży
```

### Uruchamianie testów jednostkowych

```bash
# Uruchomienie wszystkich testów jednostkowych
npm run test

# Uruchomienie testów w trybie watch
npm run test:watch

# Uruchomienie testów z interfejsem UI
npm run test:ui

# Uruchomienie testów z pomiarem pokrycia
npm run test:coverage
```

### Przykłady pisania testów jednostkowych

#### Testowanie komponentów React

```tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MojKomponent from "@/components/MojKomponent";

describe("MojKomponent", () => {
  it("renderuje poprawnie", () => {
    render(<MojKomponent />);
    expect(screen.getByText(/nazwa/i)).toBeInTheDocument();
  });

  it("reaguje na kliknięcie", () => {
    const onClickMock = vi.fn();
    render(<MojKomponent onClick={onClickMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
```

#### Testowanie serwisów

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MojSerwis } from "@/lib/services/mojSerwis";

// Mock dla zależności
const mockZaleznosc = {
  metoda: vi.fn(),
};

describe("MojSerwis", () => {
  let serwis: MojSerwis;
  
  beforeEach(() => {
    vi.resetAllMocks();
    serwis = new MojSerwis(mockZaleznosc);
  });

  it("zwraca oczekiwany rezultat", async () => {
    mockZaleznosc.metoda.mockResolvedValue({ data: "wynik" });
    const result = await serwis.mojaMetoda();
    expect(result).toEqual("wynik");
  });

  it("obsługuje błędy", async () => {
    mockZaleznosc.metoda.mockRejectedValue(new Error("błąd"));
    const result = await serwis.mojaMetoda();
    expect(result).toBeNull();
  });
});
```

### Zaimplementowane testy jednostkowe

W ramach testów jednostkowych pokryto następujące kluczowe funkcjonalności:

1. **TripGeneratorForm** - testy formularza generatora podróży sprawdzające:
   - Poprawne renderowanie wszystkich pól formularza
   - Obsługę zmiany wartości pól formularza
   - Obsługę błędów walidacji
   - Wyświetlanie tekstu "Generowanie..." podczas ładowania
   - Stylowanie pól z błędami (dodawanie klasy border-red-500)

2. **TripPlanService** - testy serwisu planów podróży sprawdzające:
   - Pobieranie planów podróży z bazy danych
   - Obsługę błędów podczas pobierania planu
   - Zachowanie gdy nie znaleziono planu dla użytkownika
   - Generowanie mockowego planu podróży

3. **NoteService** - testy serwisu notatek sprawdzające:
   - Pobieranie wszystkich notatek użytkownika
   - Pobieranie pojedynczych notatek na podstawie ID
   - Tworzenie nowych notatek
   - Usuwanie notatek i obsługę błędów

## Testy E2E (Playwright)

Testy E2E są pisane za pomocą Playwright, który umożliwia testowanie aplikacji w przeglądarce Chrome.

### Struktura katalogów

```
e2e/
├── home.spec.ts           # Testy strony głównej
├── api/                   # Testy API
│   └── trips.spec.ts      # Testy API dla wycieczek
├── components/            # Testy dla komponentów w kontekście E2E
└── pages/                 # Page Objects dla testów E2E
    └── HomePage.ts        # Page Object dla strony głównej
```

### Uruchamianie testów E2E

```bash
# Uruchomienie wszystkich testów E2E
npm run test:e2e

# Instalacja przeglądarek Playwright
npm run test:install-browsers

# Uruchomienie testów E2E z przeglądarką systemową (w środowisku WSL/Arch)
npm run test:e2e:system
```

> **Uwaga dla środowiska WSL/Arch Linux:**  
> W środowisku WSL/Arch Linux mogą wystąpić problemy z uruchomieniem przeglądarek Playwright. 
> W takim przypadku możesz potrzebować:
> 1. Zainstalować przeglądarkę Chrome/Chromium w systemie
> 2. Ustawić zmienną środowiskową `PLAYWRIGHT_CHROME_EXECUTABLE_PATH` na ścieżkę do wykonywalnego pliku przeglądarki
> 3. Uruchomić testy używając `npm run test:e2e:system`

## Wszystkie testy

```bash
# Uruchomienie wszystkich testów (jednostkowe + E2E)
npm run test:all

# Lintowanie kodu testów
npm run test:lint
```

## Najlepsze praktyki

### Testy jednostkowe

- Używaj `describe` do grupowania powiązanych testów
- Używaj `it` lub `test` do definiowania pojedynczych przypadków testowych
- Testuj komponenty w izolacji, mockując zależności
- Korzystaj z MSW do mockowania zapytań API
- Unikaj testowania implementacji, skupiaj się na testowaniu zachowania
- Resetuj mocki przed każdym testem używając `vi.resetAllMocks()` w `beforeEach`
- Testuj przypadki brzegowe i obsługę błędów
- Weryfikuj zarówno poprawne działanie funkcji jak i obsługę wyjątków
- Używaj snapshotów ostrożnie - tylko dla stabilnych części interfejsu

### Testy E2E

- Używaj Page Object Model do organizacji kodu testów
- Używaj locatorów dla niezawodnego wybierania elementów
- Implementuj testy wizualne za pomocą `expect(page).toHaveScreenshot()`
- Używaj testów API dla walidacji backendu
- Korzystaj z trybu debug i trace viewer do diagnozy problemów z testami

## Dodawanie nowych testów

1. Dla testów jednostkowych: dodaj nowy plik w `src/tests/unit/` z nazwą testowanego komponentu i przyrostkiem `.test.ts` lub `.test.tsx`.
2. Dla testów E2E: dodaj nowy plik w `e2e/` z przyrostkiem `.spec.ts`.
3. Dla Page Objects: dodaj nowy plik w `e2e/pages/` z nazwą strony i przyrostkiem `.ts`.

## Aktualizacja mockowanego API

1. Dodaj lub zaktualizuj handlery w pliku `src/tests/mocks/handlers.ts`.
2. Jeśli dodajesz nowy endpoint, upewnij się, że jest on poprawnie zarejestrowany w serwerze MSW. 
