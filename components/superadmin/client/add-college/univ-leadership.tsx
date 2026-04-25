"use client";

import React, { useState } from "react";
import { Info, Users } from "lucide-react";
import { FormCard } from "./FormCard";
import { DynamicTable } from "./FormInput";
import { generateId } from "@/lib/superadmin/constants";

export function UniversityOverviewCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  const [fields, setFields] = useState([
    { id: "1", field: "Established", value: "1959" },
    { id: "2", field: "Location", value: "Kirtipur, 5 km from Kathmandu's city center" },
    { id: "3", field: "Campus Size", value: "154.77 hectares (3,042-5-2 ropanis)" },
    { id: "4", field: "Type", value: "Non-profit, autonomous" },
  ]);

  return (
    <FormCard
      icon={<Info size={24} className="text-blue-600" />}
      title="University Overview"
      sub="Institutional details and rankings"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <DynamicTable
        columns={[
          { key: "field", label: "Field" },
          { key: "value", label: "Value" },
        ]}
        data={fields}
        onAdd={() =>
          setFields((prev) => [...prev, { id: generateId(), field: "", value: "" }])
        }
        onRemove={(id) => setFields((prev) => prev.filter((f) => f.id !== id))}
        onUpdate={(id, key, value) =>
          setFields((prev) =>
            prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
          )
        }
        addLabel="Add Field"
      />
    </FormCard>
  );
}

export function LeadershipCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  const [members, setMembers] = useState([
    { id: "1", position: "Chancellor", role: "Ceremonial head", holder: "Sushila Karki" },
    { id: "2", position: "Vice Chancellor", role: "Chief Executive", holder: "Prof. Deepak Aryal, PhD" },
    { id: "3", position: "Rector", role: "Manages academic programs", holder: "Prof. Khadga K.C, PhD" },
  ]);

  return (
    <FormCard
      icon={<Users size={24} className="text-purple-600" />}
      title="Leadership & Administration"
      sub="Key administrative personnel"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          Add Member
        </button>
      }
    >
      <DynamicTable
        columns={[
          { key: "position", label: "Position" },
          { key: "role", label: "Role" },
          { key: "holder", label: "Current Holder" },
        ]}
        data={members}
        onAdd={() =>
          setMembers((prev) => [
            ...prev,
            { id: generateId(), position: "", role: "", holder: "" },
          ])
        }
        onRemove={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
        onUpdate={(id, key, value) =>
          setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, [key]: value } : m)),
          )
        }
        addLabel="Add Member"
      />
    </FormCard>
  );
}
