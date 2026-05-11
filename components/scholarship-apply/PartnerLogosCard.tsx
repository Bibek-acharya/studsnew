"use client";

import { useEffect, useRef } from "react";

interface PartnerLogo {
  name: string;
  logo: string;
}

export default function PartnerLogosCard({ logos }: { logos: PartnerLogo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || logos.length === 0) return;
    if (window.innerWidth >= 1024) return;

    el.scrollLeft = 0;

    let id: number;
    const tick = () => {
      if (el.scrollWidth <= el.clientWidth) {
        id = requestAnimationFrame(tick);
        return;
      }
      el.scrollBy(1, 0);
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        cancelAnimationFrame(id);
        el.scrollLeft = 0;
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [logos.length]);

  if (!logos || logos.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Our Partners</p>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
        {logos.map((logo, i) => (
          <div key={i} className="h-14 flex items-center justify-center">
            <img src={logo.logo} alt={logo.name} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto lg:hidden" style={{ scrollbarWidth: "none" }}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="shrink-0 w-28 h-14 flex items-center justify-center">
            <img src={logo.logo} alt={logo.name} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
