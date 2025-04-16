# Dokument wymagań produktu (PRD) - TripPlanner (MVP)

## 1. Przegląd produktu
TripPlanner (MVP) to aplikacja wykorzystująca potencjał AI do uproszczenia procesu planowania wycieczek. Umożliwia użytkownikom zapisywanie szybkich notatek o miejscach i celach podróży, które następnie przekształca w szczegółowe, dopasowane plany podróży, zawierające autentyczne miejsca do zwiedzenia, przedstawione w odpowiedniej kolejności, wraz z opisami oraz odległościami od miejsca początkowego. Aplikacja oferuje również prosty system zarządzania kontem oraz profil użytkownika, gdzie można zapisywać preferencje turystyczne, które również uwzględniane są w generowanym planie podróży.

## 2. Problem użytkownika
Planowanie wycieczek jest często czasochłonne i skomplikowane. Użytkownicy mają trudności z przekształceniem szybkich notatek o potencjalnych miejscach i celach podróży w kompleksowy plan, który zawiera autentyczne miejsca do zwiedzenia, opisy, odległości, uwzględniając indywidualne preferencje turystyczne.

## 3. Wymagania funkcjonalne
1. System notatek:
   - Możliwość tworzenia nowych notatek dotyczących planowanych wycieczek.
   - Odczytywanie, przeglądanie, edytowanie oraz usuwanie notatek.
   - Notatki zawierają pobieżne informacje o miejscach, celach podróży oraz dodatkowych wymaganiach.
2. System kont użytkowników:
   - Rejestracja i logowanie z zastosowaniem bezpiecznego uwierzytelniania.
   - Edycja hasła oraz możliwość usunięcia konta.
3. Profil użytkownika:
   - Zapisywanie preferencji dotyczących rodzaju miejsc, preferowanego sposobu odpoczynku, posiłków, atrakcji sportowych, innych parametrów.
4. Generowanie planu wycieczki:
   - Generowanie szczegółowego planu na żądanie, na podstawie wybranych notatek i zapisanych preferencji.
   - Plan wycieczki powinien uwzględniać lokalizację punktu startowego oraz maksymalną odległośc od niego na jaką planujemy się oddalić podczas podróży.
   - Plan wycieczki musi zawierać sekwencję punktów do zwiedzenia wraz z krótki opisem i zdjęciem, w kolejności uwzględniającej ich lokalizację i odległości.
5. Aktualizacja preferencji:
   - Umożliwienie edycji ustawień profilu i modyfikacji preferencji w dowolnym momencie.

## 4. Granice produktu
1. Produkt nie obejmuje:
   - Funkcji współdzielenia planów wycieczkowych między kontami.
   - Rozbudowanej obsługi multimedialnej, np. analizy zdjęć.
   - Zaawansowanego planowania logistyki oraz integracji z systemami real-time do wyliczania tras, kosztów i czasów przejazdów.
2. MVP obejmuje jedynie podstawowe operacje CRUD i prostą personalizację.

## 5. Historyjki użytkowników

ID: US-001
Tytuł: Rejestracja konta
Opis: Jako nowy użytkownik chcę się zarejestrować, aby uzyskać bezpieczny dostęp do własnych preferencji turystycznych i notatek.
Kryteria akceptacji:
- Formularz rejestracyjny zawiera pola na adres email i hasło.
- Po poprawnym wypełnieniu formularza i weryfikacji danych konto jest aktywowane.
- Użytkownik otrzymuje potwierdzenie pomyślnej rejestracji i zostaje zalogowany.

ID: US-002
Tytuł: Logowanie do aplikacji
Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby uzyskać bezpieczny dostęp do własnych preferencji turystycznych i notatek.
Kryteria akceptacji:
- Po podaniu prawidłowych danych logowania użytkownik zostaje przekierowany do widoku głównego.
- Błędne dane logowania wyświetlają komunikat o nieprawidłowych danych.
- Dane dotyczące logowania przechowywane są w bezpieczny sposób.

ID: US-003
Tytuł: Poruszanie się po widoku głównym.
Opis: Użytkownik po zalogowaniu zostaje przekierowany do widoku głównego, w którym może podejmować akcje służące wygenerowaniu planu podróży lub zarządzania kontem.
Kryteria akceptacji:
- Użytkownik może przejść do okna profilu turystycznego z topbar w górnej części widoku. Z tego miejsca użytkownik może uzupełniać i edytować swoje preferencje turystyczne.
- Użytkownik może dodać nową notatkę z topbar w górnej części widoku. Akceptowalna długość opisu to 1000 znaków.
- Notatki umieszczane są po bokach centralnej części widoku, o losowym kolorze i w losowym miejscu, ale tak żeby nie zasłaniały innych elementow na widoku głównym. Na notatce widnieje jej opis w formie skrócej do 100 znaków.
- W centralnej części widoku znajdują sie 3 pola tekstowe, w których użytkownik może wpisać lokalizację punktu startowego podróży (państwo oraz miasto), oraz maksymalną odległość na jaką planujemy się oddalić podaną w kilometrach.
- Pod polami tekstowymi znajduje sie przycisk "Generuj plan podróży".
- Pod przyciskiem "Generuj plan podróży" znajdują sie komponent do wyświetlania planu podróży: tekstu i przykładowego zdjęcia.

ID: US-004
Tytuł: Uzupełnienie profilu turystycznego
Opis: Jako zalogowany użytkownik chcę wypełnić swój profil danymi dotyczącymi preferencji turystycznych, aby plan wycieczki był spersonalizowany.
Kryteria akceptacji:
- Użytkownik może dodać informacje dotyczące rodzaju miejsc które lubi zwiedzać (np. miasta czy obaszary pozamiejskie, budowle czy natura, miejsca z duża ilościa turystów czy spokojne). Użytkownik może podać przykładowe autentyczne miejsca na których AI może się wzorować podczas układania planu podróży.
- Użytkownik może dodać informacje dotyczące preferowanego rodzaju spędzania czasu (zwiedzanie z duża ilością chodzenia, odpoczynek korzystając z pobliskich atrakcji, forma hybrydowa).
- Użytkownik może dodać informacje dotyczące posiłków (czy mają zostać uwzględnione w planie podróży, jakie są preferencje kulinarne).
- Dane są poprawnie zapisywane i wykorzystywane przy generowaniu planu.

ID: US-005
Tytuł: Edycja preferencji turystycznych w profilu
Opis: Jako zalogowany użytkownik chcę móc modyfikować moje preferencje turystyczne w dowolnym momencie, aby móc dostosować plan wycieczki do aktualnych potrzeb.
Kryteria akceptacji:
- Zalogowany użytkownik może aktualizować dane w swoim profilu turystycznym i zapisać je.
- Zmiany są natychmiast uwzględniane przy generowaniu nowych planów.

ID: US-006
Tytuł: Zarządzanie notatkami
Opis: Jako zalogowany użytkownik chcę mieć możliwość tworzenia, odczytywania, przeglądania, edytowania i usuwania notatek związanych z planowanymi wycieczkami, aby szybko zapisywać swoje pomysły.
Kryteria akceptacji:
- Użytkownik może dodać nową notatkę zawierającą wymagane informacje. Robi to wywołując w widoku głównym z pozycji topbar okno modalne do uzupełnienia treści notatki.
- Użytkownik ma dostęp do swoich notatek w widoku głównym. Cała treść notatki wyświetla się w osobnym oknie, po kliknięciu w wybraną notatkę. Wyjście z notatki następuje po wyborze przycisku "X" w prawym górnym rogu okna.
- Użytkownik może edytować wybraną notatkę w widoku głównym. Po kliknięciu w wybraną notatkę i wyświetleniu jej w osobnym oknie, możliwe jest edytowanie aktualnej treści i zapisanie nowej po wyborze przycisku "Zapisz".
- Użytkownik może usunąć wybraną notatkę w widoku głównym. Po kliknięciu w wybraną notatkę możliwe jest usunięcie jej po wyborze przycisku do usuwania. Podczas usuwania użytkownik proszony jest o dodatkowe potwierdzenie tej czynności.

ID: US-007
Tytuł: Generowanie planu wycieczki
Opis: Jako zalogowany użytkownik chcę generować szczegółowy plan wycieczki na podstawie wybranych notatek i profilu użytkownika.
Kryteria akceptacji:
- Plan wycieczki generowany jest na podstawie profilu turystycznego, notatek oraz informacji na temat podróży: punktu startowego i maksymalnej odleglości od niego.
- Generowanie następuje po wyborze przycisku "Generuj plan podróży" znajdujący się w widoku głównym.
- Informacje odnośnie miejsca startu podróży i maksymalnej odległości na jaką planujemy się oddalić, są niezbędne do wygenerowania planu podróży. W innym wypadku wyświetlony zostaje stosowny komunikat.
- Generowany plan zawiera listę miejsc, atrakcji, restauracji, w odpowiedniej kolejności, uwzględniając ich lokalizację oraz odległości. Zaproponowane miejsca posiadają krótki opis, przykładowe zdjęcie, oraz odległość od miejsca startu podróży.

ID: US-008
Tytuł: Zarządzanie kontem
Opis: Jako zalogowany użytkownik chcę móc edytować swoje hasło oraz usuwać konto, aby zarządzać swoimi danymi w aplikacji.
Kryteria akceptacji:
- Zalogowany użytkownik może zmienić hasło po weryfikacji tożsamości.
- Zalogowany użytkownik może usunąć konto po potwierdzeniu operacji.

ID: US-009
Tytuł: Bezpieczny dostęp i autoryzacja
Opis: Jako zalogowany użytkownik chcę mieć pewność, że moje notatki ani preferencje turystyczne nie są dostępne dla innych użytkownikow, aby zachować prywatność i bezpieczeństwo danych.
Kryteria akceptacji:
- Tylko zalogowany użytkownik może zmienić hasło po weryfikacji tożsamości, usuwać konto, mieć wgląd do preferencji turystycznych i notatek.
- Brak dostępu do notatek i preferencji turystycznych dla innych użytkowników.

## 6. Metryki sukcesu
1. Co najmniej 90% użytkowników uzupełnia profile danymi o preferencjach turystycznych.
2. Minimum 75% użytkowników generuje 3 lub więcej planów wycieczek rocznie.
3. Generowany plan wycieczki spełnia kryteria dotyczące rodzaju miejsc, atrakcji, odległości. Uwzględnia preferencje turystyczne i wybrane notatki.
