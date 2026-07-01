export interface Exam {
  id: string;
  numericId: number;
  slug: string;
  institution: string;
  verified: boolean;
  location: string;
  affiliation: string;
  website: string;
  logo: string;
  title: string;
  tags: { text: string; icon: string; type: string }[];
  deadline: string;
  eligibility: string;
  whatsapp: string;
  viber: string;
  status: string;
  examDate: string;
  nepaliDate: string;
  imageUrl: string;
  phone: string;
  email: string;
  description?: string;
  applicationFee?: string;
  overviewDetails?: { id?: number; detail: string; information: string }[];
  examDateSchedules?: {
    id?: number;
    date: string;
    event: string;
    endDate?: string;
  }[];
  eligibilityList?: { id?: number; title: string; description: string }[];
  applicationSteps?: { id?: number; title: string; description: string }[];
  examPattern?: { id?: number; label: string; value: string }[];
  subjectMarks?: { id?: number; subject: string; marks: string }[];
  modelSets?: {
    id?: number;
    title: string;
    fileUrl?: string;
    description?: string;
  }[];
  upcomingDates?: {
    id?: number;
    date: string;
    event: string;
    endDate?: string;
  }[];
  contactPersons?: {
    id?: number;
    name: string;
    role?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    image?: string;
  }[];
  faqs?: { id?: number; question: string; answer: string }[];
  applicationLink?: string;
  noticeFile?: string;
  notice_file?: string;
}
