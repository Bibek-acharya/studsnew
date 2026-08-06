"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";
import { FormData, inputClass, GalleryEntry, formatFileSize } from "./ProfilePage";

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
  addGalleryGroup: () => void;
  removeGalleryGroup: (groupIndex: number) => void;
  updateGalleryFolder: (groupIndex: number, value: string) => void;
  addGalleryImage: (groupIndex: number) => void;
  removeGalleryImage: (groupIndex: number, imageIndex: number) => void;
  updateGalleryImage: (
    groupIndex: number,
    imageIndex: number,
    field: keyof GalleryEntry,
    value: string,
  ) => void;
  handleGalleryFileSelect: (
    groupIndex: number,
    imageIndex: number,
    file: File,
  ) => Promise<void>;
  setUploadingInfo: (
    info: { groupIndex: number; imageIndex: number } | null,
  ) => void;
  uploadFile: (file: File, folder: string) => Promise<string>;
  uploadingInfo: { groupIndex: number; imageIndex: number } | null;
}

const ProfileResourcesSection: React.FC<Props> = ({
  addItem,
  removeItem,
  updateItem,
  addGalleryGroup,
  removeGalleryGroup,
  updateGalleryFolder,
  addGalleryImage,
  removeGalleryImage,
  updateGalleryImage,
  handleGalleryFileSelect,
  setUploadingInfo,
  uploadFile,
  uploadingInfo,
}) => {
  const { watch, setValue } = useFormContext<FormData>();
  const brochureUrlW = watch("brochureUrl");

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Photo Gallery
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Images displayed in the gallery section
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            onClick={addGalleryGroup}
          >
            <Plus size={16} /> Add Gallery Group
          </button>
        </div>

        <div className="p-6 space-y-8">
          {watch("galleryGroups").map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gallery Folder Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                    placeholder="e.g. Leadership Workshop"
                    value={group.folder}
                    onChange={(e) =>
                      updateGalleryFolder(groupIndex, e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5"
                  onClick={() => removeGalleryGroup(groupIndex)}
                >
                  <Trash size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {group.images.map((img, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="border border-gray-200 rounded-2xl p-4 bg-white relative"
                  >
                    <button
                      type="button"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10"
                      onClick={() =>
                        removeGalleryImage(groupIndex, imageIndex)
                      }
                    >
                      <Trash size={14} />
                    </button>

                    {uploadingInfo?.groupIndex === groupIndex &&
                    uploadingInfo?.imageIndex === imageIndex ? (
                      <p className="text-sm text-blue-600 py-20 text-center">
                        Uploading...
                      </p>
                    ) : (
                      <FileUpload
                        label=""
                        uploadedText="Image uploaded"
                        accept="image/*"
                        maxSize="5MB"
                        previewUrl={img.url}
                        previewClassName="w-full h-44 object-cover rounded-2xl"
                        onFileSelect={(file) =>
                          handleGalleryFileSelect(
                            groupIndex,
                            imageIndex,
                            file,
                          )
                        }
                        onClearPreview={() =>
                          updateGalleryImage(
                            groupIndex,
                            imageIndex,
                            "url",
                            "",
                          )
                        }
                        hideClearButton
                      />
                    )}
                  </div>
                ))}

                {group.images.length < 8 && (
                  <button
                    type="button"
                    className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[280px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition"
                    onClick={() => addGalleryImage(groupIndex)}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
                      +
                    </div>
                    <p className="font-semibold text-gray-800">Add Image</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Maximum 8 images
                    </p>
                  </button>
                )}
              </div>

              <div className="mt-5 text-xs text-gray-400">
                Max 3 cards per row • Max 8 images per folder
              </div>
            </div>
          ))}

          {watch("galleryGroups").length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No images added yet.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md  border border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fa-solid fa-download text-blue-500 mr-2"></i>
            Downloads / Resources
          </h3>
          <button
            type="button"
            onClick={() =>
              addItem("downloads", { name: "", file: "", size: "" })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Document
          </button>
        </div>
        <div className="space-y-3">
          {watch("downloads").map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3 pr-10 relative group"
            >
              <button
                type="button"
                onClick={() => removeItem("downloads", d.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                <i className="fa-regular fa-file-lines"></i>
              </div>
              <input
                className={`${inputClass} text-sm flex-1`}
                placeholder="Document name"
                value={d.name}
                onChange={(e) =>
                  updateItem("downloads", d.id, "name", e.target.value)
                }
              />
              {d.size && (
                <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                  {d.size}
                </span>
              )}
              {d.file ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={d.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1"
                  >
                    <i className="fa-solid fa-eye"></i> Preview
                  </a>
                  <label className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                    <i className="fa-solid fa-upload"></i>
                    <input
                      type="file"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadFile(
                            file,
                            "institution/downloads",
                          );
                          updateItem("downloads", d.id, "file", url);
                          updateItem(
                            "downloads",
                            d.id,
                            "size",
                            formatFileSize(file.size),
                          );
                        } catch {
                          /* skip */
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                  <i className="fa-solid fa-upload"></i> Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadFile(
                          file,
                          "institution/downloads",
                        );
                        updateItem("downloads", d.id, "file", url);
                        updateItem(
                          "downloads",
                          d.id,
                          "size",
                          formatFileSize(file.size),
                        );
                      } catch {
                        /* skip */
                      }
                    }}
                  />
                </label>
              )}
            </div>
          ))}
          {watch("downloads").length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              No documents added.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fa-solid fa-circle-question text-blue-500 mr-2"></i>
            FAQs
          </h3>
          <button
            type="button"
            onClick={() =>
              addItem("faqs", { question: "", answer: "" })
            }
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
          >
            <i className="fa-solid fa-plus mr-1"></i> Add Question
          </button>
        </div>
        <div className="space-y-4">
          {watch("faqs").map((f) => (
            <div
              key={f.id}
              className="p-5 bg-gray-50 border border-gray-200 rounded-md relative group"
            >
              <button
                type="button"
                onClick={() => removeItem("faqs", f.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <div className="space-y-3 pr-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. What are the admission requirements?"
                    value={f.question}
                    onChange={(e) =>
                      updateItem("faqs", f.id, "question", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[60px]`}
                    rows={2}
                    placeholder="Answer description..."
                    value={f.answer}
                    onChange={(e) =>
                      updateItem("faqs", f.id, "answer", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          {watch("faqs").length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              No FAQs added.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          <i className="fa-solid fa-file-pdf text-red-500 mr-2"></i>Brochure
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 rounded-md bg-brand-blue px-5 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-brand-hover transition-colors">
            <i className="fa-solid fa-upload"></i> Upload Brochure
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFile(
                    file,
                    "institution/brochure",
                  );
                  setValue("brochureUrl", url, { shouldDirty: true });
                } catch {
                  /* skip */
                }
              }}
            />
          </label>
          {brochureUrlW ? (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-file-pdf"></i>
              </div>
              <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                {decodeURIComponent(
                  brochureUrlW.split("/").pop() || "Brochure",
                )}
              </span>
              <a
                href={brochureUrlW}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1 flex-shrink-0"
              >
                <i className="fa-solid fa-eye"></i> Preview
              </a>
              <button
                type="button"
                onClick={() => setValue("brochureUrl", "", { shouldDirty: true })}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No brochure uploaded.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileResourcesSection;
