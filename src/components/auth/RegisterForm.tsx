import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useZodForm } from "@/lib/hooks/useForm";
import { registerSchema, useAuth } from "@/lib/hooks/useAuth";
import type { RegisterFormValues } from "@/lib/hooks/useAuth";

interface RegisterFormProps {
  error?: string;
  redirectUrl?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  error: initialError,
  redirectUrl = "/auth/login?registered=true",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError || "");
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(registerSchema);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await registerUser(data);

      if (result.success) {
        window.location.href = redirectUrl;
      } else {
        setError(result.error || "Wystąpił nieznany błąd podczas rejestracji");
      }
    } catch (err) {
      console.error("Błąd podczas rejestracji:", err);
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas rejestracji");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="password">Hasło</Label>
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

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Potwierdzenie hasła</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              aria-invalid={!!errors.password_confirmation}
              aria-describedby={errors.password_confirmation ? "password-confirmation-error" : undefined}
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <p id="password-confirmation-error" className="text-sm text-red-500">
                {errors.password_confirmation.message}
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
