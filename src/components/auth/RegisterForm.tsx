import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

// Schema walidacji
const registerSchema = z
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

interface RegisterFormProps {
  error?: string;
  redirectUrl?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  error: initialError,
  redirectUrl = "/auth/login?registered=true",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    password_confirmation?: string;
  }>({});
  const [error, setError] = useState(initialError || "");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    try {
      registerSchema.parse({
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce(
          (acc, curr) => {
            const path = curr.path[0] as string;
            acc[path as keyof typeof acc] = curr.message;
            return acc;
          },
          {} as {
            email?: string;
            password?: string;
            password_confirmation?: string;
          }
        );
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Przekierowanie po udanej rejestracji
          window.location.href = redirectUrl;
        } else {
          // Wyświetl błąd
          setError(data.error || "Wystąpił nieznany błąd podczas rejestracji");
        }
      } catch (err) {
        console.error("Błąd podczas rejestracji:", err);
        setError(err instanceof Error ? err.message : "Wystąpił błąd podczas rejestracji");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adres email</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
            />
            {formErrors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
            />
            {formErrors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Potwierdzenie hasła</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!formErrors.password_confirmation}
              aria-describedby={formErrors.password_confirmation ? "password-confirmation-error" : undefined}
            />
            {formErrors.password_confirmation && (
              <p id="password-confirmation-error" className="text-sm text-red-500">
                {formErrors.password_confirmation}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Rejestracja...
              </>
            ) : (
              "Zarejestruj się"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Masz już konto?{" "}
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Zaloguj się
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
