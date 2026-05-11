export interface InstitutionCourse {
  id: number;
  name: string;
  level: string;
  duration: string;
  fees: string;
  seats: number;
  status: string;
  source: "institution";
}

const STORAGE_KEY = "institution_courses";

export const getInstitutionCourses = (): InstitutionCourse[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveInstitutionCourse = (course: InstitutionCourse): void => {
  const courses = getInstitutionCourses().filter((c) => c.id !== course.id);
  courses.push(course);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

export const deleteInstitutionCourse = (id: number): void => {
  const courses = getInstitutionCourses().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};
