export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  source: string;
  tags: string[];
}

const newsData: NewsArticle[] = [
  {
    id: "1",
    title: "TU Announces New Scholarship Programs for Meritorious Students",
    excerpt: "Tribhuvan University has launched three new scholarship programs aimed at supporting meritorious students from underprivileged backgrounds.",
    content: "Tribhuvan University (TU) has officially announced the launch of three new scholarship programs designed to support meritorious students from economically disadvantaged backgrounds. The programs cover full tuition fees, accommodation, and a monthly stipend.\n\nThe scholarships are available for undergraduate and postgraduate programs across various faculties including Science, Management, Humanities, and Engineering.\n\nEligible students can apply through the official TU portal before the deadline. Selection will be based on academic performance, financial need, and an interview process.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "TU Press Office",
    date: "2025-01-15",
    readTime: "4 min",
    source: "Tribhuvan University",
    tags: ["TU", "Scholarship", "Education", "Nepal"],
  },
  {
    id: "2",
    title: "IOE Entrance Exam Date Extended Due to Public Holiday",
    excerpt: "The Institute of Engineering has postponed the upcoming entrance examination by one week following the extended public holiday declaration.",
    content: "The Institute of Engineering (IOE) has announced a one-week extension for the upcoming entrance examination. The decision was made following the government's declaration of an extended public holiday period.\n\nAll registered candidates are advised to check the updated exam schedule on the official IOE website. Admit cards will be reissued with the new dates.\n\nThe IOE has assured candidates that the syllabus and exam pattern remain unchanged.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "IOE Administration",
    date: "2025-01-10",
    readTime: "3 min",
    source: "IOE",
    tags: ["IOE", "Entrance", "Exam", "Schedule"],
  },
  {
    id: "3",
    title: "New AI and Data Science Programs Launched at KU",
    excerpt: "Kathmandu University introduces cutting-edge programs in Artificial Intelligence and Data Science to meet growing industry demand.",
    content: "Kathmandu University (KU) has announced the launch of two new undergraduate programs: B.E. in Artificial Intelligence and B.Sc. in Data Science. These programs are designed to meet the rapidly growing demand for tech professionals in Nepal and abroad.\n\nThe programs feature industry partnerships, hands-on projects, and internship opportunities with leading tech companies.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    author: "KU News Desk",
    date: "2025-01-08",
    readTime: "5 min",
    source: "Kathmandu University",
    tags: ["KU", "AI", "Data Science", "Programs"],
  },
  {
    id: "4",
    title: "Government Announces New Education Policy for Higher Studies",
    excerpt: "The Ministry of Education has unveiled a comprehensive policy framework aimed at reforming higher education in Nepal.",
    content: "The Ministry of Education, Science and Technology has unveiled a new policy framework that aims to transform the higher education landscape in Nepal. Key highlights include standardized credit systems, quality assurance mechanisms, and increased funding for research.\n\nThe policy also introduces provisions for international collaborations and student exchange programs.",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
    author: "Ministry of Education",
    date: "2025-01-05",
    readTime: "6 min",
    source: "Government of Nepal",
    tags: ["Policy", "Education", "Reform", "Nepal"],
  },
  {
    id: "1",
    title: "TU Announces New Scholarship Programs for Meritorious Students",
    excerpt: "Tribhuvan University has launched three new scholarship programs aimed at supporting meritorious students from underprivileged backgrounds.",
    content: "Tribhuvan University (TU) has officially announced the launch of three new scholarship programs designed to support meritorious students from economically disadvantaged backgrounds. The programs cover full tuition fees, accommodation, and a monthly stipend.\n\nThe scholarships are available for undergraduate and postgraduate programs across various faculties including Science, Management, Humanities, and Engineering.\n\nEligible students can apply through the official TU portal before the deadline. Selection will be based on academic performance, financial need, and an interview process.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "TU Press Office",
    date: "2025-01-15",
    readTime: "4 min",
    source: "Tribhuvan University",
    tags: ["TU", "Scholarship", "Education", "Nepal"],
  },
  {
    id: "2",
    title: "IOE Entrance Exam Date Extended Due to Public Holiday",
    excerpt: "The Institute of Engineering has postponed the upcoming entrance examination by one week following the extended public holiday declaration.",
    content: "The Institute of Engineering (IOE) has announced a one-week extension for the upcoming entrance examination. The decision was made following the government's declaration of an extended public holiday period.\n\nAll registered candidates are advised to check the updated exam schedule on the official IOE website. Admit cards will be reissued with the new dates.\n\nThe IOE has assured candidates that the syllabus and exam pattern remain unchanged.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "IOE Administration",
    date: "2025-01-10",
    readTime: "3 min",
    source: "IOE",
    tags: ["IOE", "Entrance", "Exam", "Schedule"],
  },
  {
    id: "3",
    title: "New AI and Data Science Programs Launched at KU",
    excerpt: "Kathmandu University introduces cutting-edge programs in Artificial Intelligence and Data Science to meet growing industry demand.",
    content: "Kathmandu University (KU) has announced the launch of two new undergraduate programs: B.E. in Artificial Intelligence and B.Sc. in Data Science. These programs are designed to meet the rapidly growing demand for tech professionals in Nepal and abroad.\n\nThe programs feature industry partnerships, hands-on projects, and internship opportunities with leading tech companies.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    author: "KU News Desk",
    date: "2025-01-08",
    readTime: "5 min",
    source: "Kathmandu University",
    tags: ["KU", "AI", "Data Science", "Programs"],
  },
  {
    id: "4",
    title: "Government Announces New Education Policy for Higher Studies",
    excerpt: "The Ministry of Education has unveiled a comprehensive policy framework aimed at reforming higher education in Nepal.",
    content: "The Ministry of Education, Science and Technology has unveiled a new policy framework that aims to transform the higher education landscape in Nepal. Key highlights include standardized credit systems, quality assurance mechanisms, and increased funding for research.\n\nThe policy also introduces provisions for international collaborations and student exchange programs.",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
    author: "Ministry of Education",
    date: "2025-01-05",
    readTime: "6 min",
    source: "Government of Nepal",
    tags: ["Policy", "Education", "Reform", "Nepal"],
  },{
    id: "1",
    title: "TU Announces New Scholarship Programs for Meritorious Students",
    excerpt: "Tribhuvan University has launched three new scholarship programs aimed at supporting meritorious students from underprivileged backgrounds.",
    content: "Tribhuvan University (TU) has officially announced the launch of three new scholarship programs designed to support meritorious students from economically disadvantaged backgrounds. The programs cover full tuition fees, accommodation, and a monthly stipend.\n\nThe scholarships are available for undergraduate and postgraduate programs across various faculties including Science, Management, Humanities, and Engineering.\n\nEligible students can apply through the official TU portal before the deadline. Selection will be based on academic performance, financial need, and an interview process.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "TU Press Office",
    date: "2025-01-15",
    readTime: "4 min",
    source: "Tribhuvan University",
    tags: ["TU", "Scholarship", "Education", "Nepal"],
  },
  {
    id: "2",
    title: "IOE Entrance Exam Date Extended Due to Public Holiday",
    excerpt: "The Institute of Engineering has postponed the upcoming entrance examination by one week following the extended public holiday declaration.",
    content: "The Institute of Engineering (IOE) has announced a one-week extension for the upcoming entrance examination. The decision was made following the government's declaration of an extended public holiday period.\n\nAll registered candidates are advised to check the updated exam schedule on the official IOE website. Admit cards will be reissued with the new dates.\n\nThe IOE has assured candidates that the syllabus and exam pattern remain unchanged.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "IOE Administration",
    date: "2025-01-10",
    readTime: "3 min",
    source: "IOE",
    tags: ["IOE", "Entrance", "Exam", "Schedule"],
  },
  {
    id: "3",
    title: "New AI and Data Science Programs Launched at KU",
    excerpt: "Kathmandu University introduces cutting-edge programs in Artificial Intelligence and Data Science to meet growing industry demand.",
    content: "Kathmandu University (KU) has announced the launch of two new undergraduate programs: B.E. in Artificial Intelligence and B.Sc. in Data Science. These programs are designed to meet the rapidly growing demand for tech professionals in Nepal and abroad.\n\nThe programs feature industry partnerships, hands-on projects, and internship opportunities with leading tech companies.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    author: "KU News Desk",
    date: "2025-01-08",
    readTime: "5 min",
    source: "Kathmandu University",
    tags: ["KU", "AI", "Data Science", "Programs"],
  },
  {
    id: "4",
    title: "Government Announces New Education Policy for Higher Studies",
    excerpt: "The Ministry of Education has unveiled a comprehensive policy framework aimed at reforming higher education in Nepal.",
    content: "The Ministry of Education, Science and Technology has unveiled a new policy framework that aims to transform the higher education landscape in Nepal. Key highlights include standardized credit systems, quality assurance mechanisms, and increased funding for research.\n\nThe policy also introduces provisions for international collaborations and student exchange programs.",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80",
    author: "Ministry of Education",
    date: "2025-01-05",
    readTime: "6 min",
    source: "Government of Nepal",
    tags: ["Policy", "Education", "Reform", "Nepal"],
  },
];

export const getAllNews = (): NewsArticle[] => newsData;

export const getNewsById = (id: string): NewsArticle | undefined =>
  newsData.find((article) => article.id === id);

export const getRelatedNews = (excludeId: string, category: string, limit = 3): NewsArticle[] =>
  newsData
    .filter((a) => a.id !== excludeId)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return b.date.localeCompare(a.date);
    })
    .slice(0, limit);
