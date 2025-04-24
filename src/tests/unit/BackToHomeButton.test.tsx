/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BackToHomeButton from "@/components/BackToHomeButton";

describe("BackToHomeButton", () => {
  it("renderuje przycisk z odpowiednim tekstem", () => {
    render(<BackToHomeButton href="/" />);

    const button = screen.getByRole("link", { name: /powrót do strony głównej/i });
    expect(button).toBeInTheDocument();
  });

  it("ma poprawny atrybut href", () => {
    const testHref = "/testowy-url";
    render(<BackToHomeButton href={testHref} />);

    const button = screen.getByRole("link", { name: /powrót do strony głównej/i });
    expect(button).toHaveAttribute("href", testHref);
  });

  it("zawiera ikonę strzałki", () => {
    render(<BackToHomeButton href="/" />);

    const link = screen.getByRole("link", { name: /powrót do strony głównej/i });
    const svg = link.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
