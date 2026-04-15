"use client";

import React from "react";

const ContactInfoRow: React.FC<{
  icon: string;
  title: string;
  value: string;
  badge: string;
  link?: boolean;
  linkHref?: string;
}> = ({ icon, title, value, badge, link = false, linkHref = "#" }) => (
  <div className="flex items-start gap-4">
    <div
      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${badge}`}
    >
      <i className={`${icon} text-lg`}></i>
    </div>
    <div>
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      {link ? (
        <a
          href={linkHref}
          className="mt-0.5 inline-block text-sm text-gray-500 transition-colors hover:text-[#0000FF]"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 text-sm text-gray-500">{value}</p>
      )}
    </div>
  </div>
);

export default ContactInfoRow;