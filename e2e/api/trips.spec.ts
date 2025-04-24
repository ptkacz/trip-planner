import { test, expect } from "@playwright/test";

// Pomijamy testy API, ponieważ odpowiednie endpointy nie istnieją jeszcze w projekcie
test.describe("API Trips", () => {
  test.skip("pobiera listę wycieczek", async ({ request }) => {
    const response = await request.get("/api/trips");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("trips");
    expect(Array.isArray(data.trips)).toBeTruthy();
  });

  test.skip("pobiera szczegóły wycieczki", async ({ request }) => {
    // Najpierw pobieramy listę wycieczek, aby znaleźć istniejący identyfikator
    const listResponse = await request.get("/api/trips");
    const trips = await listResponse.json();

    // Zakładamy, że otrzymaliśmy tablicę wycieczek
    expect(trips.trips.length).toBeGreaterThan(0);

    // Używamy pierwszej wycieczki z listy
    const tripId = trips.trips[0].id;

    // Teraz pobieramy szczegóły tej wycieczki
    const detailResponse = await request.get(`/api/trips/${tripId}`);

    expect(detailResponse.status()).toBe(200);

    const trip = await detailResponse.json();
    expect(trip).toHaveProperty("id", tripId);
  });
});
