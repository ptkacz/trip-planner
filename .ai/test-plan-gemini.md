```markdown
# Plan Testów dla Projektu "Trip Planner"

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument opisuje plan testów dla aplikacji webowej "Trip Planner". Aplikacja umożliwia użytkownikom generowanie planów podróży na podstawie podanych kryteriów, zarządzanie notatkami podróżniczymi oraz preferencjami profilowymi. Projekt wykorzystuje nowoczesny stos technologiczny, w tym Astro, React, TypeScript, Supabase jako backend (BaaS) oraz integrację z zewnętrznym API (OpenRouter) do generowania treści AI.

### 1.2. Cele Testowania

Główne cele procesu testowania to:

*   Zapewnienie wysokiej jakości i niezawodności aplikacji "Trip Planner".
*   Weryfikacja poprawności implementacji wszystkich kluczowych funkcjonalności zgodnie ze specyfikacją (wynikającą z analizy kodu).
*   Identyfikacja i raportowanie defektów aplikacji na wczesnym etapie rozwoju.
*   Potwierdzenie, że aplikacja spełnia wymagania użytkowników w zakresie funkcjonalności, użyteczności i wydajności.
*   Zapewnienie stabilności integracji z usługami zewnętrznymi (Supabase, OpenRouter).
*   Weryfikacja poprawności działania mechanizmów uwierzytelniania i autoryzacji.
*   Ocena responsywności i kompatybilności aplikacji na różnych urządzeniach i przeglądarkach.

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami

*   **Moduł Uwierzytelniania:**
    *   Rejestracja użytkownika (formularz, walidacja, API).
    *   Logowanie użytkownika (formularz, walidacja, API, zarządzanie sesją).
    *   Wylogowywanie użytkownika (API, czyszczenie sesji).
    *   Resetowanie hasła (formularz, API).
    *   Sprawdzanie statusu zalogowania (API).
    *   Ochrona tras (middleware, przekierowania dla niezalogowanych użytkowników).
*   **Moduł Generowania Planu Podróży:**
    *   Wprowadzanie danych do formularza (walidacja po stronie klienta i serwera).
    *   Wysyłanie żądania generowania planu (API `/api/trip/generate`).
    *   Integracja z `TripGenerationService`, w tym pobieranie notatek i profilu.
    *   Integracja z `OpenRouterService` (mockowana dla większości testów).
    *   Obsługa odpowiedzi z API (sukces, błąd).
    *   Wyświetlanie wygenerowanego planu (formatowanie, treść).
    *   Wyświetlanie planu zastępczego (mock plan) w przypadku braku planu lub błędu generowania.
    *   Zapisywanie wygenerowanego planu w bazie danych (API `/api/trip/generate` -> `TripGenerationService` -> Supabase).
    *   Pobieranie zapisanego planu z bazy danych (API `/api/trip/plan`, `TripPlanService`).
*   **Moduł Zarządzania Notatkami:**
    *   Dodawanie nowej notatki (formularz, walidacja, API `/api/notes` POST).
    *   Wyświetlanie listy notatek (komponent `NoteList`, API `/api/notes` GET).
    *   Wyświetlanie szczegółów/edycja notatki (strona `/notes/view`, pobieranie danych server-side).
    *   Aktualizacja notatki (formularz na `/notes/view`, żądanie POST).
    *   Usuwanie notatki (przycisk na `/notes/view`, żądanie POST z akcją 'delete', potwierdzenie).
    *   Wybieranie notatek do użycia w generatorze planu (interfejs `GenerateTripView`).
*   **Moduł Zarządzania Profilem:**
    *   Wyświetlanie formularza profilu (strona `/profile`, pobieranie danych server-side).
    *   Zapisywanie/aktualizacja profilu (formularz na `/profile`, API `/api/profile` POST/PUT, client-side fetch).
    *   Wykorzystanie danych profilu podczas generowania planu podróży.
*   **Interfejs Użytkownika (UI/UX):**
    *   Wygląd i spójność wizualna (Tailwind CSS, komponenty UI).
    *   Responsywność na różnych rozmiarach ekranu.
    *   Nawigacja (TopBar, przyciski powrotu, linki).
    *   Obsługa stanów ładowania i błędów w interfejsie.
    *   Użyteczność formularzy i kontrolek.

### 2.2. Funkcjonalności wyłączone z testów

*   Szczegółowe testy wewnętrznej implementacji bibliotek firm trzecich (Astro, React, Supabase SDK, Radix UI, Zod).
*   Dogłębne testy wydajnościowe i obciążeniowe (poza podstawowymi pomiarami czasu odpowiedzi).
*   Testowanie rzeczywistych modeli AI w OpenRouter (testowana będzie tylko integracja i obsługa odpowiedzi/błędów).
*   Testowanie infrastruktury Supabase (zakładamy jej poprawność działania).

## 3. Typy Testów do Przeprowadzenia

*   **Testy Jednostkowe (Unit Tests):**
    *   **Cel:** Weryfikacja poprawności działania małych, izolowanych fragmentów kodu (np. funkcje pomocnicze, proste komponenty React bez złożonej logiki, logika walidacji Zod).
    *   **Narzędzia:** Vitest.
    *   **Zakres:** Funkcje w `src/lib/utils.ts`, podstawowa logika renderowania komponentów UI, schematy Zod.
*   **Testy Integracyjne (Integration Tests):**
    *   **Cel:** Weryfikacja współpracy pomiędzy różnymi modułami/komponentami/serwisami.
    *   **Narzędzia:** Vitest, React Testing Library, Mock Service Worker (MSW) lub inne narzędzia do mockowania API/Supabase.
    *   **Zakres:** Komponenty React z logiką (np. `GenerateTripView` z mockowanymi API calls), serwisy (`noteService`, `profileService`, `tripGenerationService` z mockowanym Supabase/OpenRouter), interakcje API <-> Serwis.
*   **Testy End-to-End (E2E Tests):**
    *   **Cel:** Symulacja rzeczywistych scenariuszy użytkownika w przeglądarce, weryfikacja przepływów aplikacji.
    *   **Narzędzia:** Playwright.
    *   **Zakres:** Kluczowe ścieżki użytkownika: rejestracja -> logowanie -> tworzenie notatki -> generowanie planu -> edycja profilu -> wylogowanie. Testowanie ochrony tras.
*   **Testy API:**
    *   **Cel:** Bezpośrednia weryfikacja działania endpointów API (request/response, kody statusu, walidacja danych, obsługa błędów).
    *   **Narzędzia:** Playwright (do testowania API routes Astro), Postman/Insomnia (do testów manualnych/eksploracyjnych).
    *   **Zakres:** Wszystkie endpointy w `src/pages/api/`.
*   **Testy Wizualne (Visual Regression Tests):**
    *   **Cel:** Wykrywanie niezamierzonych zmian w interfejsie użytkownika.
    *   **Narzędzia:** Playwright (z funkcją porównywania zrzutów ekranu), opcjonalnie: Chromatic, Percy.
    *   **Zakres:** Kluczowe widoki aplikacji (strona główna, profil, formularze).
*   **Testy Użyteczności (Manual Usability Testing):**
    *   **Cel:** Ocena łatwości obsługi, intuicyjności i ogólnego doświadczenia użytkownika.
    *   **Metody:** Testy eksploracyjne, testy korytarzowe (opcjonalnie).
    *   **Zakres:** Cała aplikacja, ze szczególnym uwzględnieniem przepływu generowania planu i zarządzania danymi.
*   **Testy Kompatybilności (Cross-Browser/Device Testing):**
    *   **Cel:** Zapewnienie poprawnego działania i wyglądu aplikacji w różnych środowiskach.
    *   **Narzędzia:** Playwright (konfiguracja dla różnych przeglądarek), BrowserStack/SauceLabs (opcjonalnie), manualne testy na fizycznych urządzeniach/emulatorach.
    *   **Zakres:** Najnowsze wersje popularnych przeglądarek (Chrome, Firefox, Safari, Edge), podstawowe testy na popularnych rozdzielczościach mobilnych i desktopowych.
*   **Podstawowe Testy Bezpieczeństwa (Manual Security Checks):**
    *   **Cel:** Identyfikacja podstawowych luk bezpieczeństwa.
    *   **Metody:** Manualna inspekcja (np. sprawdzanie ochrony tras, walidacji danych wejściowych, zarządzania sesją).
    *   **Zakres:** Weryfikacja logiki middleware, walidacji danych w API, przepływów uwierzytelniania.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

*(Przykładowe, wysoko poziomowe scenariusze. Szczegółowe przypadki testowe zostaną opracowane osobno)*

*   **SCN-AUTH-001: Pomyślna rejestracja użytkownika:**
    1.  Przejdź do strony `/auth/register`.
    2.  Wypełnij formularz poprawnymi danymi (unikalny email, hasło spełniające kryteria, zgodne potwierdzenie).
    3.  Kliknij "Zarejestruj się".
    4.  *Oczekiwany rezultat:* Użytkownik zostaje zarejestrowany (np. przekierowany na stronę logowania lub główną, w zależności od logiki aplikacji).
*   **SCN-AUTH-002: Błąd walidacji podczas rejestracji:**
    1.  Przejdź do `/auth/register`.
    2.  Wypełnij formularz niepoprawnymi danymi (np. niepoprawny email, za krótkie hasło, niezgodne hasła).
    3.  Kliknij "Zarejestruj się".
    4.  *Oczekiwany rezultat:* Pod formularzem pojawiają się komunikaty o błędach walidacji Zod. Rejestracja nie dochodzi do skutku.
*   **SCN-AUTH-003: Pomyślne logowanie użytkownika:**
    1.  Przejdź do `/auth/login`.
    2.  Wprowadź dane istniejącego, zarejestrowanego użytkownika.
    3.  Kliknij "Zaloguj się".
    4.  *Oczekiwany rezultat:* Użytkownik zostaje zalogowany i przekierowany na stronę główną (`/generate` lub `/`). TopBar wyświetla email użytkownika i opcje "Profil", "Wyloguj".
*   **SCN-AUTH-004: Logowanie z błędnymi danymi:**
    1.  Przejdź do `/auth/login`.
    2.  Wprowadź niepoprawne dane logowania.
    3.  Kliknij "Zaloguj się".
    4.  *Oczekiwany rezultat:* Wyświetlony zostaje komunikat o błędzie "Nieprawidłowy email lub hasło". Użytkownik pozostaje na stronie logowania.
*   **SCN-AUTH-005: Ochrona trasy /profile:**
    1.  Jako niezalogowany użytkownik spróbuj przejść bezpośrednio do `/profile`.
    2.  *Oczekiwany rezultat:* Użytkownik zostaje przekierowany na `/auth/login`.
    3.  Zaloguj się.
    4.  Przejdź do `/profile`.
    5.  *Oczekiwany rezultat:* Strona profilu zostaje pomyślnie załadowana.
*   **SCN-TRIP-001: Generowanie planu podróży (podstawowy):**
    1.  Zaloguj się.
    2.  Przejdź do `/generate`.
    3.  Wypełnij formularz generatora (kraj, miasto, dystans > 0).
    4.  Kliknij "Generuj plan podróży".
    5.  *Oczekiwany rezultat:* Wyświetla się stan ładowania, a następnie w sekcji "Twój plan podróży" pojawia się wygenerowany plan. Formularz pozostaje wypełniony. Dane planu zostają zapisane w DB.
*   **SCN-TRIP-002: Generowanie planu z użyciem notatek:**
    1.  Zaloguj się, upewnij się, że masz co najmniej jedną notatkę.
    2.  Przejdź do `/generate`.
    3.  Wypełnij formularz generatora.
    4.  Zaznacz checkbox przy jednej lub więcej notatkach na liście.
    5.  Kliknij "Generuj plan podróży".
    6.  *Oczekiwany rezultat:* Wygenerowany plan zawiera odniesienia do treści wybranych notatek. Wyświetlona jest informacja o liczbie użytych notatek.
*   **SCN-TRIP-003: Ładowanie istniejącego planu:**
    1.  Zaloguj się. Upewnij się, że wcześniej wygenerowałeś i zapisałeś plan.
    2.  Odśwież stronę `/generate`.
    3.  *Oczekiwany rezultat:* Formularz generatora jest wypełniony danymi z ostatnio zapisanego planu. Wyświetlany jest ostatnio zapisany plan (nie mock plan).
*   **SCN-NOTE-001: Pełny cykl życia notatki:**
    1.  Zaloguj się.
    2.  Przejdź do `/generate`, kliknij "Dodaj notatkę".
    3.  Wypełnij formularz na `/notes/add`, kliknij "Zapisz notatkę".
    4.  *Oczekiwany rezultat:* Zostajesz przekierowany do `/generate`, nowa notatka jest widoczna na liście.
    5.  Kliknij na nowo dodaną notatkę na liście.
    6.  *Oczekiwany rezultat:* Przechodzisz do `/notes/view?id=...`, formularz jest wypełniony danymi notatki.
    7.  Zmodyfikuj treść i tytuł notatki, kliknij "Zapisz zmiany".
    8.  *Oczekiwany rezultat:* Zostajesz przekierowany do `/generate`, notatka na liście odzwierciedla zmiany (po odświeżeniu lub jeśli lista jest dynamiczna).
    9.  Ponownie kliknij na notatkę.
    10. Kliknij "Usuń notatkę", potwierdź w oknie dialogowym.
    11. *Oczekiwany rezultat:* Zostajesz przekierowany do `/generate`, notatka zniknęła z listy.
*   **SCN-PROF-001: Zapis profilu użytkownika:**
    1.  Zaloguj się.
    2.  Przejdź do `/profile`.
    3.  Wybierz opcje w formularzu (Typ podróży, Styl, Preferencje żywieniowe).
    4.  Kliknij "Zapisz profil".
    5.  *Oczekiwany rezultat:* Wyświetla się komunikat o sukcesie. Odświeżenie strony pokazuje zapisane wartości w formularzu.
    6.  Wygeneruj nowy plan podróży.
    7.  *Oczekiwany rezultat:* Wygenerowany plan uwzględnia preferencje zapisane w profilu.

## 5. Środowisko Testowe

*   **Lokalne środowisko deweloperskie:** Do uruchamiania testów jednostkowych i integracyjnych podczas rozwoju. Wymaga mockowania Supabase i OpenRouter.
*   **Środowisko Staging/Testowe:** Wdrożona wersja aplikacji na serwerze testowym, połączona z dedykowaną instancją testową Supabase (z odseparowanymi danymi). Klucze API (Supabase, OpenRouter) zarządzane jako zmienne środowiskowe. Używane do testów E2E, API, manualnych, wizualnych.
*   **Środowisko Produkcyjne:** Monitorowanie aplikacji po wdrożeniu (nie do aktywnego testowania przed wdrożeniem).

**Konfiguracja:**

*   **Baza danych:** Dedykowana instancja Supabase dla środowiska Staging. Dane testowe powinny być regularnie czyszczone lub resetowane.
*   **API Zewnętrzne:**
    *   OpenRouter: Użycie klucza API dla środowiska testowego lub mockowanie za pomocą narzędzi (np. MSW) dla testów E2E/integracyjnych, aby uniknąć kosztów i zależności.
    *   Supabase: Użycie testowego klucza API i URL dla środowiska Staging. Mockowanie dla testów jednostkowych/integracyjnych.
*   **Przeglądarki:** Najnowsze stabilne wersje Chrome, Firefox, Safari, Edge.
*   **Urządzenia:** Testy responsywności przeprowadzane przy użyciu narzędzi deweloperskich przeglądarki oraz na wybranych fizycznych urządzeniach (np. popularne modele smartfonów/tabletów) lub emulatorach.

## 6. Narzędzia do Testowania

*   **Framework do testów jednostkowych/integracyjnych:** Vitest
*   **Biblioteka do testowania komponentów React:** React Testing Library (@testing-library/react)
*   **Framework do testów E2E/API/Wizualnych:** Playwright
*   **Mockowanie API/serwisów:** Mock Service Worker (MSW), wbudowane mocki Vitest/Playwright
*   **Walidacja danych:** Zod (wykorzystywany w kodzie, weryfikowany przez testy)
*   **Śledzenie błędów:** GitHub Issues / Jira (lub inne narzędzie projektowe)
*   **CI/CD:** GitHub Actions (lub inne) do automatycznego uruchamiania testów.
*   **Narzędzia deweloperskie przeglądarek:** Do debugowania i inspekcji.
*   **Kontrola wersji:** Git / GitHub (lub inne).

## 7. Harmonogram Testów

*(Harmonogram jest przykładowy i wymaga dostosowania do realnego cyklu życia projektu)*

*   **Faza 1: Planowanie i Setup (Sprint 0/1):**
    *   Finalizacja planu testów.
    *   Konfiguracja środowisk testowych (Staging, testowa baza Supabase).
    *   Konfiguracja narzędzi testowych w projekcie (Vitest, Playwright, CI).
*   **Faza 2: Rozwój Testów (Równolegle z rozwojem funkcjonalności - Sprint 1-N):**
    *   Pisanie testów jednostkowych i integracyjnych przez deweloperów i QA.
    *   Rozpoczęcie pisania testów E2E i API dla kluczowych przepływów.
    *   Konfiguracja testów wizualnych.
*   **Faza 3: Wykonywanie Testów (Cyklicznie, przed każdym wdrożeniem - Sprint 1-N):**
    *   Uruchamianie automatycznych zestawów testów (Unit, Integration, E2E, API, Visual) w CI/CD.
    *   Przeprowadzanie testów manualnych (eksploracyjne, użyteczności, kompatybilności).
    *   Raportowanie i weryfikacja błędów.
*   **Faza 4: Testy Regresji (Przed wdrożeniem na produkcję):**
    *   Pełne wykonanie zestawu testów E2E i krytycznych testów manualnych.
    *   Weryfikacja poprawek błędów.
*   **Faza 5: Testy Akceptacyjne Użytkownika (UAT) (Opcjonalnie, przed wdrożeniem):**
    *   Prezentacja funkcjonalności i testy przeprowadzane przez interesariuszy/klienta.
*   **Faza 6: Monitorowanie po wdrożeniu (Ciągłe):**
    *   Monitorowanie logów i błędów na produkcji.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów)

*   Dostępny plan testów.
*   Skonfigurowane środowisko testowe.
*   Dostępna wersja aplikacji do testów (build na Staging).
*   Podstawowa dokumentacja funkcjonalności (lub kod źródłowy jako specyfikacja).

### 8.2. Kryteria Zakończenia Testów (Wyjścia)

*   Wszystkie zaplanowane przypadki testowe zostały wykonane.
*   Osiągnięto zdefiniowany próg pokrycia kodu testami (np. 70% dla Unit/Integration - do ustalenia z zespołem).
*   Wszystkie testy automatyczne (Unit, Integration, E2E, API) przechodzą pomyślnie w środowisku Staging.
*   Brak znanych błędów krytycznych (blokujących) i wysokiego priorytetu.
*   Liczba błędów średniego i niskiego priorytetu mieści się w akceptowalnym zakresie (do ustalenia z zespołem).
*   Wyniki testów zostały udokumentowane i zaraportowane.

## 9. Role i Odpowiedzialności

*   **Inżynier QA:**
    *   Tworzenie i utrzymanie planu testów.
    *   Projektowanie i implementacja przypadków testowych (manualnych i automatycznych E2E, API, wizualnych).
    *   Konfiguracja i utrzymanie środowiska testowego i narzędzi.
    *   Wykonywanie testów (manualnych i automatycznych).
    *   Raportowanie i śledzenie błędów.
    *   Komunikacja statusu testów do zespołu.
*   **Deweloperzy:**
    *   Implementacja testów jednostkowych i integracyjnych dla swojego kodu.
    *   Poprawianie błędów zgłoszonych przez QA.
    *   Uczestnictwo w przeglądach kodu pod kątem testowalności.
    *   Wsparcie w konfiguracji środowiska i debugowaniu problemów.
*   **Project Manager / Product Owner:**
    *   Definiowanie priorytetów dla testowanych funkcjonalności.
    *   Uczestnictwo w definiowaniu kryteriów akceptacji.
    *   Podejmowanie decyzji dotyczących wdrożenia na podstawie raportów z testów.

## 10. Procedury Raportowania Błędów

*   **Narzędzie:** Dedykowane narzędzie do śledzenia błędów (np. GitHub Issues, Jira).
*   **Proces:**
    1.  **Identyfikacja:** Wykrycie defektu podczas testowania.
    2.  **Reprodukcja:** Potwierdzenie możliwości powtórzenia błędu.
    3.  **Rejestracja:** Utworzenie nowego zgłoszenia błędu w systemie śledzenia.
    4.  **Analiza i Priorytetyzacja:** Ocena błędu przez zespół (QA, Dev, PM/PO) i nadanie priorytetu/ważności.
    5.  **Poprawka:** Implementacja poprawki przez dewelopera.
    6.  **Weryfikacja:** Ponowne przetestowanie poprawki przez QA w nowej wersji aplikacji.
    7.  **Zamknięcie/Odrzucenie:** Zamknięcie zgłoszenia, jeśli błąd został poprawnie naprawiony, lub ponowne otwarcie/odrzucenie.
*   **Zawartość Zgłoszenia Błędu:**
    *   **Tytuł:** Krótki, zwięzły opis problemu.
    *   **Opis:** Szczegółowy opis błędu.
    *   **Kroki do Reprodukcji:** Numerowana lista kroków pozwalająca jednoznacznie odtworzyć błąd.
    *   **Wynik Oczekiwany:** Opis, jak aplikacja powinna działać.
    *   **Wynik Aktualny:** Opis, jak aplikacja działa obecnie (z błędem).
    *   **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny, urządzenie.
    *   **Ważność/Priorytet:** (np. Krytyczny, Wysoki, Średni, Niski).
    *   **Załączniki:** Zrzuty ekranu, nagrania wideo, logi konsoli/sieciowe.
```
