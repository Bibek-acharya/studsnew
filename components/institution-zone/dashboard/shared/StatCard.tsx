"use client";
import React, { type ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  badge?: { label: string; color: string };
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  trend,
  badge,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center text-2xl shrink-0`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
          <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
        {trend && (
          <span
            className={`font-medium px-1.5 py-0.5 rounded ${
              trend.positive
                ? "text-green-500 bg-green-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {trend.value}
          </span>
        )}
        {badge && (
          <span
            className={`font-medium px-1.5 py-0.5 rounded ${
              badge.color === "green"
                ? "text-green-500 bg-green-50"
                : badge.color === "blue"
                  ? "text-blue-600 bg-blue-50"
                  : badge.color === "red"
                    ? "text-red-500 bg-red-50"
                    : "text-gray-500 bg-gray-50"
            }`}
          >
            {badge.label}
          </span>
        )}
        {trend ? "this year" : badge && badge.color === "red" ? "" : ""}
      </div>
    </div>
  );
};

export default StatCard;
