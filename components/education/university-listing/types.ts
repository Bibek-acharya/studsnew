export interface UniversityData {
  id?: number;
  name: string;
  location: string;
  rating: string;
  type: "Public" | "Private";
  rank: string;
  programs: number;
  colleges: number;
  tags: string[];
  cover?: string;
  website?: string;
}

export type FilterKey = "academic" | "type" | "rating";

export type FiltersState = Record<FilterKey, string[]>;

export const ITEMS_PER_PAGE = 18;
