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

export interface BreakdownDimension {
  educationLevel: number;
  fieldOfStudy: number;
  location: number;
  financialFit: number;
  studyLocation: number;
  categoryGender: number;
  gpaMatch: number;
  willingness: number;
  talents: number;
  achievements: number;
  profileCompatibility?: number;
}

export interface ScholarshipCardItem {
  id: number;
  title: string;
  providerType: string;
  coverage: string;
  deadline: string;
  description: string;
  tagColorClass: string;
  score?: number;
  breakdown?: BreakdownDimension;
}

export interface RecommenderRequest {
  educationLevel: string;
  studyMode: string;
  academicScoreType: string;
  academicScore: string;
  fieldOfStudy: string;
  willingEssay: string;
  willingInterview: string;
  willingGpa: string;
  province: string;
  district: string;
  studyLocation: string;
  category: string;
  gender: string;
  income: string;
  talents: string[];
  achievements: string[];
  involvement: string[];
}
