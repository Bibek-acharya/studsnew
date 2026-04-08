export interface Event {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  image: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  registrationFee: string;
  interestedCount: number;
}

const eventsData: Event[] = [
  {
    id: "1",
    title: "International Scholarship Seminar 2025",
    excerpt: "A comprehensive seminar on fully funded and partial scholarships for Nepalese students.",
    description: "Join us for an informative session about international scholarship opportunities.",
    category: "Seminar",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    organizer: "Studsphere Education",
    location: "Kathmandu, Nepal",
    date: "October 25, 2025",
    time: "10:00 AM - 4:00 PM",
    registrationFee: "Free",
    interestedCount: 245,
  },
  {
    id: "2",
    title: "Tech Career Fair 2025",
    excerpt: "Connect with top tech companies and explore career opportunities in the IT sector.",
    description: "Meet recruiters from leading tech companies and discover your next career move.",
    category: "Job Fair",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    organizer: "Tech Hub Nepal",
    location: "Lalitpur, Nepal",
    date: "November 10, 2025",
    time: "9:00 AM - 5:00 PM",
    registrationFee: "Free",
    interestedCount: 312,
  },
  {
    id: "3",
    title: "National Hackathon 2025",
    excerpt: "48-hour coding challenge to build innovative solutions for real-world problems.",
    description: "Compete with the best minds in Nepal and win exciting prizes.",
    category: "Hackathon",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    organizer: "Code Nepal",
    location: "Bhaktapur, Nepal",
    date: "December 5, 2025",
    time: "6:00 PM - 6:00 PM",
    registrationFee: "Rs. 500",
    interestedCount: 189,
  },
  {
    id: "4",
    title: "Study Abroad Workshop",
    excerpt: "Learn about the application process for universities in USA, UK, and Australia.",
    description: "Expert guidance on SOPs, recommendation letters, and visa processes.",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    organizer: "Global Education Consultancy",
    location: "Pokhara, Nepal",
    date: "November 20, 2025",
    time: "11:00 AM - 3:00 PM",
    registrationFee: "Free",
    interestedCount: 156,
  },
];

export const getAllEvents = (): Event[] => eventsData;

export const getEventById = (id: string): Event | undefined =>
  eventsData.find((event) => event.id === id);

export const getRelatedEvents = (excludeId: string, category: string, limit = 3): Event[] =>
  eventsData
    .filter((e) => e.id !== excludeId)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return b.interestedCount - a.interestedCount;
    })
    .slice(0, limit);
