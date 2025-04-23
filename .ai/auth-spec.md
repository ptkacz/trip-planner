# Specyfikacja systemu autentykacji - TripPlanner

## 1. Architektura interfejsu użytkownika

### 1.1 Nowe strony
Zostaną utworzone następujące strony Astro w katalogu `src/pages/auth`:

- `src/pages/auth/login.astro` - strona logowania użytkownika
- `src/pages/auth/register.astro` - strona rejestracji nowego użytkownika
- `src/pages/auth/reset-password.astro` - strona resetowania hasła
- `src/pages/auth/logout.astro` - strona wylogowania (przekierowanie)

### 1.2 Nowe komponenty
W katalogu `src/components/auth` zostaną utworzone następujące komponenty React:

- `LoginForm.tsx` - formularz logowania użytkownika
- `RegisterForm.tsx` - formularz rejestracji użytkownika
- `PasswordResetForm.tsx` - formularz resetowania hasła
- `AuthGuard.tsx` - komponent ochronny dla stron wymagających logowania
- `UserMenu.tsx` - menu użytkownika z opcjami zarządzania kontem (wyświetlane w TopBar)

### 1.3 Modyfikacje istniejących komponentów

#### TopBar.tsx
Komponent zostanie rozszerzony o nowe elementy:

```tsx
// Nowy interfejs
interface TopBarProps {
  onProfileClick?: () => void;
  onAddNoteClick?: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

// Modyfikacja komponentu do obsługi stanu logowania
const TopBar: React.FC<TopBarProps> = ({ onProfileClick, isLoggedIn, userEmail }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">Generator planu podróży</h1>
      <div className="flex gap-2">
        {isLoggedIn ? (
          <UserMenu email={userEmail} onProfileClick={onProfileClick} />
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/login">Logowanie</a>
            </Button>
            <Button variant="default" size="sm" asChild>
              <a href="/auth/register">Rejestracja</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
```

#### GenerateTripView.tsx
Komponent zostanie zmodyfikowany, aby renderować odpowiednie opcje w zależności od stanu logowania:

- Dla zalogowanych użytkowników - pełna funkcjonalność z notatkami i uwzględnieniem profilu
- Dla niezalogowanych użytkowników - bazowa funkcjonalność bez notatek i profilu

### 1.4 Walidacja i komunikaty błędów

Każdy formularz będzie zawierał walidację po stronie klienta z następującymi regułami:

#### Rejestracja:
- Email: format poprawnego adresu email (regex)
- Hasło: minimum 8 znaków, co najmniej jedna duża litera, jedna cyfra
- Potwierdzenie hasła: musi być zgodne z hasłem

#### Logowanie:
- Email: format poprawnego adresu email
- Hasło: pole wymagane

#### Resetowanie hasła:
- Email: format poprawnego adresu email

#### Komunikaty błędów:
- Błędy walidacji formularza (wyświetlane pod polami)
- Błędy autentykacji (np. nieprawidłowe dane logowania, konto nie istnieje)
- Błędy sieciowe (problem z połączeniem do serwera)

### 1.5 Obsługa scenariuszy

#### Scenariusz: Rejestracja
1. Użytkownik otwiera stronę `/auth/register`
2. Wypełnia formularz: email, hasło, potwierdzenie hasła
3. Po pomyślnej walidacji, dane są przesyłane do Supabase Auth
4. W przypadku powodzenia, użytkownik jest przekierowywany na stronę główną
5. W przypadku błędu, wyświetlany jest komunikat

#### Scenariusz: Logowanie
1. Użytkownik otwiera stronę `/auth/login`
2. Wypełnia formularz: email, hasło
3. Po walidacji, dane są przesyłane do Supabase Auth
4. W przypadku powodzenia, użytkownik jest przekierowywany na stronę główną
5. W przypadku błędu, wyświetlany jest komunikat

#### Scenariusz: Wylogowanie
1. Zalogowany użytkownik klika opcję "Wyloguj" w menu użytkownika
2. Następuje przekierowanie do `/auth/logout`
3. Sesja jest kasowana i użytkownik jest przekierowywany na stronę główną

## 2. Logika backendowa

### 2.1 Endpointy API

W katalogu `src/pages/api/auth` zostaną utworzone następujące endpointy:

#### `src/pages/api/auth/status.ts`
- Metoda: GET
- Opis: Zwraca aktualny stan autentykacji użytkownika
- Odpowiedź: `{ isLoggedIn: boolean, user?: UserDTO }`

#### `src/pages/api/auth/register.ts`
- Metoda: POST
- Opis: Rejestracja nowego użytkownika
- Payload: `{ email: string, password: string }`
- Odpowiedź: `{ success: boolean, user?: UserDTO, error?: string }`

#### `src/pages/api/auth/login.ts`
- Metoda: POST
- Opis: Logowanie użytkownika
- Payload: `{ email: string, password: string }`
- Odpowiedź: `{ success: boolean, user?: UserDTO, error?: string }`

#### `src/pages/api/auth/logout.ts`
- Metoda: POST
- Opis: Wylogowanie użytkownika
- Odpowiedź: `{ success: boolean, error?: string }`

#### `src/pages/api/auth/reset-password.ts`
- Metoda: POST
- Opis: Wysłanie emaila z linkiem do resetowania hasła
- Payload: `{ email: string }`
- Odpowiedź: `{ success: boolean, error?: string }`

### 2.2 Modele danych

W pliku `src/types.ts` zostaną dodane następujące typy:

```typescript
// -------------------------
// Auth DTO and Command Models
// -------------------------

/**
 * LoginCommand reprezentuje dane wymagane do logowania
 */
export interface LoginCommand {
  email: string;
  password: string;
}

/**
 * RegisterCommand reprezentuje dane wymagane do rejestracji
 */
export interface RegisterCommand {
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * ResetPasswordCommand reprezentuje dane wymagane do resetowania hasła
 */
export interface ResetPasswordCommand {
  email: string;
}

/**
 * AuthResponse reprezentuje standardową odpowiedź z endpointów autentykacji
 */
export interface AuthResponse {
  success: boolean;
  user?: UserDTO;
  error?: string;
}
```

### 2.3 Walidacja danych wejściowych

Walidacja będzie realizowana na dwóch poziomach:

#### Frontend (client-side)
- Wykorzystanie biblioteki `zod` do definiowania schematów walidacji
- Integracja z formularzami React za pomocą `react-hook-form`

#### Backend (server-side)
- Ponowna walidacja danych za pomocą `zod` przed przekazaniem do Supabase
- Sprawdzanie dodatkowych reguł biznesowych (np. unikalność emaila)

### 2.4 Obsługa wyjątków

W przypadku błędów autentykacji zostanie zaimplementowana jednolita obsługa:

- Błędy 400 (Bad Request) - nieprawidłowe dane wejściowe
- Błędy 401 (Unauthorized) - brak autoryzacji lub nieprawidłowe dane logowania
- Błędy 403 (Forbidden) - próba dostępu do zasobu bez wymaganych uprawnień
- Błędy 404 (Not Found) - zasób nie istnieje
- Błędy 500 (Internal Server Error) - błędy serwera

Każdy endpoint będzie obsługiwał błędy w jednolity sposób:

```typescript
try {
  // logika biznesowa
  return new Response(JSON.stringify({ success: true, user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} catch (error) {
  // obsługa błędu
  const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
  const status = /* określenie odpowiedniego kodu błędu */;
  
  return new Response(JSON.stringify({ success: false, error: errorMessage }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 2.5 Renderowanie stron server-side

Konfiguracja Astro z `output: "server"` (w pliku `astro.config.mjs`) oznacza, że strony są renderowane po stronie serwera. Dostęp do stanu autentykacji będzie możliwy poprzez:

```typescript
// W stronach Astro (.astro)
const supabase = Astro.locals.supabase;
const { data: { session } } = await supabase.auth.getSession();
const isLoggedIn = !!session;

// Przekazanie stanu do komponentów React
<SomeReactComponent client:load isLoggedIn={isLoggedIn} user={session?.user} />
```

## 3. System autentykacji

### 3.1 Integracja z Supabase Auth

#### Inicjalizacja klienta
Klient Supabase jest już zainicjowany w pliku `src/db/supabase.client.ts`. Zostanie on rozszerzony o metody pomocnicze do autentykacji:

```typescript
// src/lib/auth.ts
import { supabaseClient } from '../db/supabase.client';
import type { LoginCommand, RegisterCommand, ResetPasswordCommand } from '../types';

export const authService = {
  /**
   * Rejestracja nowego użytkownika
   */
  async register({ email, password }: RegisterCommand) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Logowanie użytkownika
   */
  async login({ email, password }: LoginCommand) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Wylogowanie użytkownika
   */
  async logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  /**
   * Resetowanie hasła
   */
  async resetPassword({ email }: ResetPasswordCommand) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password-confirmation`,
    });
    
    if (error) throw error;
    return true;
  },
  
  /**
   * Pobranie aktualnej sesji
   */
  async getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};
```

### 3.2 Integracja z middleware Astro

Middleware zostanie rozszerzony o funkcjonalność sprawdzania sesji i przekazywania jej do kontekstu:

```typescript
// src/middleware/index.ts
import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";

export const onRequest = defineMiddleware(async (context, next) => {
  // Inicjalizacja klienta Supabase w kontekście
  context.locals.supabase = supabaseClient;
  
  // Pobranie sesji użytkownika
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  // Dodanie informacji o użytkowniku do kontekstu
  context.locals.session = session;
  context.locals.user = session?.user;
  context.locals.isLoggedIn = !!session;
  
  // Autoryzacja dostępu do chronionych stron
  const isProtectedRoute = context.url.pathname.startsWith('/profile') || 
                           context.url.pathname.startsWith('/notes');
                           
  if (isProtectedRoute && !context.locals.isLoggedIn) {
    // Przekierowanie na stronę logowania
    return context.redirect('/auth/login?redirect=' + encodeURIComponent(context.url.pathname));
  }
  
  return next();
});
```

### 3.3 Komponenty ochronne (Auth Guards)

Zostanie utworzony komponent `AuthGuard.tsx`, który będzie opakowywał komponenty wymagające autoryzacji:

```tsx
// src/components/auth/AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { authService } from '../../lib/auth';
import type { UserDTO } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
  }, []);
  
  // Stan ładowania
  if (isAuthenticated === null) {
    return <div>Ładowanie...</div>;
  }
  
  // Użytkownik niezalogowany
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // Użytkownik zalogowany
  return <>{children}</>;
};

export default AuthGuard;
```

### 3.4 Persystencja sesji

Supabase Auth automatycznie obsługuje persystencję sesji za pomocą tokena JWT przechowywane w localStorage. Dodatkowo, sesja będzie weryfikowana na serwerze w middleware Astro. 
