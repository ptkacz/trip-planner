# Schemat bazy danych - TripPlanner (MVP)

## 1. Tabele i kolumny

### 1.1. Tabela `users`
- `id` SERIAL PRIMARY KEY
- `email` VARCHAR(255) NOT NULL UNIQUE
- `hashed_password` VARCHAR(255) NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.2. Tabela `profiles`
- `user_id` INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
- `travel_type` VARCHAR(100) NULL -- np. 'city', 'countryside', itp.
- `travel_style` VARCHAR(100) NULL -- np. 'adventure', 'relax', itp.
- `meal_preference` VARCHAR(100) NULL -- np. 'vegan', 'regular', itp.

### 1.3. Tabela `plans`
- `id` SERIAL PRIMARY KEY
- `user_id` INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE
- `start_country` VARCHAR(100) NULL
- `start_city` VARCHAR(100) NULL
- `max_distance` INTEGER NULL  -- odległość w kilometrach
- `plan` VARCHAR(10000) NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.4. Tabela `notes`
- `id` SERIAL PRIMARY KEY
- `user_id` INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `note_text` VARCHAR(1000) NOT NULL
- `note_summary` VARCHAR(100) NOT NULL
- `plan_id` INTEGER REFERENCES plans(id) ON DELETE SET NULL  -- opcjonalne, gdy notatka jest powiązana z planem
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

## 2. Relacje między tabelami

- **Users i Profiles (1:1):**
  Każdy użytkownik ma jeden profil. `profiles.user_id` jest kluczem głównym oraz kluczem obcym odnoszącym się do `users.id`.

- **Users i Plans (1:1):**
  Każdy użytkownik ma jeden przechowywany (ostatni) plan. Unikalność `plans.user_id` zapewnia, że użytkownik może mieć tylko jeden zapisany plan.

- **Plans i Notes (1:N):**
  Jeden plan podróży może być powiązany z wieloma notatkami, gdzie `notes.plan_id` odnosi się do `plans.id`.

- **Users i Notes (1:N):**
  Użytkownik może posiadać wiele notatek.

## 3. Indeksy

- Unikalny indeks na `users.email`.
- Indeks na `notes.user_id` dla optymalizacji zapytań filtrujących notatki według użytkownika.
- Indeks na `notes.plan_id` dla optymalizacji zapytań dotyczących powiązanych notatek.
- Unikalny indeks na `plans.user_id` zapewniony przez ograniczenie UNIQUE.

## 4. Zasady PostgreSQL (RLS)

- RLS (Row Level Security) jest włączony na wszystkich tabelach: `users`, `profiles`, `plans` oraz `notes`.
- Przykładowa polityka RLS:
  - Dla tabel `profiles`, `plans` oraz `notes`: dostęp do danych jest przyznawany tylko wtedy, gdy `user_id` w danym wierszu odpowiada bieżącemu identyfikatorowi użytkownika, ustawianemu np. za pomocą `current_setting('app.current_user_id')`.

## 5. Dodatkowe uwagi

- Schemat został zaprojektowany z myślą o MVP i wykorzystaniu technologii: Astro, React, Supabase oraz PostgreSQL.
- W przyszłości możliwe jest rozszerzenie modelu o historię planów podróży, co może skutkować zmianą relacji między `users` a `plans`.
- Wszystkie relacje i ograniczenia zostały określone zgodnie z najlepszymi praktykami projektowania baz danych, z uwzględnieniem normalizacji do poziomu 3NF tam, gdzie jest to możliwe. 
