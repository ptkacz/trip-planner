import React from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onProfileClick?: () => void;
}

/**
 * TopBar - komponent nawigacyjny wyświetlający się w górnej części widoku
 * Zawiera tytuł strony oraz przyciski do nawigacji (profil)
 */
const TopBar: React.FC<TopBarProps> = ({ onProfileClick }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">
        <a href="/" className="hover:opacity-80 transition-opacity">
          Generator planu podróży
        </a>
      </h1>
      <div className="flex gap-2">
        <Button variant="default" size="sm" onClick={onProfileClick} className="font-medium">
          Profil
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
