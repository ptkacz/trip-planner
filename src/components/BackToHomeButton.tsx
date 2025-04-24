import React from "react";
import { Button } from "@/components/ui/button";

interface BackToHomeButtonProps {
  href: string;
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ href }) => {
  return (
    <Button asChild variant="outline" size="sm" className="gap-2">
      <a href={href}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="inline-block"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Powrót do strony głównej
      </a>
    </Button>
  );
};

export default BackToHomeButton;
