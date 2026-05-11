import { RecommenderState, ScholarshipCardItem } from "./types";

export const initialRecommenderState: RecommenderState = {
  educationLevel: "",
  studyMode: "",
  academicScoreType: "gpa",
  academicScore: "",
  fieldOfStudy: "",
  willingEssay: "",
  willingInterview: "",
  willingGpa: "",
  province: "",
  district: "",
  studyLocation: "",
  category: "",
  gender: "",
  income: "",
  talents: [],
  achievements: [],
  involvement: [],
};

export const recommendations: ScholarshipCardItem[] = [];
