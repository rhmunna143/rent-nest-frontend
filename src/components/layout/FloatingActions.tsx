"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/cn";
import { PropertyAssistantSheet } from "@/components/assistant/PropertyAssistantSheet";

export function FloatingActions() {
  const [showTopButton, setShowTopButton] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    // Check if AI assistant is enabled on server
    fetch("/api/assistant")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.enabled) {
          setIsAssistantEnabled(true);
        }
      })
      .catch(() => {
        // AI assistant silently disabled on failure
        setIsAssistantEnabled(false);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
        {/* AI Assistant Button - hidden if no Gemini API key configured */}
        {isAssistantEnabled && (
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="group relative h-16 w-16 rounded-full bg-card shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center border-2 border-primary/20 overflow-hidden cursor-pointer"
            aria-label="Open AI Property Assistant"
          >
            <DotLottieReact
              src="https://lottie.host/9687b192-7205-456a-abc0-dcad26843575/910UK3OzCa.lottie"
              loop
              autoplay
              className="w-full h-full scale-150"
            />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 rounded-xl bg-popover text-popover-foreground px-3 py-1.5 text-xs font-medium shadow-md opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap pointer-events-none">
              Ask AI Assistant
            </span>
          </button>
        )}

        {/* Go to top button - only visible when scrolled */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-md transition-all duration-300",
            showTopButton
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0 pointer-events-none"
          )}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>

      {isAssistantEnabled && (
        <PropertyAssistantSheet
          open={isAssistantOpen}
          onOpenChange={setIsAssistantOpen}
        />
      )}
    </>
  );
}
