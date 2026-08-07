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
      href: `https://wa.me/?text=${encodedUrl}`,
    },
    {
      name: "Viber",
      icon: "fa-brands fa-viber",
      iconColor: "text-white",
      iconBg: "bg-[#7360F2]",
      href: `viber://forward?text=${encodedUrl}`,
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
    {
      name: "Twitter",
      icon: "fa-brands fa-x-twitter",
      iconColor: "text-white",
      iconBg: "bg-black",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
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
        className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Share
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div className="mx-5 border-t border-gray-100"></div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-4 overflow-x-auto py-1">
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
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition-transform group-hover:scale-105 ${item.iconColor} ${item.iconBg}`}
                >
                  <i className={item.icon}></i>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <i className="fa-solid fa-link text-sm text-gray-400"></i>
            <p className="min-w-0 flex-1 truncate text-xs text-gray-600">
              {displayUrl}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {copyLabel === "Copy link" ? "Copy" : copyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCollegeModal;
