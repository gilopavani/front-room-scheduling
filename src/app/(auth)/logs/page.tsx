"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserPermissions } from "@/hooks/useUser";
import { LogoutButton } from "@/components/auth/logout-button";
import { LogFilters, LogList } from "@/components/log";
import { Pagination } from "@/components/ui/pagination";
import { getLogsService, getLogsServiceAdmin } from "@/service/log";
import {
  LogModel,
  LogFilters as LogFiltersType,
  LogListResponse,
} from "@/models/log.model";
import { toast } from "sonner";
import Header from "@/components/header";

export default function LogsPage() {
  const { isAdmin, canViewLogs } = useUserPermissions();
  const [logs, setLogs] = useState<LogModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState<LogFiltersType>({
    limit: 10,
    page: 1,
  });

  const fetchLogs = useCallback(
    async (currentFilters: LogFiltersType) => {
      try {
        setIsLoading(true);
        let response: LogListResponse;
        if (isAdmin) {
          response = await getLogsServiceAdmin(currentFilters);
        } else {
          response = await getLogsService(currentFilters);
        }
        setLogs(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
        });
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
        toast.error("Erro ao carregar logs", {
          description: "Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<LogFiltersType>) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
        page: 1,
      }));
    },
    []
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "ASC" | "DESC") => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        sortBy,
        sortOrder,
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
  };

  if (!isAdmin && !canViewLogs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col">
      <Header title="Logs" subtitle="Acompanhe todos as Logs de clientes" />

      <div className="flex w-full h-full flex-col justify-between overflow-hidden p-6">
        <div className="flex-1 flex flex-col w-full min-h-0 border rounded-lg border-[#D7D7D7] px-4 py-8">
          <div className="flex w-full border-b border-[#D7D7D7] mb-8">
            <div className="flex w-4/5 items-center">
              <LogFilters
                onFiltersChange={handleFiltersChange}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <LogList
                logs={logs}
                isLoading={isLoading}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          totalItems={pagination.totalItems}
          itemsPerPage={filters.limit || 10}
        />
      </div>
    </div>
  );
}
