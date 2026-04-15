"use client";

import React from "react";

const OverviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <tr>
    <td className="w-1/3  px-2 py-3 font-semibold">{label}</td>
    <td className="px-4 py-3">{value}</td>
  </tr>
);

export default OverviewRow;