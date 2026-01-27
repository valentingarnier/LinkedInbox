"use client";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-3 h-3 border-2",
  md: "w-4 h-4 border-2",
  lg: "w-6 h-6 border-2",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-zinc-200 border-t-blue-600 rounded-full animate-spin ${className}`}
    />
  );
}
