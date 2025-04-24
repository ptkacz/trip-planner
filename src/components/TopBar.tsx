import React from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onProfileClick?: () => void;
  userEmail?: string;
}

/**
 * TopBar - komponent nawigacyjny wyświetlający się w górnej części widoku
 * Zawiera tytuł strony oraz przyciski do nawigacji (profil)
 */
const TopBar: React.FC<TopBarProps> = ({ onProfileClick, userEmail }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">
        <a href="/" className="hover:opacity-80 transition-opacity">
          Generator planu podróży
        </a>
      </h1>
      <div className="flex items-center gap-4">
        {userEmail && <span className="text-sm text-gray-600">{userEmail}</span>}
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={onProfileClick} className="font-medium">
            Profil
          </Button>
          {userEmail && (
            <Button variant="outline" size="sm" asChild className="font-medium">
              <a href="/auth/logout">Wyloguj</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
