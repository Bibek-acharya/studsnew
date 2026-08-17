// Sub-types
export interface PersonaItem {
  icon: string;
  title: string;
  shortDesc: string;
}

export interface FeatureItem {
  title: string;
  shortDesc: string;
}

export interface EligibilityRow {
  level: string;
  stream: string;
  eligibility: string[];
  documents: string[];
}

export interface AdmissionStep {
  title: string;
  description: string;
}

export interface SubjectGroup {
  groupName: string;
  description: string;
  subjects: string[];
  careers: string[];
}

export interface FeeItem {
  particular: string;
  amount: string;
  frequency: string;
  notes: string;
}

export interface ScholarshipItem {
  title: string;
  subtitle: string;
  coverage: string;
  requirement: string;
}

export interface FullTimeCourse {
  course: string;
  totalFees: string;
  seats: string;
  startDate: string;
  endDate: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CareerItem {
  title: string;
  icon?: string;
  color?: string;
}

export interface DownloadItem {
  title: string;
  size: string;
  file: string;
}

// Main types
export interface GlobalCourse {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  level: string;
  field: string;
  fieldOfStudy: string;
  affiliationId: number | null;
  affiliationName: string;
  nonUniversityAffiliation: string;
  estFee: string;
  govtFee: string;
  privateFee: string;
  mode: string;
  degreeLabel: string;
  careerPath: string;
  location: string;
  badges: string[];
  highlights: string[];
  about: string[];
  curriculum: any;
  admissions: string[];
  careers: CareerItem[];
  bannerUrl: string;
  whoShouldChoose: PersonaItem[];
  features: FeatureItem[];
  eligibilityRows: EligibilityRow[];
  eligibilityText: string;
  admissionSteps: AdmissionStep[];
  subjectGroups: SubjectGroup[];
  feeItems: FeeItem[];
  feeStructure: string;
  scholarshipDesc: string;
  scholarshipNotes: string;
  scholarships: ScholarshipItem[];
  fullTimeCourses: FullTimeCourse[];
  faqs: FaqItem[];
  downloads: DownloadItem[];
  isGlobal: boolean;
  status: string;
  createdBy: number;
  sourceProgramId: number | null;
  created_at: string;
  updated_at: string;
}

export interface ResolvedCourse {
  id: number;
  title: string;
  duration: string;
  level: string;
  affiliationId: number | null;
  affiliationName: string;
  nonUniversityAffiliation: string;
  description: string;
  bannerUrl: string;
  careers: CareerItem[];
  faqs: FaqItem[];
  eligibilityRows: EligibilityRow[];
  admissionSteps: AdmissionStep[];
  subjectGroups: SubjectGroup[];
  scholarshipDesc: string;
  scholarshipNotes: string;
  scholarships: ScholarshipItem[];
  institutionId: number;
  fee: string;
  eligibility: string;
  capacity: number;
  whoShouldChoose: PersonaItem[];
  features: FeatureItem[];
  fullTimeCourses: FullTimeCourse[];
  feeItems: FeeItem[];
  status: string;
}

export interface CourseOverrides {
  description?: string;
  bannerUrl?: string;
  careers?: CareerItem[];
  faqs?: FaqItem[];
}

export interface InstitutionProgram {
  id: number;
  created_at: string;
  updated_at: string;
  institution_id: number;
  institution_name: string;
  institution_location: string;
  institution_link: string;
  globalCourseId: number;
  globalCourseTitle: string;
  duration: string;
  level: string;
  field: string;
  affiliationName: string;
  nonUniversityAffiliation: string;
  bannerUrl: string;
  fee: string;
  eligibility: string;
  eligibilityText: string;
  feeStructureText: string;
  capacity: number;
  status: string;
  whoShouldChoose: PersonaItem[];
  features: FeatureItem[];
  overrides: CourseOverrides;
  nullifiedFields: string[];
}

export interface CourseApprovalRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  institutionId: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  affiliationId: number | null;
  bannerUrl: string;
  careers: CareerItem[];
  faqs: FaqItem[];
  eligibilityRows: EligibilityRow[];
  admissionSteps: AdmissionStep[];
  subjectGroups: SubjectGroup[];
  scholarshipDesc: string;
  scholarshipNotes: string;
  scholarships: ScholarshipItem[];
  fee: string;
  eligibility: string;
  capacity: number;
  whoShouldChoose: PersonaItem[];
  features: FeatureItem[];
  fullTimeCourses: FullTimeCourse[];
  feeItems: FeeItem[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: number;
  reviewedAt?: string;
  rejectionReason?: string;
}
