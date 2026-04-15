"use client";

import React from "react";

const AdminRow: React.FC<{
  position: string;
  role: string;
  holder: string;
}> = ({ position, role, holder }) => (
  <tr>
    <td className="px-4 py-3 font-medium">{position}</td>
    <td className="px-4 py-3">{role}</td>
    <td className="px-4 py-3">{holder}</td>
  </tr>
);

export default AdminRow;