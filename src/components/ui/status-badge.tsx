import { cn } from "@/lib/cn";
import type { RentalStatus, PropertyStatus, PaymentStatus } from "@/types";

// ─── Rental Status ─────────────────────────────────────────

const rentalStatusConfig: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

// ─── Property Status ────────────────────────────────────────

const propertyStatusConfig: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-success/10 text-success border-success/20",
  },
  RENTED: {
    label: "Rented",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    className: "bg-muted text-muted-foreground border-border",
  },
};

// ─── Payment Status ─────────────────────────────────────────

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  FAILED: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
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
