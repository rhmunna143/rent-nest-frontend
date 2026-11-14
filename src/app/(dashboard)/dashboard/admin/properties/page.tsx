"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useAdminProperties,
  useModerateProperty,
  useAdminDeleteProperty,
} from "@/hooks/api/useAdmin";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
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
import type { Property } from "@/types";
import {
  MoreHorizontal,
  ExternalLink,
  Star,
  Trash2,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useAdminProperties({
    page,
    limit: 10,
    search: search || undefined,
  });

  const moderateMutation = useModerateProperty();
  const deleteMutation = useAdminDeleteProperty();

  const [deleteTarget, setDeleteTarget] = React.useState<Property | null>(null);

  const handleToggleFeatured = async (property: Property) => {
    try {
      await moderateMutation.mutateAsync({
        propertyId: property.id,
        data: { isFeatured: !property.isFeatured },
      });
      toast.success(
        `Property ${property.title} ${property.isFeatured ? "removed from" : "marked as"} featured`
      );
    } catch (err) {
      toast.error((err as Error).message || "Failed to update property");
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
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) =>
        row.original.isFeatured ? (
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Standard</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Listed",
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
              <DropdownMenuLabel className="text-xs">Moderation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/properties/${p.id}`}
                  target="_blank"
                  className="cursor-pointer text-xs"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  View Public Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleFeatured(p)}
                className="cursor-pointer text-xs"
              >
                <Star className="mr-2 h-3.5 w-3.5" />
                {p.isFeatured ? "Unmark Featured" : "Mark as Featured"}
              </DropdownMenuItem>
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
        title="Properties Moderation"
        description="Oversee listings, feature highlighted properties, and remove non-compliant content."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter properties by title or location..."
      />

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Property Listing"
          description={`Are you sure you want to permanently delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete Listing"
          variant="destructive"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
