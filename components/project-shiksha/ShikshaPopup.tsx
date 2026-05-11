"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectShikshaPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<{ id: number; image_url: string; link_url: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${API_BASE}/api/v1/system/ads?page=landing&position=popup`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const ad = json.data[0];
          const resolveImg = (u: string) => u.startsWith("/uploads") ? `${API_BASE}${u}` : u;
          setPopupData({ id: ad.id, image_url: resolveImg(ad.image_url), link_url: ad.link_url });

          const dismissed = sessionStorage.getItem(`popup_dismissed_${ad.id}`);
          if (!dismissed) {
            const timer = setTimeout(() => setIsOpen(true), 200);
            return () => clearTimeout(timer);
          }
        }
      } catch {}
    };
    fetchPopup();
  }, []);

  const trackClick = useCallback(async () => {
    if (!popupData) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${API_BASE}/api/v1/system/ads/${popupData.id}/click`, { method: "POST" });
    } catch {}
  }, [popupData]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      handleClose();
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  if (!isOpen || !popupData) return null;

  const dismissKey = popupData.link_url || "default";
  const bannerStyle = { backgroundImage: 'url("' + popupData.image_url + '")' };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-[min(80vw,500px)] h-[min(80vw,500px)] animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            try { sessionStorage.setItem(`popup_dismissed_${dismissKey}`, "true"); } catch {}
          }}
          className="absolute -top-3 -right-3 text-white bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl cursor-pointer"
          onClick={() => {
            handleClose();
            try { sessionStorage.setItem(`popup_dismissed_${dismissKey}`, "true"); } catch {}
            trackClick();
            router.push(popupData.link_url);
          }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={bannerStyle} />
        </div>
      </div>
    </div>
  );
}
