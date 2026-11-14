"use client";

import * as React from "react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface UploadSignatureData {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder?: string;
}

interface UseImageUploadOptions {
  maxSizeMB?: number;
  folder?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { maxSizeMB = 2, folder = "properties" } = options;
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a JPEG, PNG, or WebP image");
      return null;
    }

    // Validate size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${maxSizeMB} MB`);
      return null;
    }

    setIsUploading(true);
    setProgress(10);

    try {
      // 1. Get signature from backend
      const signRes = await api.post<UploadSignatureData>("/uploads/sign", { folder });
      setProgress(30);

      if (!signRes.ok || !signRes.data) {
        throw new Error(signRes.message || "Could not generate upload signature");
      }

      const { cloudName, apiKey, timestamp, signature, folder: targetFolder } = signRes.data;

      // 2. Direct upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      if (targetFolder) formData.append("folder", targetFolder);

      setProgress(50);
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setProgress(85);
      const json = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error(json?.error?.message || "Cloudinary upload failed");
      }

      setProgress(100);
      toast.success("Image uploaded successfully!");
      return json.secure_url || json.url;
    } catch (err) {
      toast.error((err as Error).message || "Failed to upload image. You can enter an image URL directly.");
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
  };
}
