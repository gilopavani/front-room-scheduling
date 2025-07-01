import { z } from "zod";

export interface LogModel {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  userEmail: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface LogFilters {
  search?: string;
  action?: string;
  entity?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const logFiltersSchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export interface LogListResponse {
  data: LogModel[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
