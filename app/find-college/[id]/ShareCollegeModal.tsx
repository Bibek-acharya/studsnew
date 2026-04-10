"use client";

import React, { useEffect, useState } from "react";

type ShareCollegeModalProps = {
  collegeName: string;
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
};

const ShareCollegeModal: React.FC<ShareCollegeModalProps> = ({
  collegeName,
  isOpen,
  onClose,
  shareUrl,
  shareTitle,
  shareText,
}) => {
  const [copyLabel, setCopyLabel] = useState("Copy link");

  useEffect(() => {
    if (!isOpen) {
      setCopyLabel("Copy link");
    }
  }, [isOpen]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const displayUrl =
    shareUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "") ||
    "example.com/share-link";

  const socialLinks = [
    {
      name: "Facebook",
      icon: "fa-brands fa-facebook-f",
      iconColor: "text-white",
      iconBg: "bg-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Messenger",
      icon: "fa-brands fa-facebook-messenger",
      iconColor: "text-white",
      iconBg: "bg-[#1C88FF]",
      href: `https://m.me/?link=${encodedUrl}`,
    },
    {
      name: "Instagram",
      icon: "fa-brands fa-instagram",
      iconColor: "text-white",
      iconBg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      href: "https://www.instagram.com/",
    },
    {
      name: "WhatsApp",
      icon: "fa-brands fa-whatsapp",
      iconColor: "text-white",
      iconBg: "bg-[#25D366]",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Viber",
      icon: "fa-brands fa-viber",
      iconColor: "text-white",
      iconBg: "bg-[#7360F2]",
      href: `viber://forward?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Snapchat",
      icon: "fa-brands fa-snapchat",
      iconColor: "text-black",
      iconBg: "bg-[#FFFC00]",
      href: "https://www.snapchat.com/",
    },
    {
      name: "Discord",
      icon: "fa-brands fa-discord",
      iconColor: "text-white",
      iconBg: "bg-[#5865F2]",
      href: "https://discord.com/channels/@me",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`mx-auto w-full max-w-[640px] rounded-[20px] border border-[#E5E7EB] bg-[#F8FAFC] shadow-2xl transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <div>
            <h3 className="text-3xl leading-tight font-bold text-gray-900 sm:text-[34px]">
              Share with friends
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
            aria-label="Close share popup"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="mx-7 border-t border-gray-200"></div>

        <div className="px-7 py-5">
          <p className="sr-only">{collegeName}</p>
          <p className="text-xl leading-tight font-medium text-gray-700 sm:text-2xl">
            Share this link via
          </p>

          <div className="mt-6 flex items-center gap-6 overflow-x-auto py-1 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group shrink-0"
                aria-label={`Share on ${item.name}`}
              >
                <span
                  className={`flex h-[60px] w-[60px] items-center justify-center rounded-full text-[26px] shadow-sm transition-transform group-hover:scale-105 ${item.iconColor} ${item.iconBg}`}
                >
                  <i className={item.icon}></i>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-5 text-md leading-tight font-medium text-gray-700 sm:text-xl">
            Or copy link
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3">
            <i className="fa-solid fa-link text-[18px] text-gray-500"></i>
            <p className="min-w-0 flex-1 truncate text-sm text-gray-600 sm:text-base">
              {displayUrl}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-xl bg-[#0A0DFF] px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {copyLabel === "Copy link" ? "Copy" : copyLabel}
            </button>
          </div>
          <p className="sr-only">{shareTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ShareCollegeModal;
