"use server";
import { UserModel } from "@/models/user.model";
import { getUserFromCookie } from "@/utils/getUserFromCoockie";
import { Wind, CalendarDays, ListChecks, User, Users } from "lucide-react";
import { headers } from "next/headers";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";

interface SidebarProps {
  children: ReactNode;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  visible: boolean;
}

export default async function Sidebar({ children }: SidebarProps) {
  const user = await getUserFromCookie();

  // Obter o pathname atual a partir dos headers
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const buildMenuItems = (user: UserModel): MenuItem[] => {
    const baseItems = [
      {
        label: "Booking",
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
        label: "Minha Conta",
        href: "/my-account",
        icon: <User size={20} />,
        visible: user?.role === "user",
      },
    ];

    return baseItems.filter((item) => item.visible);
  };

  if (!user) {
    redirect("/login");
    return null;
  }

  const visibleItems = buildMenuItems(user);

  const goTo = (href: string) => {
    if (pathname !== href) {
      redirect(href);
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
        <div>
          <ul className="flex flex-col gap-2 p-4">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={item.label}
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
      </div>
      <div className="flex-1 overflow-y-auto p-4 h-full bg-white">
        {children}
      </div>
    </div>
  );
}
