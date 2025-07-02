"use client";

import { UserModel } from "@/models/user.model";
import { useUser } from "@/hooks/useUser";
import {
  Wind,
  CalendarDays,
  ListChecks,
  User,
  Users,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  children: ReactNode;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  visible: boolean;
}

export default function Sidebar({ children }: SidebarProps) {
  const { user, isLoading, isAuthenticated } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const buildMenuItems = (user: UserModel): MenuItem[] => {
    const baseItems = [
      {
        label: "Agendamentos",
        href: "/booking",
        icon: <CalendarDays size={20} />,
        visible: user?.role === "admin" || user?.canManageScheduling === true,
      },
      {
        label: "Clientes",
        href: "/clients",
        icon: <Users size={20} />,
        visible: user?.role === "admin",
      },
      {
        label: "Logs",
        href: "/logs",
        icon: <ListChecks size={20} />,
        visible: user?.role === "admin" || user?.canViewLogs === true,
      },
      {
        label: "Minha conta",
        href: "/profile",
        icon: <User size={20} />,
        visible: user?.role === "user",
      },
    ];

    return baseItems.filter((item) => item.visible);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <div className="ml-2 text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const visibleItems = buildMenuItems(user);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-64 border-r border-[#D7D7D7] h-full">
        <div className="h-24 border-b border-[#D7D7D7]">
          <div className="flex items-center pl-4 h-full">
            <Wind size={48} />
          </div>
        </div>

        <div className="flex-1">
          <ul className="flex flex-col gap-2 p-4">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${
                    isActive ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="border-t border-[#D7D7D7] py-2 px-4 flex justify-between items-center cursor-pointer">
              <div className="mb-3 flex flex-col items-start">
                <p className="text-sm font-medium">
                  {user.name} {user.lastName}
                </p>
                <p className="text-xs">
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </p>
              </div>

              <ChevronDown size={20} className="text-gray-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>
              <LogoutButton className="w-full text-sm" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex overflow-y-auto h-full w-full flex-col bg-white">
        {children}
      </div>
    </div>
  );
}
