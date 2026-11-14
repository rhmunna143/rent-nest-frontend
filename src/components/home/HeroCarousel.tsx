"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, ArrowRight, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { Property } from "@/types";

interface HeroCarouselProps {
  properties: Property[];
}

export function HeroCarousel({ properties }: HeroCarouselProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center border">
        <p className="text-sm text-muted-foreground">Discover verified rental properties</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto relative group">
      <Carousel autoPlay interval={5000} loop className="rounded-2xl overflow-hidden shadow-2xl border border-border/80">
        <CarouselContent>
          {properties.map((property) => {
            const imageSrc = property.images?.[0] || "/placeholder-house.webp";
            return (
              <CarouselItem key={property.id}>
                <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  {/* Linear overlay for text contrast */}
                  <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/30 to-transparent" />

                  {/* Top tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <PropertyStatusBadge status={property.status} />
                    {property.averageRating !== undefined && property.averageRating > 0 && (
                      <div className="bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span>{property.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom details card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border/60 shadow-lg space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        className="font-bold text-base md:text-lg hover:text-primary transition-colors line-clamp-1"
                      >
                        {property.title}
                      </Link>
                      <span className="font-extrabold text-primary text-base md:text-lg shrink-0">
                        {formatCurrency(property.rentAmount)}
                        <span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {property.location}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span>{property.bedrooms} Beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    </div>

                    <Button asChild size="sm" className="w-full rounded-lg mt-2 text-xs font-medium">
                      <Link href={`/properties/${property.id}`}>
                        View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {properties.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-background/80 hover:bg-background h-8 w-8" />
            <CarouselNext className="right-2 bg-background/80 hover:bg-background h-8 w-8" />
          </>
        )}
      </Carousel>
    </div>
  );
}
