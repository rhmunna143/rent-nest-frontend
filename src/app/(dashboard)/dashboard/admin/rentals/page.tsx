"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useAdminRentals } from "@/hooks/api/useAdmin";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import type { RentalRequest } from "@/types";
import { ExternalLink } from "lucide-react";

export default function AdminRentalsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useAdminRentals({ page, limit: 10 });

  const columns: ColumnDef<RentalRequest>[] = [
    {
      accessorKey: "id",
      header: "Request ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => {
        const prop = row.original.property;
        if (!prop) return <span className="text-xs text-muted-foreground">Unknown</span>;
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
      accessorKey: "tenant",
      header: "Applicant / Tenant",
      cell: ({ row }) => {
        const t = row.original.tenant;
        return (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold">{t?.name || "Applicant"}</p>
            <p className="text-[11px] text-muted-foreground">{t?.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Application Status",
      cell: ({ row }) => <RentalStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "moveInDate",
      header: "Target Move-In",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.moveInDate ? formatDate(row.original.moveInDate) : "Flexible"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
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
        title="Rental Applications"
        description="Global registry of lease requests submitted by tenants across all properties."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter rental records..."
      />
    </div>
  );
}
