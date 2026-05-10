"use client";

import { useState } from "react";
import { Building2, MapPin, Clock, Banknote, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface Volunteer {
  id: number;
  image: string;
  type: string;
  title: string;
  organizer: string;
  location: string;
  deadline: string;
  fee: string;
  feeLabel: string;
  details: { label: string; value: string }[];
  availableDates: string[];
}

const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 1,
    image: "https://i.pinimg.com/1200x/bf/e3/9a/bfe39a414f6a4c4d7fac5ee09ad3d734.jpg",
    type: "Unpaid Volunteer",
    title: "Community Park Cleanup",
    organizer: "Green Earth NGO",
    location: "Central Park, South Gate",
    deadline: "Oct 20, 2026",
    fee: "Free",
    feeLabel: "Free",
    details: [
      { label: "Organizer", value: "Green Earth NGO" },
      { label: "Compensation", value: "Unpaid Volunteer Role" },
      { label: "Application Fee", value: "Free" },
      { label: "Location", value: "Central Park, South Gate" },
      { label: "Application Deadline", value: "October 20, 2026" },
      { label: "Time", value: "9:00 AM - 1:00 PM" },
      { label: "Requirements", value: "Please wear comfortable clothes and closed-toe shoes. Bring a reusable water bottle." },
      { label: "Perks", value: "Free lunch provided at 1:00 PM for all volunteers. A certificate of participation will be issued upon request." },
    ],
    availableDates: ["2026-06-07", "2026-06-08", "2026-06-09", "2026-06-10", "2026-06-11", "2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    type: "Unpaid Volunteer",
    title: "Youth Mentorship Program",
    organizer: "Teach for Nepal",
    location: "Lalitpur, Nepal",
    deadline: "Nov 15, 2026",
    fee: "Free",
    feeLabel: "Free",
    details: [
      { label: "Organizer", value: "Teach for Nepal" },
      { label: "Compensation", value: "Unpaid Volunteer Role" },
      { label: "Application Fee", value: "Free" },
      { label: "Location", value: "Lalitpur, Nepal" },
      { label: "Application Deadline", value: "November 15, 2026" },
      { label: "Time", value: "Flexible" },
      { label: "Requirements", value: "Must be 18+ with strong communication skills." },
      { label: "Perks", value: "Mentorship training certificate and networking opportunities." },
    ],
    availableDates: ["2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04", "2026-07-05"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    type: "Paid Volunteer",
    title: "Digital Literacy Trainer",
    organizer: "Digital Nepal Foundation",
    location: "Kathmandu, Nepal",
    deadline: "Dec 1, 2026",
    fee: "Free",
    feeLabel: "Free",
    details: [
      { label: "Organizer", value: "Digital Nepal Foundation" },
      { label: "Compensation", value: "Stipend Provided" },
      { label: "Application Fee", value: "Free" },
      { label: "Location", value: "Kathmandu, Nepal" },
      { label: "Application Deadline", value: "December 1, 2026" },
      { label: "Time", value: "3 hours/day" },
      { label: "Requirements", value: "Basic computer knowledge and teaching experience preferred." },
      { label: "Perks", value: "Monthly stipend of NPR 5,000 and completion certificate." },
    ],
    availableDates: ["2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-15", "2026-08-16"],
  },
];

function DetailsModal({ volunteer, onClose }: { volunteer: Volunteer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-[#0000ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">Event Details</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                {volunteer.details.map((d, i) => (
                  <p key={i}><strong>{d.label}:</strong> {d.value}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" onClick={onClose} className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md w-full max-w-[400px]">
        <img
          src={volunteer.image}
          alt={volunteer.title}
          className="mb-5 h-36 w-full rounded-[12px] object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Volunteer+Event"; }}
        />
        <div className="mb-4 flex items-center">
          <span className="rounded-full bg-[#0000ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            {volunteer.type}
          </span>
        </div>
        <h2 className="mb-4 text-[22px] font-bold leading-tight text-black">{volunteer.title}</h2>
        <div className="mb-5 flex flex-col gap-2.5">
          <div className="flex items-center text-[15px] text-gray-600">
            <Building2 size={18} className="mr-3 shrink-0 text-gray-500" />
            <span>Organized by: <strong className="text-gray-800">{volunteer.organizer}</strong></span>
          </div>
          <div className="flex items-center text-[15px] text-gray-600">
            <MapPin size={18} className="mr-3 shrink-0 text-gray-500" />
            <span>{volunteer.location}</span>
          </div>
          <div className="flex items-center text-[15px] text-gray-600">
            <Clock size={18} className="mr-3 shrink-0 text-gray-500" />
            <span>Registration Deadline: <strong className="font-semibold text-orange-600">{volunteer.deadline}</strong></span>
          </div>
          <div className="flex items-center text-[15px] text-gray-600">
            <Banknote size={18} className="mr-3 shrink-0 text-gray-500" />
            <span>Application Fee: <strong className="text-[#0000ff]">{volunteer.feeLabel}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowDetails(true)} className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-[15px] font-semibold text-[#1e293b] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
            Details
          </button>
          <button onClick={() => router.push(`/volunteer/apply/${volunteer.id}`)} className="flex-[1.2] rounded-lg bg-[#0000ff] py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#0000ff] focus:ring-offset-2">
            Apply Now
          </button>
          <button className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200">
            <Bookmark size={20} />
          </button>
        </div>
      </div>
      {showDetails && <DetailsModal volunteer={volunteer} onClose={() => setShowDetails(false)} />}
    </>
  );
}

export { MOCK_VOLUNTEERS };
export type { Volunteer };
