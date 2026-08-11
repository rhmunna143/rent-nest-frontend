import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
        <SearchX className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">
            Go Home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/properties">
            Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
