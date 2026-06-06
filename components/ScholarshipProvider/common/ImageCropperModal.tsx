"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X } from "lucide-react";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.drawImage(
    image,
    Math.floor(crop.x * scaleX),
    Math.floor(crop.y * scaleY),
    Math.floor(crop.width * scaleX),
    Math.floor(crop.height * scaleY),
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, "image/jpeg");
  });
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1920 / 360,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const initialCropSet = useRef(false);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (initialCropSet.current) return;
      initialCropSet.current = true;

      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
      const crop = makeAspectCrop(
        { unit: "%", width: 80 },
        aspectRatio,
        width,
        height,
      );
      const centered = centerCrop(crop, width, height);
      setCrop(centered);
    },
    [aspectRatio],
  );

  const handleCropConfirm = async () => {
    if (!completedCrop || !imageRef.current) return;
    const croppedBlob = await getCroppedImg(imageRef.current, completedCrop);
    onCropComplete(croppedBlob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-xl w-full max-w-3xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Crop Banner Image</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center bg-gray-100 p-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            minWidth={100}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-h-[500px] w-auto object-contain"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropConfirm}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
