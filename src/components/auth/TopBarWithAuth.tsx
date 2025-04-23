import React from "react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

interface TopBarWithAuthProps {
  onProfileClick?: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

const TopBarWithAuth: React.FC<TopBarWithAuthProps> = ({ onProfileClick, isLoggedIn, userEmail }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">
        <a href="/" className="hover:opacity-80 transition-opacity">
          Generator planu podróży
        </a>
      </h1>

      <div className="flex gap-2">
        {isLoggedIn ? (
          // Menu dla zalogowanego użytkownika
          <UserMenu email={userEmail} onProfileClick={onProfileClick} />
        ) : (
          // Przyciski dla niezalogowanego użytkownika
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/login">Logowanie</a>
            </Button>
            <Button variant="default" size="sm" asChild>
              <a href="/auth/register">Rejestracja</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBarWithAuth;
