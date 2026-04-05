export type EntranceFilterState = {
  search: string;
  academicLevel: string[];
  stream: string[];
  programName: string[];
  university: string[];
  status: string[];
  quick: string[];
  sortBy: string;
};

export const DEFAULT_ENTRANCE_FILTERS: EntranceFilterState = {
  search: "",
  academicLevel: [],
  stream: [],
  programName: [],
  university: [],
  status: [],
  quick: [],
  sortBy: "popularity",
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
