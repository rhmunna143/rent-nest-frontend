"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { type RentalRequest, type RentalStatus } from "@/types";
import { Users, CheckCircle2, XCircle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import { format } from "date-fns";

export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<RentalRequest[]>("/landlord/requests");
      if (res.ok && res.data) {
        setRequests(res.data);
      } else {
        toast.error(res.message || "Failed to load requests");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: RentalStatus) => {
    // Optimistic UI update
    const previousRequests = [...requests];
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
    );

    try {
      const res = await api.patch<{ status: RentalStatus }>(
        `/landlord/requests/${id}`,
        { status: newStatus },
      );

      if (res.ok) {
        toast.success(`Request marked as ${newStatus}`);
      } else {
        // Rollback
        setRequests(previousRequests);
        toast.error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      // Rollback
      setRequests(previousRequests);
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Rental Requests
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage incoming requests for your properties
        </p>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Move-in Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <Users className="w-12 h-12 mx-auto opacity-20 mb-3" />
                    <p>No rental requests yet.</p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-muted/50 transition-colors bg-card"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {request.tenant?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.tenant?.email}
                      </div>
                      {request.message && (
                        <div className="mt-2 text-xs italic text-muted-foreground line-clamp-2 max-w-xs">
                          "{request.message}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {request.property?.title || "Unknown Property"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {request.moveInDate
                        ? format(new Date(request.moveInDate), "MMM dd, yyyy")
                        : "Not specified"}
                    </td>
                    <td className="px-6 py-4">
                      <RentalStatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {request.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                handleUpdateStatus(request.id, "APPROVED")
                              }
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleUpdateStatus(request.id, "REJECTED")
                              }
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Reject
                            </Button>
                          </>
                        )}

                        {request.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(request.id, "COMPLETED")
                            }
                          >
                            <CheckSquare className="w-4 h-4 mr-1.5" />
                            Complete Stay
                          </Button>
                        )}

                        {(request.status === "APPROVED" ||
                          request.status === "COMPLETED" ||
                          request.status === "REJECTED") && (
                          <span className="text-xs text-muted-foreground italic px-2">
                            No further actions
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
