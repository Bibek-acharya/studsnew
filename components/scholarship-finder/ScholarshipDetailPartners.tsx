"use client";

import { useMemo } from "react";

export default function PartnersTab({ items, partnerGroups, getImageUrl }: { items: any[]; partnerGroups: any[] | null; getImageUrl: (url: string) => string }) {
  const flatItems = (items && items.length > 0) ? items : [];

  const grouped = useMemo(() => {
    if (partnerGroups && partnerGroups.length > 0 && partnerGroups[0].partners) {
      const limited: { heading: string; partners: { name: string; logo_url: string; website: string }[] }[] = [];
      for (const g of partnerGroups) {
        if (limited.length >= 5) break;
        const heading = g.groupHeading || g.heading || "Partners";
        const partners = (g.partners || []).map((p: any) => ({
          name: p.name || "",
          logo_url: p.logo || p.logo_url || "",
          website: p.website || "",
        })).filter((p: { name: string }) => p.name).slice(0, 6);
        if (partners.length > 0) limited.push({ heading, partners });
      }
      return limited;
    }

    const allFlat = flatItems.map((p: any) => ({
      name: p.name || "",
      logo_url: p.logo_url || p.logo || "",
      website: p.website || "",
    })).filter((p: { name: string }) => p.name).slice(0, 6);
    return allFlat.length > 0 ? [{ heading: "Partners", partners: allFlat }] : [];
  }, [partnerGroups, flatItems]);

  if (grouped.length === 0) return null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Our Partners</h2>
        <p className="mt-1 text-[14px] text-gray-500">Organizations supporting this scholarship</p>
      </div>
      {grouped.map((group, gi) => (
        <div key={gi} className="mb-8">
          {group.heading && <h3 className="mb-4 text-[16px] font-bold text-gray-900">{group.heading}</h3>}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {group.partners.map((p, pi) => {
              const content = (
                <>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                    {p.logo_url ? (
                      <img
                        src={getImageUrl(p.logo_url)}
                        alt={p.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-3xl font-bold text-blue-600">
                        {p.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-600 mt-2 px-1 text-center font-semibold truncate group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </p>
                </>
              );
              const cardClass = "group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm hover:shadow-md transition-all duration-300";
              return p.website ? (
                <a key={pi} href={p.website} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {content}
                </a>
              ) : (
                <div key={pi} className={cardClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
