"use client";

import React from "react";
import { getImageUrl } from "@/services/api";
import EmptyTabState from "./EmptyTabState";

interface TabAlumniProps {
  alumni: any[];
}

const TabAlumni: React.FC<TabAlumniProps> = ({ alumni }) => {
  if (alumni.length === 0) return <EmptyTabState tabName="alumni" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Notable Alumni</h2>
        <p className="text-[14px] text-gray-500">
          Connect with our proud graduates working globally.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {alumni.map((person: any, i: number) => (
          <div
            key={person.name || i}
            className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-5"
          >
            {person.photo || person.image ? (
              <img
                src={getImageUrl(person.photo || person.image)}
                className="h-16 w-16 rounded-full object-cover"
                alt={person.name}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                <i className="fa-solid fa-user text-white/60"></i>
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{person.name}</h4>
              <p className="text-[12.5px] text-gray-500">
                {person.job || person.role}
              </p>
              <p className="text-[11.5px] text-gray-400">{person.batch}</p>
            </div>
            {typeof person.linkedin === "string" && person.linkedin && (
              <a
                href={
                  person.linkedin.startsWith("http")
                    ? person.linkedin
                    : `https://${person.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabAlumni;
