import { http, HttpResponse } from "msw";

// Przykładowe dane
const trips = [
  { id: "1", title: "Wycieczka do Paryża", description: "Romantyczna wycieczka do stolicy Francji", price: 1200 },
  { id: "2", title: "Wakacje w Grecji", description: "Relaks na pięknych plażach Santorini", price: 1800 },
  { id: "3", title: "Safari w Kenii", description: "Przygoda wśród dzikiej przyrody Afryki", price: 2500 },
];

export const handlers = [
  http.get("/api/trips", () => {
    return HttpResponse.json({ trips });
  }),

  http.get("/api/trips/:id", ({ params }) => {
    const { id } = params;
    const trip = trips.find((t) => t.id === id);

    if (!trip) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(trip);
  }),
];
