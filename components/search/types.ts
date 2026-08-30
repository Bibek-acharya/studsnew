export interface SearchResult {
  id: number;
  type: string;
  title: string;
  description: string;
  image: string;
  banner: string;
  logo: string;
  featured: boolean;
  verified: boolean;
  claimed: boolean;
  popular: boolean;
  rating: number;
  reviews: number;
  programs: number;
  colleges: number;
  rank: number;
  institutionType: string;
  location: string;
  university: string;
  nonUniversityAffiliation: string;
  duration: string;
  field: string;
  estFee: string;
  website: string;
  slug: string;
}
