import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "current";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-indigo-200 border-t-indigo-600",
    white: "border-gray-200 border-t-white",
    current: "border-current/20 border-t-current",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 ${colorClasses[color]}`}
    />
  );
};
