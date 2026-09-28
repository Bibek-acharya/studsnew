import type { GlobalCourse } from "@/types/course";
import type { CourseFinderFilters, CourseFilterCounts } from "./types";

/**
 * Filter option definitions for the public course finder.
 *
 * `values` holds every stored spelling that belongs to the option. Courses are
 * written by the superadmin course form, which uses its own vocabulary
 * ("Diploma (CTEVT)", "PCL", "MPhil", "+2", ...). The public finder groups
 * those into friendlier buckets ("Diploma / PCL", "Higher Secondary (+2)", ...),
 * so every option needs an explicit alias list. Matching used to be a
 * bidirectional `includes` between the label and the stored level, which made
 * grouped labels unreachable: "Diploma / PCL" only matched "PCL" and never
 * "Diploma (CTEVT)".
 */
export interface FilterOption {
  id: string;
  label: string;
  values: string[];
}

export const ACADEMIC_LEVEL_OPTIONS: FilterOption[] = [
  { id: "Higher Secondary (+2)", label: "Higher Secondary (+2)", values: ["+2", "Higher Secondary", "Secondary"] },
  { id: "A Levels", label: "A Levels", values: ["A-Level", "A Level", "A Levels", "A-Level (Science)"] },
  { id: "Pre-Diploma / TSLC", label: "Pre-Diploma / TSLC", values: ["TSLC (CTEVT)", "TSLC", "Pre-Diploma", "Pre-Diploma / TSLC"] },
  { id: "Diploma / PCL", label: "Diploma / PCL", values: ["Diploma (CTEVT)", "Diploma", "PCL"] },
  { id: "Bachelor's Degree", label: "Bachelor's Degree", values: ["Bachelor's", "Bachelors", "Bachelor", "Bachelor's (Honours)", "Bachelor's Degree"] },
  { id: "Postgraduate Diploma", label: "Postgraduate Diploma", values: ["Postgraduate Diploma (PGD)", "Postgraduate Diploma", "PGD"] },
  { id: "Master's Degree", label: "Master's Degree", values: ["Master's", "Masters", "Master", "Master's Degree", "MA", "M.A."] },
  { id: "M.Phil.", label: "M.Phil.", values: ["MPhil", "M.Phil", "M. Phil"] },
  { id: "PhD / Doctorate", label: "PhD / Doctorate", values: ["PhD", "Ph.D", "Doctorate", "Doctoral"] },
  { id: "Professional Qualifications", label: "Professional Qualifications", values: ["Professional Qualifications", "Professional Qualification"] },
  { id: "Certificate Courses", label: "Certificate Courses", values: ["Certificate Courses", "Certificate", "Certificates"] },
  { id: "Short-Term Courses", label: "Short-Term Courses", values: ["Short-Term Courses", "Short Term Courses", "Short-Term"] },
  { id: "Vocational / Technical Training", label: "Vocational / Technical Training", values: ["Vocational", "Technical & Vocational", "Vocational Training", "Technical Training"] },
  { id: "Skill Development Programs", label: "Skill Development Programs", values: ["Skill Development Programs", "Skill Development", "Skill"] },
  { id: "Entrance Preparation", label: "Entrance Preparation", values: ["Entrance Preparation", "Entrance Prep", "Entrance"] },
  { id: "Language & Test Preparation", label: "Language & Test Preparation", values: ["Language & Test Preparation", "Language & Test Prep", "Test Preparation"] },
  { id: "Continuing / Lifelong Education", label: "Continuing / Lifelong Education", values: ["Continuing / Lifelong Education", "Continuing Education", "Lifelong Education"] },
];

export const FIELD_OPTIONS: FilterOption[] = [
  { id: "Management & Business", label: "Management & Business", values: ["Management & Business", "Management", "Business", "Business Administration"] },
  { id: "Accounting & Finance", label: "Accounting & Finance", values: ["Accounting & Finance", "Accounting", "Finance"] },
  { id: "Computer Science & Information Technology", label: "Computer Science & Information Technology", values: ["Computer Science & Information Technology", "Computer Science & IT", "Computer Science", "Information Technology", "CSIT", "ICT"] },
  { id: "Engineering", label: "Engineering", values: ["Engineering"] },
  { id: "Science & Mathematics", label: "Science & Mathematics", values: ["Science & Mathematics", "Science", "Mathematics"] },
  { id: "Medicine & Health Sciences", label: "Medicine & Health Sciences", values: ["Medicine & Health Sciences", "Medicine", "Health Sciences", "Allied Health"] },
  { id: "Nursing", label: "Nursing", values: ["Nursing"] },
  { id: "Pharmacy", label: "Pharmacy", values: ["Pharmacy"] },
  { id: "Dentistry", label: "Dentistry", values: ["Dentistry", "Dental"] },
  { id: "Ayurveda & Alternative Medicine", label: "Ayurveda & Alternative Medicine", values: ["Ayurveda & Alternative Medicine", "Ayurveda", "Alternative Medicine"] },
  { id: "Agriculture", label: "Agriculture", values: ["Agriculture", "Agricultural"] },
  { id: "Veterinary & Animal Science", label: "Veterinary & Animal Science", values: ["Veterinary & Animal Science", "Veterinary", "Animal Science"] },
  { id: "Forestry & Environmental Studies", label: "Forestry & Environmental Studies", values: ["Forestry & Environmental Studies", "Forestry", "Environmental Studies"] },
  { id: "Education & Teaching", label: "Education & Teaching", values: ["Education & Teaching", "Education", "Teaching"] },
  { id: "Humanities", label: "Humanities", values: ["Humanities", "Humanity"] },
  { id: "Social Sciences", label: "Social Sciences", values: ["Social Sciences", "Social Science", "Sociology"] },
  { id: "Law & Legal Studies", label: "Law & Legal Studies", values: ["Law & Legal Studies", "Law", "Legal Studies"] },
  { id: "Economics", label: "Economics", values: ["Economics", "Economical"] },
  { id: "Hospitality & Hotel Management", label: "Hospitality & Hotel Management", values: ["Hospitality & Hotel Management", "Hospitality", "Hotel Management", "Tourism & Hospitality"] },
  { id: "Travel & Tourism", label: "Travel & Tourism", values: ["Travel & Tourism", "Travel", "Tourism"] },
  { id: "Architecture, Design & Planning", label: "Architecture, Design & Planning", values: ["Architecture, Design & Planning", "Architecture", "Design", "Planning"] },
  { id: "Media & Communication", label: "Media & Communication", values: ["Media & Communication", "Media", "Communication", "Journalism"] },
  { id: "Arts & Fine Arts", label: "Arts & Fine Arts", values: ["Arts & Fine Arts", "Arts", "Fine Arts", "Art"] },
  { id: "Fashion & Textile", label: "Fashion & Textile", values: ["Fashion & Textile", "Fashion", "Textile"] },
  { id: "Aviation", label: "Aviation", values: ["Aviation", "Air Travel"] },
  { id: "Sports & Physical Education", label: "Sports & Physical Education", values: ["Sports & Physical Education", "Sports", "Physical Education"] },
  { id: "Library & Information Science", label: "Library & Information Science", values: ["Library & Information Science", "Library Science", "Library"] },
  { id: "Languages & Literature", label: "Languages & Literature", values: ["Languages & Literature", "Language", "Literature"] },
  { id: "Public Administration & Governance", label: "Public Administration & Governance", values: ["Public Administration & Governance", "Public Administration", "Governance", "Political Science"] },
  { id: "Development Studies", label: "Development Studies", values: ["Development Studies", "Development"] },
  { id: "Disaster & Risk Management", label: "Disaster & Risk Management", values: ["Disaster & Risk Management", "Disaster Management", "Risk Management"] },
  { id: "Maritime / Marine Studies", label: "Maritime / Marine Studies", values: ["Maritime / Marine Studies", "Maritime", "Marine Studies"] },
  { id: "Food & Nutrition", label: "Food & Nutrition", values: ["Food & Nutrition", "Food", "Nutrition", "Dietetics"] },
  { id: "Religious & Cultural Studies", label: "Religious & Cultural Studies", values: ["Religious & Cultural Studies", "Religious Studies", "Cultural Studies"] },
  { id: "Security & Defence Studies", label: "Security & Defence Studies", values: ["Security & Defence Studies", "Security Studies", "Defence Studies"] },
  { id: "Technical & Vocational", label: "Technical & Vocational", values: ["Technical & Vocational", "Technical", "Vocational"] },
  { id: "Professional Studies", label: "Professional Studies", values: ["Professional Studies", "Professional"] },
  { id: "Language & Test Preparation", label: "Language & Test Preparation", values: ["Language & Test Preparation", "Language & Test Prep", "Test Preparation"] },
  { id: "Skill & Short-Term Courses", label: "Skill & Short-Term Courses", values: ["Skill & Short-Term Courses", "Skill Development Programs", "Short-Term Courses"] },
  { id: "Other / Interdisciplinary", label: "Other / Interdisciplinary", values: ["Other / Interdisciplinary", "Other", "Interdisciplinary"] },
];

export const UNIVERSITY_OPTIONS: FilterOption[] = [
  { id: "Tribhuvan University (TU)", label: "Tribhuvan University (TU)", values: ["Tribhuvan University"] },
  { id: "Kathmandu University (KU)", label: "Kathmandu University (KU)", values: ["Kathmandu University"] },
  { id: "Pokhara University (PU)", label: "Pokhara University (PU)", values: ["Pokhara University"] },
  { id: "Purbanchal University (PoU)", label: "Purbanchal University (PoU)", values: ["Purbanchal University"] },
  { id: "Nepal Sanskrit University (NSU)", label: "Nepal Sanskrit University (NSU)", values: ["Nepal Sanskrit University"] },
  { id: "Lumbini Buddhist University (LBU)", label: "Lumbini Buddhist University (LBU)", values: ["Lumbini Buddhist University"] },
  { id: "Mid-West University (MU)", label: "Mid-West University (MU)", values: ["Mid-West University"] },
  { id: "Far Western University (FWU)", label: "Far Western University (FWU)", values: ["Far Western University"] },
  { id: "Agriculture and Forestry University (AFU)", label: "Agriculture and Forestry University (AFU)", values: ["Agriculture and Forestry University"] },
  { id: "Nepal Open University (NOU)", label: "Nepal Open University (NOU)", values: ["Nepal Open University"] },
  { id: "Rajarshi Janak University (RJU)", label: "Rajarshi Janak University (RJU)", values: ["Rajarshi Janak University"] },
  { id: "Manmohan Technical University (MTU)", label: "Manmohan Technical University (MTU)", values: ["Manmohan Technical University"] },
  { id: "Gandaki University (GU)", label: "Gandaki University (GU)", values: ["Gandaki University"] },
  { id: "Lumbini Technological University (LTU)", label: "Lumbini Technological University (LTU)", values: ["Lumbini Technological University"] },
  { id: "Madhesh University (MU)", label: "Madhesh University (MU)", values: ["Madhesh University"] },
  { id: "University of Nepal", label: "University of Nepal", values: ["University of Nepal"] },
  { id: "Madan Bhandari University of Science and Technology (MBUST)", label: "Madan Bhandari University of Science and Technology (MBUST)", values: ["Madan Bhandari University of Science and Technology"] },
  { id: "Vidushi Yogmaya Himalayan Ayurveda University", label: "Vidushi Yogmaya Himalayan Ayurveda University", values: ["Vidushi Yogmaya Himalayan Ayurveda University"] },
  { id: "Shahid Dasharath Chand Health Sciences University", label: "Shahid Dasharath Chand Health Sciences University", values: ["Shahid Dasharath Chand Health Sciences University"] },
  { id: "National Examinations Board (NEB)", label: "National Examinations Board (NEB)", values: ["National Examinations Board", "NEB"] },
  { id: "Council for Technical Education and Vocational Training (CTEVT)", label: "Council for Technical Education and Vocational Training (CTEVT)", values: ["Council for Technical Education and Vocational Training", "CTEVT"] },
];

/**
 * Lower-cases, replaces every separator with a single space and trims, so
 * "M.Phil.", "MPhil" and "M. Phil" all collapse to comparable tokens and word
 * boundaries stay detectable. "+" is kept so "+2" does not degrade to "2".
 */
export function normalizeFacetValue(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

function sharesTokenBoundary(outer: string, inner: string): boolean {
  // Either exact, or one side continues the other at a word boundary, so
  // "diploma" matches "diploma in civil engineering" but not
  // "postgraduate diploma pgd".
  return outer === inner || outer.startsWith(`${inner} `) || inner.startsWith(`${outer} `);
}

const normalizeCache = new Map<string, string>();

function normalizeCached(value: string): string {
  const cached = normalizeCache.get(value);
  if (cached !== undefined) return cached;
  const normalized = normalizeFacetValue(value);
  normalizeCache.set(value, normalized);
  return normalized;
}

/** True when a stored facet value belongs to the selected filter option. */
export function matchesFilterOption(stored: string | null | undefined, option: FilterOption): boolean {
  const value = normalizeCached((stored ?? "").trim());
  if (!value) return false;
  return option.values.some((alias) => {
    const normalizedAlias = normalizeCached(alias);
    return normalizedAlias !== "" && sharesTokenBoundary(value, normalizedAlias);
  });
}

function matchesAnyOption(storedValues: Array<string | null | undefined>, selected: string[], options: FilterOption[]): boolean {
  if (selected.length === 0) return true;
  const activeOptions = options.filter((option) => selected.includes(option.id));
  if (activeOptions.length === 0) return true;
  return storedValues.some((stored) => activeOptions.some((option) => matchesFilterOption(stored, option)));
}

/** Applies every active course-finder filter to a single course. */
export function courseMatchesFilters(course: GlobalCourse, filters: CourseFinderFilters): boolean {
  if (!matchesAnyOption([course.level], filters.academicLevels, ACADEMIC_LEVEL_OPTIONS)) return false;
  if (!matchesAnyOption([course.fieldOfStudy, course.field], filters.fields, FIELD_OPTIONS)) return false;
  if (
    !matchesAnyOption(
      [course.affiliationName, course.nonUniversityAffiliation],
      filters.universities,
      UNIVERSITY_OPTIONS,
    )
  ) {
    return false;
  }
  return true;
}

export function filterCourses(courses: GlobalCourse[], filters: CourseFinderFilters): GlobalCourse[] {
  return courses.filter((course) => courseMatchesFilters(course, filters));
}

function countByOption(courses: GlobalCourse[], options: FilterOption[], read: (course: GlobalCourse) => Array<string | null | undefined>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const option of options) counts[option.id] = 0;
  for (const course of courses) {
    const storedValues = read(course);
    for (const option of options) {
      if (storedValues.some((stored) => matchesFilterOption(stored, option))) counts[option.id] += 1;
    }
  }
  return counts;
}

/**
 * Facet counts are derived from the courses actually loaded on the page rather
 * than from the raw `level`/`field`/`affiliation` groups returned by
 * `/filter-counts`. Those groups are keyed by the stored spelling, so an
 * option like "Diploma / PCL" never found its own key and rendered no count.
 */
export function buildCourseFilterCounts(courses: GlobalCourse[]): CourseFilterCounts {
  return {
    byAcademic: countByOption(courses, ACADEMIC_LEVEL_OPTIONS, (course) => [course.level]),
    byField: countByOption(courses, FIELD_OPTIONS, (course) => [course.fieldOfStudy, course.field]),
    byUniversity: countByOption(courses, UNIVERSITY_OPTIONS, (course) => [
      course.affiliationName,
      course.nonUniversityAffiliation,
    ]),
    byProvider: {},
    byDuration: {},
  };
}
