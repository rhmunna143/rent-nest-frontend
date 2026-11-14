"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
}

export function ImageUploader({
  value = [],
  onChange,
  maxImages = 8,
  folder = "properties",
}: ImageUploaderProps) {
  const { uploadImage, isUploading } = useImageUpload({ folder });
  const [urlInput, setUrlInput] = React.useState("");
  const [showUrlField, setShowUrlField] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      onChange([...value, url]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;
    onChange([...value, cleanUrl]);
    setUrlInput("");
    setShowUrlField(false);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Existing Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden bg-muted border group shadow-2xs"
            >
              <Image
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                fill
                sizes="180px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/90 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-xs transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-background/90 text-foreground text-[10px] font-bold">
                  Thumbnail
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload & Add Controls */}
      {value.length < maxImages && (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* File Picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Uploading to Cloudinary...
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload Image (max 2 MB)
              </>
            )}
          </Button>

          {/* Toggle URL input */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlField((prev) => !prev)}
            className="w-full sm:w-auto rounded-xl text-xs text-muted-foreground"
          >
            <Link2 className="mr-1.5 h-3.5 w-3.5" />
            {showUrlField ? "Hide URL Input" : "Paste Image URL"}
          </Button>
        </div>
      )}

      {/* Direct URL input fallback */}
      {showUrlField && value.length < maxImages && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://images.unsplash.com/photo-..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="h-9 rounded-xl text-xs"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddUrl}
            className="h-9 rounded-xl text-xs font-semibold shrink-0"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add URL
          </Button>
        </div>
      )}
    </div>
  );
}
