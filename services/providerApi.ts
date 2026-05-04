const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ProviderProfile {
  id: number;
  provider_name: string;
  registration_number?: string;
  email?: string;
  contact_number?: string;
  website_url?: string;
  logo_url?: string;
  address?: string;
  about_text?: string;
  mission?: string;
  values?: string;
  services?: ProviderService[];
  sectors?: ProviderSector[];
  projects?: ProviderProject[];
  gallery?: ProviderGalleryImage[];
  reviews?: ProviderReview[];
  scholarship_count: number;
  news_count: number;
  event_count: number;
  blog_count: number;
}

export interface ProviderService {
  id: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface ProviderSector {
  id: number;
  name: string;
  description: string;
  color: string;
  image_url: string;
  icon: string;
  sort_order: number;
}

export interface ProviderProject {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  sort_order: number;
}

export interface ProviderGalleryImage {
  id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface ProviderReview {
  id: number;
  author_name: string;
  avatar_url: string;
  rating: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  created_at: string;
}

export async function getProviderProfile(id: number): Promise<ProviderProfile> {
  const res = await fetch(`${API_BASE_URL}/api/v1/public/providers/${id}`);
  if (!res.ok) throw new Error("Provider not found");
  const data = await res.json();
  return data.data;
}
