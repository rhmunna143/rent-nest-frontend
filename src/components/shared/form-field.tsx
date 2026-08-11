import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export interface FormFieldProps extends InputProps {
  label: React.ReactNode;
  error?: string;
  description?: string;
  containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, containerClassName, id, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn("grid gap-2", containerClassName)}>
        <Label htmlFor={inputId} className={error ? "text-destructive" : ""}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : description ? `${inputId}-description` : undefined
          }
          {...props}
        />
        {description && !error && (
          <p id={`${inputId}-description`} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
