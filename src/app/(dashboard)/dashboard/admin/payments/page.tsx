"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useAdminPayments } from "@/hooks/api/useAdmin";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Payment } from "@/types";
import { CreditCard, ExternalLink } from "lucide-react";

export default function AdminPaymentsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useAdminPayments({ page, limit: 10 });

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "transactionId",
      header: "Transaction",
      cell: ({ row }) => {
        const id = row.original.transactionId || row.original.id;
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs font-semibold">
              {id.slice(0, 16)}...
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "tenant",
      header: "Payer",
      cell: ({ row }) => {
        const t = row.original.tenant;
        return (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold">{t?.name || "Tenant"}</p>
            <p className="text-[11px] text-muted-foreground">{t?.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "rentalRequest",
      header: "Property",
      cell: ({ row }) => {
        const prop = row.original.rentalRequest?.property;
        if (!prop) return <span className="text-xs text-muted-foreground">Lease Agreement</span>;
        return (
          <div className="space-y-0.5">
            <Link
              href={`/properties/${prop.id}`}
              target="_blank"
              className="text-xs font-semibold hover:underline flex items-center gap-1 line-clamp-1"
            >
              <span>{prop.title}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <p className="text-[11px] text-muted-foreground">{prop.location}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Settled At",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Payment Transactions"
        description="Comprehensive audit log of all completed and pending Stripe Checkout charges."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter transactions..."
      />
    </div>
  );
}
