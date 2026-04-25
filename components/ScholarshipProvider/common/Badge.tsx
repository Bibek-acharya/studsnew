import React, { memo } from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "purple" | "orange" | "red" | "gray" | "indigo" | "yellow";
}

const Badge: React.FC<BadgeProps> = memo(({ children, variant = "blue" }) => {
  const variantClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
    indigo: "bg-indigo-100 text-indigo-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
