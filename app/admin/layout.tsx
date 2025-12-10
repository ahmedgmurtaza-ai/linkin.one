"use client";

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

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      {children}
    </div>
  );
}
