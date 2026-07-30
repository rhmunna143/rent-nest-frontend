"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { type Property, type PropertyStatus } from "@/types";
import { Building2, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for delete confirmation
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Property[]>("/landlord/properties");
      if (res.ok && res.data) {
        setProperties(res.data);
      } else {
        toast.error(res.message || "Failed to load properties");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);

    try {
      const res = await api.delete(`/landlord/properties/${propertyToDelete}`);
      if (res.ok) {
        toast.success("Property deleted successfully");
        setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));
      } else {
        if (res.status === 409) {
          toast.error("Cannot delete property with active rentals.");
        } else {
          toast.error(res.message || "Failed to delete property");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setPropertyToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    try {
      const res = await api.put<{ status: PropertyStatus }>(
        `/landlord/properties/${id}`,
        { status: newStatus },
      );
      if (res.ok) {
        toast.success("Status updated");
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Properties
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your rental listings
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Rent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Listed Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    Loading properties...
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <Building2 className="w-12 h-12 mx-auto opacity-20 mb-3" />
                    <p>No properties found.</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/dashboard/landlord/properties/new">
                        Create your first listing
                      </Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-muted/50 transition-colors bg-card"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {property.images && property.images.length > 0 ? (
                          <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {property.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {property.bedrooms} Bed • {property.bathrooms} Bath
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${property.rentAmount.toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-4">
                      <PropertyStatusBadge status={property.status} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(property.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/landlord/properties/${property.id}/edit`}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {property.status !== "AVAILABLE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(property.id, "AVAILABLE")
                              }
                            >
                              Mark as Available
                            </DropdownMenuItem>
                          )}
                          {property.status !== "UNAVAILABLE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(property.id, "UNAVAILABLE")
                              }
                            >
                              Mark as Unavailable
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setPropertyToDelete(property.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!propertyToDelete}
        onOpenChange={(open) => !open && setPropertyToDelete(null)}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmLabel="Delete Property"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
