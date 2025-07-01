"use server";

import api from "@/lib/api";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth-config";
import {
  CreateBookingModel,
  CreateBookingResponse,
} from "@/models/create-booking.model";

export interface BookingActionResponse {
  success: boolean;
  status?: "confirmed" | "cancelled";
  error?: string;
}

export interface CreateBookingActionResponse {
  success: boolean;
  booking?: CreateBookingResponse;
  error?: string;
}

export async function cancelBookingAction(
  bookingId: string
): Promise<BookingActionResponse> {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.accessToken) {
      return {
        success: false,
        error: "Não autorizado",
      };
    }

    const response = await api.post(
      `/booking/cancel/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.data?.status === "cancelled") {
      return {
        success: true,
        status: "cancelled",
      };
    }

    return {
      success: false,
      error: "Falha ao cancelar agendamento",
    };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Erro ao cancelar agendamento"
        : "Erro ao cancelar agendamento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function confirmBookingAction(
  bookingId: string
): Promise<BookingActionResponse> {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.accessToken) {
      return {
        success: false,
        error: "Não autorizado",
      };
    }

    const response = await api.post(
      `/booking/confirm/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.data?.status === "confirmed") {
      return {
        success: true,
        status: "confirmed",
      };
    }

    return {
      success: false,
      error: "Falha ao confirmar agendamento",
    };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Erro ao confirmar agendamento"
        : "Erro ao confirmar agendamento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function createBookingAction(
  bookingData: CreateBookingModel
): Promise<CreateBookingActionResponse> {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.accessToken) {
      return {
        success: false,
        error: "Não autorizado",
      };
    }

    const response = await api.post<CreateBookingResponse>(
      "/booking",
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return {
      success: true,
      booking: response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Erro ao criar agendamento"
        : "Erro ao criar agendamento";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
