"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary: "bg-[#6039ed] hover:bg-[#4c2bc4] text-white shadow-sm hover:shadow-md",
  secondary: "bg-zinc-900 hover:bg-zinc-800 text-white",
  ghost: "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50",
  outline: "border-2 border-[#6039ed] text-[#6039ed] hover:bg-[#6039ed] hover:text-white",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-lg font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
