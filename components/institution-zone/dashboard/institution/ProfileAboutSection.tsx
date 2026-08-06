"use client";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import { FormData, inputClass } from "./ProfilePage";

interface Props {
  addItem: <T extends { id: number }>(
    fieldName: string,
    defaultItem: Omit<T, "id">,
  ) => void;
  removeItem: <T extends { id: number }>(
    fieldName: string,
    id: number,
  ) => void;
  updateItem: (
    fieldName: string,
    id: number,
    field: string,
    value: string,
  ) => void;
  uploadFile: (file: File, folder: string) => Promise<string>;
}

const ProfileAboutSection: React.FC<Props> = ({
  addItem,
  removeItem,
  updateItem,
  uploadFile,
}) => {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="bg-white p-6 rounded-md  border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
        About Section
      </h3>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Video Link
        </label>
        {(() => {
          const v = watch("videos")[0];
          if (!v) return <p className="text-sm text-gray-400 py-2">Loading...</p>;
          return (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex gap-4">
                {/* Left: Avatar - full height */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-24 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                    {v.avatar ? (
                      <img
                        src={v.avatar}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <i className="fa-solid fa-user text-gray-400 text-2xl"></i>
                    )}
                  </div>
                  <label className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                    <i className="fa-solid fa-camera mr-1"></i> Photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadFile(
                            file,
                            "institution/video-avatars",
                          );
                          updateItem("videos", v.id, "avatar", url);
                        } catch {
                          /* skip */
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Right: 3 rows */}
                <div className="flex-1 space-y-3">
                  {/* Row 1: Video URL */}
                  <input
                    type="text"
                    className={`${inputClass} text-sm`}
                    placeholder="YouTube URL, video link, or iframe embed code"
                    value={v.url}
                    onChange={(e) =>
                      updateItem("videos", v.id, "url", e.target.value)
                    }
                  />

                  {/* Row 2: Name + Designation */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Person Name"
                      value={v.name}
                      onChange={(e) =>
                        updateItem("videos", v.id, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Designation"
                      value={v.designation}
                      onChange={(e) =>
                        updateItem(
                          "videos",
                          v.id,
                          "designation",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  {/* Row 3: Message textarea */}
                  <textarea
                    className={`${inputClass} text-sm`}
                    placeholder="Message / Title"
                    rows={3}
                    value={v.message}
                    onChange={(e) =>
                      updateItem("videos", v.id, "message", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About the College
        </label>
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <div data-name="about">
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write a detailed description of your college..."
                minHeight={200}
              />
              {errors.about && <p className="mt-1 text-xs text-red-500">{errors.about.message}</p>}
            </div>
          )}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Our Vision
          </label>
          <Controller
            name="vision"
            control={control}
            render={({ field }) => (
              <div data-name="vision">
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Our vision is..."
                  minHeight={150}
                />
                {errors.vision && <p className="mt-1 text-xs text-red-500">{errors.vision.message}</p>}
              </div>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Our Mission
          </label>
          <Controller
            name="mission"
            control={control}
            render={({ field }) => (
              <div data-name="mission">
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Our mission is..."
                  minHeight={150}
                />
                {errors.mission && <p className="mt-1 text-xs text-red-500">{errors.mission.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-0">
            Institution Overview
          </label>
          <button
            type="button"
            onClick={() =>
              addItem("overviewRows", { key: "", value: "" })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Row
          </button>
        </div>
        <div className="space-y-3">
          {watch("overviewRows").map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
            >
              <button
                type="button"
                onClick={() => removeItem("overviewRows", r.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Key (e.g. Established Year)"
                  value={r.key}
                  onChange={(e) =>
                    updateItem(
                      "overviewRows",
                      r.id,
                      "key",
                      e.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Value (e.g. 1995)"
                  value={r.value}
                  onChange={(e) =>
                    updateItem(
                      "overviewRows",
                      r.id,
                      "value",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
          {watch("overviewRows").length === 0 && (
            <p className="text-sm text-gray-400 py-2">No rows added.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-0">
            Leadership & Administration
          </label>
          <button
            type="button"
            onClick={() =>
              addItem("leadershipRows", {
                position: "",
                role: "",
                holder: "",
              })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Row
          </button>
        </div>
        <div className="space-y-3">
          {watch("leadershipRows").map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
            >
              <button
                type="button"
                onClick={() => removeItem("leadershipRows", r.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Position"
                  value={r.position}
                  onChange={(e) =>
                    updateItem(
                      "leadershipRows",
                      r.id,
                      "position",
                      e.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Role"
                  value={r.role}
                  onChange={(e) =>
                    updateItem(
                      "leadershipRows",
                      r.id,
                      "role",
                      e.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Current Holder"
                  value={r.holder}
                  onChange={(e) =>
                    updateItem(
                      "leadershipRows",
                      r.id,
                      "holder",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
          {watch("leadershipRows").length === 0 && (
            <p className="text-sm text-gray-400 py-2">No rows added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAboutSection;
