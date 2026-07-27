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
  <li className="flex items-start gap-3">
    <div
      className={`mt-0.5 flex w-8 h-8 shrink-0 items-center justify-center rounded-full ${badge}`}
    >
      <i className={`${icon} text-xs`}></i>
    </div>
    <div>
      <span className="block text-gray-900 font-bold text-[13px]">{title}</span>
      {link ? (
        <a
          href={linkHref}
          className="text-gray-500 font-medium text-[12px] hover:text-[#0000ff] transition-colors"
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-500 font-medium text-[12px]">{value}</span>
      )}
    </div>
  </li>
);

export default ContactInfoRow;