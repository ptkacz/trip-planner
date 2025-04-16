# Plan implementacji widoku Generowanie planu podróży

## 1. Przegląd
Widok Generowanie planu podróży służy do wprowadzania danych przez użytkownika (państwo, miasto, maksymalna odległość oraz opcjonalnie notatki) oraz generowania spersonalizowanego planu podróży przy użyciu funkcjonalności AI. Celem widoku jest umożliwienie użytkownikowi szybkiego i intuicyjnego stworzenia planu wycieczki z uwzględnieniem jego preferencji.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką: `/generate`.

## 3. Struktura komponentów
- **GenerateTripView** (główny kontener widoku)
  - **TopBar** (nawigacja do profilu i dodawania nowej notatki)
  - **NoteList** (lista notatek użytkownika w skróconej formie)
  - **TripGeneratorForm** (formularz z polami: start_country, start_city, max_distance)
  - **GenerateButton** (przycisk uruchamiający proces generacji)
  - **PlanDisplay** (obszar prezentacji wygenerowanego planu podróży, zawierający tekst planu oraz przykładowe zdjęcie)
  - **ErrorBanner** (opcjonalny komponent do wyświetlania komunikatów o błędach)

## 4. Szczegóły komponentów
### GenerateTripView
- Opis: Główny komponent kontenerowy łączący wszystkie podkomponenty niezbędne do interakcji i wyświetlania wyniku.
- Główne elementy: TopBar, NoteList, TripGeneratorForm, GenerateButton, PlanDisplay, ErrorBanner.
- Obsługiwane interakcje: przechwytywanie danych z formularza, inicjowanie wywołań API, odbiór wyników.
- Typy: wykorzystuje typ `GenerateTripCommand` i `TripPlanDTO` z `types.ts`.

### TripGeneratorForm
- Opis: Formularz umożliwiający użytkownikowi wprowadzenie danych wejściowych niezbędnych do generowania planu.
- Główne elementy: pola tekstowe dla `start_country`, `start_city`, pole numeryczne dla `max_distance`.
- Obsługiwane interakcje: zdarzenia onChange dla pól, walidacja na poziomie klienta (np. pola nie mogą być puste, max_distance > 0).
- Walidacja:
  - `start_country` i `start_city` muszą być niepuste.
  - `max_distance` musi być liczbą dodatnią.
- Typy: lokalny ViewModel np. `TripFormViewModel` z polami odpowiadającymi `GenerateTripCommand`.
- Propsy: funkcja przekazująca zmienione dane do nadrzędnego komponentu.

### NoteList
- Opis: Wyświetla listę notatek w skróconej formie.
- Główne elementy: lista notatek. Notatki to klikalne elementy. Akcja na kliknięcie - wyświetlenie widoku notatki z możliwością edycji, usunięcia, powrotu do widoku glównego.
- Obsługiwane interakcje: klikanie notatek.
- Typy: typ `NoteDTO` dla pojedynczej notatki.
- Propsy: lista notatek pobrana z API, callback do aktualizacji wybranych notatek.

### GenerateButton
- Opis: Przycisk inicjujący żądanie generacji planu podróży.
- Główne elementy: przycisk z tekstem "Generuj plan podróży".
- Obsługiwane interakcje: kliknięcie powoduje wywołanie funkcji API.
- Walidacja: sprawdzenie poprawności danych z formularza przed wywołaniem.
- Propsy: funkcja onClick przekazana z nadrzędnego komponentu.

### PlanDisplay
- Opis: Komponent wyświetlający wygenerowany plan podróży.
- Główne elementy: pole tekstowe/sekcja na plan wygenerowany przez AI, przykładowe zdjęcie.
- Interakcje: aktualizacja treści po otrzymaniu danych z API.
- Typy: wykorzystuje typ `TripPlanDTO`.
- Propsy: obiekt planu przekazany przez rodzica.

### ErrorBanner
- Opis: Komponent do prezentacji komunikatów o błędach.
- Główne elementy: komunikat tekstowy z informacją o błędzie.
- Interakcje: pojawia się w przypadku błędnego wywołania API lub walidacji.
- Propsy: komunikat błędu przekazany przez rodzica.

## 5. Typy
- `GenerateTripCommand`: 
  - `start_country: string`
  - `start_city: string`
  - `max_distance: number`
  - `selected_note_ids?: string[]`
- `TripPlanDTO`:
  - `plan: string`
  - `notes_used: string[]`
  - `generated_at: string`
- Dodatkowy typ lokalny, np. `TripFormViewModel`:
  - `start_country: string`
  - `start_city: string`
  - `max_distance: number`
  - `selected_note_ids: string[]`

## 6. Zarządzanie stanem
- Użycie React `useState` do zarządzania stanem formularza (TripFormViewModel).
- Stan dla:
  - danych wejściowych formularza,
  - listy notatek i zaznaczonych notatek,
  - wyniku generacji (TripPlanDTO),
  - stanu ładowania oraz błędów.
- Opcjonalnie utworzenie custom hooka `useTripGenerator` do wywołań API i zarządzania stanem odpowiedzi.

## 7. Integracja API
- Wywołanie endpointu POST `/trip/generate`:
  - Żądanie: przesłanie danych zgodnych z `GenerateTripCommand`.
  - Odpowiedź: oczekiwany obiekt `TripPlanDTO`.
- Użycie fetch lub biblioteki HTTP (np. axios) do przeprowadzenia wywołania.
- Obsługa stanu ładowania, błędów i sukcesu (aktualizacja stanu w komponencie nadrzędnym).

## 8. Interakcje użytkownika
- Użytkownik wprowadza dane (państwo, miasto, maksymalna odległość).
- Wybiera notatki z listy (opcjonalnie).
- Kliknięcie przycisku "Generuj plan podróży" uruchamia walidację.
- W przypadku poprawnych danych, zostaje wysłane żądanie generacji.
- Po otrzymaniu odpowiedzi, wyświetlenie wygenerowanego planu.
- W przypadku błędu, wyświetlenie komunikatu za pomocą ErrorBanner.

## 9. Warunki i walidacja
- Sprawdzenie, czy pola `start_country` i `start_city` nie są puste.
- Walidacja, że `max_distance` jest liczbą dodatnią.
- Jeśli którykolwiek warunek nie jest spełniony, formularz nie wysyła żądania i wyświetla odpowiedni komunikat inline.
- Kontrola wybranych notatek, aby ich identyfikatory były poprawnymi UUID (dodatkowo weryfikowane przez backend).

## 10. Obsługa błędów
- Wyłapywanie błędów z wywołania API.
- Prezentacja komunikatów błędnych w komponencie ErrorBanner.
- Obsługa błędów walidacyjnych (np. błędne dane wejściowe) poprzez wyświetlanie komunikatów przy polach formularza.
- Logowanie błędów do konsoli w trybie deweloperskim.

## 11. Kroki implementacji
1. Utworzenie nowej strony w katalogu `src/pages` o ścieżce `/generate`.
2. Implementacja głównego komponentu `GenerateTripView` jako komponentu React, opakowanego w Astro layout.
3. Zaimplementowanie/wykorzystanie istniejącego komponentu `TopBar` do nawigacji.
4. Utworzenie komponentu `TripGeneratorForm` z polami tekstowymi oraz mechanizmem wyboru notatek (np. checkboxy).
5. Utworzenie komponentu `NoteList` do wyświetlania dostępnych notatek.
6. Implementacja `GenerateButton` inicjującego wywołanie funkcji API.
7. Integracja z API – wywołanie POST `/trip/generate` przy użyciu danych z formularza i obsługa odpowiedzi.
8. Implementacja komponentu `PlanDisplay` w celu prezentacji wygenerowanego planu.
9. Dodanie obsługi błędów i komunikatów za pomocą komponentu `ErrorBanner`.
10. Testowanie działania widoku, w tym walidacji pól i poprawności obsługi wywołań API.
11. Stylowanie komponentów przy użyciu Tailwind CSS i/lub komponentów z Shadcn/ui. 
