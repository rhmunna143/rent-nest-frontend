"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";

interface BlogShareButtonsProps {
  title: string;
  slug: string;
}

export function BlogShareButtons({ title, slug }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Fallback to relative URL on server, resolve window.location on client
  const [url, setUrl] = useState(`/blog/${slug}`);

  React.useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={shareTwitter}
        className="rounded-xl text-xs gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5" />
        X (Twitter)
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareFacebook}
        className="rounded-xl text-xs gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareLinkedIn}
        className="rounded-xl text-xs gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="rounded-xl text-xs gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-success" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
