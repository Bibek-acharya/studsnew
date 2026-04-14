export type EntranceFilterState = {
  search: string;
  academicLevel: string[];
  stream: string[];
  status: string[];
  sortBy: string;
  location: string;
  institutionType: string[];
  province: string[];
  district: string[];
  localLevel: string[];
  applicationFee: string[];
  scholarship: string[];
  gpa: string;
};

export const DEFAULT_ENTRANCE_FILTERS: EntranceFilterState = {
  search: "",
  academicLevel: [],
  stream: [],
  status: [],
  sortBy: "popularity",
  location: "",
  institutionType: [],
  province: [],
  district: [],
  localLevel: [],
  applicationFee: [],
  scholarship: [],
  gpa: "",
};

export interface Exam {
  id: string;
  title: string;
  university: string;
  faculty: string;
  status: "Ongoing" | "Upcoming" | "Closing Soon" | "Closed";
  examDate: string;
  nepaliDate: string;
  imageUrl: string;
}

export interface ExamDetails {
  id: string;
  title: string;
  university: string;
  faculty: string;
  status: "Ongoing" | "Upcoming" | "Closing Soon" | "Closed";
  examDate: string;
  nepaliDate: string;
  imageUrl: string;
  registrationStart: string;
  registrationEnd: string;
  examLevel: string;
  duration: string;
  questionType: string;
  description: string;
  conductingBody: string;
  examFrequency: string;
  examMode: string;
  applicationFee: string;
  foreignFee: string;
  applicationSteps: { title: string; description: string }[];
  eligibility: { title: string; description: string }[];
  examPattern: { label: string; value: string }[];
  subjectMarks: { subject: string; marks: number }[];
  modelSets: { title: string; size: string; description: string }[];
  courses: string[];
  admissionSteps: { title: string; description: string }[];
  admitCardInfo: string;
  upcomingDates: { date: string; event: string; status?: string }[];
  pastDates: { date: string; event: string }[];
  faqs: { question: string; answer: string }[];
}
