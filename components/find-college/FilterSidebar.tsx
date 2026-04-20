import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CollegeFilters,
  DEFAULT_COLLEGE_FILTERS,
} from "@/app/find-college/types";
import { apiService } from "@/services/api";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { FaSliders, FaStar } from "react-icons/fa6";
import {
  NEPAL_DISTRICTS,
  NEPAL_LOCAL_BODIES,
  NEPAL_PROVINCES,
} from "@/lib/location-data";

interface FilterSidebarProps {
  filters: CollegeFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollegeFilters>>;
}

// ── Nepal Data ────────────────────────────────────────────────────────────────

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary", count: 3200 },
  { id: "alevel", label: "A Level", count: 85 },
  { id: "diploma", label: "Diploma / CTEVT", count: 410 },
];

const PROGRAMS: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
  plus2: [
    { id: "p2_sci", label: "Science", count: 1200 },
    { id: "p2_mgmt", label: "Management", count: 1500 },
    { id: "p2_hum", label: "Humanities", count: 300 },
    { id: "p2_edu", label: "Education", count: 150 },
    { id: "p2_law", label: "Law", count: 50 },
  ],
  alevel: [
    { id: "al_sci", label: "A Level - Science", count: 45 },
    { id: "al_nonsci", label: "A Level - Non-Science/Mgmt", count: 40 },
  ],
  diploma: [
    { id: "d_eng", label: "Engineering (CTEVT)", count: 150 },
    { id: "d_med", label: "Medical & Nursing (CTEVT)", count: 120 },
    { id: "d_hm", label: "Hotel Management & Tourism", count: 90 },
    { id: "d_agr", label: "Agriculture & Forestry (CTEVT)", count: 50 },
  ],
};

const COURSES: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
  b_it: [
    { id: "c_bsc_csit", label: "BSc CSIT", count: 45 },
    { id: "c_bca", label: "BCA", count: 60 },
    { id: "c_bit", label: "BIT", count: 30 },
    { id: "c_bim", label: "BIM", count: 40 },
  ],
  b_eng: [
    { id: "c_civil", label: "BE Civil Engineering", count: 80 },
    { id: "c_comp", label: "BE Computer Engineering", count: 65 },
    { id: "c_arch", label: "B. Architecture", count: 25 },
    { id: "c_elec", label: "BE Electrical/Electronics", count: 30 },
  ],
  b_biz: [
    { id: "c_bba", label: "BBA", count: 150 },
    { id: "c_bbs", label: "BBS", count: 200 },
    { id: "c_bbm", label: "BBM", count: 80 },
    { id: "c_bhm", label: "BHM", count: 90 },
  ],
  b_med: [
    { id: "c_mbbs", label: "MBBS", count: 25 },
    { id: "c_bds", label: "BDS", count: 15 },
    { id: "c_nursing", label: "BSc. Nursing", count: 40 },
    { id: "c_pharma", label: "B. Pharmacy", count: 20 },
  ],
  b_agr: [
    { id: "c_bsc_ag", label: "BSc. Agriculture", count: 30 },
    { id: "c_bsc_forestry", label: "BSc. Forestry", count: 20 },
  ],
  m_biz: [
    { id: "c_mba", label: "MBA", count: 60 },
    { id: "c_mbs", label: "MBS", count: 120 },
  ],
  m_it: [
    { id: "c_msc_csit", label: "MSc. CSIT", count: 10 },
    { id: "c_mca", label: "MCA", count: 15 },
    { id: "c_mit", label: "MIT", count: 25 },
  ],
  d_eng: [
    { id: "c_dip_civil", label: "Diploma in Civil Eng.", count: 60 },
    { id: "c_dip_comp", label: "Diploma in Computer Eng.", count: 45 },
  ],
  d_med: [
    { id: "c_pcl_nurs", label: "PCL Nursing", count: 55 },
    { id: "c_ha", label: "HA (General Medicine)", count: 40 },
  ],
};

const provinceIdMap: Record<string, string> = {
  "Koshi Province": "prov_koshi",
  "Madhesh Province": "prov_madhesh",
  "Bagmati Province": "prov_bagmati",
  "Gandaki Province": "prov_gandaki",
  "Lumbini Province": "prov_lumbini",
  "Karnali Province": "prov_karnali",
  "Sudurpashchim Province": "prov_sudur",
};

const districtIdMap: Record<string, string> = {
  Bhojpur: "d_bhojpur",
  Dhankuta: "d_dhankuta",
  Ilam: "d_ilam",
  Jhapa: "d_jhapa",
  Khotang: "d_khotang",
  Morang: "d_morang",
  Okhaldhunga: "d_okhaldhunga",
  Panchthar: "d_panchthar",
  Sankhuwasabha: "d_sankhuwasabha",
  Solukhumbu: "d_solukhumbu",
  Sunsari: "d_sunsari",
  Taplejung: "d_taplejung",
  Terhathum: "d_terhathum",
  Udayapur: "d_udayapur",
  Bara: "d_bara",
  Dhanusha: "d_dhanusha",
  Mahottari: "d_mahottari",
  Parsa: "d_parsa",
  Rautahat: "d_rautahat",
  Saptari: "d_saptari",
  Sarlahi: "d_sarlahi",
  Siraha: "d_siraha",
  Bhaktapur: "d_bhaktapur",
  Chitwan: "d_chitwan",
  Dhading: "d_dhading",
  Dolakha: "d_dolakha",
  Kathmandu: "d_kathmandu",
  Kavrepalanchok: "d_kavre",
  Lalitpur: "d_lalitpur",
  Makwanpur: "d_makwanpur",
  Nuwakot: "d_nuwakot",
  Ramechhap: "d_ramechhap",
  Rasuwa: "d_rasuwa",
  Sindhuli: "d_sindhuli",
  Sindhupalchok: "d_sindhupalchok",
  Baglung: "d_baglung",
  Gorkha: "d_gorkha",
  Kaski: "d_kaski",
  Lamjung: "d_lamjung",
  Manang: "d_manang",
  Mustang: "d_mustang",
  Myagdi: "d_myagdi",
  Nawalpur: "d_nawalpur",
  Parbat: "d_parbat",
  Syangja: "d_syangja",
  Tanahun: "d_tanahun",
  Arghakhanchi: "d_arghakhanchi",
  Banke: "d_banke",
  Bardiya: "d_bardiya",
  Dang: "d_dang",
  Gulmi: "d_gulmi",
  Kapilvastu: "d_kapilvastu",
  Palpa: "d_palpa",
  Parasi: "d_parasi",
  Pyuthan: "d_pyuthan",
  Rolpa: "d_rolpa",
  "Rukum Purba": "d_rukum_purba",
  Rupandehi: "d_rupandehi",
  Dailekh: "d_dailekh",
  Dolpa: "d_dolpa",
  Humla: "d_humla",
  Jajarkot: "d_jajarkot",
  Jumla: "d_jumla",
  Kalikot: "d_kalikot",
  Mugu: "d_mugu",
  "Rukum Paschim": "d_rukum_paschim",
  Salyan: "d_salyan",
  Surkhet: "d_surkhet",
  Achham: "d_achham",
  Baitadi: "d_baitadi",
  Bajhang: "d_bajhang",
  Bajura: "d_bajura",
  Dadeldhura: "d_dadeldhura",
  Darchula: "d_darchula",
  Doti: "d_doti",
  Kailali: "d_kailali",
  Kanchanpur: "d_kanchanpur",
};

type DistrictOption = {
  id: string;
  label: string;
  localBodies?: LocalBodyOption[];
};

type LocalBodyOption = {
  id: string;
  label: string;
  type: "Municipality" | "Sub-Metropolitan City" | "Metropolitan City" | "Gaunpalika";
};

type ProvinceOption = {
  id: string;
  label: string;
  districts: DistrictOption[];
  localBodies?: LocalBodyOption[];
};

type ProvinceName = keyof typeof NEPAL_DISTRICTS;

const localBodyIdMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  Object.entries(NEPAL_LOCAL_BODIES).forEach(([district, bodies]) => {
    bodies.forEach((body: { name: string; wards: number }) => {
      const key = `${district}:${body.name}`;
      map[key] = `lb_${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`;
    });
  });
  return map;
})();

const provinceOptions: ProvinceOption[] = NEPAL_PROVINCES.map(
  (provinceName, index) => {
    const provinceKey = provinceName as ProvinceName;
    const provinceId = provinceIdMap[provinceName] || `prov_${index}`;
    const districts = (NEPAL_DISTRICTS[provinceKey] || []).map(
      (districtName: string) => ({
        id:
          districtIdMap[districtName] ||
          `d_${districtName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
        label: districtName,
        localBodies: ((NEPAL_LOCAL_BODIES as Record<string, { name: string; wards: number }[]>)[districtName] || []).map((body): LocalBodyOption => ({
          id:
            localBodyIdMap[`${districtName}:${body.name}`] ||
            `lb_${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
          label: body.name,
          type: (body.name.toLowerCase().includes("sub-metropolitan")
            ? "Sub-Metropolitan City"
            : body.name.toLowerCase().includes("metropolitan")
            ? "Metropolitan City"
            : body.name.toLowerCase().includes("municipality")
            ? "Municipality"
            : "Gaunpalika") as LocalBodyOption["type"],
        })),
      }),
    );

    return {
      id: provinceId,
      label: provinceName.replace(/\s+Province$/, ""),
      districts,
    };
  },
);

const COLLEGE_TYPES = [
  { id: "ct_private", label: "Private", count: 250 },
  { id: "ct_public", label: "Public / Govt", count: 50 },
  { id: "ct_community", label: "Community", count: 20 },
  { id: "ct_constituent", label: "Constituent", count: 15 },
  { id: "ct_foreign", label: "Foreign Affiliated", count: 35 },
];

const COURSE_DURATIONS = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5+ Years",
];
const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Highest Rating" },
  { id: "verified", label: "Verified First" },
  { id: "fee_low", label: "Fee: Low to High" },
  { id: "fee_high", label: "Fee: High to Low" },
];

const APPLIED_FILTER_KEYS: Array<
  Exclude<keyof CollegeFilters, "search" | "feeMax" | "sortBy">
> = [
  "academic",
  "program",
  "course",
  "province",
  "district",
  "localBody",
  "type",
  "courseDuration",
  "quick",
  "stream",
  "location",
  "facilities",
  "feeRange",
  "duration",
  "popularity",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFee(val: number) {
  if (val >= 2000000) return "NPR 20,00,000+";
  return `NPR ${val.toLocaleString("en-IN")}`;
}

// ── Sub-Components ────────────────────────────────────────────────────────────

const CustomSelect: React.FC<{
  placeholder: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ placeholder, value, options, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.id === value)?.label || "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative mb-3">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-[#f8fafc] px-3 py-2 text-[13.5px] text-gray-900 outline-none transition disabled:bg-gray-100 disabled:text-gray-400 focus:border-blue-500"
      >
        <span className={value ? "" : "text-gray-400"}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-[13px] text-gray-400">No options</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`flex w-full px-3 py-2 text-left text-[13.5px] hover:bg-gray-50 ${
                  opt.id === value ? "bg-blue-50 text-blue-600" : "text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SearchInput: React.FC<{

  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ placeholder, value, onChange }) => (
  <div className="relative mb-3">
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-md border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const CheckboxItem: React.FC<{
  id: string;
  label: React.ReactNode;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, count, checked, onChange }) => (
  <label
    htmlFor={id}
    className="group flex w-full cursor-pointer items-center justify-between"
  >
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

const RadioItem: React.FC<{
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, name, checked, onChange }) => (
  <label htmlFor={id} className="group flex cursor-pointer items-center gap-3">
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="custom-radio"
    />
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
      {label}
    </span>
  </label>
);

const Accordion: React.FC<{
  title: string;
  defaultOpen?: boolean;
  hideDivider?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, hideDivider = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      hideDivider={hideDivider}
    >
      {children}
    </GlobalFilterSection>
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
}) => {
  const { data: collegeFilterCounts } = useQuery({
    queryKey: ["collegeFilterCounts"],
    queryFn: () => apiService.getCollegeFilterCounts(),
    staleTime: 5 * 60 * 1000,
  });

  const [locating, setLocating] = useState(false);
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [programSearch, setProgramSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [navLocString, setNavLocString] = useState("");

  const getFacetCount = (id: string): number | undefined => {
    if (!collegeFilterCounts?.data?.facet_counts_by_id) return undefined;
    return collegeFilterCounts.data.facet_counts_by_id[id] ?? 0;
  };

  useEffect(() => {
    const updateLocation = (cityStr: string) => {
      if (
        !cityStr ||
        cityStr === "Detect Location" ||
        cityStr === "Detecting..." ||
        cityStr === "Location Found"
      )
        return;
      setNavLocString(cityStr);
    };

    const savedLoc = sessionStorage.getItem("navLocation");
    if (savedLoc) {
      updateLocation(savedLoc);
    }

    const handleNavLocation = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      updateLocation(customEvent.detail);
    };

    window.addEventListener("navLocationChange", handleNavLocation);
    return () =>
      window.removeEventListener("navLocationChange", handleNavLocation);
  }, [setFilters]);

  // Derived cascade data
  const availablePrograms = useMemo(() => {
    const progs = filters.academic
      .flatMap((a) => PROGRAMS[a] || [])
      .map((p) => ({ ...p, count: getFacetCount(p.id) }));
    if (!programSearch) return progs;
    return progs.filter((p) =>
      p.label.toLowerCase().includes(programSearch.toLowerCase()),
    );
  }, [filters.academic, programSearch, getFacetCount]);

  const availableCourses = useMemo(() => {
    const showCourse = filters.academic.some((a) =>
      ["diploma"].includes(a),
    );
    if (!showCourse) return [];
    const courses = filters.program
      .flatMap((p) => COURSES[p] || [])
      .map((c) => ({ ...c, count: getFacetCount(c.id) }));
    if (!courseSearch) return courses;
    return courses.filter((c) =>
      c.label.toLowerCase().includes(courseSearch.toLowerCase()),
    );
  }, [filters.academic, filters.program, courseSearch, getFacetCount]);

  const showCourseSection = filters.academic.some((a) =>
    ["diploma"].includes(a),
  );

  const filterLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    ACADEMIC_LEVELS.forEach((item) => map.set(item.id, item.label));
    provinceOptions.forEach((province) => {
      map.set(province.id, province.label);
      province.districts.forEach((district) => {
        map.set(district.id, district.label);
        district.localBodies?.forEach((lb) => map.set(lb.id, lb.label));
      });
    });
    COLLEGE_TYPES.forEach((item) => map.set(item.id, item.label));
    COURSE_DURATIONS.forEach((item) => map.set(item, item));
    SORT_OPTIONS.forEach((item) => map.set(item.id, item.label));

    Object.values(PROGRAMS).forEach((group) => {
      group.forEach((item) => map.set(item.id, item.label));
    });

    Object.values(COURSES).forEach((group) => {
      group.forEach((item) => map.set(item.id, item.label));
    });

    return map;
  }, []);

  const appliedFilters = useMemo(() => {
    const tags: Array<{
      key: Exclude<keyof CollegeFilters, "search" | "feeMax" | "sortBy">;
      value: string;
      label: string;
    }> = [];

    APPLIED_FILTER_KEYS.forEach((key) => {
      filters[key].forEach((value) => {
        tags.push({ key, value, label: filterLabelMap.get(value) || value });
      });
    });

    return tags;
  }, [filters, filterLabelMap]);

  const isFeeApplied = filters.feeMax < DEFAULT_COLLEGE_FILTERS.feeMax;
  const hasActiveFilters = appliedFilters.length > 0 || isFeeApplied;

  const toggle = (key: keyof CollegeFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };



  const clearAll = () => setFilters(DEFAULT_COLLEGE_FILTERS);

  const handleLocate = () => {
    if (locating) return;
    setLocating(true);

    const resolveLocation = async (lat?: number, lon?: number) => {
      try {
        let cityStr = "";

        // 1. Try precise GPS via OpenStreetMap Nominatim (zoom=10 for city/district level)
        if (lat && lon) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              cityStr =
                data.address.county ||
                data.address.city ||
                data.address.state_district ||
                "";
            }
          }
        }

        // 2. Try generic IP-based location if GPS failed or permission denied
        if (!cityStr) {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data) {
              cityStr = data.city || data.principalSubdivision || "";
            }
          }
        }

        // 3. Map detected location to Province/District filters
        if (cityStr) {
          const normalizedSearch = cityStr.toLowerCase();
          let foundProvId = "";
          let foundDistId = "";

          // Match Province
          for (const prov of provinceOptions) {
            if (normalizedSearch.includes(prov.label.toLowerCase())) {
              foundProvId = prov.id;
            }
          }

          // Match District
          for (const prov of provinceOptions) {
            for (const dist of prov.districts) {
              const distLower = dist.label.toLowerCase();
              if (
                normalizedSearch.includes(distLower) ||
                distLower.includes(normalizedSearch)
              ) {
                foundDistId = dist.id;
                foundProvId = prov.id; // Auto-select parent province
              }
            }
          }

          setFilters((prev) => {
            if (!foundProvId && !foundDistId) {
              return { ...prev, search: cityStr };
            }

            const nextProv = new Set(prev.province);
            const nextDist = new Set(prev.district);

            if (foundProvId) nextProv.add(foundProvId);
            if (foundDistId) nextDist.add(foundDistId);

            return {
              ...prev,
              province: Array.from(nextProv),
              district: Array.from(nextDist),
            };
          });

          sessionStorage.setItem("navLocation", cityStr);
          window.dispatchEvent(
            new CustomEvent("navLocationChange", { detail: cityStr }),
          );
        } else {
          alert("Could not detect your district. Please select it manually.");
        }
      } catch (e) {
        console.error(e);
        alert("Could not detect location.");
      } finally {
        setLocating(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolveLocation(pos.coords.latitude, pos.coords.longitude),
        () => resolveLocation(), // Fallback to IP if denied
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      resolveLocation(); // Fallback instantly if geolocation unavailable
    }
  };
  
  const academicLevelsWithCounts = useMemo(

    () => ACADEMIC_LEVELS.map((item) => ({ ...item, count: getFacetCount(item.id) })),
    [getFacetCount],
  );

  const collegeTypesWithCounts = useMemo(
    () =>
      COLLEGE_TYPES.map((item) => ({
        ...item,
        count: collegeFilterCounts?.data?.type_counts_by_id
          ? (collegeFilterCounts.data.type_counts_by_id[item.id] ?? 0)
          : undefined,
      })),
    [collegeFilterCounts],
  );

  const courseDurationsWithCounts = useMemo(
    () =>
      COURSE_DURATIONS.map((duration) => ({
        id: duration,
        label: duration,
        count: getFacetCount(duration),
      })),
    [getFacetCount],
  );

  return (
    <>
      {/* ── Filter Card ───────────────────────────────────── */}
      <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6 ">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
                    <FaSliders size={18} className="text-black" />
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">
                      Filters
                    </h3>
                  </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setShowAppliedDropdown((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
            >
              Applied ({appliedFilters.length + (isFeeApplied ? 1 : 0)})
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
              ></i>
            </button>
          )}
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
            {appliedFilters.length === 0 && !isFeeApplied ? (
              <p className="px-1 py-2 text-[13px] italic text-gray-400">
                No filters selected yet.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 pb-3">
                  {appliedFilters.map((tag, index) => (
                    <button
                      key={`${tag.key}-${tag.value}-${index}`}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          [tag.key]: prev[tag.key].filter(
                            (item) => item !== tag.value,
                          ),
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    >
                      {tag.label}
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  ))}

                  {isFeeApplied && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          feeMax: DEFAULT_COLLEGE_FILTERS.feeMax,
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    >
                      Max Fee: {formatFee(filters.feeMax)}
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearAll();
                      setShowAppliedDropdown(false);
                    }}
                    className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* College Near Me */}
        <div className="border-b border-gray-100 py-3">
          <button
            type="button"
            onClick={handleLocate}
            className="flex w-full items-center justify-start gap-2 rounded-md border border-black/20  px-4 py-3 text-gray-700 hover:text-brand-blue outline-none transition-all duration-200"
          >
            {locating ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="7" />
                <line x1="12" y1="1" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="1" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="23" y2="12" />
              </svg>
            ) : (
              <i
                className={`fa-solid ${navLocString ? "fa-location-dot" : "fa-location-crosshairs"} text-[16px]`}
              ></i>
            )}
            <span className="text-[15px] font-medium">
              {locating
                ? "Locating..."
                : navLocString
                  ? navLocString
                  : "College Near Me"}
            </span>
          </button>
        </div>

        {/* Accordions */}

        {/* 1. Academic Level */}
        <Accordion title="Academic Level" defaultOpen>
          <div className="flex flex-col gap-3.5 pt-1">
            {academicLevelsWithCounts.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`acad-${item.id}`}
                label={item.label}
                count={item.count}
                checked={filters.academic.includes(item.id)}
                onChange={() => {
                  toggle("academic", item.id);
                  // Reset cascade when academic changes
                  setFilters((prev) => ({ ...prev, program: [], course: [] }));
                }}
              />
            ))}
          </div>
        </Accordion>

        {/* 2. Program */}
        <Accordion title="Program" defaultOpen>
          <SearchInput
            placeholder="Search programs..."
            value={programSearch}
            onChange={setProgramSearch}
          />
          <div className="custom-scrollbar flex max-h-55 flex-col gap-3.5 overflow-y-auto pr-1">
            {availablePrograms.length === 0 ? (
              <p className="px-1 text-[13px] italic text-gray-400">
                {filters.academic.length === 0
                  ? "Select an Academic Level first."
                  : "No programs found."}
              </p>
            ) : (
              availablePrograms.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={`prog-${item.id}`}
                  label={item.label}
                  count={item.count}
                  checked={filters.program.includes(item.id)}
                  onChange={() => toggle("program", item.id)}
                />
              ))
            )}
          </div>
        </Accordion>

        {/* 3. Course (conditional) */}
        {showCourseSection && (
          <Accordion title="Course">
            <SearchInput
              placeholder="Search courses..."
              value={courseSearch}
              onChange={setCourseSearch}
            />
            <div className="custom-scrollbar flex max-h-55 flex-col gap-3.5 overflow-y-auto pr-1">
              {availableCourses.length === 0 ? (
                <p className="px-1 text-[13px] italic text-gray-400">
                  {filters.program.length === 0
                    ? "Select a Program first to view courses."
                    : "No courses found."}
                </p>
              ) : (
                availableCourses.map((item) => (
                  <CheckboxItem
                    key={item.id}
                    id={`course-${item.id}`}
                    label={item.label}
                    count={item.count}
                    checked={filters.course.includes(item.id)}
                    onChange={() => toggle("course", item.id)}
                  />
                ))
              )}
            </div>
          </Accordion>
        )}

        {/* 4. Location (Province/District/Local Body) */}
        <Accordion title="Location" defaultOpen>
          <div className="flex flex-col gap-2 pt-1">
            <CustomSelect
              placeholder="Select Province"
              value={filters.province[0] || ""}
              options={provinceOptions}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  province: val ? [val] : [],
                  district: [],
                  localBody: [],
                }));
              }}
            />
            <CustomSelect
              placeholder="Select District"
              value={filters.district[0] || ""}
              options={
                filters.province[0]
                  ? provinceOptions.find((p) => p.id === filters.province[0])?.districts || []
                  : []
              }
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  district: val ? [val] : [],
                  localBody: [],
                }));
              }}
              disabled={!filters.province[0]}
            />
            <CustomSelect
              placeholder="Select Municipality / Gaunpalika"
              value={filters.localBody[0] || ""}
              options={
                filters.district[0]
                  ? provinceOptions
                      .find((p) => p.id === filters.province[0])
                      ?.districts.find((d) => d.id === filters.district[0])
                      ?.localBodies || []
                  : []
              }
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  localBody: val ? [val] : [],
                }));
              }}
              disabled={!filters.district[0]}
            />
          </div>
        </Accordion>


        {/* 6. College Type */}
        <Accordion title="Colleges Type">
          <div className="flex flex-col gap-3.5 pt-1">
            {collegeTypesWithCounts.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`type-${item.id}`}
                label={item.label}
                count={item.count}
                checked={filters.type.includes(item.id)}
                onChange={() => toggle("type", item.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* 7. Fee Range */}
        <Accordion title="Total Fee Range">
          <div className="px-2 pb-2 pt-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-400">
                NPR 0
              </span>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[14px] font-bold text-blue-600">
                {formatFee(filters.feeMax)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={50000}
              value={filters.feeMax}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  feeMax: Number(e.target.value),
                }))
              }
              className="fee-range w-full"
            />
          </div>
        </Accordion>

        {/* 9. Course Duration */}
        <Accordion title="Course Duration">
          <div className="flex flex-col gap-3.5 pt-1">
            {courseDurationsWithCounts.map((dur) => (
              <CheckboxItem
                key={dur.id}
                id={`dur-${dur.id}`}
                label={dur.label}
                count={dur.count}
                checked={filters.courseDuration.includes(dur.id)}
                onChange={() => toggle("courseDuration", dur.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* 10. Facilities */}
        <Accordion title="Facilities">
          <div className="flex flex-col gap-3.5 pt-1">
            <CheckboxItem
              id="fac-hostel"
              label="Hostel"
              checked={filters.facilities.includes("hostel")}
              onChange={() => toggle("facilities", "hostel")}
            />
            <CheckboxItem
              id="fac-transport"
              label="Transportation"
              checked={filters.facilities.includes("transportation")}
              onChange={() => toggle("facilities", "transportation")}
            />
            <CheckboxItem
              id="fac-library"
              label="Library"
              checked={filters.facilities.includes("library")}
              onChange={() => toggle("facilities", "library")}
            />
            <CheckboxItem
              id="fac-lab"
              label="Lab"
              checked={filters.facilities.includes("lab")}
              onChange={() => toggle("facilities", "lab")}
            />
            <CheckboxItem
              id="fac-sports"
              label="Sports"
              checked={filters.facilities.includes("sports")}
              onChange={() => toggle("facilities", "sports")}
            />
            <CheckboxItem
              id="fac-cafeteria"
              label="Cafeteria"
              checked={filters.facilities.includes("cafeteria")}
              onChange={() => toggle("facilities", "cafeteria")}
            />
          </div>
        </Accordion>

        {/* 11. Rating */}
        <Accordion title="Rating">
          <div className="flex flex-col gap-3.5 pt-1">
            <CheckboxItem
              id="rating-4.5"
              label={<><FaStar className="inline text-yellow-500" /> 4.5 & above (Top Rated)</>}
              checked={filters.rating?.includes("4.5")}
              onChange={() => toggle("rating", "4.5")}
            />
            <CheckboxItem
              id="rating-4.0"
              label={<><FaStar className="inline text-yellow-500" /> 4.0 & above</>}
              checked={filters.rating?.includes("4.0")}
              onChange={() => toggle("rating", "4.0")}
            />
            <CheckboxItem
              id="rating-3.5"
              label={<><FaStar className="inline text-yellow-500" /> 3.5 & above</>}
              checked={filters.rating?.includes("3.5")}
              onChange={() => toggle("rating", "3.5")}
            />
            <CheckboxItem
              id="rating-3.0"
              label={<><FaStar className="inline text-yellow-500" /> 3.0 & above</>}
              checked={filters.rating?.includes("3.0")}
              onChange={() => toggle("rating", "3.0")}
            />
          </div>
        </Accordion>

        {/* 12. Sort By */}
        <Accordion title="Sort By" defaultOpen hideDivider>
          <div className="flex flex-col gap-3.5">
            {SORT_OPTIONS.map((opt) => (
              <RadioItem
                key={opt.id}
                id={`sort-${opt.id}`}
                name="sort"
                label={opt.label}
                checked={filters.sortBy === opt.id}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, sortBy: opt.id }))
                }
              />
            ))}
          </div>
        </Accordion>
      </div>

      <style>{`
        .custom-checkbox {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 0.25em;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }
        .custom-checkbox::before {
          content: "";
          width: 0.65em;
          height: 0.65em;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          box-shadow: inset 1em 1em white;
          clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        .custom-checkbox:checked {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        .custom-checkbox:checked::before { transform: scale(1); }
        .custom-checkbox:hover { border-color: #64748b; }

        .custom-radio {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 50%;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }
        .custom-radio::before {
          content: "";
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          background-color: white;
        }
        .custom-radio:checked { background-color: #2563eb; border-color: #2563eb; }
        .custom-radio:checked::before { transform: scale(1); }
        .custom-radio:hover { border-color: #64748b; }

        .fee-range {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: blue;
        }
        .fee-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: 0 0 0 4px #eff6ff;
          transition: box-shadow 0.2s;
        }
        .fee-range::-webkit-slider-thumb:hover { box-shadow: 0 0 0 6px #dbeafe; }
        .fee-range::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #e2e8f0;
          border-radius: 2px;
        }
        .fee-range:focus { outline: none; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
};

export default FilterSidebar;
