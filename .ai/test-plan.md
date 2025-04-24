# Plan Testów

## 1. Wprowadzenie i Cele Testowania
Celem niniejszego planu testów jest zapewnienie wysokiej jakości aplikacji poprzez systematyczne wykrywanie błędów, weryfikację poprawności działania kluczowych funkcjonalności oraz potwierdzenie zgodności implementacji z wymaganiami projektowymi. Testy mają na celu:
- Wykrycie i eliminację błędów zarówno na poziomie jednostkowym, jak i integracyjnym.
- Zapewnienie optymalnej wydajności i responsywności interfejsu użytkownika.
- Weryfikację poprawnej integracji z usługami zewnętrznymi (Supabase, Openrouter.ai).
- Utrzymanie stabilności systemu podczas wprowadzania nowych funkcjonalności.

## 2. Zakres Testów
Testy obejmą następujące obszary:
- **Frontend**: Testowanie komponentów napisanych w React oraz interfejsu użytkownika z wykorzystaniem Astro, Tailwind i Shadcn/ui.
- **Backend / API**: Weryfikacja endpointów API znajdujących się w katalogu `./src/pages/api`, w tym interakcji z bazą danych Supabase oraz autentykacją.
- **Integracja**: Testy połączeń między frontendem, backendem i zewnętrznymi usługami (np. Openrouter.ai).
- **CI/CD**: Weryfikacja działania pipeline'ów w Github Actions oraz poprawności deploymentu (DigitalOcean, Docker).
- **Testy wydajnościowe**: Ocena czasu ładowania i responsywności aplikacji w różnych scenariuszach użytkowania.
- **Testy dostępności**: Weryfikacja zgodności z wytycznymi WCAG i zapewnienie dostępności dla użytkowników z różnymi potrzebami.
- **Testy kompatybilności**: Sprawdzenie działania aplikacji na różnych przeglądarkach i urządzeniach.

## 3. Typy Testów
- **Testy Jednostkowe**: Weryfikacja działania poszczególnych funkcji i komponentów (np. logika React, helpery w `./src/lib`).
- **Testy Integracyjne**: Sprawdzenie poprawnej współpracy między warstwami aplikacji, zwłaszcza komunikacji między frontendem a backendem.
- **Testy End-to-End (E2E)**: Symulacja rzeczywistych scenariuszy użytkownika obejmujących cały przepływ aplikacji.
- **Testy Wydajnościowe**: Testy obciążeniowe i stresowe dla kluczowych punktów aplikacji oraz monitorowanie Core Web Vitals.
- **Testy UI / Wizualne**: Walidacja poprawności renderowania interfejsu, zgodności z wytycznymi projektowymi (Tailwind, Shadcn/ui) oraz wykrywanie regresji wizualnej.
- **Testy Dostępności**: Weryfikacja zgodności z wytycznymi WCAG 2.1 i zapewnienie dostępności dla użytkowników z niepełnosprawnościami.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności
- **Renderowanie i interakcja komponentów**  
  - Sprawdzenie poprawnego renderowania stron i komponentów React.
  - Weryfikacja responsywności elementów UI oraz poprawnej obsługi zdarzeń (kliknięcia, wprowadzanie danych, nawigacja).
  - Testowanie izolowanych komponentów w środowisku Storybook.
  
- **Autentykacja i autoryzacja**  
  - Testowanie rejestracji i logowania użytkowników poprzez mechanizmy Supabase.
  - Walidacja ograniczeń dostępu do zabezpieczonych zasobów.

- **Komunikacja z API**  
  - Weryfikacja poprawności odpowiedzi serwera dla endpointów w `./src/pages/api`.
  - Testowanie obsługi błędów oraz edge-case'ów (np. nieprawidłowe żądania).
  - Mockowanie odpowiedzi API za pomocą MSW (Mock Service Worker).

- **Integracja z usługami zewnętrznymi**  
  - Testowanie poprawności komunikacji z Openrouter.ai (np. przekazywanie zapytań, obsługa odpowiedzi).
  - Walidacja synchronizacji i spójności danych między Supabase a aplikacją.

- **CI/CD i Deployment**  
  - Symulacja pipeline'ów CI/CD w Github Actions.
  - Weryfikacja procesu budowania, testowania oraz deploymentu aplikacji na DigitalOcean.

## 5. Środowisko Testowe
- **Lokalne**: Uruchomienie aplikacji w środowisku deweloperskim z wykorzystaniem lokalnej konfiguracji bazy danych oraz środowiska Node.js.
- **Staging**: Środowisko zbliżone do produkcyjnego, umożliwiające kompleksowe testowanie integracyjne.
- **Testy Automatyczne**: Pipeline CI/CD, który uruchamia automatyczną serię testów przy każdym pushu do repozytorium.
- **Środowisko do testów kompatybilności**: Usługa BrowserStack do testowania na różnych przeglądarkach i urządzeniach.

## 6. Narzędzia do Testowania
- **Frameworki testowe**: 
  - Vitest jako główny framework testowy (szybszy niż Jest, lepiej integruje się z Astro)
  - React Testing Library do testów komponentów React
  - MSW (Mock Service Worker) do mockowania API
- **Narzędzia E2E**: Playwright do automatyzacji testów end-to-end
- **Narzędzia do testów UI i wizualnych**:
  - Storybook do izolowanego testowania i dokumentowania komponentów
  - Percy lub Chromatic do testów regresji wizualnej
- **Narzędzia do testów dostępności**:
  - Axe lub Lighthouse do testowania zgodności z WCAG
- **Narzędzia do testów wydajnościowych**: 
  - Web Vitals API do mierzenia Core Web Vitals
  - Lighthouse do audytu wydajności
  - Grafana k6 do zaawansowanych testów obciążeniowych
- **Narzędzia do testów kompatybilności**:
  - BrowserStack do testowania na różnych przeglądarkach i urządzeniach
- **System zarządzania błędami**: GitHub Issues
- **Pipeline CI/CD**: GitHub Actions do automatycznego uruchamiania testów przy commitach

## 7. Harmonogram Testów
- **Faza 1: Przygotowanie**  
  - Ustalenie środowisk testowych i konfiguracja narzędzi.  
  - Opracowanie pierwszej wersji testów jednostkowych i integracyjnych.
  - Konfiguracja Storybook dla kluczowych komponentów UI.
  
- **Faza 2: Testy Automatyczne**  
  - Implementacja i uruchomienie testów jednostkowych z Vitest i integracyjnych z React Testing Library.
  - Konfiguracja i wdrożenie testów E2E z Playwright.
  - Bieżąca integracja testów w pipeline CI/CD.
  
- **Faza 3: Testy Wydajnościowe i Obciążeniowe**  
  - Konfiguracja monitorowania Web Vitals.
  - Przeprowadzenie testów wydajnościowych z Lighthouse.
  - Implementacja zaawansowanych testów obciążeniowych z Grafana k6.
  
- **Faza 4: Testy Wizualne i Dostępności**
  - Wdrożenie testów regresji wizualnej z Percy/Chromatic.
  - Przeprowadzenie audytów dostępności z Axe.
  - Testowanie na różnych przeglądarkach i urządzeniach za pomocą BrowserStack.
  
- **Faza 5: Raportowanie i Poprawki**  
  - Zbieranie wyników testów, raportowanie błędów i wdrożenie poprawek.
  - Retestowanie po wdrożeniu poprawek.

## 8. Kryteria Akceptacji Testów
- Wszystkie testy jednostkowe i integracyjne muszą przejść pomyślnie przed wdrożeniem.
- Błędy krytyczne oraz wysokiego priorytetu muszą być naprawione przed wdrożeniem nowej wersji.
- Wyniki testów wydajnościowych muszą spełniać ustalone wymagania dotyczące czasu odpowiedzi i obciążenia.
- Core Web Vitals muszą spełniać standardy Google dla dobrego doświadczenia użytkownika.
- Testy dostępności muszą potwierdzać zgodność z WCAG 2.1 na poziomie AA.
- Zebrane raporty z testów muszą być przeanalizowane i zatwierdzone przez zespół QA oraz deweloperów.

## 9. Role i Odpowiedzialności
- **QA Engineer**: Odpowiedzialny za przygotowanie, implementację i przeprowadzanie testów; raportowanie błędów.
- **Deweloperzy**: Tworzenie kodu zgodnie z wymaganiami oraz wdrażanie poprawek zgłoszonych w trakcie testów.
- **Product Owner**: Weryfikacja zgodności funkcjonalności z wymaganiami biznesowymi.
- **DevOps/Inżynier CI/CD**: Utrzymanie i monitorowanie pipeline'ów CI/CD oraz wdrożeń produkcyjnych.

## 10. Procedury Raportowania Błędów
- **Zgłaszanie błędów**: Wszystkie znalezione błędy należy zgłaszać w GitHub Issues, z dokładnym opisem problemu, krokami reprodukcji, oczekiwanym wynikiem oraz zrzutami ekranu (jeśli dotyczy).
- **Priorytetyzacja**: Błędy są klasyfikowane według krytyczności (krytyczny, wysoki, średni, niski) oraz wpływu na użytkownika końcowego.
- **Weryfikacja**: Po naprawie błędu, należy przeprowadzić retesty w celu potwierdzenia poprawności wdrożonej zmiany.
- **Dokumentacja**: Wszystkie zgłoszenia, zmiany oraz wnioski po testach muszą być dokumentowane i archiwizowane w celu późniejszej analizy oraz poprawy procesów testowych.
