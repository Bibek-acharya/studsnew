"use client";
import React from "react";
import Breadcrumb from "./Breadcrumb";

interface SectionHeaderProps {
  title: string;
  breadcrumbItems: { label: string; href?: string }[];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  breadcrumbItems,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="mt-2 sm:mt-0">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>
  );
};

export default SectionHeader;
