import { z } from "zod";

export interface BookingModel {
  id: string;
  date: string;
  time: string;
  userId: string;
  roomId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    lastName: string;
    role: "user" | "admin";
  };
  room: {
    number: string;
  };
}

export interface BookingListResponse {
  data: BookingModel[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface BookingFilters {
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export const bookingFiltersSchema = z.object({
  search: z.string().optional(),
  date: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type BookingFiltersSchema = z.infer<typeof bookingFiltersSchema>;
