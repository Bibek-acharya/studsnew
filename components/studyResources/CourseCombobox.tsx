"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { studyResourcesApi } from "@/services/studyResourcesApi";

interface CourseComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  /** Prepend an "empty" option (e.g. "All courses") used as a filter reset. */
  allowEmpty?: boolean;
  emptyLabel?: string;
}

/**
 * Searchable course dropdown backed by the shared course options list.
 * Typing filters suggestions; a free-typed value is accepted as-is so the
 * user is never blocked when the option list is incomplete.
 */
export default function CourseCombobox({
  value,
  onChange,
  placeholder = "Select or type course",
  inputClassName,
  allowEmpty = false,
  emptyLabel = "All courses",
}: CourseComboboxProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);
  const [failed, setFailed] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let active = true;
    studyResourcesApi
      .listCourseOptions()
      .then((names) => {
        if (active) setOptions(names);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const showEmptyOption = allowEmpty && query.trim() === "";
  const items = useMemo(
    () => (showEmptyOption ? ["", ...filtered] : filtered),
    [showEmptyOption, filtered],
  );

  const close = () => {
    setOpen(false);
    setQuery(valueRef.current);
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const commit = (val: string) => {
    onChange(val);
    setQuery(val);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setHighlight((h) => Math.min(h + 1, Math.max(items.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && items[highlight] !== undefined) {
        e.preventDefault();
        commit(items[highlight]);
      }
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="course-combobox-listbox"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        value={open ? query : value}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName}
      />
      {!failed && (
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}
      {open && items.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {items.map((opt, idx) => (
            <li key={opt || "__empty__"}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(opt)}
                onMouseEnter={() => setHighlight(idx)}
                className={`block w-full truncate px-3 py-1.5 text-left text-sm ${
                  idx === highlight
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600"
                } ${opt ? "font-medium" : "italic text-gray-500"}`}
              >
                {opt || emptyLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
