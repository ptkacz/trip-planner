import type { Database } from "./db/database.types";

/**
 * DTO and Command Models for TripPlanner API
 *
 * This file defines data transfer object (DTO) types and command models for
 * API operations, ensuring close alignment with the underlying database models
 * defined in Database["public"]["Tables"].
 *
 * NOTE: The user_id is typically derived from the authentication context and
 * is not expected in the client payload for creation/update operations.
 */

// -------------------------
// User DTO
// -------------------------

/**
 * UserDTO represents the public fields of a user returned by the API.
 */
export type UserDTO = Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "created_at" | "updated_at">;

// -------------------------
// Profile DTO and Command Models
// -------------------------

/**
 * ProfileDTO represents the user's profile data returned by the API.
 */
export type ProfileDTO = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "user_id" | "travel_type" | "travel_style" | "meal_preference"
>;

/**
 * CreateProfileCommand represents the payload required to create a new profile.
 * The user_id is typically added from the auth context on the server side.
 */
export type CreateProfileCommand = Pick<
  Database["public"]["Tables"]["profiles"]["Insert"],
  "travel_type" | "travel_style" | "meal_preference"
>;

/**
 * UpdateProfileCommand represents the payload for updating an existing profile.
 */
export type UpdateProfileCommand = Partial<CreateProfileCommand>;

// -------------------------
// Note DTO and Command Models
// -------------------------

/**
 * NoteDTO represents the note data returned by the API.
 * It includes a subset of fields from the database entity.
 */
export type NoteDTO = Pick<
  Database["public"]["Tables"]["notes"]["Row"],
  "id" | "note_text" | "note_summary" | "created_at"
>;

/**
 * CreateNoteCommand represents the payload to create a new note.
 * Fields such as id, created_at, and updated_at are managed by the system.
 */
export type CreateNoteCommand = Omit<
  Database["public"]["Tables"]["notes"]["Insert"],
  "id" | "created_at" | "updated_at" | "user_id"
> & {
  user_id?: string;
};

/**
 * UpdateNoteCommand represents the payload to update an existing note.
 * All fields are optional to allow partial updates.
 */
export type UpdateNoteCommand = Partial<Omit<Database["public"]["Tables"]["notes"]["Update"], "id" | "user_id">>;

// -------------------------
// Plan DTO and Command Models
// -------------------------

/**
 * PlanDTO represents the trip plan data returned by the API.
 */
export type PlanDTO = Database["public"]["Tables"]["plans"]["Row"];

/**
 * CreatePlanCommand represents the payload to create a new trip plan.
 * Fields such as id and created_at are managed by the system.
 */
export type CreatePlanCommand = Omit<Database["public"]["Tables"]["plans"]["Insert"], "id" | "created_at">;

/**
 * UpdatePlanCommand represents the payload to update an existing trip plan.
 */
export type UpdatePlanCommand = Partial<Omit<Database["public"]["Tables"]["plans"]["Update"], "id">>;

// -------------------------
// Trip Generation Command and DTO
// -------------------------

/**
 * GenerateTripCommand represents the input payload required to generate a trip plan.
 */
export interface GenerateTripCommand {
  start_country: string;
  start_city: string;
  max_distance: number;
  selected_note_ids?: string[]; // Optional: specific notes to consider
}

/**
 * TripPlanDTO represents the output of the trip generation process.
 */
export interface TripPlanDTO {
  plan: string;
  notes_used: string[];
  generated_at: string;
  start_country?: string;
  start_city?: string;
  max_distance?: number;
}

// -------------------------
// Auth DTO and Command Models
// -------------------------

/**
 * UserDTO reprezentuje dane użytkownika przekazywane między backendem a frontendem
 */
export interface UserDTO {
  id: string;
  email: string;
  created_at: string;
}

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
