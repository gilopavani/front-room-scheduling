"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LogModel } from "@/models/log.model";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LogListProps {
  logs: LogModel[];
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  onSortChange: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
}

export function LogList({
  logs,
  isLoading = false,
  sortBy,
  sortOrder,
  onSortChange,
}: LogListProps) {
  const handleDateSortClick = () => {
    if (sortBy === "createdAt") {
      const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
      onSortChange("createdAt", newOrder);
    } else {
      onSortChange("createdAt", "ASC");
    }
  };

  const renderSortIcon = () => {
    if (sortBy !== "createdAt") return null;

    return sortOrder === "ASC" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR });
    const formattedTime = format(date, "HH:mm", { locale: ptBR });
    return `${formattedDate} às ${formattedTime}`;
  };

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

  if (logs.length === 0) {
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
          <thead className="bg-white sticky top-0 z-10 border-b border-[#D7D7D7]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Tipo de atividade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Módulo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                <button
                  onClick={handleDateSortClick}
                  className="flex items-center hover:text-gray-600 transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  Data e horário
                  {renderSortIcon()}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7D7D7]">
            {logs.map((log) => (
              <tr key={log.id} className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-black font-medium text-[14px]">
                    {log.user.name} {log.user.lastName}
                  </p>
                  <p className="text-black font-normal text-[13px]">
                    {log.user.email}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#F6F4F1] border border-[#D7D7D7] text-black">
                    {log.activity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#F6F4F1] border border-[#D7D7D7] text-black">
                    {log.module}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#F6F4F1] border border-[#D7D7D7] text-black">
                    {formatDateTime(log.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
