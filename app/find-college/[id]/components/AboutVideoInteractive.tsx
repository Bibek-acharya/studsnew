"use client";

import React, { useState } from "react";

type CardData = {
  avatar: string;
  title: string;
  quote: string;
  author: string;
  role: string;
  video: string;
};

const cardData: Record<string, CardData> = {
  "Samir Sharma": {
    avatar:
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Industry-Aligned<br/>Curriculum",
    quote:
      '"Our program bridges the gap between theoretical foundations and the practical skills needed in today\'s rapidly evolving tech landscape."',
    author: "Prof. Michael Chen",
    role: "Head of Computer Science",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  "Deepak Khadka": {
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Seamless<br/>Admissions",
    quote:
      '"We ensure a smooth, transparent, and welcoming enrollment process for every prospective student joining our community."',
    author: "Deepak Khadka",
    role: "Admission Head",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  "Basanta Blown": {
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Student-Centric<br/>Support",
    quote:
      '"Guiding students through their academic journey with personalized assistance, care, and continuous mentorship."',
    author: "Basanta Blown",
    role: "Asst Coordinator",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  "Tribendra Timsina": {
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Academic<br/>Excellence",
    quote:
      '"Maintaining rigorous standards in our curriculum to foster critical thinking, innovation, and professional growth."',
    author: "Tribendra Timsina",
    role: "Coordinator",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  "Kush Shrestha": {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Efficient<br/>Operations",
    quote:
      '"Behind every great institution is a dedicated administrative team ensuring smooth and efficient day-to-day operations."',
    author: "Kush Shrestha",
    role: "Administration",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
};

const AboutVideoInteractive: React.FC = () => {
  const [mainKey, setMainKey] = useState("Samir Sharma");
  const [fading, setFading] = useState(false);

  const allKeys = Object.keys(cardData);
  const others = allKeys.filter((k) => k !== mainKey);
  const mainData = cardData[mainKey];

  const handleSwap = (newKey: string) => {
    setFading(true);
    setTimeout(() => {
      setMainKey(newKey);
      setFading(false);
    }, 150);
  };

  return (
    <div className="mx-auto mb-10 flex w-full max-w-212.5 flex-col items-center justify-center gap-6 xl:flex-row xl:gap-8">
      <div className="relative h-[50vh] w-full max-w-125 shrink-0 overflow-hidden rounded-md bg-brand-blue ring-1 ring-gray-200/50 sm:h-85 sm:rounded-md">
        <video
          className="absolute inset-0 h-full w-full bg-brand-blue object-cover transition-opacity duration-300"
          src={mainData.video}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute bottom-5 left-5 z-10 max-w-[70%]">
          <div
            className="flex flex-col rounded-md border border-white/10 bg-black/60 px-4 py-2 text-white backdrop-blur-md sm:px-5 sm:py-3"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
          >
            <span className="text-sm font-semibold tracking-wide sm:text-base">
              {mainKey}
            </span>
            <span className="mt-0.5 text-[10px] font-medium text-gray-300 sm:text-xs">
              {mainData.role}
            </span>
          </div>
        </div>

        <div className="absolute right-5 top-5 z-20 flex max-h-[calc(100%-40px)] flex-col gap-2 overflow-y-auto pb-4 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {others.map((key) => {
            const data = cardData[key];
            return (
              <div
                key={key}
                onClick={() => handleSwap(key)}
                className="group relative h-12.5 w-[70px] shrink-0 cursor-pointer transition-transform sm:h-[55px] sm:w-[85px]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-white bg-brand-blue sm:rounded-md">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    src={data.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[80%] flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-1">
                    <span
                      className="truncate text-[8px] font-bold leading-tight text-white sm:text-[9px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {key}
                    </span>
                    <span
                      className="mt-0.5 truncate text-[6px] font-medium leading-tight text-gray-300 sm:text-[7px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {data.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative h-[50vh] w-full max-w-[280px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-brand-blue p-5 sm:h-[340px] sm:p-6">
        <div
          className={`relative z-10 flex h-full flex-col justify-center transition-opacity duration-150 ${fading ? "opacity-50" : "opacity-100"}`}
        >
          <img
            src={mainData.avatar}
            alt="Avatar"
            className="mb-3 h-12 w-12 rounded-md border border-white/20 object-cover sm:mb-4 sm:h-14 sm:w-14"
          />
          <h2
            dangerouslySetInnerHTML={{ __html: mainData.title }}
            className="mb-2 text-[16px] font-bold leading-tight tracking-tight text-white sm:mb-3 sm:text-[18px]"
          />
          <p className="mb-4 text-[12px] leading-relaxed text-blue-100/80 sm:text-[13px]">
            {mainData.quote}
          </p>
          <div className="mt-auto">
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white sm:text-[12px]">
              {mainData.author}
            </h4>
            <p className="text-[12px] text-blue-200/60">{mainData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutVideoInteractive;