import { z } from "zod";

export interface UserModel {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role?: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs?: boolean;
  canManageScheduling?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFilters {
  search?: string;
  status?: "active" | "inactive";
  role?: "user" | "admin";
  page?: number;
  limit?: number;
}

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  role: z.enum(["user", "admin"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export interface UserListResponse {
  data: UserModel[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
