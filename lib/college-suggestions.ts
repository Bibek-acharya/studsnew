export const collegeSuggestions = [
  "Amrit Science Campus (ASCOL)",
  "Apex College",
  "Asian College of Higher Studies",
  "Birendra Multiple Campus",
  "British College of Higher Studies",
  "Deerwalk Institute of Technology",
  "Global College of Management",
  "Islington College",
  "Kathmandu University",
  "Nepal College of Information Technology (NCIT)",
  "Nepal Engineering College",
  "Patan Multiple Campus",
  "Pokhara University",
  "Pulchowk Campus (IOE)",
  "St. Xavier's College",
  "Thapathali Campus (IOE)",
  "Tribhuvan University",
  "Walnut Dream College",
];

export interface College {
  id: number;
  name: string;
  location?: string;
  type?: string;
  rating?: number;
  reviewCount?: number;
}

export const popularColleges: College[] = [
  { id: 1, name: "Pulchowk Campus (IOE)", location: "Lalitpur", type: "Government", rating: 4.8, reviewCount: 245 },
  { id: 2, name: "Kathmandu University", location: "Dhulikhel", type: "Private", rating: 4.5, reviewCount: 312 },
  { id: 3, name: "Thapathali Campus (IOE)", location: "Kathmandu", type: "Government", rating: 4.4, reviewCount: 189 },
  { id: 4, name: "Amrit Science Campus (ASCOL)", location: "Kathmandu", type: "Government", rating: 4.3, reviewCount: 156 },
  { id: 5, name: "Patan Multiple Campus", location: "Lalitpur", type: "Community", rating: 4.1, reviewCount: 98 },
  { id: 6, name: "Pokhara University", location: "Pokhara", type: "Private", rating: 4.2, reviewCount: 178 },
  { id: 7, name: "Tribhuvan University", location: "Kathmandu", type: "Government", rating: 4.0, reviewCount: 567 },
  { id: 8, name: "Nepal College of Information Technology (NCIT)", location: "Kathmandu", type: "Private", rating: 4.3, reviewCount: 134 },
  { id: 9, name: "Islington College", location: "Kathmandu", type: "Private", rating: 4.2, reviewCount: 112 },
  { id: 10, name: "Deerwalk Institute of Technology", location: "Kathmandu", type: "Private", rating: 4.4, reviewCount: 89 },
  { id: 11, name: "Global College of Management", location: "Kathmandu", type: "Private", rating: 4.1, reviewCount: 76 },
  { id: 12, name: "Apex College", location: "Kathmandu", type: "Private", rating: 4.0, reviewCount: 145 },
  { id: 13, name: "St. Xavier's College", location: "Kathmandu", type: "Private", rating: 4.5, reviewCount: 167 },
  { id: 14, name: "Birendra Multiple Campus", location: "Bharatpur", type: "Community", rating: 3.9, reviewCount: 54 },
  { id: 15, name: "British College of Higher Studies", location: "Kathmandu", type: "Private", rating: 4.2, reviewCount: 98 },
  { id: 16, name: "Asian College of Higher Studies", location: "Kathmandu", type: "Private", rating: 4.0, reviewCount: 67 },
  { id: 17, name: "Nepal Engineering College", location: "Pokhara", type: "Private", rating: 4.1, reviewCount: 89 },
  { id: 18, name: "Walnut Dream College", location: "Kathmandu", type: "Private", rating: 3.8, reviewCount: 45 },
];

export function getCollegesBySearch(query: string): College[] {
  if (!query) return popularColleges;
  const lower = query.toLowerCase();
  return popularColleges.filter(c => 
    c.name.toLowerCase().includes(lower) || 
    c.location?.toLowerCase().includes(lower)
  ).slice(0, 10);
}

export function getCollegeById(id: number): College | undefined {
  return popularColleges.find(c => c.id === id);
}