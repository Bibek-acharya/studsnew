import { Exam } from "@/components/entrance/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Request failed");
  }

  return response.json() as Promise<T>;
}

export interface EntranceFilters {
  search?: string;
  academicLevel?: string[];
  stream?: string[];
  status?: string[];
  sortBy?: string;
  location?: string;
  institutionType?: string[];
  province?: string[];
  district?: string[];
  localLevel?: string[];
  applicationFee?: string[];
  scholarship?: string[];
  gpa?: string[];
}

export interface EntrancesResponse {
  data: {
    entrances: Exam[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

export interface EntranceFilterCountsResponse {
  data: {
    total: number;
    academic_level_counts: Record<string, number>;
    stream_counts: Record<string, number>;
    program_counts: Record<string, number>;
    university_counts: Record<string, number>;
    status_counts: Record<string, number>;
  };
}

export interface EntranceDetailsResponse {
  data: Exam;
}

const SEEDED_EXAMS: Exam[] = [
  {
    id: "ioe-be-2081",
    institution: "Tribhuvan University - IOE",
    verified: true,
    location: "Pulchowk Campus, Lalitpur",
    affiliation: "TU - Institute of Engineering",
    website: "ioe.edu.np",
    logo: "https://placehold.co/64x64/0000FF/ffffff?text=IOE",
    title: "IOE BE/B.Arch Entrance Exam 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Offline", icon: "building", type: "default" },
      { text: "National", icon: "globe", type: "default" },
    ],
    deadline: "Jestha 5, 2082",
    eligibility: "+2 Science (Min 45%)",
    whatsapp: "https://wa.me/9779841234567",
    viber: "viber://chat?number=9779841234567",
    status: "Ongoing",
    examDate: "Jestha 15, 2082",
    nepaliDate: "Jestha 15, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cee-medical-2081",
    institution: "Medical Education Commission",
    verified: true,
    location: "Kathmandu",
    affiliation: "Ministry of Health & Education",
    website: "mec.gov.np",
    logo: "https://placehold.co/64x64/00a844/ffffff?text=MEC",
    title: "Common Entrance Examination (CEE) for Medical 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Jestha 30, 2082",
    eligibility: "+2 Science (Min 50% in PCB)",
    whatsapp: "https://wa.me/9779847654321",
    viber: "viber://chat?number=9779847654321",
    status: "Ongoing",
    examDate: "Asar 10, 2082",
    nepaliDate: "Asar 10, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cmat-tu-2081",
    institution: "Tribhuvan University - FoM",
    verified: true,
    location: "Kirtipur, Kathmandu",
    affiliation: "TU - Faculty of Management",
    website: "tu.edu.np",
    logo: "https://placehold.co/64x64/8476F1/ffffff?text=TU",
    title: "CMAT Entrance Exam 2081 (Management)",
    tags: [
      { text: "Upcoming", icon: "trending-up", type: "warning" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Bhadra 15, 2082",
    eligibility: "+2 in any stream (Min 45%)",
    whatsapp: "https://wa.me/9779812345678",
    viber: "viber://chat?number=9779812345678",
    status: "Upcoming",
    examDate: "Bhadra 25, 2082",
    nepaliDate: "Bhadra 25, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1454165833767-1316b344249a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ku-uumat-2081",
    institution: "Kathmandu University",
    verified: true,
    location: "Dhulikhel, Kavrepalanchok",
    affiliation: "KU - School of Engineering",
    website: "ku.edu.np",
    logo: "https://placehold.co/64x64/1E88E5/ffffff?text=KU",
    title: "KU UMAT Entrance Exam 2081",
    tags: [
      { text: "Upcoming", icon: "trending-up", type: "warning" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Shrawan 30, 2082",
    eligibility: "+2 Science (Min 50%)",
    whatsapp: "https://wa.me/9779812345679",
    viber: "viber://chat?number=9779812345679",
    status: "Upcoming",
    examDate: "Ashoj 10, 2082",
    nepaliDate: "Ashoj 10, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "gate-2026",
    institution: "National Admission Center",
    verified: true,
    location: "Kathmandu",
    affiliation: "Government of Nepal",
    website: "nac.edu.np",
    logo: "https://placehold.co/64x64/E53935/ffffff?text=NAC",
    title: "GATE Examination 2026",
    tags: [
      { text: "Closing Soon", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Chaitra 20, 2082",
    eligibility: "Bachelor in Engineering",
    whatsapp: "https://wa.me/9779812345680",
    viber: "viber://chat?number=9779812345680",
    status: "Closing Soon",
    examDate: "Chaitra 28, 2082",
    nepaliDate: "Chaitra 28, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1509004714953-1558f221d5d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "iast-nepal-2081",
    institution: "Institute of Advanced Studies",
    verified: true,
    location: "Lazimpat, Kathmandu",
    affiliation: "Private Institute",
    website: "iast.edu.np",
    logo: "https://placehold.co/64x64/7B1FA2/ffffff?text=IAST",
    title: "IAST Scholarship Entrance 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Baishakh 15, 2083",
    eligibility: "+2 or equivalent (Min 60%)",
    whatsapp: "https://wa.me/9779812345681",
    viber: "viber://chat?number=9779812345681",
    status: "Ongoing",
    examDate: "Baishakh 25, 2083",
    nepaliDate: "Baishakh 25, 2083 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df8ef5d5b07?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ctevt-tech-entrance",
    institution: "CTEVT",
    verified: true,
    location: "Baneshwor, Kathmandu",
    affiliation: "Council for Technical Education & Vocational Training",
    website: "ctevt.gov.np",
    logo: "https://placehold.co/64x64/FF9800/ffffff?text=CTEVT",
    title: "CTEVT Technical Entrance Exam",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Ashad 30, 2082",
    eligibility: "SEE passed or equivalent",
    whatsapp: "https://wa.me/9779812345682",
    viber: "viber://chat?number=9779812345682",
    status: "Ongoing",
    examDate: "Shrawan 5, 2082",
    nepaliDate: "Shrawan 5, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd9b2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "loe-entrance-2081",
    institution: "Lumbini Buddhist University",
    verified: true,
    location: "Lumbini, Rupandehi",
    affiliation: "LBU",
    website: "lbu.edu.np",
    logo: "https://placehold.co/64x64/8BC34A/ffffff?text=LBU",
    title: "LOE Entrance Exam 2081",
    tags: [
      { text: "Upcoming", icon: "trending-up", type: "warning" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Shrawan 15, 2082",
    eligibility: "+2 in any stream",
    whatsapp: "https://wa.me/9779812345683",
    viber: "viber://chat?number=9779812345683",
    status: "Upcoming",
    examDate: "Shrawan 25, 2082",
    nepaliDate: "Shrawan 25, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf1f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "poa-entrance-2081",
    institution: "Pokhara University",
    verified: true,
    location: "Pokhara, Kaski",
    affiliation: "PU - School of Engineering",
    website: "pu.edu.np",
    logo: "https://placehold.co/64x64/00BCD4/ffffff?text=PU",
    title: "Pokhara University Entrance Exam 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Ashoj 1, 2082",
    eligibility: "+2 Science or Diploma",
    whatsapp: "https://wa.me/9779812345684",
    viber: "viber://chat?number=9779812345684",
    status: "Ongoing",
    examDate: "Ashoj 15, 2082",
    nepaliDate: "Ashoj 15, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1564981797816-2c93a350427e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mba-central-2081",
    institution: "Central College of Business",
    verified: false,
    location: "New Baneshwor, Kathmandu",
    affiliation: "Private College",
    website: "centralcollege.edu.np",
    logo: "https://placehold.co/64x64/9C27B0/ffffff?text=CCB",
    title: "Central MBA Entrance 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Chaitra 1, 2082",
    eligibility: "Bachelor degree (Min 45%)",
    whatsapp: "https://wa.me/9779812345685",
    viber: "viber://chat?number=9779812345685",
    status: "Ongoing",
    examDate: "Chaitra 10, 2082",
    nepaliDate: "Chaitra 10, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1556761175-4b46aebe7c04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ncel-entrance",
    institution: "Nepal Council of Engineering",
    verified: true,
    location: "Thamel, Kathmandu",
    affiliation: "Professional Body",
    website: "ncel.org.np",
    logo: "https://placehold.co/64x64/795548/ffffff?text=NCEL",
    title: "NCEL Engineering Entrance 2081",
    tags: [
      { text: "Closing Soon", icon: "flame", type: "alert" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Baishakh 1, 2083",
    eligibility: "+2 Science or Diploma in Engineering",
    whatsapp: "https://wa.me/9779812345686",
    viber: "viber://chat?number=9779812345686",
    status: "Closing Soon",
    examDate: "Baishakh 10, 2083",
    nepaliDate: "Baishakh 10, 2083 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bph-entrance-2081",
    institution: "B.P. Koirala Institute of Health Sciences",
    verified: true,
    location: "Dharan, Sunsari",
    affiliation: "BPKIHS",
    website: "bpkhis.edu.np",
    logo: "https://placehold.co/64x64/D32F2F/ffffff?text=BPK",
    title: "BPKIHS BPH Entrance Exam 2081",
    tags: [
      { text: "Upcoming", icon: "trending-up", type: "warning" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Magh 15, 2082",
    eligibility: "+2 Science (PCB min 50%)",
    whatsapp: "https://wa.me/9779812345687",
    viber: "viber://chat?number=9779812345687",
    status: "Upcoming",
    examDate: "Falgun 1, 2082",
    nepaliDate: "Falgun 1, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd5a9d6774?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "acs-entrance-2081",
    institution: "Academy of Career Studies",
    verified: false,
    location: "Koteshwor, Kathmandu",
    affiliation: "Private Institute",
    website: "acs.edu.np",
    logo: "https://placehold.co/64x64/3F51B5/ffffff?text=ACS",
    title: "ACS Entrance Scholarship Test 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Jestha 20, 2083",
    eligibility: "SEE passed (Min GPA 2.5)",
    whatsapp: "https://wa.me/9779812345688",
    viber: "viber://chat?number=9779812345688",
    status: "Ongoing",
    examDate: "Jestha 30, 2083",
    nepaliDate: "Jestha 30, 2083 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1523240795613-b5897db862b1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ku-mmat-2081",
    institution: "Kathmandu University",
    verified: true,
    location: "Dhulikhel, Kavrepalanchok",
    affiliation: "KU - School of Management",
    website: "ku.edu.np/management",
    logo: "https://placehold.co/64x64/1E88E5/ffffff?text=KUM",
    title: "KU MMAT (MBA) Entrance 2081",
    tags: [
      { text: "Closing Soon", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Chaitra 15, 2082",
    eligibility: "Bachelor degree (Min 45%)",
    whatsapp: "https://wa.me/9779812345689",
    viber: "viber://chat?number=9779812345689",
    status: "Closing Soon",
    examDate: "Chaitra 25, 2082",
    nepaliDate: "Chaitra 25, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1553871374-c8fe51d1f8b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nibm-entrance",
    institution: "National Institute of Business Management",
    verified: true,
    location: "Golfutar, Kathmandu",
    affiliation: "NIBM",
    website: "nibm.edu.np",
    logo: "https://placehold.co/64x64/607D8B/ffffff?text=NIBM",
    title: "NIBM Entrance Exam 2081",
    tags: [
      { text: "Upcoming", icon: "trending-up", type: "warning" },
      { text: "Offline", icon: "building", type: "default" },
    ],
    deadline: "Shrawan 20, 2082",
    eligibility: "+2 in any stream",
    whatsapp: "https://wa.me/9779812345690",
    viber: "viber://chat?number=9779812345690",
    status: "Upcoming",
    examDate: "Shrawan 30, 2082",
    nepaliDate: "Shrawan 30, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "peb-entrance-2081",
    institution: "Purwanchal Engineering College",
    verified: false,
    location: "Birtamod, Jhapa",
    affiliation: "Private College",
    website: "peb.edu.np",
    logo: "https://placehold.co/64x64/FF5722/ffffff?text=PEB",
    title: "PEB Engineering Entrance 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Asar 1, 2082",
    eligibility: "+2 Science (Min 40%)",
    whatsapp: "https://wa.me/9779812345691",
    viber: "viber://chat?number=9779812345691",
    status: "Ongoing",
    examDate: "Asar 15, 2082",
    nepaliDate: "Asar 15, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb09f182b85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hce-horizontal-2081",
    institution: "Himalayan College of Engineering",
    verified: true,
    location: "Sankhamul, Kathmandu",
    affiliation: "IOE Affiliated",
    website: "hce.edu.np",
    logo: "https://placehold.co/64x64/009688/ffffff?text=HCE",
    title: "HCE Entrance & Scholarship Test 2081",
    tags: [
      { text: "Ongoing", icon: "flame", type: "alert" },
      { text: "Online", icon: "monitor", type: "success" },
    ],
    deadline: "Magh 25, 2082",
    eligibility: "+2 Science or Diploma",
    whatsapp: "https://wa.me/9779812345692",
    viber: "viber://chat?number=9779812345692",
    status: "Ongoing",
    examDate: "Falgun 5, 2082",
    nepaliDate: "Falgun 5, 2082 (BS)",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b825788f?auto=format&fit=crop&w=800&q=80",
  },
];

export const entranceService = {
  async getEntrances(
    filters: EntranceFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<EntrancesResponse> {
    try {
      return await apiRequest<EntrancesResponse>("/api/v1/entrances", {
        method: "POST",
        body: JSON.stringify({ ...filters, page, pageSize }),
      });
    } catch (error) {
      console.warn("API unavailable, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filtered = [...SEEDED_EXAMS];

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(search) ||
            e.institution.toLowerCase().includes(search) ||
            e.location.toLowerCase().includes(search) ||
            e.affiliation.toLowerCase().includes(search)
        );
      }

      if (filters.academicLevel?.length) {
        filtered = filtered.filter((e) =>
          filters.academicLevel?.some((level) => {
            if (level === "plus2") return /\+2|higher secondary|intermediate|class 12|neb/i.test(e.eligibility);
            if (level === "bachelor")
              return /bachelor|bsc|bba|be|entrance|cmat|cee/i.test(e.title);
            if (level === "master") return /master|mba|mbs|msc|ma/i.test(e.title);
            if (level === "diploma") return /diploma|ctevt|pcl/i.test(e.eligibility);
            return true;
          })
        );
      }

      if (filters.stream?.length) {
        filtered = filtered.filter((e) =>
          filters.stream?.some(
            (s) =>
              e.title.toLowerCase().includes(s.toLowerCase()) ||
              e.affiliation.toLowerCase().includes(s.toLowerCase())
          )
        );
      }

      if (filters.status?.length) {
        filtered = filtered.filter((e) =>
          filters.status?.includes(e.status.toLowerCase())
        );
      }

      return {
        data: {
          entrances: filtered,
          total: filtered.length,
          page,
          pageSize,
        },
      };
    }
  },

  async getEntranceFilterCounts(): Promise<EntranceFilterCountsResponse> {
    try {
      return await apiRequest<EntranceFilterCountsResponse>("/api/v1/entrances/filter-counts");
    } catch (error) {
      console.warn("API unavailable, using mock filter counts:", error);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const countByField = (field: keyof Exam, values: string[]): Record<string, number> => {
        const counts: Record<string, number> = {};
        values.forEach((v) => {
          counts[v] = SEEDED_EXAMS.filter((e) => {
            const fieldValue = String(e[field]).toLowerCase();
            return fieldValue.includes(v.toLowerCase());
          }).length;
        });
        return counts;
      };

      return {
        data: {
          total: SEEDED_EXAMS.length,
          academic_level_counts: {
            plus2: SEEDED_EXAMS.filter((e) =>
              /\+2|higher secondary|intermediate|class 12|neb/i.test(e.eligibility)
            ).length,
            bachelor: SEEDED_EXAMS.filter((e) =>
              /bachelor|bsc|bba|be|entrance|cmat|cee/i.test(e.title)
            ).length,
            master: SEEDED_EXAMS.filter((e) =>
              /master|mba|mbs|msc|ma/i.test(e.title)
            ).length,
            diploma: SEEDED_EXAMS.filter((e) =>
              /diploma|ctevt|pcl/i.test(e.eligibility)
            ).length,
          },
          stream_counts: countByField("affiliation", [
            "science",
            "management",
            "medical",
            "computer",
            "humanities",
          ]),
          program_counts: countByField("title", [
            "ioe",
            "cee",
            "cmat",
            "kuummat",
            "gate",
          ]),
          university_counts: countByField("institution", [
            "tu",
            "ku",
            "pu",
            "purbanchal",
            "mec",
          ]),
          status_counts: {
            ongoing: SEEDED_EXAMS.filter((e) => e.status === "Ongoing").length,
            upcoming: SEEDED_EXAMS.filter((e) => e.status === "Upcoming").length,
            "closing soon": SEEDED_EXAMS.filter((e) => e.status === "Closing Soon").length,
          },
        },
      };
    }
  },

  async getEntranceById(id: string): Promise<EntranceDetailsResponse> {
    try {
      return await apiRequest<EntranceDetailsResponse>(`/api/v1/entrances/${id}`);
    } catch (error) {
      console.warn("API unavailable, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const exam = SEEDED_EXAMS.find((e) => e.id === id);
      if (!exam) {
        throw new Error("Entrance not found");
      }
      return { data: exam };
    }
  },
};