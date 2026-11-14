import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  MapPin,
  CheckCircle2,
  Star,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Home,
  Building,
} from "lucide-react";
import { PropertyStatusBadge } from "@/components/ui/status-badge";
import { RentCTA } from "@/components/properties/RentCTA";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { SavePropertyButton } from "@/components/properties/SavePropertyButton";
import { ShareButton } from "@/components/properties/ShareButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverFetch } from "@/lib/server-api";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
import type { Property } from "@/types";
import type { Metadata } from "next";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  props: PropertyDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const res = await serverFetch<Property>(`/properties/${params.id}`);

  if (!res.ok || !res.data) {
    return {
      title: "Property Not Found | RentNest",
      description: "The requested rental property could not be found.",
    };
  }

  const p = res.data;
  const image = p.images?.[0] || "/placeholder-house.webp";

  return {
    title: `${p.title} | RentNest`,
    description: `${p.bedrooms} bed, ${p.bathrooms} bath rental property in ${p.location}. Listed at ${formatCurrency(p.rentAmount)}/month.`,
    openGraph: {
      title: `${p.title} - Rental Property | RentNest`,
      description: p.description.slice(0, 160),
      images: [{ url: image }],
    },
  };
}

export default async function PropertyDetailPage(props: PropertyDetailPageProps) {
  const params = await props.params;
  const res = await serverFetch<Property>(`/properties/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok || !res.data) {
    notFound();
  }

  const property = res.data;

  // Fetch similar properties in the same category
  let similarProperties: Property[] = [];
  if (property.categoryId) {
    const simRes = await serverFetch<Property[]>(
      `/properties?categoryId=${property.categoryId}&limit=5`,
      { cache: "no-store" }
    );
    if (simRes.ok && simRes.data) {
      similarProperties = simRes.data
        .filter((p) => p.id !== property.id)
        .slice(0, 4);
    }
  }

  // Calculate review distribution
  const reviews = property.reviews ?? [];
  const reviewCount = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { star, count, percentage };
  });

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    image: property.images ?? [],
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location,
    },
    offers: {
      "@type": "Offer",
      price: property.rentAmount,
      priceCurrency: "USD",
      availability:
        property.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      validFrom: property.createdAt,
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <li>
            <Link href="/properties" className="hover:text-primary transition-colors">
              Properties
            </Link>
          </li>
          {property.category && (
            <>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <li>
                <Link
                  href={`/properties?categoryId=${property.category.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {property.category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="h-3 w-3 shrink-0" />
          <li className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {property.title}
          </li>
        </ol>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PropertyStatusBadge status={property.status} />
            {property.category && (
              <span className="text-xs font-semibold bg-muted px-2.5 py-1 rounded-md text-muted-foreground">
                {property.category.name}
              </span>
            )}
            {property.isFeatured && (
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {property.title}
          </h1>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm sm:text-base">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{property.location}</span>
          </p>
        </div>

        {/* Action Buttons: Save & Share */}
        <div className="flex items-center gap-2 self-start">
          <ShareButton title={property.title} />
          <SavePropertyButton property={property} />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-10">
          {/* Gallery Component */}
          <PropertyGallery images={property.images ?? []} title={property.title} />

          {/* Specifications Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-card rounded-2xl border shadow-2xs">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Monthly Rent</p>
                <p className="font-extrabold text-primary text-lg">
                  {formatCurrency(property.rentAmount)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bedrooms</p>
                <p className="font-bold text-foreground flex items-center gap-1.5 text-base">
                  <BedDouble className="h-4 w-4 text-primary" />
                  <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bathrooms</p>
                <p className="font-bold text-foreground flex items-center gap-1.5 text-base">
                  <Bath className="h-4 w-4 text-primary" />
                  <span>{property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Listed On</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatDate(property.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight">About this Space</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Included Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl border bg-card/60 text-xs sm:text-sm font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Landlord Profile Card */}
          {property.landlord && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Meet the Landlord</h2>
              <div className="p-6 rounded-2xl border bg-card shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border">
                    <AvatarImage
                      src={property.landlord.profileImage ?? undefined}
                      alt={property.landlord.name}
                    />
                    <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                      {getInitials(property.landlord.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg">
                      {property.landlord.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Property Owner • Member since{" "}
                      {property.landlord.createdAt
                        ? formatDate(property.landlord.createdAt)
                        : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-muted-foreground border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-6">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-primary" />
                    <span>
                      {property.landlord._count?.properties ?? 1} total{" "}
                      {property.landlord._count?.properties === 1 ? "listing" : "listings"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews & Distribution */}
          <div className="space-y-6 pt-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Verified Reviews</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tenant feedback from verified leases on RentNest.
                </p>
              </div>

              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-extrabold text-foreground text-lg">
                      {property.averageRating?.toFixed(1) ?? "5.0"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>

            {reviewCount === 0 ? (
              <div className="p-8 text-center rounded-2xl border bg-muted/20 border-dashed space-y-2">
                <Star className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                <h3 className="font-semibold text-sm">No reviews yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Be the first tenant to submit an application and review this property once your lease is confirmed.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Distribution bars */}
                <div className="p-4 rounded-xl bg-muted/30 border space-y-2 max-w-md">
                  {distribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-12 font-medium flex items-center gap-1">
                        {star} <Star className="h-3 w-3 fill-warning text-warning" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl border bg-card shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={rev.tenant?.profileImage ?? undefined} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {getInitials(rev.tenant?.name || "Tenant")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">
                              {rev.tenant?.name || "Verified Tenant"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {formatDate(rev.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? "fill-warning text-warning"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns: Sticky Booking CTA */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 rounded-2xl border bg-card shadow-md space-y-5">
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-primary">
                  {formatCurrency(property.rentAmount)}
                </span>
                <span className="text-sm font-normal text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Transparent rent with no additional platform markups
              </p>
            </div>

            {/* RentCTA component */}
            <RentCTA
              propertyId={property.id}
              status={property.status}
              landlordId={property.landlordId}
            />

            <div className="pt-3 border-t space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>Protected by Stripe Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>Direct landlord messaging & lease approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section className="pt-16 border-t space-y-6" aria-label="Similar rental listings">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Similar Properties</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Other listings available in the {property.category?.name || "same"} category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp.id} property={simProp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
