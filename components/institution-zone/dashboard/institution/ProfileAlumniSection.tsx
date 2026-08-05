"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
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

const ProfileAlumniSection: React.FC<Props> = ({
  addItem,
  removeItem,
  updateItem,
  uploadFile,
}) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="bg-white p-6 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fa-solid fa-users text-blue-500 mr-2"></i>Notable
          Alumni
        </h3>
        <button
          type="button"
          onClick={() =>
            addItem("alumni", {
              photo: "",
              name: "",
              job: "",
              batch: "",
              linkedin: "",
            })
          }
          className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
        >
          <i className="fa-solid fa-plus mr-1"></i> Add Alumni
        </button>
      </div>
      <div className="space-y-3">
        {watch("alumni").map((a, index) => (
          <div
            key={a.id}
            className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
          >
            <button
              type="button"
              onClick={() => removeItem("alumni", a.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <div className="flex gap-4 pr-10">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                  {a.photo ? (
                    <img
                      src={a.photo}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <i className="fa-solid fa-user text-gray-400 text-xl"></i>
                  )}
                </div>
                <label className="cursor-pointer text-[10px] font-medium text-brand-blue hover:text-brand-hover bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-1 rounded transition-colors whitespace-nowrap">
                  <i className="fa-solid fa-camera mr-0.5"></i> Photo
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
                          "institution/alumni",
                        );
                        updateItem("alumni", a.id, "photo", url);
                      } catch {
                        /* skip */
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  className={`${inputClass} text-sm`}
                  placeholder="Full name"
                  value={a.name}
                  onChange={(e) =>
                    updateItem("alumni", a.id, "name", e.target.value)
                  }
                />
                <input
                  className={`${inputClass} text-sm`}
                  placeholder="Current job (e.g. Software Engineer at Google)"
                  value={a.job}
                  onChange={(e) =>
                    updateItem("alumni", a.id, "job", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className={`${inputClass} text-sm`}
                    placeholder="Batch year"
                    value={a.batch}
                    onChange={(e) =>
                      updateItem("alumni", a.id, "batch", e.target.value)
                    }
                  />
                  <div className="relative">
                    <input
                      className={`${inputClass} text-sm ${errors.alumni?.[index]?.linkedin ? 'border-red-500' : ''}`}
                      placeholder="LinkedIn URL"
                      {...register(`alumni.${index}.linkedin`)}
                    />
                    {errors.alumni?.[index]?.linkedin && (
                      <p className="mt-1 text-xs text-red-500">{errors.alumni[index]?.linkedin?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {watch("alumni").length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">
            No alumni added.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileAlumniSection;
