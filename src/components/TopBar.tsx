import React from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onProfileClick?: () => void;
  onAddNoteClick?: () => void;
}

/**
 * TopBar - komponent nawigacyjny wyświetlający się w górnej części widoku
 * Zawiera tytuł strony oraz przyciski do nawigacji (profil, dodawanie notatki)
 */
const TopBar: React.FC<TopBarProps> = ({ onProfileClick, onAddNoteClick }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">Generator planu podróży</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onProfileClick}>
          Profil
        </Button>
        <Button variant="outline" size="sm" onClick={onAddNoteClick}>
          Dodaj notatkę
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
