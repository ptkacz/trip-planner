import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { z } from "zod";

// Schema walidacji
const loginSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { isLoading: initialLoading = false, error: initialError } = props;
  const onSubmit = props.onSubmit;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
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
          {} as { email?: string; password?: string }
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
      setError(undefined);

      try {
        // Sprawdzam, czy onSubmit jest funkcją
        if (typeof onSubmit !== "function") {
          console.error("onSubmit nie jest funkcją:", onSubmit);
          setError("Problem z funkcją logowania. Skontaktuj się z administratorem.");
          return;
        }

        const success = await onSubmit(email, password);
        if (!success) {
          setError("Nieprawidłowy email lub hasło");
        }
      } catch (err) {
        console.error("Błąd podczas logowania:", err);
        setError(err instanceof Error ? err.message : "Wystąpił błąd podczas logowania");
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
            <div className="flex justify-between">
              <Label htmlFor="password">Hasło</Label>
              <a href="/auth/reset-password" className="text-sm text-blue-600 hover:underline">
                Zapomniałeś hasła?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Logowanie...
              </>
            ) : (
              "Zaloguj się"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Nie masz jeszcze konta?{" "}
              <a href="/auth/register" className="text-blue-600 hover:underline">
                Zarejestruj się
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
