import React, { memo } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = memo(({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium py-2.5 px-6 rounded-lg transition-all flex items-center gap-2";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-bold",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
