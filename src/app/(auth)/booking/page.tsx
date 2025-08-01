"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserPermissions } from "@/hooks/useUser";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  BookingFilters,
  BookingList,
  NewBookingModal,
} from "@/components/booking";
import { BookingSettingsModal } from "@/components/booking/booking-settings-modal";
import { Pagination } from "@/components/ui/pagination";
import { getBookingsService, getBookingsServiceAdmin } from "@/service/booking";
import {
  BookingModel,
  BookingFilters as BookingFiltersType,
  BookingListResponse,
} from "@/models/booking.model";
import { toast } from "sonner";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

export default function BookingPage() {
  const { canManageScheduling, isAdmin } = useUserPermissions();
  const [bookings, setBookings] = useState<BookingModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState<BookingFiltersType>({
    limit: 10,
    page: 1,
    sortBy: "date",
    sortOrder: "DESC",
  });

  const fetchBookings = useCallback(
    async (currentFilters: BookingFiltersType) => {
      try {
        setIsLoading(true);
        let response: BookingListResponse;
        if (isAdmin) {
          response = await getBookingsServiceAdmin(currentFilters);
        } else {
          response = await getBookingsService(currentFilters);
        }
        setBookings(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
        });
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos", {
          description: "Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    fetchBookings(filters);
  }, [filters, fetchBookings]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<BookingFiltersType>) => {
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

  const handleSettingsSaved = () => {
    fetchBookings(filters);
  };

  const handleBookingCreated = () => {
    fetchBookings(filters);
  };

  const handleBookingUpdate = (
    bookingId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    if (newStatus === "confirmed") {
      fetchBookings(filters);
      return;
    }
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  if (!canManageScheduling) {
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
      <Header
        title="Agendamentos"
        subtitle="Acompanhe todos os agendamentos de clientes forma simples"
      />

      <div className="flex w-full h-full flex-col justify-between overflow-hidden p-6">
        <div className="flex-1 flex flex-col w-full min-h-0 border rounded-lg border-[#D7D7D7] px-4 py-8">
          <div className="flex w-full gap-20 border-b border-[#D7D7D7] mb-8">
            <BookingFilters
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />

            {isAdmin ? (
              <Button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-5 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
              >
                Ajustes de agendamento
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setIsNewBookingModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-5 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
              >
                Novo Agendamento
              </Button>
            )}
          </div>

          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <BookingList
                bookings={bookings}
                isLoading={isLoading}
                isAdmin={isAdmin}
                onBookingUpdate={handleBookingUpdate}
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

      <BookingSettingsModal
        open={isSettingsModalOpen}
        close={() => setIsSettingsModalOpen(false)}
        onOpenChange={setIsSettingsModalOpen}
        onSettingsSaved={handleSettingsSaved}
      />

      <NewBookingModal
        open={isNewBookingModalOpen}
        close={() => setIsNewBookingModalOpen(false)}
        onOpenChange={setIsNewBookingModalOpen}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  );
}
