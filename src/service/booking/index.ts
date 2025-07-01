import api from "@/lib/api";
import { BookingListResponse, BookingFilters } from "@/models/booking.model";

export async function getBookingsService(
  filters: BookingFilters = {}
): Promise<BookingListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  const response = await api.get<BookingListResponse>(
    `/booking?${params.toString()}`
  );
  return response.data;
}
