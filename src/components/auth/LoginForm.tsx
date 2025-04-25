import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { useZodForm } from "@/lib/hooks/useForm";
import { loginSchema } from "@/lib/hooks/useAuth";
import type { LoginFormValues } from "@/lib/hooks/useAuth";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { isLoading: initialLoading = false, error: initialError } = props;
  const onSubmit = props.onSubmit;

  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema);

  const onSubmitForm = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(undefined);

    try {
      if (typeof onSubmit !== "function") {
        console.error("onSubmit nie jest funkcją:", onSubmit);
        setError("Problem z funkcją logowania. Skontaktuj się z administratorem.");
        return;
      }

      const success = await onSubmit(data.email, data.password);
      if (!success) {
        setError("Nieprawidłowy email lub hasło");
      }
    } catch (err) {
      console.error("Błąd podczas logowania:", err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas logowania");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adres email</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.com"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {errors.email.message}
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
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {errors.password.message}
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
