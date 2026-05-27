import React from "react";

const CheckboxItem: React.FC<{
  id: string;
  label: React.ReactNode;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, count, checked, onChange }) => (
  <label htmlFor={id} className="group flex w-full cursor-pointer items-center justify-between">
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[12px] font-medium text-slate-500">
        {count.toLocaleString()}
      </span>
    )}
  </label>
);

export default CheckboxItem;
