import { notFound } from "next/navigation";
import { BedDouble, Bath, MapPin, CheckCircle2, Star } from "lucide-react";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { RentCTA } from "@/components/properties/RentCTA";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Property } from "@/types";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
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
              <img
                src={mainImage}
                alt={property.title}
                className="object-cover w-full h-full"
              />
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-md overflow-hidden bg-muted relative"
                  >
                    <img
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
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
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-primary" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
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
          <div className="p-6 border rounded-xl bg-card sticky top-24 shadow-sm">
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
    </div>
  );
}
