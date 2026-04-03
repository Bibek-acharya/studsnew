export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  location: string;
  amount: string;
  level: string;
  field: string;
  category: string;
  covers: string;
  deadline: string;
}

export const getAllScholarships = (): Scholarship[] => [
  {
    id: "1",
    title: "National IT Excellence Scholarship (BSc. CSIT)",
    provider: "Tribhuvan University, Nepal",
    location: "Bagmati, Nepal",
    amount: "100% Tuition Waiver",
    level: "Bachelor",
    field: "IT / Computer Science",
    category: "Merit-Based",
    covers: "Tuition",
    deadline: "Aug 15, 2026",
  },
  {
    id: "2",
    title: "Women in Engineering Tech Grant",
    provider: "Kathmandu University",
    location: "Kavre, Nepal",
    amount: "Rs. 50,000 + Hostel",
    level: "Bachelor",
    field: "Engineering",
    category: "Female Only",
    covers: "Hostel & Fees",
    deadline: "This Friday",
  }
];

export const getScholarshipById = (id: string): Scholarship | undefined => {
  return getAllScholarships().find((s) => s.id === id);
};
