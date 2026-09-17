// Canonical "Advertise For" options shared by the institution-zone request form
// and the superadmin advertise-request table (contract: docs/advertise-request-plan.md).

export interface AdvertiseForOption {
  value: string;
  label: string;
}

export const ADVERTISE_FOR_OPTIONS: AdvertiseForOption[] = [
  { value: "course-finder:multi_college", label: "Course page - Different colleges" },
  { value: "course-finder:single_college", label: "Course page - Individual college" },
  { value: "landing-popup", label: "Landing Page Popup" },
  { value: "hero-banner", label: "Hero Banner" },
  { value: "showcase-banner", label: "Showcase Banner" },
  { value: "landing-courses", label: "Landing Courses" },
  { value: "university-affiliation", label: "University Affiliation" },
];

export function advertiseForLabel(value: string): string {
  return ADVERTISE_FOR_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
