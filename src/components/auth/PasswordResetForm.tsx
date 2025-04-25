import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useZodForm } from "@/lib/hooks/useForm";
import { resetPasswordSchema } from "@/lib/hooks/useAuth";
import type { ResetPasswordFormValues } from "@/lib/hooks/useAuth";
import { authService } from "@/lib/services/authService";

interface PasswordResetFormProps {
  onSubmit?: (email: string) => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  isLoading: externalIsLoading = false,
  error: externalError,
  success: externalSuccess = false,
}) => {
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();
  const [internalSuccess, setInternalSuccess] = useState(false);

  // Używamy wartości z propsów lub stanu wewnętrznego
  const isLoading = externalIsLoading || internalIsLoading;
  const error = externalError || internalError;
  const success = externalSuccess || internalSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(resetPasswordSchema);

  const onSubmitForm = async (data: ResetPasswordFormValues) => {
    // Jeśli dostarczono zewnętrzną funkcję onSubmit, używamy jej
    if (onSubmit) {
      onSubmit(data.email);
      return;
    }

    // W przeciwnym razie używamy wbudowanej logiki
    try {
      setInternalIsLoading(true);
      setInternalError(undefined);

      const result = await authService.resetPassword({ email: data.email });

      if (result.success) {
        setInternalSuccess(true);
      } else if (result.error) {
        setInternalError(result.error);
      }
    } catch (error) {
      setInternalError(
        error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd podczas resetowania hasła"
      );
    } finally {
      setInternalIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <p className="text-gray-600 mt-2">Podaj swój adres email, a wyślemy Ci link do zresetowania hasła</p>
        </div>

        {success ? (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Instrukcje resetowania hasła zostały wysłane na podany adres email</AlertDescription>
          </Alert>
        ) : (
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

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Wysyłanie...
                </>
              ) : (
                "Wyślij link resetujący"
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                <a href="/auth/login" className="text-blue-600 hover:underline">
                  Powrót do logowania
                </a>
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
