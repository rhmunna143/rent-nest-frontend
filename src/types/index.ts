// ============================================================
// Shared Types & Enums for RentNest Frontend
// ============================================================

// --- Enums ---

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type ContactStatus = "NEW" | "READ" | "RESOLVED";

// --- Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  profileImage?: string | null;
  status?: UserStatus;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    properties: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  categoryId: string;
  landlordId: string;
  category?: Category;
  landlord?: Pick<User, "id" | "name" | "email" | "phone" | "profileImage">;
  reviews?: Review[];
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: RentalStatus;
  moveInDate?: string | null;
  message?: string | null;
  tenant?: Pick<User, "id" | "name" | "email" | "phone" | "profileImage">;
  property?: Property;
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  rentalRequestId?: string;
  rentalId?: string; // alias for compatibility
  tenantId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string | null;
  checkoutUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: Pick<User, "id" | "name" | "email">;
  rentalRequest?: {
    id: string;
    property?: Pick<Property, "id" | "title" | "location" | "rentAmount">;
  };
}

export interface Review {
  id: string;
  rentalRequestId?: string;
  rentalId?: string; // alias for compatibility
  tenantId: string;
  propertyId: string;
  rating: number;
  comment?: string | null;
  tenant?: Pick<User, "id" | "name" | "profileImage">;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

// --- Analytics & Stats ---

export interface PublicStats {
  properties: number;
  availableProperties: number;
  landlords: number;
  tenants: number;
  completedRentals: number;
  averageRating: number;
  categories: number;
}

export interface AdminStats {
  totals: {
    users: number;
    properties: number;
    rentals: number;
    revenue: number;
  };
  charts: {
    categoryDistribution: { name: string; count: number }[];
    monthlyGrowth: { month: string; users: number; rentals: number; revenue: number }[];
    rentalStatuses: { status: RentalStatus; count: number }[];
  };
}

export interface LandlordStats {
  totals: {
    totalProperties: number;
    activeRentals: number;
    pendingRequests: number;
    totalEarnings: number;
  };
  monthlyEarnings: { month: string; amount: number }[];
}

// --- API Response Shapes ---

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails?: ApiErrorDetail[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// --- API Client Result (normalized) ---

export type ApiResult<T> =
  | { ok: true; data: T; meta?: PaginationMeta; message: string }
  | { ok: false; message: string; errorDetails?: ApiErrorDetail[]; status: number };
