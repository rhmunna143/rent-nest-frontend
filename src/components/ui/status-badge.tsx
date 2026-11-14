import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { RentalStatus, PropertyStatus, PaymentStatus } from "@/types";

// ─── Rental Status ─────────────────────────────────────────

const rentalStatusConfig: Record<
  RentalStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  PENDING: {
    label: "Pending",
    variant: "warning",
  },
  APPROVED: {
    label: "Approved",
    variant: "default",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
  },
  ACTIVE: {
    label: "Active",
    variant: "success",
  },
  COMPLETED: {
    label: "Completed",
    variant: "muted",
  },
};

// ─── Property Status ────────────────────────────────────────

const propertyStatusConfig: Record<
  PropertyStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  AVAILABLE: {
    label: "Available",
    variant: "success",
  },
  RENTED: {
    label: "Rented",
    variant: "default",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    variant: "muted",
  },
};

// ─── Payment Status ─────────────────────────────────────────

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  PENDING: {
    label: "Pending",
    variant: "warning",
  },
  COMPLETED: {
    label: "Completed",
    variant: "success",
  },
  FAILED: {
    label: "Failed",
    variant: "destructive",
  },
};

// ─── Components ─────────────────────────────────────────────

export interface RentalStatusBadgeProps {
  status: RentalStatus;
  className?: string;
}

export function RentalStatusBadge({ status, className }: RentalStatusBadgeProps) {
  const config = rentalStatusConfig[status] ?? {
    label: status,
    variant: "muted",
  };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function PropertyStatusBadge({
  status,
  className,
}: PropertyStatusBadgeProps) {
  const config = propertyStatusConfig[status] ?? {
    label: status,
    variant: "muted",
  };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status] ?? {
    label: status,
    variant: "muted",
  };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
