"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/placeholder-house.webp"];
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % safeImages.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, safeImages.length]);

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted group shadow-xs border">
        <Image
          src={safeImages[selectedIndex]}
          alt={`${title} - image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
          priority
        />

        {/* Expand / Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-background/80 backdrop-blur-sm text-foreground hover:bg-background shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Open fullscreen gallery"
        >
          <Maximize2 className="h-4 w-4" />
          <span>View all ({safeImages.length})</span>
        </button>

        {/* Navigation arrows if more than 1 image */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background shadow-xs transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % safeImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background shadow-xs transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20 scale-102"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Select photo ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 bg-background/95 backdrop-blur-xl border-border/80">
          <DialogTitle className="sr-only">Photo Gallery - {title}</DialogTitle>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <Image
              src={safeImages[selectedIndex]}
              alt={`${title} - photo ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-contain"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedIndex(
                      (prev) => (prev - 1 + safeImages.length) % safeImages.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((prev) => (prev + 1) % safeImages.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold">
              {selectedIndex + 1} / {safeImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
