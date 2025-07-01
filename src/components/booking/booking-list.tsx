"use client";

import React from "react";
import { BookingModel } from "@/models/booking.model";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

interface BookingListProps {
  bookings: BookingModel[];
  isLoading?: boolean;
  isAdmin: boolean;
}

const statusMap = {
  pending: {
    label: "Pendente",
    className: "bg-[#F5F5F5] text-[#676767] border border-[#A4AAAD]",
    backgroundColor: "#ffff",
  },
  confirmed: {
    label: "Agendado",
    className: "bg-[#DBFFFA] text-[#10C3A9] border border-[#10C3A9]",
    backgroundColor: "#DBFFFA",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-[#FFF5F5] text-[#EA0000] border border-[#FF0000]",
    backgroundColor: "#FFF5F5",
  },
};

export function BookingList({
  bookings,
  isLoading = false,
  isAdmin = false,
}: BookingListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <Image
          aria-hidden
          src="/dashboard-report-icon.svg"
          alt="File icon"
          width={200}
          height={200}
          className="mb-8"
        />
        <p className="text-black text-[22px] font-semibold">
          Nada por aqui ainda...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="min-w-full">
          <thead className="bg-white sticky top-0 z-10 border-b border-[#D7D7D7] ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Data agendamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Sala de agendamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Status transação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7D7D7]">
            {bookings.map((booking) => {
              const status = statusMap[booking.status];
              return (
                <tr
                  key={booking.id}
                  className={`bg-[${status.backgroundColor}]`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2 text-[14px] text-black font-normal">
                      <div className="">
                        {formatInTimeZone(
                          new Date(booking.date),
                          "UTC",
                          "dd/MM/yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </div>
                      <div>às {booking.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-black font-medium text-[14px]">
                      {booking.user.name} {booking.user.lastName}
                    </p>
                    <p className="text-black font-normal text-[13px]">
                      {booking.user.role === "admin"
                        ? "Administrador"
                        : "Usuário"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="rounded-full bg-black text-white w-min px-2 py-1 text-[12px] flex gap-1">
                      <p>Sala</p>
                      <b>{booking.room.number}</b>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-2 justify-center py-4 whitespace-nowrap gap-4 flex">
                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 rounded-full text-white bg-black cursor-pointer hover:bg-black/80"
                      >
                        <X />
                      </Button>
                    )}

                    {booking.status === "pending" && isAdmin && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 rounded-full text-white bg-black cursor-pointer hover:bg-black/80"
                      >
                        <Check />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
