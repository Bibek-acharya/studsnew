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

const blogsData: Blog[] = [
  {
    id: "1",
    title: "Important Notice: Revised Counseling Schedule for IOE Admission 2024",
    excerpt: "The Institute of Engineering (IOE) has announced a revised schedule for the upcoming counseling sessions. All candidates are advised to review the updated dates and prepare accordingly.",
    content: "The Institute of Engineering (IOE) has officially announced a revised schedule for the counseling sessions related to the 2024 admission cycle. This change affects all candidates who have successfully cleared the entrance examination.\n\nThe counseling process will now be conducted in multiple rounds to ensure a smooth and efficient seat allocation process. Candidates are required to bring their original documents, including academic transcripts, citizenship certificate, and entrance scorecard.\n\nIt is strongly recommended that all applicants review the updated schedule carefully and mark their calendars. Failure to appear during the designated time slot may result in forfeiture of the allocated seat.",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "Studsphere Team",
    authorAvatar: "Studsphere",
    tags: ["IOE", "Admission", "Counseling", "Schedule"],
  },
  {
    id: "2",
    title: "Top 10 Scholarships for Nepalese Students in 2025",
    excerpt: "A comprehensive guide to the best scholarship opportunities available for Nepalese students pursuing higher education abroad.",
    content: "Studying abroad can be financially challenging, but numerous scholarships are available to support talented Nepalese students. This guide covers the top 10 scholarships you should apply for in 2025.\n\nFrom fully funded government scholarships to university-specific awards, there are options for every academic profile. Make sure to check eligibility criteria and application deadlines carefully.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "Education Desk",
    authorAvatar: "Education",
    tags: ["Scholarship", "Study Abroad", "Funding"],
  },
  {
    id: "3",
    title: "How to Prepare for IOE Entrance Exam: A Complete Guide",
    excerpt: "Expert tips and strategies to crack the IOE entrance examination and secure admission to top engineering colleges in Nepal.",
    content: "The IOE entrance exam is one of the most competitive examinations in Nepal. With thousands of aspirants competing for limited seats, proper preparation is key to success.\n\nThis guide covers everything from syllabus breakdown to time management strategies, recommended books, and practice test resources.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    author: "Exam Prep Team",
    authorAvatar: "ExamPrep",
    tags: ["IOE", "Entrance", "Preparation", "Engineering"],
  },
  {
    id: "4",
    title: "Student Life at Kathmandu University: What to Expect",
    excerpt: "An inside look at campus life, extracurricular activities, and academic culture at one of Nepal's premier universities.",
    content: "Kathmandu University offers a vibrant campus life that goes beyond academics. From technical clubs to cultural festivals, students have numerous opportunities to grow and explore.",
    category: "Student Life",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    author: "Campus Reporter",
    authorAvatar: "Campus",
    tags: ["KU", "Campus Life", "Nepal"],
  },
  {
    id: "1",
    title: "Important Notice: Revised Counseling Schedule for IOE Admission 2024",
    excerpt: "The Institute of Engineering (IOE) has announced a revised schedule for the upcoming counseling sessions. All candidates are advised to review the updated dates and prepare accordingly.",
    content: "The Institute of Engineering (IOE) has officially announced a revised schedule for the counseling sessions related to the 2024 admission cycle. This change affects all candidates who have successfully cleared the entrance examination.\n\nThe counseling process will now be conducted in multiple rounds to ensure a smooth and efficient seat allocation process. Candidates are required to bring their original documents, including academic transcripts, citizenship certificate, and entrance scorecard.\n\nIt is strongly recommended that all applicants review the updated schedule carefully and mark their calendars. Failure to appear during the designated time slot may result in forfeiture of the allocated seat.",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "Studsphere Team",
    authorAvatar: "Studsphere",
    tags: ["IOE", "Admission", "Counseling", "Schedule"],
  },
  {
    id: "2",
    title: "Top 10 Scholarships for Nepalese Students in 2025",
    excerpt: "A comprehensive guide to the best scholarship opportunities available for Nepalese students pursuing higher education abroad.",
    content: "Studying abroad can be financially challenging, but numerous scholarships are available to support talented Nepalese students. This guide covers the top 10 scholarships you should apply for in 2025.\n\nFrom fully funded government scholarships to university-specific awards, there are options for every academic profile. Make sure to check eligibility criteria and application deadlines carefully.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "Education Desk",
    authorAvatar: "Education",
    tags: ["Scholarship", "Study Abroad", "Funding"],
  },
  {
    id: "3",
    title: "How to Prepare for IOE Entrance Exam: A Complete Guide",
    excerpt: "Expert tips and strategies to crack the IOE entrance examination and secure admission to top engineering colleges in Nepal.",
    content: "The IOE entrance exam is one of the most competitive examinations in Nepal. With thousands of aspirants competing for limited seats, proper preparation is key to success.\n\nThis guide covers everything from syllabus breakdown to time management strategies, recommended books, and practice test resources.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    author: "Exam Prep Team",
    authorAvatar: "ExamPrep",
    tags: ["IOE", "Entrance", "Preparation", "Engineering"],
  },
  {
    id: "4",
    title: "Student Life at Kathmandu University: What to Expect",
    excerpt: "An inside look at campus life, extracurricular activities, and academic culture at one of Nepal's premier universities.",
    content: "Kathmandu University offers a vibrant campus life that goes beyond academics. From technical clubs to cultural festivals, students have numerous opportunities to grow and explore.",
    category: "Student Life",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    author: "Campus Reporter",
    authorAvatar: "Campus",
    tags: ["KU", "Campus Life", "Nepal"],
  },
  {
    id: "1",
    title: "Important Notice: Revised Counseling Schedule for IOE Admission 2024",
    excerpt: "The Institute of Engineering (IOE) has announced a revised schedule for the upcoming counseling sessions. All candidates are advised to review the updated dates and prepare accordingly.",
    content: "The Institute of Engineering (IOE) has officially announced a revised schedule for the counseling sessions related to the 2024 admission cycle. This change affects all candidates who have successfully cleared the entrance examination.\n\nThe counseling process will now be conducted in multiple rounds to ensure a smooth and efficient seat allocation process. Candidates are required to bring their original documents, including academic transcripts, citizenship certificate, and entrance scorecard.\n\nIt is strongly recommended that all applicants review the updated schedule carefully and mark their calendars. Failure to appear during the designated time slot may result in forfeiture of the allocated seat.",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "Studsphere Team",
    authorAvatar: "Studsphere",
    tags: ["IOE", "Admission", "Counseling", "Schedule"],
  },
  {
    id: "2",
    title: "Top 10 Scholarships for Nepalese Students in 2025",
    excerpt: "A comprehensive guide to the best scholarship opportunities available for Nepalese students pursuing higher education abroad.",
    content: "Studying abroad can be financially challenging, but numerous scholarships are available to support talented Nepalese students. This guide covers the top 10 scholarships you should apply for in 2025.\n\nFrom fully funded government scholarships to university-specific awards, there are options for every academic profile. Make sure to check eligibility criteria and application deadlines carefully.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "Education Desk",
    authorAvatar: "Education",
    tags: ["Scholarship", "Study Abroad", "Funding"],
  },
  {
    id: "3",
    title: "How to Prepare for IOE Entrance Exam: A Complete Guide",
    excerpt: "Expert tips and strategies to crack the IOE entrance examination and secure admission to top engineering colleges in Nepal.",
    content: "The IOE entrance exam is one of the most competitive examinations in Nepal. With thousands of aspirants competing for limited seats, proper preparation is key to success.\n\nThis guide covers everything from syllabus breakdown to time management strategies, recommended books, and practice test resources.",
    category: "Study Tips",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    author: "Exam Prep Team",
    authorAvatar: "ExamPrep",
    tags: ["IOE", "Entrance", "Preparation", "Engineering"],
  },
  {
    id: "4",
    title: "Student Life at Kathmandu University: What to Expect",
    excerpt: "An inside look at campus life, extracurricular activities, and academic culture at one of Nepal's premier universities.",
    content: "Kathmandu University offers a vibrant campus life that goes beyond academics. From technical clubs to cultural festivals, students have numerous opportunities to grow and explore.",
    category: "Student Life",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    author: "Campus Reporter",
    authorAvatar: "Campus",
    tags: ["KU", "Campus Life", "Nepal"],
  },
  
];

export const getAllBlogs = (): Blog[] => blogsData;

export const getBlogById = (id: string): Blog | undefined =>
  blogsData.find((blog) => blog.id === id);

export const getRelatedBlogs = (excludeId: string, category: string, limit = 3): Blog[] =>
  blogsData
    .filter((b) => b.id !== excludeId)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return Number(b.id) - Number(a.id);
    })
    .slice(0, limit);
