import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Niepoprawny format adresu email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną dużą literę")
      .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę"),
    password_confirmation: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Hasła nie są identyczne",
    path: ["password_confirmation"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function useAuth() {
  const login = async (data: LoginFormValues): Promise<boolean> => {
    try {
      // Implementacja logowania
      console.log("Logowanie użytkownika:", data.email);
      return true; // Zwraca true jeśli logowanie się powiedzie
    } catch (error) {
      console.error("Błąd logowania:", error);
      return false;
    }
  };

  const register = async (data: RegisterFormValues) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordFormValues) => {
    try {
      // Implementacja resetowania hasła
      console.log("Resetowanie hasła dla:", data.email);
      return { success: true };
    } catch (error) {
      console.error("Błąd resetowania hasła:", error);
      throw error;
    }
  };

  return { login, register, resetPassword };
}
