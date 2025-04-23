import React from "react";
import type { UserDTO } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isAuthenticated?: boolean;
  user?: UserDTO | null;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback = null, isAuthenticated = false }) => {
  // Jeśli użytkownik jest zalogowany, renderuj dzieci
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // W przeciwnym razie renderuj fallback lub null
  return <>{fallback}</>;
};

export default AuthGuard;
