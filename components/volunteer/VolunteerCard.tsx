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

export default function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const router = useRouter();

  return (
    <div className="rounded-[16px] border border-gray-200 bg-white p-3 transition-all duration-300 w-full max-w-[400px]">
      <img
        src={volunteer.image}
        alt={volunteer.title}
        className="mb-3 h-24 w-full rounded-[12px] object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Volunteer+Event"; }}
      />
      <div className="mb-2 flex items-center">
        <span className="rounded-full bg-[#0000ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {volunteer.type}
        </span>
      </div>
      <h2 className="mb-2 text-[18px] font-bold leading-tight text-black">{volunteer.title}</h2>
      <div className="mb-3 flex flex-col gap-1.5">
        <div className="flex items-center text-[13px] text-gray-600">
          <Building2 size={15} className="mr-2 shrink-0 text-gray-500" />
          <span>Organized by: <strong className="text-gray-800">{volunteer.organizer}</strong></span>
        </div>
        <div className="flex items-center text-[13px] text-gray-600">
          <MapPin size={15} className="mr-2 shrink-0 text-gray-500" />
          <span>{volunteer.location}</span>
        </div>
        <div className="flex items-center text-[13px] text-gray-600">
          <Clock size={15} className="mr-2 shrink-0 text-gray-500" />
          <span>Registration Deadline: <strong className="font-semibold text-orange-600">{volunteer.deadline}</strong></span>
        </div>
        <div className="flex items-center text-[13px] text-gray-600">
          <Banknote size={15} className="mr-2 shrink-0 text-gray-500" />
          <span>Application Fee: <strong className="text-[#0000ff]">{volunteer.feeLabel}</strong></span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => router.push(`/volunteer/${volunteer.id}`)} className="flex-1 h-10 rounded-lg border border-gray-200 bg-white py-2 text-[13px] font-semibold text-[#1e293b] transition-colors hover:bg-gray-50 ">
          Details
        </button>
        <button onClick={() => router.push(`/volunteer/apply/${volunteer.id}`)} className="flex-[1.2] h-10 rounded-lg bg-[#0000ff] py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 hover:cursor-pointer">
          Apply Now
        </button>
        {/* <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 ">
          <Bookmark size={18} />
        </button> */}
      </div>
    </div>
  );
}

export type { Volunteer };
