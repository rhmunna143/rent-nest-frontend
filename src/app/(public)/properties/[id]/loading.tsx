import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-10 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/4 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="aspect-video w-full rounded-md" />
            <Skeleton className="aspect-video w-full rounded-md" />
            <Skeleton className="aspect-video w-full rounded-md" />
            <Skeleton className="aspect-video w-full rounded-md" />
          </div>

          <Skeleton className="h-8 w-48 mt-8 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-xl space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>

          <div className="p-6 border rounded-xl space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
