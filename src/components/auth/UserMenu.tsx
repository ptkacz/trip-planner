import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  email?: string;
  onProfileClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ email, onProfileClick }) => {
  const initials = email ? email.split("@")[0].slice(0, 2).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full flex items-center justify-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = "/notes")} className="cursor-pointer">
          Moje notatki
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => (window.location.href = "/auth/logout")}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
