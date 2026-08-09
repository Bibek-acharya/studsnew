"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormData, inputClass } from "./ProfilePage";

interface Props {
  locationRef: React.RefObject<HTMLDivElement | null>;
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  filteredDistricts: string[];
  toggleLevel: (v: string) => void;
  levelOptions: string[];
  level: string[];
  universities: { id: number; name: string }[];
}

const ProfileGeneralSection: React.FC<Props> = ({
  locationRef,
  showSuggestions,
  setShowSuggestions,
  locationFilter,
  setLocationFilter,
  filteredDistricts,
  toggleLevel,
  levelOptions,
  level,
  universities,
}) => {
  const [uniSearch, setUniSearch] = useState("");
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormData>();

  const filteredUniversities = universities.filter(u =>
    u.name.toLowerCase().includes(uniSearch.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-6 rounded-md  border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          <i className="fa-solid fa-building text-blue-500 mr-2"></i>General
          Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Name
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.collegeName ? 'border-red-500' : ''}`}
              placeholder="Enter college name"
              {...register("collegeName")}
            />
            {errors.collegeName && (
              <p className="mt-1 text-xs text-red-500">{errors.collegeName.message}</p>
            )}
          </div>
          <div className="relative" ref={locationRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (District)
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Type a district..."
              value={watch("location")}
              onChange={(e) => {
                setValue("location", e.target.value, { shouldDirty: true });
                setLocationFilter(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredDistricts.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">
                    No districts found
                  </div>
                ) : (
                  filteredDistricts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setValue("location", d, { shouldDirty: true });
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {d}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <div className="flex flex-wrap gap-2">
              {levelOptions.map(opt => (
                <label key={opt} className={`px-3 py-1.5 rounded-md border text-sm cursor-pointer transition-colors flex items-center gap-1.5 ${level.includes(opt) ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"}`}>
                  <input type="checkbox" className="hidden" checked={level.includes(opt)} onChange={() => toggleLevel(opt)} />
                  {level.includes(opt) && <i className="fa-solid fa-check text-xs"></i>}
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.website ? 'border-red-500' : ''}`}
              placeholder="www.college.edu.np"
              {...register("website")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              className={`${inputClass} ${errors.contactEmail ? 'border-red-500' : ''}`}
              placeholder="admission@college.edu.np"
              {...register("contactEmail")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.contactPhone ? 'border-red-500' : ''}`}
              placeholder="01-4XXXXXX"
              {...register("contactPhone")}
            />
          </div>
          {level.some(l => l.includes("Bachelor") || l.includes("Master")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Affiliated Universities</label>
            <div className="border border-gray-300 rounded-md bg-white">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Search universities..."
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                />
              </div>
              <div className="max-h-40 overflow-y-auto p-2">
                {universities.length === 0 ? (
                  <p className="text-sm text-gray-400">Loading universities...</p>
                ) : filteredUniversities.length === 0 ? (
                  <p className="text-sm text-gray-400">No universities found</p>
                ) : (
                  filteredUniversities.map(u => (
                    <label key={u.id} className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={watch("universityIds").includes(u.id)}
                        onChange={(e) => {
                          const ids = getValues("universityIds");
                          if (e.target.checked) {
                            setValue("universityIds", [...ids, u.id], { shouldDirty: true });
                          } else {
                            setValue("universityIds", ids.filter(id => id !== u.id), { shouldDirty: true });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{u.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            {watch("universityIds").length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {watch("universityIds").map(id => {
                  const uni = universities.find(u => u.id === id);
                  return uni ? (
                    <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {uni.name}
                      <button type="button" onClick={() => setValue("universityIds", getValues("universityIds").filter(i => i !== id), { shouldDirty: true })} className="hover:text-blue-900">
                        <i className="fa-solid fa-times text-[10px]"></i>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
          )}
          {level.some(l => !l.includes("Bachelor") && !l.includes("Master")) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Non-University Affiliation</label>
            <input type="text" className={`${inputClass} ${errors.affiliation ? 'border-red-500' : ''}`} placeholder="e.g. NEB, CTEVT" {...register("affiliation")} />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.mapUrl ? 'border-red-500' : ''}`}
              placeholder="https://www.google.com/maps/embed?pb=..."
              {...register("mapUrl")}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.facebookUrl ? 'border-red-500' : ''}`}
              placeholder="https://facebook.com/..."
              {...register("facebookUrl")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.instagramUrl ? 'border-red-500' : ''}`}
              placeholder="https://instagram.com/..."
              {...register("instagramUrl")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TikTok URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.tiktokUrl ? 'border-red-500' : ''}`}
              placeholder="https://tiktok.com/..."
              {...register("tiktokUrl")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.youtubeUrl ? 'border-red-500' : ''}`}
              placeholder="https://youtube.com/..."
              {...register("youtubeUrl")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.linkedinUrl ? 'border-red-500' : ''}`}
              placeholder="https://linkedin.com/..."
              {...register("linkedinUrl")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileGeneralSection;
