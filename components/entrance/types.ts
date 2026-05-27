export interface Exam {
  id: string;
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
  overviewDetails?: { detail: string; information: string }[];
  applicationLink?: string;
  noticeFile?: string;
}
