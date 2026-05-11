"use client";
import React from "react";
import { House } from "@phosphor-icons/react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center text-sm text-gray-500 gap-2">
      <House />
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span>-</span>
          {item.href ? (
            <a href={item.href} className="hover:text-gray-700">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
