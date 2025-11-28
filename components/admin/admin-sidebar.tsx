"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Link2, BarChart3, Layout, Link as LinkIcon } from "lucide-react";

type AdminTab = "profile" | "links" | "layout" | "analytics";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "links" as const, label: "Links", icon: Link2 },
    { id: "layout" as const, label: "Layout", icon: Layout },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm p-6 space-y-1 overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4 group">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg group-hover:scale-110 transition-transform">
          <LinkIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-none">linkin.one</h2>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </Link>

      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
          Dashboard
        </p>
      </div>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-11 text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "hover:bg-muted/50"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon className="h-5 w-5" />
          {tab.label}
        </Button>
      ))}
    </aside>
  );
}
