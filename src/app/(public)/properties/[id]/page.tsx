import { notFound } from "next/navigation";
import { BedDouble, Bath, MapPin, CheckCircle2, Star } from "lucide-react";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { RentCTA } from "@/components/properties/RentCTA";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Property } from "@/types";
import Image from "next/image";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage(
  props: PropertyDetailPageProps,
) {
  const params = await props.params;
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

  let property: Property | null = null;
  try {
    const res = await fetch(`${BASE_URL}/properties/${params.id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) notFound();
    } else {
      const data = await res.json();
      if (data.success) {
        property = data.data;
      } else {
        notFound();
      }
    }
  } catch (error) {
    console.error("Failed to fetch property", error);
    notFound();
  }

  if (!property) {
    notFound();
  }

  const mainImage = property.images[0] || "/placeholder-house.webp";
  const otherImages = property.images.slice(1);

  let similarProperties: Property[] = [];
  try {
    if (property.categoryId) {
      const simRes = await fetch(`${BASE_URL}/properties?categoryId=${property.categoryId}&limit=5`, {
        cache: "no-store",
      });
      if (simRes.ok) {
        const simData = await simRes.json();
        if (simData.success) {
          similarProperties = simData.data.filter((p: Property) => p.id !== property!.id).slice(0, 4);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch similar properties", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <PropertyStatusBadge status={property.status} />
          {property.category && (
            <span className="text-sm bg-muted px-2 py-1 rounded-md text-muted-foreground">
              {property.category.name}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {property.title}
        </h1>
        <p className="text-muted-foreground flex items-center gap-1.5 text-lg">
          <MapPin className="h-5 w-5" />
          {property.location}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Images */}
          <div className="space-y-2">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted relative">
              <Image
                src={mainImage}
                alt={property.title}
                className="object-cover w-full h-full"
                width={700}
                height={600}
              />
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-md overflow-hidden bg-muted relative"
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      className="object-cover w-full h-full"
                      width={700}
                      height={600}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-xl border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property ID</p>
                <p className="font-medium">{property.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{property.category?.name || "Uncategorized"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                <p className="font-medium flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-primary" /> {property.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bathrooms</p>
                <p className="font-medium flex items-center gap-1.5"><Bath className="h-4 w-4 text-primary" /> {property.bathrooms}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About this property</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {property.reviews && property.reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-500" />
                {property.averageRating?.toFixed(1)} ({property.reviews.length}{" "}
                reviews)
              </h2>
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.tenant?.profileImage || ""} />
                        <AvatarFallback>
                          {review.tenant?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {review.tenant?.name || "Anonymous Tenant"}
                        </p>
                        <div className="flex items-center text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-card sticky z-100 top-24 shadow-sm">
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary">
                ${property.rentAmount}
                <span className="text-base text-muted-foreground font-normal">
                  {" "}
                  / month
                </span>
              </p>
            </div>

            <RentCTA propertyId={property.id} />
          </div>

          {property.landlord && (
            <div className="p-6 border rounded-xl bg-card">
              <h3 className="font-semibold mb-4">Listed by Landlord</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.landlord.profileImage || ""} />
                  <AvatarFallback>
                    {property.landlord.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{property.landlord.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Joined RentNest
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="border-t pt-16 mt-8">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similarProperties.map((prop: Property) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
