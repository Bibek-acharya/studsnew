"use client";

import React, { useRef, useState } from "react";

interface EntranceExam {
  id: number;
  name: string;
  location: string;
  deadline: string;
  examDate: string;
  imageUrl: string;
  logoUrl: string;
  applyLink: string;
  whatsappLink: string;
  viberLink: string;
}

const entranceExams: EntranceExam[] = [
  {
    id: 1,
    name: "KIST Science Entrance Exam",
    location: "Maitighar, Kathmandu",
    deadline: "15 July 2026",
    examDate: "5 August 2026",
    imageUrl:
      "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/aeddff223a6b322bbcb719e0a160a721505040b71741944808.jpg",
    logoUrl: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
  {
    id: 2,
    name: "Global Mgmt Entrance Exam",
    location: "Mid-Baneshwor, Kathmandu",
    deadline: "20 July 2026",
    examDate: "12 August 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=GC&background=f17116&color=fff&font-size=0.4",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
  {
    id: 3,
    name: "Trinity A-Levels Entrance",
    location: "Dillibazar, Kathmandu",
    deadline: "10 August 2026",
    examDate: "25 August 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=TC&background=0000ff&color=fff&font-size=0.4",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
  {
    id: 4,
    name: "St. Xavier's Science Entrance",
    location: "Maitighar, Kathmandu",
    deadline: "30 July 2026",
    examDate: "18 August 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=SXC&background=000000&color=fff&font-size=0.4",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
  {
    id: 5,
    name: "KMC Management Entrance",
    location: "Bagbazar, Kathmandu",
    deadline: "5 August 2026",
    examDate: "22 August 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1525926476834-f8b225881c1c?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=KMC&background=ff0000&color=fff&font-size=0.4",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
  {
    id: 6,
    name: "Prasadi Science Entrance",
    location: "Lalitpur, Nepal",
    deadline: "31 August 2026",
    examDate: "15 September 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=PA&background=008000&color=fff&font-size=0.4",
    applyLink: "#",
    whatsappLink: "#",
    viberLink: "#",
  },
];

const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#0040ff"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const ViberIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.665 13.916c-1.378-.853-3.666-.08-4.498.411-.969.572-1.282.684-1.894.275-1.077-.723-2.909-2.613-3.523-3.71-.341-.607-.175-.956.402-1.921.492-.832 1.258-3.084.385-4.463-1.082-1.71-3.14-1.127-4.14-.949-.572.102-1.162.593-1.385 1.157-1.105 2.827-.123 7.558 3.518 11.554 3.738 4.103 8.349 5.228 11.319 4.301.6-.188 1.128-.766 1.25-1.341.218-.99.789-3.05-.904-4.154zm-2.05-6.841c-2.39-2.396-5.836-2.63-6.208-2.651-.433-.024-.766-.395-.742-.828.024-.433.395-.766.828-.742.502.028 4.542.33 7.42 3.214 2.894 2.9 3.197 6.94 3.226 7.447.022.394-.275.731-.665.762h-.077c-.407 0-.75-.32-.771-.73-.023-.418-.288-3.953-2.481-6.143zm-2.228 2.232c-1.321-1.324-3.14-1.557-3.411-1.577-.43-.031-.749-.405-.718-.835.032-.43.405-.749.835-.718.375.027 2.766.335 4.52 2.093 1.767 1.77 2.078 4.17 2.106 4.548.03.43-.291.803-.721.834h-.056c-.412 0-.756-.324-.785-.74-.021-.316-.271-1.89-1.326-3.214z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    <path d="m21 3-9 9" />
    <path d="M15 3h6v6" />
  </svg>
);

const EntranceExamCard: React.FC<{ exam: EntranceExam }> = ({ exam }) => (
  <div className="bg-white rounded-xl border border-gray-200 min-w-[280px] w-[280px] flex-none flex flex-col relative snap-start transition-shadow group">
    <div className="relative h-[120px] w-full flex-none p-3">
      <img
        src={exam.imageUrl}
        alt="College Campus"
        className="w-full h-full object-cover rounded-md"
        draggable={false}
      />
    </div>
    <div className="absolute top-[86px] left-5 bg-white rounded-md h-12 w-12 flex items-center justify-center z-10">
      <img
        src={exam.logoUrl}
        alt="Logo"
        className="w-full h-full object-contain rounded-sm"
        draggable={false}
      />
    </div>

    <div className="px-4 pb-4 pt-5 flex flex-col grow">
      <h3 className="group/title relative text-[17px] font-bold text-gray-900 leading-snug mb-1 flex items-center gap-1 w-full">
        <span className="truncate hover:text-blue-600 cursor-pointer transition-colors">
          {exam.name}
        </span>
        <VerifiedIcon className="w-4.5 h-4.5 shrink-0" />

        <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded shadow-md whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
          {exam.name}
          <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
        </div>
      </h3>
      <p className="text-[13px] text-gray-500 mb-3 flex items-center gap-1">
        <LocationIcon className="w-3.5 h-3.5 shrink-0" />
        {exam.location}
      </p>

      <p className="text-red-600 text-[14px] font-medium mb-1">
        Deadline: {exam.deadline}
      </p>
      <p className="text-gray-700 text-[13px]">Exam Date: {exam.examDate}</p>

      <div className="mt-auto pt-2">
        <div
          className="w-full h-px my-2 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
            backgroundSize: "6px 1px",
          }}
        ></div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
            <span className="font-medium">Join Group:</span>
            <a
              href={exam.whatsappLink}
              className="text-[#25D366] hover:underline transition-all flex items-center gap-1 font-semibold"
              title="Join WhatsApp Group"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={exam.viberLink}
              className="text-[#7360f2] hover:underline transition-all flex items-center gap-1 font-semibold"
              title="Join Viber Group"
            >
              <ViberIcon className="w-3.75 h-3.75" />
              Viber
            </a>
          </div>

          <a
            href={exam.applyLink}
            className="text-blue-600 text-[15px] font-medium inline-flex items-center gap-1.5 hover:text-blue-800 transition-colors"
          >
            Apply Now
            <ArrowRightIcon className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export const EntranceAds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="bg-[#fef7f0] w-full max-w-6xl p-6 md:p-8 rounded-lg border border-orange-50/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Entrance Examination Forms 2026 for the +2
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing items-stretch"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {entranceExams.map((exam) => (
            <EntranceExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </div>
  );
};