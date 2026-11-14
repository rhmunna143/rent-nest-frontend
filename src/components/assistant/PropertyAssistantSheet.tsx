"use client";

import * as React from "react";
import { useState } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Property } from "@/types";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  properties?: Property[];
}

interface PropertyAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyAssistantSheet({
  open,
  onOpenChange,
}: PropertyAssistantSheetProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hi! I'm your RentNest AI Assistant. Tell me what kind of home you're looking for (e.g. '2 bedroom apartment under $2500 in downtown with wifi') and I'll find live listings for you.",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isSubmitting) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "assistant",
            text: data.error || "Sorry, I couldn't search listings right now. Please try again.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: data.explanation || "Here are matching listings:",
          properties: data.properties || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col h-full bg-background"
      >
        <SheetHeader className="p-4 border-b bg-card">
          <SheetTitle className="flex items-center gap-2 text-base">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <span>RentNest AI Assistant</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
              Gemini
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-xs"
                    : "bg-muted text-foreground rounded-bl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>

              {/* Render real property cards if any are attached to the response */}
              {msg.properties && msg.properties.length > 0 && (
                <div className="mt-3 w-full space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    Matching Properties ({msg.properties.length})
                  </p>
                  <div className="space-y-3">
                    {msg.properties.map((property) => (
                      <div key={property.id} className="h-80">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state if search returned 0 items */}
              {msg.properties && msg.properties.length === 0 && (
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5 px-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>No listings currently match those specific filters.</span>
                </div>
              )}
            </div>
          ))}

          {isSubmitting && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl max-w-[80%]">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Analyzing requirements and searching listings...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Input */}
        <div className="p-3 border-t bg-card">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 2-bed under 2000 with wifi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSubmitting}
              className="rounded-xl h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
