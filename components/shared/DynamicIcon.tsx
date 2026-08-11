"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

const kebabToPascal = (name: string): string =>
  name
    .replace(/-./g, (m) => m[1].toUpperCase())
    .replace(/^./, (m) => m.toUpperCase());

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function DynamicIcon({
  name,
  size = 24,
  className = "",
}: DynamicIconProps) {
  const IconComponent = (
    LucideIcons.icons as Record<
      string,
      React.ComponentType<{ size?: number; className?: string }>
    >
  )[kebabToPascal(name)];

  return IconComponent ? (
    <IconComponent size={size} className={className} />
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
