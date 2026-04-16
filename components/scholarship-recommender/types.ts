export type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StudyMode = "full-time" | "part-time" | "either" | "not-sure";
export type BinaryChoice = "yes" | "no";
export type AcademicScoreType = "gpa" | "percentage" | "";

export interface RecommenderState {
  educationLevel: string;
  studyMode: StudyMode | "";
  academicScoreType: AcademicScoreType;
  academicScore: string;
  fieldOfStudy: string;
  willingEssay: BinaryChoice | "";
  willingInterview: BinaryChoice | "";
  willingGpa: BinaryChoice | "";
  province: string;
  district: string;
  studyLocation: "inside" | "abroad" | "both" | "";
  category: string;
  gender: string;
  income: "below_2" | "2_to_5" | "5_to_10" | "above_10" | "";
  talents: string[];
  achievements: string[];
  involvement: string[];
}

export interface ScholarshipCardItem {
  id: number;
  title: string;
  providerType: string;
  coverage: string;
  deadline: string;
  description: string;
  tagColorClass: string;
}
