export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  authorAvatar: string;
  tags: string[];
}

export const getAllBlogs = (): Blog[] => {
  return [];
};

export const getBlogById = (id: string): Blog | undefined => {
  return undefined;
};

export const getRelatedBlogs = (excludeId: string, category: string, limit = 3): Blog[] => {
  return [];
};