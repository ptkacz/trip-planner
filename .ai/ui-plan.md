# Architektura UI dla TripPlanner (MVP)

## 1. Przegląd struktury UI
Aplikacja składa się z czterech głównych widoków: widok logowania, widok główny oraz dwa modale – dla profilu użytkownika i dla notatki. Interfejs zaprojektowany jest w minimalistycznym stylu z naciskiem na prostotę, przejrzystość oraz intuicyjną nawigację. Globalny stan aplikacji jest zarządzany przy użyciu React Context i hooków, co pozwala na synchronizację danych, w tym listy notatek i wygenerowanego planu podróży.

## 2. Lista widoków

### Widok Uwierzytelniania
- Nazwa widoku: Uwierzytelnianie
- Ścieżka widoku: `/login` i `/register`
- Główny cel: Autentykacja użytkownika poprzez wprowadzenie danych logowania/rejestrowania (email, hasło).
- Kluczowe informacje do wyświetlenia: Formularz logowania, komunikaty błędów inline (np. błędne dane logowania), przycisk do przesłania danych.
- Kluczowe komponenty widoku: Formularz logowania, komponent komunikatów błędów.
- UX, dostępność, bezpieczeństwo: Przyjazny interfejs z wyraźnymi etykietami, walidacja pól formularza oraz zabezpieczenie przed nieautoryzowanym dostępem.

### Widok generowania planu podróży (główny)
- Nazwa widoku: Widok generowania planu podroży
- Ścieżka widoku: `/generate`
- Główny cel: Prezentacja głównych funkcji aplikacji, w tym wyświetlenie planu podróży i notatek.
- Kluczowe informacje do wyświetlenia: Lista notatek (w skróconej formie), centralna sekcja z wygenerowanym planem podróży, przyciski nawigacyjne.
- Kluczowe komponenty widoku: Topbar z przyciskami nawigacyjnymi, lista notatek, sekcja wyświetlania planu podróży, komponent generowania planu składający się z przycisku oraz miejsc do uzupełnienia startowej lokalizacji (państwa, miasta, odległości).
- UX, dostępność, bezpieczeństwo: Intuicyjna nawigacja, czytelny układ elementów, inline komunikaty błędów przy operacjach (generowanie planu, zapisywanie notatek).

### Widok Profilu (Modal)
- Nazwa widoku: Modal Profilu
- Ścieżka widoku: wyświetlany jako modal z poziomu topbaru w widoku generowania planu podróży (głównym).
- Główny cel: Umożliwienie użytkownikowi uzupełnienia lub edycji danych profilu (preferencje turystyczne).
- Kluczowe informacje do wyświetlenia: Formularz danych profilu (travel_type, travel_style, meal_preference).
- Kluczowe komponenty widoku: Komponent formularza, modal, przyciski zapisu i zamknięcia.
- UX, dostępność, bezpieczeństwo: Szybki dostęp z poziomu topbaru, łatwa nawigacja po formularzu, walidacja danych i mechanika ochronna przed przypadkowym zamknięciem.

### Widok Notatki (Modal)
- Nazwa widoku: Modal Notatki
- Ścieżka widoku: dostępny jako modal z poziomu topbaru w widoku generowania planu podróży (głównym).
- Główny cel: Umożliwienie pełnej obsługi CRUD notatki (tworzenie, edycja, usuwanie).
- Kluczowe informacje do wyświetlenia: Pole tekstowe dla notatki, przyciski: Zapisz, Usuń, Zamknij (bez zapisu), komunikaty błędów (np. przekroczenie dozwolonej długości tekstu).
- Kluczowe komponenty widoku: Formularz notatki, modal, przyciski operacyjne, modal potwierdzenia usunięcia.
- UX, dostępność, bezpieczeństwo: Intuicyjny panel operacji, natychmiastowy feedback inline, walidacja długości notatki, mechanizm potwierdzenia usunięcia zapobiegający przypadkowym operacjom.

## 3. Mapa podróży użytkownika

1. Użytkownik rozpoczyna przy widoku logowania, gdzie wprowadza dane autoryzacyjne.
2. Po pomyślnym logowaniu następuje przekierowanie do widoku generowania planu podróży (głównego).
3. W widoku generowania planu podróży (głównym) użytkownik widzi topbar, który umożliwia:
   - Otwarcie modalu profilu w celu edycji danych.
   - Otwarcie modalu notatki do dodania nowej notatki.
4. Po wyborze konkretnej notatki, użytkownik może modyfikować jej zawartość lub usuwać ją (z dodatkowym modalem potwierdzenia).
5. Na bocznych sekcjach widoku "przypinane" są dodane notatki ze skróconym opisem.
5. Centralna część widoku zawiera komponenty do generowania planu podróży:
   - Elementy do uzupełnienia punktu startowego (państwo, miasto) oraz maksymalnego zasięgu podróży wyrażonego w km.
   - Przycisk do wygenerowania planu podróży na podstawie notatek i profilu turystycznego.
   - Pole tekstowe wyświetlające wygenerowany plan podróży.
   - Pole do wyświetlenia przykładowego obrazu na temat wygenerowanego planu podróży.
6. Każdy krok posiada inline komunikaty błędów, zapewniając użytkownikowi natychmiastowy feedback.

## 4. Układ i struktura nawigacji

- Główna nawigacja oparta jest na topbarze widocznym w widoku głównym oraz pozostałych elementach na widoku głównym.
- Topbar zawiera przyciski prowadzące do:
  - Otwarcia modalu profilu.
  - Otwarcia modalu do dodania nowej notatki.
- Widok główny zawiera ponadto pozostałe przyciski:
  - Dodane notatki w formie klikalnej, które przenoszą do widoku edycji/usuwania notatki.
  - Przycisk do generowania planu podróży.
- Widoki logowania/rejestracji i generowania planu podróży (główny) są oddzielnymi stronami, natomiast widoki profilu i notatki są implementowane jako modale, które pojawiają się na tle widoku głównego.
- Nawigacja jest intuicyjna i dostępna poprzez wyraźne etykiety oraz responsywne przyciski, umożliwiające szybki dostęp do funkcji aplikacji.

## 5. Kluczowe komponenty

- Topbar: Centralny pasek nawigacyjny umożliwiający dostęp do dodatkowych funkcji (profil, dodanie nowej notatki).
- Modal Component: Standaryzowany komponent modal, używany zarówno dla edycji profilu, jak i edycji/usuwania notatki.
- Formularze: Komponenty formularzy do logowania, edycji profilu oraz zarządzania notatkami z natychmiastową walidacją danych.
- Plan Podróży View: Komponent pozwalający na:
   1. Uzupełnienie punktu startowego (państwo, miasto), oraz maksymalnej odległości od tego punktu (podanej w km).
   2. Zlecenie akcji wygenerowania planu podróży po kliknięciu w przycisk.
   2. Wyświetlanie wygenerowanego planu podróży, z uwzględnieniem notatek, profilu turystycznego oraz podanego punktu startowego z maksymalną odległością.
- Komponent Inline Error: Wyświetlanie komunikatów błędów w czasie rzeczywistym, zapewniający szybką informację zwrotną dla użytkownika. 
