<authentication_analysis>
# Analiza przepływów autentykacji

## 1. Przepływy autentykacji wymienione w dokumentacji

### Rejestracja użytkownika
- Użytkownik wypełnia formularz rejestracyjny z danymi email i hasło
- Dane są walidowane po stronie klienta
- Dane są przesyłane do API (endpoint /api/auth/register)
- API wykonuje walidację po stronie serwera
- API wywołuje Supabase Auth w celu utworzenia konta
- Użytkownik otrzymuje odpowiedź i zostaje przekierowany na stronę główną

### Logowanie użytkownika
- Użytkownik wypełnia formularz logowania z danymi email i hasło
- Dane są walidowane po stronie klienta
- Dane są przesyłane do API (endpoint /api/auth/login)
- API przekazuje dane do Supabase Auth do weryfikacji
- Po poprawnym logowaniu, token JWT jest zapisywany w localStorage
- Użytkownik zostaje przekierowany na stronę główną

### Wylogowanie użytkownika
- Użytkownik klika opcję "Wyloguj" w menu użytkownika
- Następuje przekierowanie do endpointu /api/auth/logout
- Supabase Auth usuwa sesję
- Token JWT jest usuwany z localStorage
- Użytkownik jest przekierowywany na stronę główną

### Weryfikacja sesji
- Middleware sprawdza sesję przy każdym żądaniu
- Astro API weryfikuje token JWT z Supabase Auth
- Informacje o sesji są dodawane do kontekstu Astro
- Chronione strony są dostępne tylko dla zalogowanych użytkowników

### Resetowanie hasła
- Użytkownik wypełnia formularz z adresem email
- Supabase wysyła email z linkiem do resetowania hasła
- Użytkownik klika link w emailu
- Użytkownik jest przekierowywany do formularza resetowania hasła
- Hasło jest aktualizowane w Supabase Auth

## 2. Główni aktorzy i ich interakcje

### Aktorzy
- Przeglądarka użytkownika
- Astro Middleware
- Astro Endpoint API
- Supabase Auth

### Interakcje
- Przeglądarka <-> Astro API: Przesyłanie formularzy, odbieranie odpowiedzi
- Astro API <-> Supabase Auth: Rejestracja, logowanie, weryfikacja tokenów
- Astro Middleware <-> Supabase Auth: Weryfikacja sesji
- Przeglądarka <-> localStorage: Przechowywanie tokenów JWT

## 3. Procesy weryfikacji i odświeżania tokenów

### Weryfikacja tokenu
- Przy każdym żądaniu, Middleware sprawdza istnienie tokenu JWT
- Token jest weryfikowany przez Supabase Auth
- Token zawiera informacje o użytkowniku i czasie wygaśnięcia
- Middleware ustawia informacje o użytkowniku w kontekście Astro

### Odświeżanie tokenu
- Supabase automatycznie zarządza procesem odświeżania tokenu
- Gdy token zbliża się do wygaśnięcia, Supabase generuje nowy token
- Nowy token jest zapisywany w localStorage
- Proces jest transparentny dla użytkownika

## 4. Kroki autentykacji

### Rejestracja
1. Użytkownik wypełnia formularz rejestracyjny
2. Walidacja danych po stronie klienta
3. Przesłanie danych do API
4. Walidacja po stronie serwera
5. Wywołanie Supabase Auth signUp
6. Supabase tworzy konto i zwraca token
7. Token jest zapisywany w localStorage
8. Przekierowanie użytkownika

### Logowanie
1. Użytkownik wypełnia formularz logowania
2. Walidacja danych po stronie klienta
3. Przesłanie danych do API
4. Wywołanie Supabase Auth signInWithPassword
5. Supabase weryfikuje dane i zwraca token
6. Token jest zapisywany w localStorage
7. Przekierowanie użytkownika

### Weryfikacja sesji
1. Middleware przechwytuje żądanie
2. Middleware pobiera token z żądania/cookie
3. Wywołanie Supabase Auth getSession
4. Weryfikacja tokenu
5. Dodanie informacji o sesji do kontekstu
6. Sprawdzenie uprawnień dostępu do chronionej strony
7. Przekierowanie lub kontynuacja żądania
</authentication_analysis>

<mermaid_diagram>
sequenceDiagram
    autonumber
    participant Browser as Przeglądarka
    participant Components as Komponenty React
    participant Pages as Strony Astro
    participant Middleware as Astro Middleware
    participant API as Astro API Endpoints
    participant Auth as Serwis Auth
    participant Supabase as Supabase Auth
    participant LocalStorage as LocalStorage

    Note over Browser,Supabase: Proces rejestracji użytkownika

    Browser->>Pages: Otwarcie strony rejestracji
    Pages->>Components: Renderowanie formularza rejestracji
    Components->>Browser: Wyświetlenie formularza
    Browser->>Components: Wypełnienie i wysłanie formularza
    Components->>Components: Walidacja formularza (client-side)
    Components->>API: POST /api/auth/register
    API->>API: Walidacja danych (server-side)
    API->>Auth: Wywołanie register()
    Auth->>Supabase: signUp()
    Supabase->>Auth: Zwrócenie danych sesji
    Auth->>API: Zwrócenie danych użytkownika
    API->>LocalStorage: Zapisanie tokenu JWT
    API->>Browser: Odpowiedź z danymi i status success
    Browser->>Pages: Przekierowanie na stronę główną

    Note over Browser,Supabase: Proces logowania użytkownika

    Browser->>Pages: Otwarcie strony logowania
    Pages->>Components: Renderowanie formularza logowania
    Components->>Browser: Wyświetlenie formularza
    Browser->>Components: Wypełnienie i wysłanie formularza
    Components->>Components: Walidacja formularza (client-side)
    Components->>API: POST /api/auth/login
    API->>API: Walidacja danych (server-side)
    API->>Auth: Wywołanie login()
    Auth->>Supabase: signInWithPassword()
    Supabase->>Auth: Zwrócenie danych sesji
    Auth->>API: Zwrócenie danych użytkownika
    API->>LocalStorage: Zapisanie tokenu JWT
    API->>Browser: Odpowiedź z danymi i status success
    Browser->>Pages: Przekierowanie na stronę główną

    Note over Browser,Supabase: Weryfikacja sesji i dostęp do chronionych zasobów

    Browser->>Pages: Żądanie chronionej strony
    Pages->>Middleware: Przechwycenie żądania
    Middleware->>Supabase: getSession()
    Supabase->>Middleware: Dane sesji
    
    alt Ważna sesja
        Middleware->>Pages: Dodanie danych sesji do kontekstu
        Pages->>Components: Przekazanie statusu i danych użytkownika
        Components->>Browser: Renderowanie chronionej zawartości
    else Brak sesji / wygasła sesja
        Middleware->>Browser: Przekierowanie do strony logowania
    end

    Note over Browser,Supabase: Odświeżanie tokenu JWT

    Browser->>Pages: Żądanie dowolnej strony
    Pages->>Middleware: Przechwycenie żądania
    Middleware->>Supabase: getSession()
    
    alt Token blisko wygaśnięcia
        Supabase->>LocalStorage: Automatyczne odświeżenie tokenu
        Supabase->>Middleware: Nowe dane sesji
    else Token ważny
        Supabase->>Middleware: Aktualne dane sesji
    end
    
    Middleware->>Pages: Kontynuacja żądania z danymi sesji

    Note over Browser,Supabase: Proces wylogowania

    Browser->>Components: Kliknięcie "Wyloguj"
    Components->>API: POST /api/auth/logout
    API->>Auth: Wywołanie logout()
    Auth->>Supabase: signOut()
    Supabase->>Auth: Potwierdzenie wylogowania
    Auth->>API: Potwierdzenie zakończenia sesji
    API->>LocalStorage: Usunięcie tokenu JWT
    API->>Browser: Odpowiedź z status success
    Browser->>Pages: Przekierowanie na stronę główną

    Note over Browser,Supabase: Resetowanie hasła

    Browser->>Pages: Otwarcie strony resetowania hasła
    Pages->>Components: Renderowanie formularza resetowania
    Components->>Browser: Wyświetlenie formularza
    Browser->>Components: Wypełnienie i wysłanie adresu email
    Components->>API: POST /api/auth/reset-password
    API->>Auth: Wywołanie resetPassword()
    Auth->>Supabase: resetPasswordForEmail()
    Supabase->>Auth: Potwierdzenie wysłania emaila
    Auth->>API: Potwierdzenie
    API->>Browser: Odpowiedź z status success
    Browser->>Pages: Wyświetlenie komunikatu o wysłaniu emaila
</mermaid_diagram> 
