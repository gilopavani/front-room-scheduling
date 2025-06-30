"use client";

import React from "react";
import { useUserPermissions } from "@/hooks/useUser";
import { LogoutButton } from "@/components/auth/logout-button";

export default function BookingPage() {
  const { canManageScheduling, isAdmin } = useUserPermissions();

  if (!canManageScheduling && !isAdmin) {
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Sistema de Agendamento de Salas
        </h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Área de Agendamentos</h2>
        <p className="text-gray-600 mb-4">
          Bem-vindo ao sistema de agendamento de salas. Aqui você pode:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canManageScheduling && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Gerenciar Agendamentos
              </h3>
              <p className="text-blue-700 text-sm">
                Criar, editar e cancelar agendamentos de salas.
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Administração
              </h3>
              <p className="text-green-700 text-sm">
                Acesso completo para confirmar e gerenciar todos os
                agendamentos.
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Visualizar Salas
            </h3>
            <p className="text-gray-700 text-sm">
              Consultar disponibilidade e informações das salas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
