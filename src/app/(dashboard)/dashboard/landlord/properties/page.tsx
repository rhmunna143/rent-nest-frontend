"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useLandlordProperties,
  useDeleteProperty,
  useUpdatePropertyStatus,
} from "@/hooks/api/useLandlord";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Property, PropertyStatus } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function LandlordPropertiesPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useLandlordProperties({ page, limit: 10 });
  const deleteMutation = useDeleteProperty();
  const updateStatusMutation = useUpdatePropertyStatus();

  const [deleteTarget, setDeleteTarget] = React.useState<Property | null>(null);

  const handleStatusChange = async (property: Property, nextStatus: PropertyStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        propertyId: property.id,
        status: nextStatus,
      });
      toast.success(
        `Property "${property.title}" marked as ${nextStatus.toLowerCase()}`
      );
    } catch (err) {
      toast.error((err as Error).message || "Failed to update property status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Property "${deleteTarget.title}" deleted successfully`);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete property");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "title",
      header: "Property",
      cell: ({ row }) => {
        const p = row.original;
        const img = p.images?.[0] || "/placeholder-house.webp";
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image src={img} alt={p.title} fill sizes="64px" className="object-cover" />
            </div>
            <div className="space-y-0.5">
              <Link
                href={`/properties/${p.id}`}
                target="_blank"
                className="font-semibold text-sm hover:underline flex items-center gap-1 line-clamp-1"
              >
                <span>{p.title}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-1">{p.location}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground">
          {row.original.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      accessorKey: "rentAmount",
      header: "Monthly Rent",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {formatCurrency(row.original.rentAmount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PropertyStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
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
        const p = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel className="text-xs">Manage Listing</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/landlord/properties/${p.id}/edit`}
                  className="cursor-pointer text-xs"
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Edit Property
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/properties/${p.id}`}
                  target="_blank"
                  className="cursor-pointer text-xs"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  View Public Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {p.status === "AVAILABLE" ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(p, "RENTED")}
                  className="cursor-pointer text-xs text-warning focus:text-warning"
                >
                  <XCircle className="mr-2 h-3.5 w-3.5" />
                  Mark as Rented
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(p, "AVAILABLE")}
                  className="cursor-pointer text-xs text-success focus:text-success"
                >
                  <CheckCircle className="mr-2 h-3.5 w-3.5" />
                  Mark as Available
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteTarget(p)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My Properties"
        description="View and manage your active rental units, update availability, or add new listings."
        actions={
          <Button asChild className="rounded-xl">
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="w-4 h-4 mr-2" /> Add New Property
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
        searchPlaceholder="Filter listings..."
      />

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Property"
          description={`Are you sure you want to permanently delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete Property"
          variant="destructive"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
