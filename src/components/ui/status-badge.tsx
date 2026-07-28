import { cn } from "@/lib/cn";
import type { RentalStatus, PropertyStatus, PaymentStatus } from "@/types";

// ─── Rental Status ─────────────────────────────────────────

const rentalStatusConfig: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

// ─── Property Status ────────────────────────────────────────

const propertyStatusConfig: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  RENTED: {
    label: "Rented",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

// ─── Payment Status ─────────────────────────────────────────

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

// ─── Component ─────────────────────────────────────────────

interface RentalStatusBadgeProps {
  status: RentalStatus;
  className?: string;
}

export function RentalStatusBadge({ status, className }: RentalStatusBadgeProps) {
  const config = rentalStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function PropertyStatusBadge({ status, className }: PropertyStatusBadgeProps) {
  const config = propertyStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
