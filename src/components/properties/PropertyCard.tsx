import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images[0] || "/placeholder-house.webp"; // fallback image

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <Link
        href={`/properties/${property.id}`}
        className="block relative aspect-video overflow-hidden"
      >
        {/* Placeholder linear if no image */}
        <div className="absolute inset-0 bg-muted/20" />
        {/* Actual image */}
        <img
          src={imageUrl}
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <PropertyStatusBadge status={property.status} />
        </div>
        {property.averageRating !== undefined && property.averageRating > 0 && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
            {property.averageRating.toFixed(1)}
          </div>
        )}
      </Link>

      <CardContent className="p-4 flex-1 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/properties/${property.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-1">
              {property.title}
            </h3>
          </Link>
          <span className="font-bold text-primary shrink-0">
            ${property.rentAmount}
            <span className="text-xs text-muted-foreground font-normal">
              /mo
            </span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground flex items-center gap-1 line-clamp-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {property.location}
        </p>

        <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} Bath</span>
          </div>
          {property.category && (
            <div className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">
              {property.category.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
