import React from "react";

interface ErrorBannerProps {
  message: string;
}

/**
 * Komponent wyświetlający komunikaty o błędach
 */
const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
      data-test-id="error-banner"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorBanner;
