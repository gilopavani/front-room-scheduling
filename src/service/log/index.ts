import api from "@/lib/api";
import { LogListResponse, LogFilters } from "@/models/log.model";

export async function getLogsService(
  filters: LogFilters = {}
): Promise<LogListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await api.get<LogListResponse>(
    `/me/logs?${params.toString()}`
  );
  return response.data;
}

export async function getLogsServiceAdmin(
  filters: LogFilters = {}
): Promise<LogListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response = await api.get<LogListResponse>(`/log?${params.toString()}`);
  return response.data;
}
