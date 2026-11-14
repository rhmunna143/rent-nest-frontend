"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryInput,
} from "@/lib/schemas/category.schema";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/api/useCategories";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MoreHorizontal, Tags } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  const openNewForm = () => {
    setEditingCategory(null);
    reset({ name: "", description: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    reset({ name: category.name, description: category.description || "" });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: { name: data.name, description: data.description || undefined },
        });
        toast.success(`Category "${data.name}" updated successfully!`);
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description || undefined,
        });
        toast.success(`Category "${data.name}" created successfully!`);
      }
      setIsFormOpen(false);
    } catch (err) {
      toast.error((err as Error).message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Category "${deleteTarget.name}" deleted successfully.`);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete category");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-sm">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground line-clamp-1 max-w-sm">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "_count",
      header: "Properties",
      cell: ({ row }) => {
        const count = row.original._count?.properties ?? 0;
        return (
          <Badge variant="outline" className="text-xs font-semibold">
            {count} {count === 1 ? "property" : "properties"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const cat = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openEditForm(cat)}
                className="cursor-pointer text-xs"
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteTarget(cat)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
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
        title="Category Management"
        description="Configure classifications and property types for landlord listing submissions."
        actions={
          <Button onClick={openNewForm} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Filter categories by name..."
      />

      {/* Create / Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Apartments, Duplex, Condo"
                  className="rounded-xl"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  className="min-h-24 rounded-xl"
                  placeholder="Briefly describe what residential structures belong in this category..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Category"
          description={`Are you sure you want to delete "${deleteTarget.name}"? If any properties are currently assigned to this category, the deletion will be rejected.`}
          confirmLabel="Delete Category"
          variant="destructive"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
