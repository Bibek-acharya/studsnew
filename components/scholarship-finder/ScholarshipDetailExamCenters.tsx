"use client";

import { MapPin } from "lucide-react";

export default function ExamCentersTab({ centers }: { centers: any[] }) {
  const rawItems = centers.length > 0 ? centers : [
    { province: "Bagmati Province", city: "Kathmandu", venue: "Advance Academy, Lalitpur", contact: "Mr. Bablu Gupta", phone: "9851131074, 9861116456" },
    { province: "Gandaki Province", city: "Pokhara", venue: "Gandaki College, Mahendrapul", contact: "Mr. Prasanna Dhungel, Mr. Pabin Chhetri", phone: "9801127672, 9856009596" },
    { province: "Lumbini Province", city: "Butwal", venue: "Butwal Campus, Tankasinwa", contact: "Mr. Sushant Acharya, Er. Subodh Regmi", phone: "9749394615, 9851313120" },
    { province: "Koshi Province", city: "Biratnagar", venue: "Koshi College, Main Road", contact: "Mr. Dhiraj Shah", phone: "9827329145" },
    { province: "Sudurpashchim Province", city: "Kailali", venue: "Seti College, Dhangadhi", contact: "Mr. Jay Dhami", phone: "9868742691" },
    { province: "Madhesh Province", city: "Lahan", venue: "Janak Education Center", contact: "Mr. Aashish Chaudhary, Mr. Shiv Yadav", phone: "9818378642, 9861969297" },
    { province: "Madhesh Province", city: "Birgunj", venue: "Narayani Academy, Ghantaghar", contact: "Mr. Anurag Gupta, Mr. Prabhat Kumar", phone: "9844000111, 9801230707" },
  ];

  const extractMapLink = (raw: string): string => {
    if (!raw) return "";
    const trimmed = raw.trim();
    const srcMatch = trimmed.match(/<iframe[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/i);
    if (srcMatch) return srcMatch[1];
    return trimmed;
  };

  const items = rawItems.map((c: any) => ({
    province: c.province || "",
    headerColor: c.headerColor || c.headerColor_ || "",
    info: c.info || "",
    centerName: c.centerName || c.center_name || c.city || c.venue || "",
    venue: c.venue || "",
    contact: c.contactPerson || c.contact_person || c.contact || "",
    phone: c.phoneNumber || c.phone_number || c.phone || "",
    mapLink: extractMapLink(c.mapCoordinates || c.map_coordinates || ""),
  }));

  const parseMapCoords = (link: string): string => {
    if (!link) return "";
    // Direct lat,lng coordinates
    const coordMatch = link.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
    if (coordMatch) return coordMatch[0].replace(/\s+/g, "");
    // Google Maps embed URL: !2dLNG!3dLAT or !3dLAT!4dLNG
    const embed2d3d = link.match(/!2d([-+]?\d+\.?\d*)!3d([-+]?\d+\.?\d*)/);
    if (embed2d3d) return `${embed2d3d[2]},${embed2d3d[1]}`;
    const embed3d4d = link.match(/!3d([-+]?\d+\.?\d*)!4d([-+]?\d+\.?\d*)/);
    if (embed3d4d) return `${embed3d4d[1]},${embed3d4d[2]}`;
    // /@lat,lng,zoom in Google Maps URLs
    const atMatch = link.match(/[@/]([-+]?\d+\.?\d*),\s*([-+]?\d+\.?\d*)/);
    if (atMatch) return `${atMatch[1]},${atMatch[2]}`;
    // ?q=lat,lng or &q=lat,lng or /place/name/@lat,lng
    const qMatch = link.match(/[?&]q=([-+]?\d+\.?\d*),\s*([-+]?\d+\.?\d*)/);
    if (qMatch) return `${qMatch[1]},${qMatch[2]}`;
    // ?ll=lat,lng
    const llMatch = link.match(/[?&]ll=([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)/);
    if (llMatch) return `${llMatch[1]},${llMatch[2]}`;
    // ?center=lat,lng
    const centerMatch = link.match(/[?&]center=([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)/);
    if (centerMatch) return `${centerMatch[1]},${centerMatch[2]}`;
    return "";
  };

  const isGoogleMapsUrl = (link: string): boolean => {
    return /(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i.test(link);
  };

  const isEmbedUrl = (link: string): boolean => {
    return /google\.com\/maps\/embed/i.test(link);
  };

  const getMapSrc = (link: string, coords: string): string => {
    if (!link) return "";
    if (isEmbedUrl(link)) return link;
    if (coords) return `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&z=15&output=embed`;
    if (isGoogleMapsUrl(link)) return `https://maps.google.com/maps?q=${encodeURIComponent(link)}&output=embed`;
    return "";
  };

  const getStaticMapUrl = (coords: string): string => {
    if (!coords) return "";
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(coords)}&zoom=15&size=220x130&markers=${encodeURIComponent(coords)},ol-marker`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Exam Centers by Province</h2>
        <p className="mt-1 text-[14px] text-gray-500">Entrance examination will be conducted simultaneously across Nepal</p>
      </div>
      <div className="space-y-6">
        {items.map((center, i) => {
          const coords = parseMapCoords(center.mapLink);
          const mapSrc = getMapSrc(center.mapLink, coords);
          const originalUrl = center.mapLink;
          return (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100">
            <div
              className="px-5 py-4"
              style={center.headerColor ? { backgroundColor: center.headerColor } : { backgroundColor: "#eff6ff" }}
            >
              <h3 className="text-[16px] font-bold" style={{ color: center.headerColor ? "#ffffff" : "#111827" }}>{center.province || center.centerName}</h3>
            </div>
            <div className="flex flex-col gap-4 p-5 md:flex-row">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-gray-900">{center.centerName || center.venue}</h4>
                    {center.venue && center.venue !== center.centerName && (
                      <p className="text-[13px] font-medium text-gray-600">{center.venue}</p>
                    )}
                    {center.info && (
                      <p className="mt-1 text-[13px] text-gray-500">{center.info}</p>
                    )}
                  </div>
                </div>
                {(center.contact || center.phone) && (
                <div>
                  {center.contact && <p className="text-[13px] text-gray-700"><span className="font-semibold">Contact:</span> {center.contact}</p>}
                  {center.phone && <a href={`tel:${center.phone.split(",")[0].trim()}`} className="text-[12px] text-blue-600 hover:underline">{center.phone}</a>}
                </div>
                )}
              </div>
              {originalUrl && (
                <div className="shrink-0 w-full md:w-[220px]">
                  {mapSrc ? (
                    <iframe
                      src={mapSrc}
                      className="h-[130px] w-full rounded-md border border-gray-200"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map for ${center.centerName || center.province}`}
                    />
                  ) : (
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-md border border-gray-200 transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex h-[130px] items-center justify-center bg-gray-100">
                        <div className="flex flex-col items-center gap-1 text-gray-400 transition group-hover:text-blue-600">
                          <MapPin size={28} />
                          <span className="text-[11px] font-semibold">View on Map</span>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
