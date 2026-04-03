"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-[#0000FF] text-white hover:bg-[#0000CC] shadow-md shadow-blue-500/20",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-[#0000FF] text-[#0000FF] hover:bg-blue-50",
    ghost: "text-[#0000FF] hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-[12px]",
    md: "px-6 py-2.5 text-[14px]",
    lg: "px-8 py-3.5 text-[15px]",
    xl: "px-10 py-4 text-[16px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
