"use client";

import React from "react";

interface FormInputProps {
  label: string | React.ReactNode;
  type?: "text" | "email" | "tel" | "url" | "number" | "date" | "select" | "textarea";
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  step?: string;
  min?: string;
  max?: string;
}

export function FormInput({
  label,
  type = "text",
  placeholder,
  options,
  required,
  value,
  onChange,
  className = "",
  rows = 3,
  step,
  min,
  max,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {type === "select" ? (
        <select
          className={`input-field ${className}`}
          value={value as string}
          onChange={onChange}
        >
          <option value="">Select {label}</option>
          {(options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={`input-field min-h-[100px] py-4 ${className}`}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className={`input-field ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}

export function FileUpload({
  label,
  sub,
  description,
  accept,
  multiple,
  icon,
  required,
}: {
  label: string;
  sub?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-sm font-medium text-gray-700">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      )}
      <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
        <div className="mx-auto mb-4 flex h-48 w-full items-center justify-center rounded-md bg-gray-50 transition-colors">
          {icon || (
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          )}
        </div>
        <p className="text-base font-medium text-gray-700">{sub || "Click to upload"}</p>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        <input type="file" className="hidden" accept={accept} multiple={multiple} />
      </div>
    </div>
  );
}

interface DynamicTableProps {
  columns: { key: string; label: string; width?: string }[];
  data: Record<string, string>[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: string, value: string) => void;
  addLabel?: string;
}

export function DynamicTable({
  columns,
  data,
  onAdd,
  onRemove,
  onUpdate,
  addLabel = "Add Row",
}: DynamicTableProps) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-gray-700 ${col.width || ""}`}
              >
                {col.label}
              </th>
            ))}
            <th className="w-20 px-4 py-3 text-center font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-gray-400">
                No entries yet. Click &quot;{addLabel}&quot; to add one.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <input
                      type="text"
                      className="input-field py-2 text-sm"
                      value={row[col.key] || ""}
                      onChange={(e) => onUpdate(row.id, col.key, e.target.value)}
                      placeholder={col.label}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          {addLabel}
        </button>
      </div>
    </div>
  );
}
