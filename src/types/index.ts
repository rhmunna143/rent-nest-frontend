// ============================================================
// Shared Types & Enums for RentNest Frontend
// ============================================================

// --- Enums ---

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

// --- Entities ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  profileImage?: string | null;
  isActive: boolean;
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
  createdAt: string;
  updatedAt: string;
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
  tenant?: Pick<User, "id" | "name" | "email" | "phone">;
  property?: Property;
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  rentalId: string;
  tenantId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string | null;
  checkoutUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rentalId: string;
  tenantId: string;
  propertyId: string;
  rating: number;
  comment?: string | null;
  tenant?: Pick<User, "id" | "name" | "profileImage">;
  createdAt: string;
  updatedAt: string;
}

// --- API Response Shapes ---

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
