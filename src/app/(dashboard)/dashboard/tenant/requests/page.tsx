"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useRentals } from "@/hooks/api/useRentals";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { RentalRequest } from "@/types";
import { ArrowRight, CreditCard, ExternalLink, Plus } from "lucide-react";

export default function TenantRequestsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useRentals({ page, limit: 10 });

  const columns: ColumnDef<RentalRequest>[] = [
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => {
        const p = row.original.property;
        if (!p) return <span className="text-xs text-muted-foreground">Unknown Property</span>;
        return (
          <div className="space-y-0.5">
            <Link
              href={`/properties/${p.id}`}
              target="_blank"
              className="text-sm font-semibold hover:underline flex items-center gap-1 line-clamp-1"
            >
              <span>{p.title}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <p className="text-xs text-muted-foreground">{p.location}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "moveInDate",
      header: "Move-In Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.moveInDate ? formatDate(row.original.moveInDate) : "Flexible"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Application Status",
      cell: ({ row }) => <RentalStatusBadge status={row.original.status} />,
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            {r.status === "APPROVED" && (
              <Button size="sm" asChild className="rounded-xl h-8 px-3 text-xs font-semibold">
                <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                  Pay Now
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl h-8 px-3 text-xs font-semibold"
            >
              <Link href={`/dashboard/tenant/requests/${r.id}`}>
                View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My Rental Requests"
        description="Track the real-time status of your property lease applications and complete payments for approved rentals."
        actions={
          <Button asChild className="rounded-xl">
            <Link href="/properties">
              <Plus className="mr-1.5 h-4 w-4" /> Browse Properties
            </Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter requests..."
      />
    </div>
  );
}
