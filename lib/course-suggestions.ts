export interface Course {
  name: string;
  level: string;
}

export const courseDataByLevel: Record<string, string[]> = {
  "+2 / High School": [
    "Science (Physics, Chemistry, Biology)",
    "Science (Physics, Chemistry, Mathematics)",
    "Management",
    "Humanities",
    "Law",
    "Education",
    "Hotel Management",
    "Agriculture",
  ],
  "Bachelor's Degree": [
    "BCA (Bachelor of Computer Applications)",
    "BSc.CSIT (Computer Science & IT)",
    "BIT (Bachelor in Information Technology)",
    "BIM (Bachelor in Management)",
    "BBA (Bachelor of Business Administration)",
    "BBM (Bachelor in Business Management)",
    "BBS (Bachelor of Business Studies)",
    "BE Civil (Civil Engineering)",
    "BE Computer (Computer Engineering)",
    "BE Electronics (Electronics Engineering)",
    "BE Mechanical (Mechanical Engineering)",
    "MBBS (Bachelor of Medicine & Surgery)",
    "BDS (Bachelor of Dental Surgery)",
    "BSc. Nursing",
    "BPharm (Bachelor of Pharmacy)",
    "BArch (Bachelor of Architecture)",
    "BA (Bachelor of Arts)",
    "BFA (Bachelor of Fine Arts)",
    "BCom (Bachelor of Commerce)",
    "LLB (Bachelor of Laws)",
  ],
  "Master's Degree": [
    "MCA (Master of Computer Applications)",
    "MSc.CSIT (Computer Science & IT)",
    "MBA (Master of Business Administration)",
    "MBS (Master in Business Studies)",
    "ME Computer (Computer Engineering)",
    "ME Civil (Civil Engineering)",
    "ME Electronics (Electronics Engineering)",
    "M.Sc. Physics",
    "M.Sc. Chemistry",
    "M.Sc. Mathematics",
    "M.Sc. Biology",
    "MA (Master of Arts)",
    "MPH (Master of Public Health)",
    "MPharm (Master of Pharmacy)",
    "MSc. Nursing",
    "LLM (Master of Laws)",
    "M.Ed. (Master of Education)",
  ],
  Diploma: [
    "Diploma in Computer Engineering",
    "Diploma in Civil Engineering",
    "Diploma in Electronics Engineering",
    "Diploma in Mechanical Engineering",
    "Diploma in Architecture",
    "Diploma in Agriculture",
    "Diploma in Pharmacy",
    "Diploma in Nursing",
    "Diploma in Hotel Management",
    "Diploma in Fashion Design",
    "Diploma in Graphic Design",
    "Diploma in Multimedia",
  ],
};

export function getCoursesByLevel(level: string): string[] {
  return courseDataByLevel[level] || [];
}

export function getAllLevels(): string[] {
  return Object.keys(courseDataByLevel);
}

export function searchCourses(query: string, level?: string): string[] {
  let courses: string[];
  
  if (level && courseDataByLevel[level]) {
    courses = courseDataByLevel[level];
  } else {
    courses = Object.values(courseDataByLevel).flat();
  }
  
  if (!query) return courses.slice(0, 10);
  
  const lower = query.toLowerCase();
  return courses.filter(c => c.toLowerCase().includes(lower)).slice(0, 10);
}