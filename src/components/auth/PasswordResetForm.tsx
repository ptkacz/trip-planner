import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

// Schema walidacji
const resetPasswordSchema = z.object({
  email: z.string().email("Niepoprawny format adresu email"),
});

interface PasswordResetFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  success = false,
}) => {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});

  const validateForm = (): boolean => {
    try {
      resetPasswordSchema.parse({ email });
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
          {} as { email?: string }
        );
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(email);
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
