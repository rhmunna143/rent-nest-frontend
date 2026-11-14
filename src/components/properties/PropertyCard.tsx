"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { BedDouble, Bath, MapPin, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import type { Property } from "@/types";
import { SavePropertyButton } from "./SavePropertyButton";
import { formatCurrency } from "@/lib/format";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const primaryImage = property.images?.[0] || "/placeholder-house.webp";
  const displayImage = imageError ? "/placeholder-house.webp" : primaryImage;

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all border-border/80 rounded-xl bg-card">
      {/* Media container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Link
          href={`/properties/${property.id}`}
          className="block h-full w-full"
          aria-label={`View details for ${property.title}`}
        >
          <Image
            src={displayImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Top-left: status */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <PropertyStatusBadge status={property.status} />
        </div>

        {/* Top-right: rating & save */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {property.averageRating !== undefined && property.averageRating > 0 && (
            <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{property.averageRating.toFixed(1)}</span>
            </div>
          )}
          <SavePropertyButton property={property} />
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/properties/${property.id}`}
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
            >
              <h3 className="font-semibold text-base md:text-lg line-clamp-1">
                {property.title}
              </h3>
            </Link>
            <div className="text-right shrink-0">
              <span className="font-bold text-primary text-base md:text-lg">
                {formatCurrency(property.rentAmount)}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                /mo
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 line-clamp-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
            <span>{property.location}</span>
          </p>

          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 pt-0.5 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Meta badges & specs */}
        <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </span>
          </div>

          {property.category && (
            <span className="bg-muted px-2 py-0.5 rounded-full font-medium text-[11px]">
              {property.category.name}
            </span>
          )}
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full rounded-xl justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
        >
          <Link href={`/properties/${property.id}`}>
            View Details
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
