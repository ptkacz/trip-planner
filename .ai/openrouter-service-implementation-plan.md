# Przewodnik wdrożenia usługi OpenRouter

## 1. Opis usługi
Usługa OpenRouter integruje się z interfejsem API OpenRouter w celu uzupełniania czatów opartych na LLM. Jej głównym zadaniem jest przyjmowanie komunikatów systemowych, komunikatów użytkownika oraz ustrukturyzowanych odpowiedzi, a następnie przesyłanie ich do API oraz przetwarzanie zwróconych danych. Usługa korzysta z bezpiecznych połączeń HTTPS oraz mechanizmów walidacji danych, zapewniając wysoki poziom bezpieczeństwa i niezawodności.

## 2. Opis konstruktora
Konstruktor klasy `OpenRouterService` przyjmuje konfigurację umożliwiającą:
- Ustawienie komunikatu systemowego
- Ustawienie komunikatu użytkownika
- Definicję formatu odpowiedzi (`response_format`) w formacie JSON Schema
- Określenie nazwy modelu
- Ustawienie parametrów modelu

Konstruktor inicjalizuje wewnętrzny klient HTTP, ustawia zmienne środowiskowe (takie jak `API_KEY` i `API_ENDPOINT`) oraz przygotowuje usługę do obsługi żądań do API OpenRouter.

## 3. Publiczne metody i pola
### Metody:
1. `configure(config: OpenRouterConfig)`: Ustawia konfigurację usługi, łącząc komunikaty oraz parametry modelu w jeden spójny zestaw.
2. `sendChatRequest(message: string): Promise<ChatResponse>`: Wysyła żądanie do API OpenRouter zawierające komunikat systemowy, użytkownika oraz dodatkowe ustawienia, a następnie zwraca odpowiedź w ustrukturyzowanym formacie.
3. `parseResponse(response: any): ChatResponse`: Przetwarza i waliduje odpowiedź API zgodnie z wcześniej zdefiniowanym `response_format`.

### Pola:
- `apiKey`: Klucz dostępu do API, przechowywany w zmiennych środowiskowych.
- `apiEndpoint`: URL punktu końcowego API.
- `modelName`: Nazwa modelu wykorzystywanego w komunikacji z API.
- `modelParameters`: Obiekt zawierający parametry modelu, takie jak `temperature` i `max_tokens`.

## 4. Prywatne metody i pola
### Metody:
1. `_buildRequestBody(message: string): object`: Buduje ciało żądania zawierające komunikat systemowy, komunikat użytkownika oraz inne parametry wymagane przez API.
2. `_validateResponse(response: any): boolean`: Waliduje odpowiedź API, sprawdzając zgodność z definicją `response_format`.
3. `_handleError(error: Error): void`: Obsługuje błędy, logując je oraz inicjując mechanizmy naprawcze (np. retry logic).

### Pola:
- `_httpClient`: Prywatny klient HTTP do komunikacji z API OpenRouter.
- `_config`: Prywatna konfiguracja przechowująca aktualne ustawienia usługi.

## 5. Obsługa błędów
### Potencjalne scenariusze błędów:
1. **Błąd połączenia/timeout**:
   - Wyzwanie: Brak odpowiedzi od API w wyznaczonym czasie.
   - Rozwiązanie: Implementacja retry logic oraz mechanizmu fallback, który zwraca domyślną odpowiedź lub odpowiedni komunikat błędu.

2. **Nieprawidłowy format odpowiedzi**:
   - Wyzwanie: API zwraca dane w nieoczekiwanym formacie, co uniemożliwia ich prawidłową walidację.
   - Rozwiązanie: Walidacja odpowiedzi względem `response_format`, logowanie błędu oraz zwrócenie komunikatu o błędzie z odpowiednimi danymi diagnostycznymi.

3. **Błąd autoryzacji**:
   - Wyzwanie: Nieprawidłowy lub wygasły klucz API powoduje odmowę dostępu.
   - Rozwiązanie: Natychmiastowe przerwanie operacji, logowanie błędu oraz powiadomienie administratora o problemie autoryzacyjnym.

4. **Inne niespodziewane błędy**:
   - Wyzwanie: Nieprzewidziane błędy systemowe lub serwerowe.
   - Rozwiązanie: Globalny mechanizm obsługi wyjątków, który loguje szczegóły błędu i umożliwia późniejszą analizę problemu.

## 6. Kwestie bezpieczeństwa
- Przechowywanie kluczy API oraz poufnych danych wyłącznie w zmiennych środowiskowych.
- Walidacja oraz sanityzacja danych wejściowych i wyjściowych.
- Użycie bezpiecznych połączeń HTTPS do komunikacji z API.
- Implementacja mechanizmów rate limiting oraz ochrony przed atakami typu brute force.
- Regularne monitorowanie logów i wdrażanie systemów alertowania przy wykryciu nieautoryzowanych prób dostępu.

## 7. Plan wdrożenia krok po kroku
1. **Konfiguracja środowiska**:
   - Klucze do API będą przechowywane w pliku `.env`.

2. **Implementacja usługi**:
   - Zaimplementuj klasę `OpenRouterService` w module, np. w pliku `./src/services/openrouterService.ts`.

3. **Konfiguracja komunikatów**:
   - **Komunikat systemowy**: Przykład: "You are a helpful assistant dedicated to providing detailed and accurate responses.".
   - **Komunikat użytkownika**: Przykład: "Please, provide the necessary details for your request.".

4. **Definicja response_format**:
   - Ustal ustrukturyzowaną odpowiedź, używając poniższego przykładu:
     ```json
     {
       "type": "json_schema",
       "json_schema": {
         "name": "ChatResponseSchema",
         "strict": true,
         "schema": {
           "message": "string",
           "timestamp": "string"
         }
       }
     }
     ```

5. **Konfiguracja modelu**:
   - Określ nazwę modelu oraz parametry, np.:
     - Model name: "gpt-4"
     - Model parameters: { "temperature": 0.2, "max_tokens": 256 }
