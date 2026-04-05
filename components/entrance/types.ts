export interface Exam {
  id: string;
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
  status: 'Ongoing' | 'Upcoming' | 'Closing Soon' | 'Closed';
  examDate: string;
  nepaliDate: string;
  imageUrl: string;
}
