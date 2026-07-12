"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Building2, MapPin, Globe, X } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Institution {
  id: number;
  institution_name: string;
  district?: string;
  province?: string;
  website_url?: string;
  affiliation?: string;
  logo_url?: string;
}

interface InstitutionFields {
  name: string;
  location: string;
  affiliation: string;
  link: string;
  institution_id: number;
  logo: string;
}

interface InstitutionSelectorProps {
  value: InstitutionFields;
  onChange: (value: InstitutionFields) => void;
  onUpload?: (file: File) => Promise<string>;
}

export default function InstitutionSelector({
  value,
  onChange,
  onUpload,
}: InstitutionSelectorProps) {
  const [query, setQuery] = useState(value.name || "");
  const [results, setResults] = useState<Institution[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value.name);
  }, [value.name]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/superadmin/institutions?search=${encodeURIComponent(q)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("superadmin_token")}`,
              "Content-Type": "application/json",
            },
          },
        );
        const body = await res.json();
        const institutions: Institution[] = body?.data?.institutions || [];
        setResults(institutions);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleSelect = (inst: Institution) => {
    setSelectedInst(inst);
    setQuery(inst.institution_name);
    setOpen(false);
    onChange({
      name: inst.institution_name,
      location: [inst.district, inst.province].filter(Boolean).join(", "),
      affiliation: inst.affiliation || "",
      link: inst.website_url || "",
      institution_id: inst.id,
      logo: inst.logo_url || "",
    });
  };

  const handleClear = () => {
    setSelectedInst(null);
    setQuery("");
    setResults([]);
    setOpen(false);
    onChange({
      name: "",
      location: "",
      affiliation: "",
      link: "",
      institution_id: 0,
      logo: "",
    });
  };

  const handleNameChange = (q: string) => {
    setQuery(q);
    if (!selectedInst || selectedInst.institution_name !== q) {
      setSelectedInst(null);
    }
    if (!selectedInst || selectedInst.institution_name !== q) {
      onChange({ ...value, name: q, institution_id: 0 });
    }
    handleSearch(q);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-600" />
        Institution Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Logo — spans 2 cols */}
        <div className="md:col-span-2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Logo
          </label>
          <label className="cursor-pointer group flex-1">
            <div
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden h-full min-h-[100px] ${
                value.logo ? "border-blue-300 bg-blue-50/30" : "border-gray-300"
              }`}
            >
              {value.logo ? (
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={value.logo}
                    alt="logo"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">
                      Click to replace
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ ...value, logo: "" });
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full text-red-500 hover:bg-white shadow-md"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-full mb-1.5">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Upload Logo
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    JPG/PNG · Max 2MB
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !onUpload) return;
                if (!file.type.startsWith("image/")) {
                  alert("Please select an image file.");
                  return;
                }
                if (file.size > 2 * 1024 * 1024) {
                  alert("File size must be under 2MB.");
                  return;
                }
                try {
                  const url = await onUpload(file);
                  onChange({ ...value, logo: url });
                } catch {
                  alert("Upload failed.");
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {/* Fields — spans 4 cols */}
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <div className="relative" ref={containerRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Institution Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => results.length > 0 && setOpen(true)}
                  placeholder="Type to search or enter institution name..."
                  className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
                    type="button"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="w-4 h-4 block rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
                  </div>
                )}
              </div>
              {open && results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto shadow-lg z-10">
                  {results.map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelect(inst)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-sm flex items-center gap-3 transition-colors ${
                        selectedInst?.id === inst.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {inst.institution_name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-800 block truncate">
                          {inst.institution_name}
                        </span>
                        <span className="text-gray-500 text-xs block truncate">
                          {[inst.district, inst.province]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Affiliation
              </label>
              <input
                type="text"
                value={value.affiliation}
                onChange={(e) =>
                  onChange({ ...value, affiliation: e.target.value })
                }
                placeholder="e.g., Tribhuvan University"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={value.location}
                  onChange={(e) =>
                    onChange({ ...value, location: e.target.value })
                  }
                  placeholder="e.g., Kathmandu, Bagmati Province"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Institution Link
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="url"
                  value={value.link}
                  onChange={(e) => onChange({ ...value, link: e.target.value })}
                  placeholder="https://example.edu.np"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
