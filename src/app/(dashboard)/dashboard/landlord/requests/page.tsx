"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useLandlordRequests,
  useUpdateLandlordRequest,
} from "@/hooks/api/useLandlord";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { RentalRequest, RentalStatus } from "@/types";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CheckSquare,
} from "lucide-react";

export default function LandlordRequestsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useLandlordRequests({ page, limit: 10 });
  const updateMutation = useUpdateLandlordRequest();

  const handleUpdateStatus = async (
    request: RentalRequest,
    nextStatus: RentalStatus
  ) => {
    try {
      await updateMutation.mutateAsync({
        requestId: request.id,
        status: nextStatus,
      });
      toast.success(
        `Application from ${request.tenant?.name || "tenant"} marked as ${nextStatus.toLowerCase()}`
      );
    } catch (err) {
      toast.error((err as Error).message || "Failed to update request");
    }
  };

  const columns: ColumnDef<RentalRequest>[] = [
    {
      accessorKey: "tenant",
      header: "Applicant",
      cell: ({ row }) => {
        const t = row.original.tenant;
        return (
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">{t?.name || "Applicant"}</p>
            <p className="text-xs text-muted-foreground">{t?.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ row }) => {
        const p = row.original.property;
        if (!p) return <span className="text-xs text-muted-foreground">Unknown</span>;
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
      header: "Status",
      cell: ({ row }) => <RentalStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Decision",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Decision menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {r.status === "PENDING" && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(r, "APPROVED")}
                    className="cursor-pointer text-xs text-success focus:text-success"
                  >
                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                    Approve Application
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(r, "REJECTED")}
                    className="cursor-pointer text-xs text-destructive focus:text-destructive"
                  >
                    <XCircle className="mr-2 h-3.5 w-3.5" />
                    Decline Application
                  </DropdownMenuItem>
                </>
              )}

              {r.status === "APPROVED" && (
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(r, "COMPLETED")}
                  className="cursor-pointer text-xs text-primary focus:text-primary"
                >
                  <CheckSquare className="mr-2 h-3.5 w-3.5" />
                  Mark Lease as Completed
                </DropdownMenuItem>
              )}

              {r.status !== "PENDING" && r.status !== "APPROVED" && (
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Status is finalized ({r.status})
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Rental Applications"
        description="Review tenant applications for your units, approve leases, or decline requests."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter applications..."
      />
    </div>
  );
}
