<user_journey_analysis>
# Analiza podróży użytkownika w procesie autentykacji

## 1. Ścieżki użytkownika wymienione w dokumentacji

### Rejestracja nowego użytkownika
- Wypełnienie formularza rejestracyjnego (email, hasło, potwierdzenie hasła)
- Walidacja danych
- Utworzenie konta
- Otrzymanie potwierdzenia rejestracji i automatyczne zalogowanie

### Logowanie użytkownika
- Wypełnienie formularza logowania (email, hasło)
- Walidacja danych
- Uzyskanie dostępu do konta
- Przekierowanie do widoku głównego

### Odzyskiwanie hasła
- Przejście do formularza resetowania hasła
- Podanie adresu email
- Otrzymanie linku resetującego na adres email
- Ustawienie nowego hasła

### Wylogowanie użytkownika
- Wybranie opcji wylogowania
- Potwierdzenie wylogowania
- Przekierowanie do widoku głównego

### Korzystanie z aplikacji jako niezalogowany użytkownik
- Dostęp do generatora planu podróży (ograniczona funkcjonalność)
- Możliwość wprowadzenia punktu startowego
- Brak dostępu do notatek i profilu turystycznego

### Korzystanie z aplikacji jako zalogowany użytkownik
- Pełny dostęp do generatora planu podróży
- Dostęp do preferencji turystycznych (profil)
- Dostęp do notatek (tworzenie, edycja, usuwanie)
- Generowanie planu uwzględniającego profil i wybrane notatki

## 2. Główne podróże i ich stany

### Ścieżka rejestracji
- StronaGlowna - punkt startowy
- FormularzRejestracji - wypełnianie danych rejestracyjnych
- WalidacjaDanych - sprawdzanie poprawności danych
- TworzenieKonta - tworzenie konta w systemie
- PotwierdzenieRejestracji - potwierdzenie pomyślnej rejestracji
- ZalogowanyWidokGlowny - widok główny z pełną funkcjonalnością

### Ścieżka logowania
- StronaGlowna - punkt startowy
- FormularzLogowania - wypełnianie danych logowania
- WeryfikacjaDanych - sprawdzanie poprawności danych
- ZalogowanyWidokGlowny - widok główny z pełną funkcjonalnością

### Ścieżka resetowania hasła
- FormularzLogowania - punkt startowy
- FormularzResetowaniaHasla - wprowadzanie adresu email
- WyslanieLinku - wysyłanie linku resetującego
- UstawienieNowegoHasla - wprowadzanie nowego hasła
- PotwierdzenieZmianyHasla - potwierdzenie zmiany hasła
- FormularzLogowania - powrót do logowania

### Ścieżka wylogowania
- ZalogowanyWidokGlowny - punkt startowy
- PotwierdzanieWylogowania - potwierdzenie wylogowania
- StronaGlowna - powrót do widoku podstawowego

## 3. Punkty decyzyjne i alternatywne ścieżki

### Punkty decyzyjne podczas rejestracji
- WalidacjaDanych: dane poprawne / dane niepoprawne
- TworzenieKonta: udane / nieudane (np. email już istnieje)

### Punkty decyzyjne podczas logowania
- WeryfikacjaDanych: dane poprawne / dane niepoprawne

### Punkty decyzyjne przy korzystaniu z aplikacji
- CzyZalogowany: zalogowany / niezalogowany
- DostepDoNotatek: zalogowany / niezalogowany
- DostepDoProfilu: zalogowany / niezalogowany

## 4. Opis celów każdego stanu

### Stany rejestracji
- FormularzRejestracji: umożliwienie użytkownikowi wprowadzenia danych do rejestracji
- WalidacjaDanych: zapewnienie poprawności i bezpieczeństwa danych
- TworzenieKonta: utworzenie konta w systemie
- PotwierdzenieRejestracji: informacja o powodzeniu rejestracji

### Stany logowania
- FormularzLogowania: umożliwienie użytkownikowi wprowadzenia danych logowania
- WeryfikacjaDanych: sprawdzenie poprawności danych logowania
- ZalogowanyWidokGlowny: prezentacja funkcjonalności dla zalogowanego użytkownika

### Stany resetowania hasła
- FormularzResetowaniaHasla: umożliwienie wprowadzenia adresu email do resetowania
- WyslanieLinku: procesowanie żądania i wysyłanie linku resetującego
- UstawienieNowegoHasla: wprowadzenie nowego, bezpiecznego hasła
- PotwierdzenieZmianyHasla: informacja o powodzeniu zmiany hasła

### Stany korzystania z aplikacji
- StronaGlowna: punkt wejścia do aplikacji, prezentacja podstawowej funkcjonalności
- ZalogowanyWidokGlowny: pełna funkcjonalność dla zalogowanego użytkownika
- WidokNiezalogowany: ograniczona funkcjonalność dla niezalogowanego użytkownika
</user_journey_analysis>

<mermaid_diagram>
stateDiagram-v2
    [*] --> StronaGlowna

    %% Główne stany aplikacji
    state StronaGlowna {
        [*] --> WidokNiezalogowany
        WidokNiezalogowany --> WybierzLogowanie: Kliknięcie "Logowanie"
        WidokNiezalogowany --> WybierzRejestracje: Kliknięcie "Rejestracja"
        WidokNiezalogowany --> GenerowaniePlanuPodstawowe: Wprowadzenie punktu startowego
    }

    %% Proces autentykacji
    state "Autentykacja" as Autentykacja {
        %% Proces logowania
        state "Logowanie" as Logowanie {
            [*] --> FormularzLogowania
            FormularzLogowania --> WalidacjaLogowania: Wypełnienie formularza
            FormularzLogowania --> FormularzResetowania: Kliknięcie "Zapomniałem hasła"
            
            state WalidacjaLogowania <<choice>>
            WalidacjaLogowania --> PotwierdzenieDanychLogowania: Dane poprawne
            WalidacjaLogowania --> Blad_Logowanie: Dane niepoprawne
            
            Blad_Logowanie --> FormularzLogowania: Popraw dane
            PotwierdzenieDanychLogowania --> ZalogowanyUzytkownik: Zalogowano
        }

        %% Proces rejestracji
        state "Rejestracja" as Rejestracja {
            [*] --> FormularzRejestracji
            FormularzRejestracji --> WalidacjaRejestracji: Wypełnienie formularza
            
            state WalidacjaRejestracji <<choice>>
            WalidacjaRejestracji --> TworzenieKonta: Dane poprawne
            WalidacjaRejestracji --> Blad_Rejestracja: Dane niepoprawne
            
            Blad_Rejestracja --> FormularzRejestracji: Popraw dane
            TworzenieKonta --> PotwierdzenieRejestracji: Konto utworzone
            TworzenieKonta --> BlادIstniејaceKonto: Konto już istnieje
            
            BlادIstniејaceKonto --> FormularzRejestracji: Wybierz inny email
            PotwierdzenieRejestracji --> ZalogowanyUzytkownik: Automatyczne logowanie
        }

        %% Proces resetowania hasła
        state "ResetowanieHasla" as ResetowanieHasla {
            [*] --> FormularzResetowania
            FormularzResetowania --> WyslanieEmailaResetujacego: Podanie adresu email
            
            state WyslanieEmailaResetujacego <<choice>>
            WyslanieEmailaResetujacego --> PotwierdzenieMail: Email wysłany
            WyslanieEmailaResetujacego --> BlادNiepoprawnyEmail: Niepoprawny email
            
            BlادNiepoprawnyEmail --> FormularzResetowania: Popraw email
            PotwierdzenieMail --> [*]: Powrót do logowania
            
            %% Zewnętrzna akcja - kliknięcie linku w emailu
            PotwierdzenieMail --> UstawienieNowegoHasla: Kliknięcie linku w emailu
            UstawienieNowegoHasla --> WalidacjaNowegoHasla: Podanie nowego hasła
            
            state WalidacjaNowegoHasla <<choice>>
            WalidacjaNowegoHasla --> PotwierdzenieZmianyHasla: Hasło poprawne
            WalidacjaNowegoHasla --> BlادNiepoprawneHaslo: Hasło niepoprawne
            
            BlادNiepoprawneHaslo --> UstawienieNowegoHasla: Popraw hasło
            PotwierdzenieZmianyHasla --> FormularzLogowania: Przejście do logowania
        }
    }

    %% Korzystanie z aplikacji jako zalogowany użytkownik
    state "ZalogowanyUzytkownik" as ZalogowanyUzytkownik {
        [*] --> ZalogowanyWidokGlowny
        
        ZalogowanyWidokGlowny --> GenerowaniePlanuZaawansowane: Wprowadzenie danych
        ZalogowanyWidokGlowny --> ZarzadzanieNotatkami: Kliknięcie zarządzania notatkami
        ZalogowanyWidokGlowny --> ProfilTurystyczny: Kliknięcie "Profil"
        ZalogowanyWidokGlowny --> WylogowanieProces: Kliknięcie "Wyloguj"
        
        state "ZarzadzanieNotatkami" as ZarzadzanieNotatkami {
            [*] --> ListaNotatek
            ListaNotatek --> EdycjaNotatki: Kliknięcie notatki
            ListaNotatek --> TworzenieNotatki: Kliknięcie "Dodaj"
            EdycjaNotatki --> ZapiszNotatke: Kliknięcie "Zapisz"
            EdycjaNotatki --> UsunNotatke: Kliknięcie "Usuń"
            TworzenieNotatki --> ZapiszNotatke: Kliknięcie "Zapisz"
            ZapiszNotatke --> ListaNotatek: Notatka zapisana
            UsunNotatke --> ListaNotatek: Notatka usunięta
        }
        
        state "ProfilTurystyczny" as ProfilTurystyczny {
            [*] --> FormularzProfilu
            FormularzProfilu --> WalidacjaProfilu: Kliknięcie "Zapisz"
            state WalidacjaProfilu <<choice>>
            WalidacjaProfilu --> ZapisanieProfilu: Dane poprawne
            WalidacjaProfilu --> BlادProfil: Dane niepoprawne
            BlادProfil --> FormularzProfilu: Popraw dane
            ZapisanieProfilu --> [*]: Profil zapisany
        }
        
        GenerowaniePlanuZaawansowane --> WygenerowatyPlan: Kliknięcie "Generuj"
    }

    %% Proces wylogowania
    state WylogowanieProces {
        [*] --> PotwierdzanieWylogowania
        PotwierdzanieWylogowania --> StronaGlowna: Wylogowany
    }

    %% Powiązania między głównymi stanami
    WybierzLogowanie --> Logowanie
    WybierzRejestracje --> Rejestracja
    ZalogowanyUzytkownik --> StronaGlowna: Wylogowanie
    WylogowanieProces --> StronaGlowna: Powrót jako niezalogowany

    %% Różnice w generowaniu planu
    state GenerowaniePlanuPodstawowe {
        [*] --> WprowadzeniePunktuStartowego
        WprowadzeniePunktuStartowego --> GenerowaniePlanuBezProfilu: Kliknięcie "Generuj"
        GenerowaniePlanuBezProfilu --> WyswietleniePlanuPodstawowego: Plan wygenerowany
    }

    state GenerowaniePlanuZaawansowane {
        [*] --> WprowadzenieDanychZaawansowanych
        WprowadzenieDanychZaawansowanych --> WybórNotatek: Wybór notatek
        WybórNotatek --> GenerowaniePlanuZProfilem: Kliknięcie "Generuj"
        GenerowaniePlanuZProfilem --> WyswietleniePlanuZaawansowanego: Plan wygenerowany
    }

    %% Dodatkowe opisy i notatki
    note right of FormularzLogowania
      Formularz zawiera pola:
      - Email
      - Hasło
      - Przycisk "Zaloguj"
      - Link "Zapomniałem hasła"
    end note

    note right of FormularzRejestracji
      Formularz zawiera pola:
      - Email
      - Hasło
      - Potwierdzenie hasła
      - Przycisk "Zarejestruj"
    end note

    note right of ZalogowanyWidokGlowny
      Widok główny z:
      - Pełną funkcjonalnością
      - Dostępem do notatek
      - Dostępem do profilu
      - Opcją wylogowania
    end note

    note right of WidokNiezalogowany
      Ograniczona funkcjonalność:
      - Generowanie planu na podstawie punktu startowego
      - Brak dostępu do profilu i notatek
    end note
</mermaid_diagram> 
