import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export interface FormTextareaProps extends TextareaProps {
  label: React.ReactNode;
  error?: string;
  description?: string;
  containerClassName?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, description, containerClassName, id, className, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className={cn("grid gap-2", containerClassName)}>
        <Label htmlFor={textareaId} className={error ? "text-destructive" : ""}>
          {label}
        </Label>
        <Textarea
          id={textareaId}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : description ? `${textareaId}-description` : undefined
          }
          {...props}
        />
        {description && !error && (
          <p id={`${textareaId}-description`} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";
