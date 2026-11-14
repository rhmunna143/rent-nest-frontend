import type { FieldValues, UseFormSetError, Path } from "react-hook-form";
import type { ApiErrorDetail } from "@/types";

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred. Please try again.";
}

export function applyServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errorDetails?: ApiErrorDetail[]
): void {
  if (!errorDetails || !Array.isArray(errorDetails)) return;

  for (const detail of errorDetails) {
    if (detail.field) {
      setError(detail.field as Path<T>, {
        type: "server",
        message: detail.message,
      });
    }
  }
}
