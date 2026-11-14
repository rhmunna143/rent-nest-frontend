import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 mx-auto w-full">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-12">
        <Skeleton className="h-72 md:col-span-3 lg:col-span-4 rounded-xl" />
        <Skeleton className="h-96 md:col-span-4 lg:col-span-8 rounded-xl" />
      </div>
    </div>
  );
}
