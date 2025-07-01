"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function LogoutButton({ children, className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <Button onClick={handleLogout} className={className}>
      {children || "Sair"}
    </Button>
  );
}
