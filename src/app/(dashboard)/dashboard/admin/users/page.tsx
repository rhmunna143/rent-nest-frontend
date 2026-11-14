"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useAdminUsers, useUpdateUser } from "@/hooks/api/useAdmin";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatDate, getInitials } from "@/lib/format";
import { toast } from "sonner";
import type { User, UserRole, UserStatus } from "@/types";
import { MoreHorizontal, UserX, UserCheck, Shield, Filter } from "lucide-react";

export default function AdminUsersPage() {
  const [page, setPage] = React.useState(1);
  const [role, setRole] = React.useState<UserRole | undefined>(undefined);
  const [status, setStatus] = React.useState<UserStatus | undefined>(undefined);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 10,
    role,
    status,
    search: search || undefined,
  });

  const updateUserMutation = useUpdateUser();

  const [confirmTarget, setConfirmTarget] = React.useState<{
    user: User;
    action: "BAN" | "UNBAN";
  } | null>(null);

  const handleStatusChange = async (user: User, nextStatus: UserStatus) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: { status: nextStatus },
      });
      toast.success(
        `User ${user.name} has been ${nextStatus === "BANNED" ? "banned" : "unbanned"}`
      );
    } catch (err) {
      toast.error((err as Error).message || "Failed to update user status");
    } finally {
      setConfirmTarget(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={u.profileImage ?? undefined} alt={u.name} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                {getInitials(u.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const r = row.original.role;
        return (
          <Badge
            variant={
              r === "ADMIN" ? "default" : r === "LANDLORD" ? "secondary" : "outline"
            }
            className="text-xs font-semibold"
          >
            {r}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={s === "ACTIVE" ? "success" : "destructive"}
            className="text-xs font-semibold"
          >
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
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
        const u = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {u.status === "ACTIVE" ? (
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
                  onClick={() => setConfirmTarget({ user: u, action: "BAN" })}
                >
                  <UserX className="mr-2 h-3.5 w-3.5" />
                  Ban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-success focus:bg-success/10 focus:text-success cursor-pointer text-xs"
                  onClick={() => setConfirmTarget({ user: u, action: "UNBAN" })}
                >
                  <UserCheck className="mr-2 h-3.5 w-3.5" />
                  Unban User
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
        title="User Management"
        description="Search, view role permissions, and moderate user account access across RentNest."
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(nextPage) => setPage(nextPage + 1)}
        searchPlaceholder="Filter users by name or email..."
        filterSlot={
          <div className="flex items-center gap-2">
            <select
              value={role ?? ""}
              onChange={(e) => setRole((e.target.value as UserRole) || undefined)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="">All Roles</option>
              <option value="TENANT">Tenants</option>
              <option value="LANDLORD">Landlords</option>
              <option value="ADMIN">Admins</option>
            </select>

            <select
              value={status ?? ""}
              onChange={(e) => setStatus((e.target.value as UserStatus) || undefined)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>
        }
      />

      {/* Confirmation Dialog for Ban/Unban */}
      {confirmTarget && (
        <ConfirmDialog
          open={Boolean(confirmTarget)}
          onOpenChange={(open) => !open && setConfirmTarget(null)}
          onConfirm={() =>
            handleStatusChange(
              confirmTarget.user,
              confirmTarget.action === "BAN" ? "BANNED" : "ACTIVE"
            )
          }
          title={confirmTarget.action === "BAN" ? "Ban User Account" : "Unban User Account"}
          description={
            confirmTarget.action === "BAN"
              ? `Are you sure you want to ban ${confirmTarget.user.name}? They will immediately lose access to sign in or perform actions.`
              : `Are you sure you want to reactivate ${confirmTarget.user.name}'s account?`
          }
          confirmLabel={confirmTarget.action === "BAN" ? "Ban Account" : "Unban Account"}
          variant={confirmTarget.action === "BAN" ? "destructive" : "default"}
          isLoading={updateUserMutation.isPending}
        />
      )}
    </div>
  );
}
