<architecture_analysis>
# Analiza architektury UI modułu autentykacji

## 1. Komponenty wymienione w plikach referencyjnych

### Strony Astro:
- src/pages/auth/login.astro - strona logowania
- src/pages/auth/register.astro - strona rejestracji
- src/pages/auth/reset-password.astro - strona resetowania hasła
- src/pages/auth/logout.astro - strona wylogowania (przekierowanie)

### Komponenty React:
- src/components/auth/LoginForm.tsx - formularz logowania
- src/components/auth/RegisterForm.tsx - formularz rejestracji
- src/components/auth/PasswordResetForm.tsx - formularz resetowania hasła
- src/components/auth/AuthGuard.tsx - komponent ochronny dla stron wymagających logowania
- src/components/auth/UserMenu.tsx - menu użytkownika
- src/components/TopBar.tsx - modyfikacja istniejącego komponentu
- src/components/GenerateTripView.tsx - modyfikacja istniejącego komponentu

### Komponenty pomocnicze i usługi:
- src/lib/auth.ts - serwis autentykacji integrujący z Supabase
- src/middleware/index.ts - middleware Astro do weryfikacji sesji

## 2. Główne strony i odpowiadające komponenty

### Logowanie:
- src/pages/auth/login.astro - strona
- src/components/auth/LoginForm.tsx - główny komponent formularza

### Rejestracja:
- src/pages/auth/register.astro - strona
- src/components/auth/RegisterForm.tsx - główny komponent formularza

### Resetowanie hasła:
- src/pages/auth/reset-password.astro - strona
- src/components/auth/PasswordResetForm.tsx - główny komponent formularza

### Wylogowanie:
- src/pages/auth/logout.astro - strona przekierowująca

### Integracja z istniejącymi widokami:
- src/components/TopBar.tsx - rozszerzony o UserMenu.tsx dla zalogowanych lub przyciski logowania/rejestracji
- src/components/GenerateTripView.tsx - zmodyfikowany, aby wyświetlać różne funkcje w zależności od stanu logowania

## 3. Przepływ danych między komponentami

- Strony Astro (login.astro, register.astro) -> formularze React (LoginForm.tsx, RegisterForm.tsx) -> API Endpointy (/api/auth/login, /api/auth/register) -> Supabase Auth
- TopBar.tsx -> UserMenu.tsx -> logout.astro -> API Endpoint (/api/auth/logout) -> Supabase Auth
- Middleware sprawdza sesję i przekazuje informacje o użytkowniku do stron Astro i komponentów React
- AuthGuard.tsx chroni komponenty wymagające autoryzacji, sprawdzając stan logowania

## 4. Funkcjonalność komponentów

### LoginForm.tsx:
- Formularz z polami email i hasło
- Walidacja pól (format email, hasło wymagane)
- Obsługa logowania poprzez Supabase Auth
- Wyświetlanie komunikatów o błędach
- Przekierowanie po udanym logowaniu

### RegisterForm.tsx:
- Formularz z polami email, hasło i potwierdzenie hasła
- Walidacja pól (format email, złożoność hasła, zgodność haseł)
- Obsługa rejestracji poprzez Supabase Auth
- Wyświetlanie komunikatów o błędach
- Przekierowanie po udanej rejestracji

### PasswordResetForm.tsx:
- Formularz z polem email
- Walidacja pola (format email)
- Wysyłanie żądania resetowania hasła przez Supabase Auth
- Wyświetlanie komunikatów (sukces/błąd)

### AuthGuard.tsx:
- Komponent ochronny dla elementów wymagających logowania
- Sprawdzanie stanu sesji
- Renderowanie zawartości chronionych lub komunikatu/przekierowanie dla niezalogowanych

### UserMenu.tsx:
- Menu użytkownika z informacją o zalogowanym koncie
- Opcje zarządzania kontem (profil, wylogowanie)

### Middleware:
- Weryfikacja sesji użytkownika
- Przekazywanie stanu logowania do kontekstu Astro
- Ochrona ścieżek wymagających autoryzacji
</architecture_analysis>

<mermaid_diagram>
flowchart TD
  %% Główne grupy elementów
  subgraph "Komponenty Stron Autentykacji"
    LoginPage["login.astro\nStrona logowania"]
    RegisterPage["register.astro\nStrona rejestracji"]
    ResetPage["reset-password.astro\nResetowanie hasła"]
    LogoutPage["logout.astro\nWylogowanie"]
  end

  subgraph "Formularze React"
    LoginForm["LoginForm.tsx\nFormularz logowania"]
    RegisterForm["RegisterForm.tsx\nFormularz rejestracji"]
    PasswordResetForm["PasswordResetForm.tsx\nFormularz resetowania hasła"]
  end

  subgraph "Komponenty Autoryzacyjne"
    AuthGuard["AuthGuard.tsx\nKomponent ochronny"]
    UserMenu["UserMenu.tsx\nMenu użytkownika"]
  end

  subgraph "Serwisy i Middleware"
    AuthService["auth.ts\nSerwis autentykacji"]
    AuthMiddleware["middleware/index.ts\nMiddleware Astro"]
  end

  subgraph "Komponenty Aplikacji"
    TopBarOld["TopBar.tsx\nObecny komponent (do modyfikacji)"]
    TopBarNew["TopBar.tsx\nZmodyfikowany komponent"]:::modified
    GenerateTripViewOld["GenerateTripView.tsx\nObecny komponent (do modyfikacji)"]
    GenerateTripViewNew["GenerateTripView.tsx\nZmodyfikowany komponent"]:::modified
  end

  subgraph "Supabase"
    SupabaseAuth["Supabase Auth\nAutentykacja"]
  end

  %% Połączenia między komponentami stron a formularzami
  LoginPage --> LoginForm
  RegisterPage --> RegisterForm
  ResetPage --> PasswordResetForm

  %% Połączenia z formularzami i API
  LoginForm --"POST"--> ApiLoginEndpoint["API: /api/auth/login.ts"]
  RegisterForm --"POST"--> ApiRegisterEndpoint["API: /api/auth/register.ts"]
  PasswordResetForm --"POST"--> ApiResetEndpoint["API: /api/auth/reset-password.ts"]
  LogoutPage --"POST"--> ApiLogoutEndpoint["API: /api/auth/logout.ts"]
  
  %% Połączenia endpointów z serwisem auth
  ApiLoginEndpoint --> AuthService
  ApiRegisterEndpoint --> AuthService
  ApiResetEndpoint --> AuthService
  ApiLogoutEndpoint --> AuthService
  
  %% Połączenia serwisu auth z Supabase
  AuthService --> SupabaseAuth

  %% Przepływ danych z middleware
  AuthMiddleware --"Sprawdza sesję"--> SupabaseAuth
  AuthMiddleware --"Przekazuje sesję"--> PageContext["Kontekst Astro (locals)"]
  
  %% Relacje między komponentami
  TopBarOld --"Modyfikacja"--> TopBarNew
  TopBarNew --> UserMenu
  GenerateTripViewOld --"Modyfikacja"--> GenerateTripViewNew
  GenerateTripViewNew --> AuthGuard
  
  %% AuthGuard kontroluje dostęp
  AuthGuard --"Chroni komponenty\nwymagające logowania"--> ProtectedComponents["Komponenty chronione\n(notatki, profil)"]
  AuthGuard --"Sprawdza sesję"--> AuthService

  %% Przepływ użytkownika
  User((Użytkownik)) --> TopBarNew
  User --> LoginPage
  User --> RegisterPage
  User --> ResetPage
  
  %% Stylizacja
  classDef modified fill:#f9c270,stroke:#333,stroke-width:2px;
  classDef page fill:#d4f0f0,stroke:#333,stroke-width:1px;
  classDef form fill:#e0f5d0,stroke:#333,stroke-width:1px;
  classDef api fill:#f0d0e5,stroke:#333,stroke-width:1px;
  
  class LoginPage,RegisterPage,ResetPage,LogoutPage page;
  class LoginForm,RegisterForm,PasswordResetForm form;
  class ApiLoginEndpoint,ApiRegisterEndpoint,ApiResetEndpoint,ApiLogoutEndpoint api;
</mermaid_diagram> 
