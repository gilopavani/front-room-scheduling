import api from "@/lib/api";
import { BookingListResponse, BookingFilters } from "@/models/booking.model";
import {
  CreateBookingModel,
  CreateBookingResponse,
  AvailableSlotsResponse,
} from "@/models/create-booking.model";

export async function getBookingsService(
  filters: BookingFilters = {}
): Promise<BookingListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await api.get<BookingListResponse>(
    `/me/bookings?${params.toString()}`
  );
  return response.data;
}

export async function getBookingsServiceAdmin(
  filters: BookingFilters = {}
): Promise<BookingListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await api.get<BookingListResponse>(
    `/booking?${params.toString()}`
  );
  return response.data;
}

export async function getAvailableSlotsService(
  roomId: string,
  date: string
): Promise<AvailableSlotsResponse> {
  const response = await api.post<AvailableSlotsResponse>(
    `/booking/free/${roomId}`,
    { date }
  );
  return response.data;
}

export async function createBookingService(
  bookingData: CreateBookingModel
): Promise<CreateBookingResponse> {
  const response = await api.post<CreateBookingResponse>(
    "/booking",
    bookingData
  );
  return response.data;
}
