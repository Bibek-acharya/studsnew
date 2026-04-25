import React, { memo } from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const Avatar: React.FC<AvatarProps> = memo(({ name, size = "md", color }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const colors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-orange-400 to-orange-600",
    "from-pink-400 to-pink-600",
    "from-teal-400 to-teal-600",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const gradientColor = color || colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColor} text-white flex items-center justify-center font-semibold shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
