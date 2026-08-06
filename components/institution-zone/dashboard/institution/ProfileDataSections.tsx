"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormData, inputClass } from "./ProfilePage";

interface ReorderItem {
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
  levelOptions?: string[];
}

const ProfileDataSections: React.FC<ReorderItem> = ({
  addItem,
  removeItem,
  updateItem,
  levelOptions = [],
}) => {
  const { watch } = useFormContext<FormData>();

  return (
    <>
      <div className="bg-white p-6 rounded-md  border border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fa-solid fa-book-open text-blue-500 mr-2"></i>
            Courses & Fees
          </h3>
          <button
            type="button"
            onClick={() =>
              addItem("courses", {
                name: "",
                level: "",
                duration: "",
                fees: "",
                eligibility: "",
                seats: "",
              })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Course
          </button>
        </div>
        <div className="space-y-3">
          {watch("courses").map((c) => (
            <div
              key={c.id}
              className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
            >
              <button
                type="button"
                onClick={() => removeItem("courses", c.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                <select
                  className={`${inputClass} text-sm`}
                  value={c.level}
                  onChange={(e) =>
                    updateItem("courses", c.id, "level", e.target.value)
                  }
                >
                  <option value="">Level</option>
                  {levelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Course name"
                  value={c.name}
                  onChange={(e) =>
                    updateItem("courses", c.id, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Duration"
                  value={c.duration}
                  onChange={(e) =>
                    updateItem("courses", c.id, "duration", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Fees / Year"
                  value={c.fees}
                  onChange={(e) =>
                    updateItem("courses", c.id, "fees", e.target.value)
                  }
                />
                <input
                  type="number"
                  min="0"
                  className={`${inputClass} text-sm`}
                  placeholder="Seats"
                  value={c.seats}
                  onChange={(e) =>
                    updateItem("courses", c.id, "seats", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={`${inputClass} text-sm`}
                  placeholder="Eligibility"
                  value={c.eligibility}
                  onChange={(e) =>
                    updateItem(
                      "courses",
                      c.id,
                      "eligibility",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
          {watch("courses").length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              No courses added.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fa-solid fa-building text-blue-500 mr-2"></i>
            College Facilities
          </h3>
          <button
            type="button"
            onClick={() =>
              addItem("facilities", { icon: "", heading: "", desc: "" })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Facility
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {watch("facilities").map((f) => {
            const iconName = f.icon?.trim() || "";
            const iconValid = iconName.length > 0;
            return (
              <div
                key={f.id}
                className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
              >
                <button
                  type="button"
                  onClick={() => removeItem("facilities", f.id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
                <div className="space-y-3 pr-10">
                  <input
                    className={`${inputClass} text-sm`}
                    placeholder="Facility title (e.g. Library, Sports Complex)"
                    value={f.heading}
                    onChange={(e) =>
                      updateItem(
                        "facilities",
                        f.id,
                        "heading",
                        e.target.value,
                      )
                    }
                  />
                  <textarea
                    className={`${inputClass} text-sm h-16`}
                    placeholder="Short description"
                    value={f.desc}
                    onChange={(e) =>
                      updateItem(
                        "facilities",
                        f.id,
                        "desc",
                        e.target.value,
                      )
                    }
                  ></textarea>
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${iconValid ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue" : "bg-gray-100 border-gray-200 text-gray-400"}`}
                      >
                        {iconValid ? (
                          <i
                            className={`fa-solid fa-${iconName} text-lg`}
                          ></i>
                        ) : (
                          <i className="fa-solid fa-icons text-lg"></i>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          className={`${inputClass} text-sm font-mono`}
                          placeholder="Icon name (e.g. book, laptop, flask)"
                          value={f.icon}
                          onChange={(e) => {
                            const v = e.target.value
                              .replace(/\s+/g, "-")
                              .toLowerCase();
                            updateItem("facilities", f.id, "icon", v);
                          }}
                        />
                        <p className="mt-1 text-[11px] text-gray-400">
                          Browse icons at{" "}
                          <a
                            href="https://fontawesome.com/icons"
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-blue hover:underline font-medium"
                          >
                            fontawesome.com/icons
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {watch("facilities").length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center col-span-2">
              No facilities added.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDataSections;
