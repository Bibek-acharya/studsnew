export interface Scholarship {
  id: string | number;
  title: string;
  org: string;
  amount: string;
  location: string;
  locationLat?: number;
  locationLng?: number;
  studyLevel: string;
  deadline: string;
  badgeType: string;
  status: string;
  imageUrl?: string;
  imagePlaceholder?: string;
  courseStream: string;
  providerType: string;
  coverage: string;
  gpaRequirement: string;
  entranceRequired: boolean;
  deadlineType: string;
  specialCategory?: string;
  eligibility?: string;
}

export interface ScholarshipFilters {
  studyLevel?: string[];
  courseStream?: string[];
  location?: string[];
  scholarshipType?: string[];
  providerType?: string[];
  coverage?: string[];
  gpaRequirement?: string[];
  entranceRequired?: boolean[];
  deadlineType?: string[];
  specialCategory?: string[];
  searchQuery?: string;
  userLat?: number;
  userLng?: number;
}

const seedScholarships: Scholarship[] = [
  {
    id: 1,
    title: "Women in Research Scholarship",
    org: "Global Science Alliance",
    amount: "NPR 500,000",
    location: "Pokhara, Nepal",
    locationLat: 28.2096,
    locationLng: 83.9856,
    studyLevel: "+2",
    deadline: "Mar 28, 2026",
    badgeType: "NEED BASED",
    status: "CLOSED",
    imagePlaceholder: "Women in Research Scholarship",
    courseStream: "Science",
    providerType: "NGO",
    coverage: "Full",
    gpaRequirement: "3.0+",
    entranceRequired: false,
    deadlineType: "This Month",
    eligibility: "Female students with 3.0+ GPA in Science stream",
  },
  {
    id: 2,
    title: "Nepal STEM Excellence Grant",
    org: "Tech Nepal Foundation",
    amount: "NPR 400,000",
    location: "Kathmandu, Nepal",
    locationLat: 27.7172,
    locationLng: 85.324,
    studyLevel: "+2",
    deadline: "Apr 10, 2026",
    badgeType: "PARTIAL TUITION",
    status: "CLOSING SOON",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    courseStream: "Science",
    providerType: "NGO",
    coverage: "50%",
    gpaRequirement: "2.5+",
    entranceRequired: true,
    deadlineType: "Ending Soon",
    eligibility: "Science students with minimum 2.5 GPA, must clear entrance exam",
  },
  {
    id: 3,
    title: "College Merit Excellence Award",
    org: "KIST College",
    amount: "NPR 200,000",
    location: "Lalitpur, Nepal",
    locationLat: 27.4421,
    locationLng: 85.2537,
    studyLevel: "+2",
    deadline: "Apr 30, 2026",
    badgeType: "MERIT BASED",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    courseStream: "Management",
    providerType: "College",
    coverage: "75%",
    gpaRequirement: "3.5+",
    entranceRequired: false,
    deadlineType: "This Month",
  },
  {
    id: 4,
    title: "Asian Tech Research Fellowship",
    org: "Kyoto University",
    amount: "¥1,500,000",
    location: "Kyoto, Japan",
    locationLat: 35.0116,
    locationLng: 135.7681,
    studyLevel: "A Level",
    deadline: "Jun 20, 2026",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    courseStream: "IT",
    providerType: "University",
    coverage: "Full",
    gpaRequirement: "3.0+",
    entranceRequired: true,
    deadlineType: "Ongoing",
  },
  {
    id: 5,
    title: "Community Leaders Aid Fund",
    org: "Social Impact NGO",
    amount: "NPR 150,000",
    location: "Kathmandu, Nepal",
    locationLat: 27.7172,
    locationLng: 85.324,
    studyLevel: "A Level",
    deadline: "Apr 05, 2026",
    badgeType: "NEED BASED",
    status: "CLOSING SOON",
    imagePlaceholder: "Community Leaders Aid",
    courseStream: "Humanities",
    providerType: "NGO",
    coverage: "25%",
    gpaRequirement: "No GPA Required",
    entranceRequired: false,
    deadlineType: "Ending Soon",
  },
  {
    id: 6,
    title: "Women in Tech Initiative",
    org: "Oxford University",
    amount: "£25,000 / Year",
    location: "Oxford, UK",
    locationLat: 51.7548,
    locationLng: -1.2544,
    studyLevel: "CTEVT",
    deadline: "Aug 10, 2026",
    badgeType: "FULL TUITION",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
    courseStream: "Engineering",
    providerType: "University",
    coverage: "Full",
    gpaRequirement: "3.0+",
    entranceRequired: true,
    deadlineType: "Ongoing",
  },
  {
    id: 7,
    title: "Future Entrepreneurs Fund",
    org: "Global Business Org",
    amount: "NPR 300,000",
    location: "Kathmandu, Nepal",
    locationLat: 27.7172,
    locationLng: 85.324,
    studyLevel: "CTEVT",
    deadline: "Sep 15, 2026",
    badgeType: "MERIT BASED",
    status: "OPEN",
    imagePlaceholder: "Future Entrepreneurs Fund",
    courseStream: "Management",
    providerType: "Private Organization",
    coverage: "50%",
    gpaRequirement: "2.5+",
    entranceRequired: false,
    deadlineType: "This Month",
  },
  {
    id: 8,
    title: "Creative Arts Scholarship",
    org: "National Arts Council",
    amount: "NPR 250,000",
    location: "Patan, Nepal",
    locationLat: 27.4541,
    locationLng: 85.323,
    studyLevel: "+2",
    deadline: "Oct 10, 2026",
    badgeType: "PARTIAL TUITION",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
    courseStream: "Humanities",
    providerType: "Government",
    coverage: "Tuition Only",
    gpaRequirement: "2.0+",
    entranceRequired: false,
    deadlineType: "Ongoing",
  },
  {
    id: 9,
    title: "Medical Science Grant",
    org: "Health Nepal Foundation",
    amount: "NPR 800,000",
    location: "Chitwan, Nepal",
    locationLat: 27.5322,
    locationLng: 84.3541,
    studyLevel: "A Level",
    deadline: "May 01, 2026",
    badgeType: "NEED BASED",
    status: "CLOSING SOON",
    imagePlaceholder: "Medical Science Grant",
    courseStream: "Medical",
    providerType: "INGO",
    coverage: "Full",
    gpaRequirement: "3.0+",
    entranceRequired: true,
    deadlineType: "Ending Soon",
  },
  {
    id: 10,
    title: "Engineering Innovation Award",
    org: "Tech Institute Nepal",
    amount: "NPR 450,000",
    location: "Pokhara, Nepal",
    locationLat: 28.2096,
    locationLng: 83.9856,
    studyLevel: "CTEVT",
    deadline: "Nov 20, 2026",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    courseStream: "Engineering",
    providerType: "College",
    coverage: "75%",
    gpaRequirement: "3.5+",
    entranceRequired: true,
    deadlineType: "Ongoing",
  },
  {
    id: 11,
    title: "Rural Education Support",
    org: "Himalayan Trust",
    amount: "NPR 100,000",
    location: "Solukhumbu, Nepal",
    locationLat: 27.4167,
    locationLng: 86.5,
    studyLevel: "+2",
    deadline: "Dec 05, 2026",
    badgeType: "NEED BASED",
    status: "OPEN",
    imagePlaceholder: "Rural Education Support",
    courseStream: "Science",
    providerType: "NGO",
    coverage: "25%",
    gpaRequirement: "No GPA Required",
    entranceRequired: false,
    deadlineType: "This Week",
  },
  {
    id: 12,
    title: "Global Leadership Fellowship",
    org: "International Uni",
    amount: "$40,000 / Year",
    location: "New York, USA",
    locationLat: 40.7128,
    locationLng: -74.006,
    studyLevel: "A Level",
    deadline: "Jan 15, 2026",
    badgeType: "FULL TUITION",
    status: "CLOSED",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    courseStream: "Management",
    providerType: "University",
    coverage: "Full",
    gpaRequirement: "3.5+",
    entranceRequired: true,
    deadlineType: "This Month",
  },
  {
    id: 13,
    title: "Environmental Impact Grant",
    org: "Green Earth Foundation",
    amount: "NPR 350,000",
    location: "Kathmandu, Nepal",
    locationLat: 27.7172,
    locationLng: 85.324,
    studyLevel: "CTEVT",
    deadline: "Feb 20, 2027",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    imagePlaceholder: "Environmental Impact Grant",
    courseStream: "Science",
    providerType: "INGO",
    coverage: "50%",
    gpaRequirement: "2.5+",
    entranceRequired: false,
    deadlineType: "Ongoing",
  },
  {
    id: 14,
    title: "Excellence in Humanities",
    org: "National Literacy Trust",
    amount: "NPR 150,000",
    location: "Bhaktapur, Nepal",
    locationLat: 27.5206,
    locationLng: 85.5761,
    studyLevel: "+2",
    deadline: "Mar 10, 2027",
    badgeType: "MERIT BASED",
    status: "CLOSING SOON",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop",
    courseStream: "Humanities",
    providerType: "NGO",
    coverage: "Tuition Only",
    gpaRequirement: "3.0+",
    entranceRequired: false,
    deadlineType: "Ending Soon",
  },
  {
    id: 15,
    title: "Tech Startups Fellowship",
    org: "Silicon Valley Hub",
    amount: "$20,000 / Year",
    location: "San Francisco, USA",
    locationLat: 37.7749,
    locationLng: -122.4194,
    studyLevel: "A Level",
    deadline: "Apr 05, 2027",
    badgeType: "FULL TUITION",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    courseStream: "IT",
    providerType: "Private Organization",
    coverage: "Full",
    gpaRequirement: "3.0+",
    entranceRequired: true,
    deadlineType: "This Month",
  },
  {
    id: 16,
    title: "Public Health Scholarship",
    org: "WHO Affiliates",
    amount: "NPR 500,000",
    location: "Lalitpur, Nepal",
    locationLat: 27.4421,
    locationLng: 85.2537,
    studyLevel: "CTEVT",
    deadline: "May 12, 2027",
    badgeType: "NEED BASED",
    status: "OPEN",
    imagePlaceholder: "Public Health Scholarship",
    courseStream: "Medical",
    providerType: "INGO",
    coverage: "75%",
    gpaRequirement: "2.5+",
    entranceRequired: true,
    deadlineType: "Ongoing",
  },
  {
    id: 17,
    title: "NextGen Innovators Award",
    org: "Global Innovators",
    amount: "NPR 220,000",
    location: "Kathmandu, Nepal",
    studyLevel: "+2",
    deadline: "Jun 15, 2027",
    badgeType: "PARTIAL TUITION",
    status: "CLOSING SOON",
    imagePlaceholder: "NextGen Innovators Award",
    courseStream: "IT",
    providerType: "Private Organization",
    coverage: "50%",
    gpaRequirement: "3.0+",
    entranceRequired: false,
    deadlineType: "Ending Soon",
  },
  {
    id: 18,
    title: "Data Science Fellowship",
    org: "Data Analytics Institute",
    amount: "NPR 400,000",
    location: "Pokhara, Nepal",
    studyLevel: "A Level",
    deadline: "Jul 30, 2027",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    courseStream: "IT",
    providerType: "University",
    coverage: "Full",
    gpaRequirement: "3.5+",
    entranceRequired: true,
    deadlineType: "Ongoing",
  },
];

function calculateDistance(lat1: number, lon1: number, lat2?: number, lon2?: number): number {
  if (!lat2 || !lon2) return Infinity;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function filterScholarships(scholarships: Scholarship[], filters: ScholarshipFilters): Scholarship[] {
  let filtered = scholarships.filter((s) => {
    if (filters.studyLevel?.length && !filters.studyLevel.includes(s.studyLevel)) return false;
    if (filters.courseStream?.length && !filters.courseStream.includes(s.courseStream)) return false;
    if (filters.location?.length && !filters.location.some((loc) => s.location.toLowerCase().includes(loc.toLowerCase()))) return false;
    if (filters.scholarshipType?.length && !filters.scholarshipType.includes(s.badgeType)) return false;
    if (filters.providerType?.length && !filters.providerType.includes(s.providerType)) return false;
    if (filters.coverage?.length && !filters.coverage.includes(s.coverage)) return false;
    if (filters.gpaRequirement?.length && !filters.gpaRequirement.includes(s.gpaRequirement)) return false;
    if (filters.deadlineType?.length && !filters.deadlineType.includes(s.deadlineType)) return false;
    if (filters.specialCategory?.length && (!s.specialCategory || !filters.specialCategory.includes(s.specialCategory))) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        s.title.toLowerCase().includes(query) ||
        s.org.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.courseStream.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    return true;
  });

  if (filters.userLat !== undefined && filters.userLng !== undefined) {
    filtered = filtered.map(s => ({
      ...s,
      _distance: calculateDistance(
        filters.userLat!,
        filters.userLng!,
        s.locationLat,
        s.locationLng
      )
    })).sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
  }

  return filtered;
}

export interface ScholarshipListResponse {
  scholarships: Scholarship[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const SCHOLARSHIPS_PER_PAGE = 18;

export const scholarshipApi = {
  async getScholarships(filters: ScholarshipFilters = {}, page: number = 1): Promise<ScholarshipListResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = filterScholarships(seedScholarships, filters);
        const total = filtered.length;
        const totalPages = Math.ceil(total / SCHOLARSHIPS_PER_PAGE);
        const start = (page - 1) * SCHOLARSHIPS_PER_PAGE;
        const paginatedScholarships = filtered.slice(start, start + SCHOLARSHIPS_PER_PAGE);
        
        resolve({
          scholarships: paginatedScholarships,
          pagination: {
            total,
            page,
            pageSize: SCHOLARSHIPS_PER_PAGE,
            totalPages,
          },
        });
      }, 100);
    });
  },

  async getScholarshipDetails(id: string | number): Promise<Scholarship | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const scholarship = seedScholarships.find((s) => s.id === id);
        resolve(scholarship);
      }, 100);
    });
  },

  getSeedScholarships(): Scholarship[] {
    return seedScholarships;
  },
};