"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProjectShikshaPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("studsphere_scholarship_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem("studsphere_scholarship_dismissed", "true");
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-[min(80vw,500px)] h-[min(80vw,500px)] animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute -top-3 -right-3 text-white bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl cursor-pointer"
          onClick={() => {
            handleClose();
            router.push("/scholarship-apply/project-shiksha");
          }}
        >
          <Image
            src="/test.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      </div>
    </div>
  );
}
