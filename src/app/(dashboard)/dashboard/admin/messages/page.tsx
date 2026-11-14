"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useAdminContacts, useUpdateContactMessage } from "@/hooks/api/useAdmin";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
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
import type { ContactMessage, ContactStatus } from "@/types";
import { MoreHorizontal, Mail, CheckCircle, Clock } from "lucide-react";

export default function AdminMessagesPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useAdminContacts({ page, limit: 10 });
  const updateStatusMutation = useUpdateContactMessage();

  const handleStatusUpdate = async (message: ContactMessage, nextStatus: ContactStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        contactId: message.id,
        status: nextStatus,
      });
      toast.success(`Message marked as ${nextStatus.toLowerCase()}`);
    } catch (err) {
      toast.error((err as Error).message || "Failed to update message status");
    }
  };

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: "name",
      header: "Sender",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold">{row.original.name}</p>
          <a
            href={`mailto:${row.original.email}`}
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            {row.original.email}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject & Message",
      cell: ({ row }) => (
        <div className="max-w-md space-y-1">
          <p className="text-xs font-semibold line-clamp-1">{row.original.subject}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === "NEW" ? "default" : s === "RESOLVED" ? "success" : "secondary"
            }
            className="text-xs font-semibold"
          >
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Received",
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
        const msg = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(msg, "READ")}
                disabled={msg.status === "READ"}
                className="cursor-pointer text-xs"
              >
                <Clock className="mr-2 h-3.5 w-3.5" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(msg, "RESOLVED")}
                disabled={msg.status === "RESOLVED"}
                className="cursor-pointer text-xs text-success focus:text-success"
              >
                <CheckCircle className="mr-2 h-3.5 w-3.5" />
                Mark as Resolved
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="cursor-pointer text-xs flex items-center"
                >
                  <Mail className="mr-2 h-3.5 w-3.5" />
                  Reply via Email
                </a>
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
        title="Inquiries & Messages"
        description="Public inquiries submitted through the contact support form."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Search inquiries..."
      />
    </div>
  );
}
