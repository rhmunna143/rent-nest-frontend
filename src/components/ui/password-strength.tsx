"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({ password = "", className }: PasswordStrengthProps) {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const strengthConfig = [
    { text: "Very Weak", color: "bg-destructive text-destructive" },
    { text: "Weak", color: "bg-destructive text-destructive" },
    { text: "Fair", color: "bg-warning text-warning" },
    { text: "Good", color: "bg-primary text-primary" },
    { text: "Strong", color: "bg-success text-success" },
  ];

  const currentStrength = strengthConfig[metCount];

  if (!password) return null;

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      {/* Progress Bars */}
      <div className="flex gap-1.5 h-1.5 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              i < metCount ? currentStrength.color.split(" ")[0] : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Strength:</span>
        <span className={cn("font-medium", currentStrength.color.split(" ")[1])}>
          {currentStrength.text}
        </span>
      </div>

      {/* Criteria checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-xs text-muted-foreground">
        {criteria.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.met ? (
              <Check className="h-3.5 w-3.5 text-success shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            )}
            <span className={c.met ? "text-foreground" : ""}>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
