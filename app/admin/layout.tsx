"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Force light mode for dashboard
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");

    return () => {
      // Cleanup when leaving admin
      document.documentElement.classList.remove("light");
    };
  }, []);

  return <SidebarProvider>{children}</SidebarProvider>;
}
