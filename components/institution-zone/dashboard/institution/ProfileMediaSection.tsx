"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormData } from "./ProfilePage";

interface Props {
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
  setLogoFile: (f: File | null) => void;
  setBannerFile: (f: File | null) => void;
  setCropImageSrc: (s: string | null) => void;
  setCropperOpen: (v: boolean) => void;
  uploadFile: (file: File, folder: string) => Promise<string>;
  cardImageInputRef: React.RefObject<HTMLInputElement | null>;
  setCardImageFile: (f: File | null) => void;
  cropTarget: "banner" | "card";
  setCropTarget: (t: "banner" | "card") => void;
}

const ProfileMediaSection: React.FC<Props> = ({
  logoInputRef,
  bannerInputRef,
  setLogoFile,
  setBannerFile,
  setCropImageSrc,
  setCropperOpen,
  uploadFile,
  cardImageInputRef,
  setCardImageFile,
  cropTarget,
  setCropTarget,
}) => {
  const { watch, setValue, formState: { errors } } = useFormContext<FormData>();
  const logoUrlW = watch("logoUrl");
  const bannerUrlW = watch("bannerUrl");
  const cardImageUrlW = watch("cardImageUrl");

  return (
    <div className="bg-white p-6 rounded-md  border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">
        <i className="fa-solid fa-image text-blue-500 mr-2"></i>Logo &
        Banner
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Logo
          </label>
          <div
            data-name="logoUrl"
            onClick={() => logoInputRef.current?.click()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
          >
            {logoUrlW ? (
              <>
                <img
                  src={logoUrlW}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                  alt="Logo"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("logoUrl", "", { shouldDirty: true });
                    setLogoFile(null);
                    if (logoInputRef.current) logoInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </>
            ) : (
              <div className="space-y-1 text-center self-center">
                <i className="fa-regular fa-building text-4xl text-gray-400"></i>
                <div className="flex text-sm text-gray-600 justify-center mt-3">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Upload logo
                  </span>
                </div>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFile(file, "institution/logo");
                  setValue("logoUrl", url, { shouldDirty: true });
                } catch {
                  /* skip */
                }
              }}
            />
          </div>
          {errors.logoUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.logoUrl.message}</p>
          )}
        </div>
        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner / Cover Image
          </label>
          <div
            data-name="bannerUrl"
            onClick={() => bannerInputRef.current?.click()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
          >
            {bannerUrlW ? (
              <>
                <img
                  src={bannerUrlW}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Banner"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("bannerUrl", "", { shouldDirty: true });
                    setBannerFile(null);
                    if (bannerInputRef.current) bannerInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </>
            ) : (
              <div className="space-y-1 text-center self-center">
                <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                <div className="flex text-sm text-gray-600 justify-center mt-3">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Upload banner
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 1920 × 360 pixels
                </p>
              </div>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBannerFile(file);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    setCropImageSrc(ev.target.result as string);
                    setCropTarget("banner");
                    setCropperOpen(true);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
          {errors.bannerUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.bannerUrl.message}</p>
          )}
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Image
          </label>
          <div
            data-name="cardImageUrl"
            onClick={() => cardImageInputRef.current?.click()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
          >
            {cardImageUrlW ? (
              <>
                <img
                  src={cardImageUrlW}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Card"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("cardImageUrl", "", { shouldDirty: true });
                    setCardImageFile(null);
                    if (cardImageInputRef.current) cardImageInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </>
            ) : (
              <div className="space-y-1 text-center self-center">
                <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                <div className="flex text-sm text-gray-600 justify-center mt-3">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Upload card image
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 310 × 140 pixels
                </p>
              </div>
            )}
            <input
              ref={cardImageInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setCardImageFile(file);
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    setCropImageSrc(ev.target.result as string);
                    setCropTarget("card");
                    setCropperOpen(true);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMediaSection;
