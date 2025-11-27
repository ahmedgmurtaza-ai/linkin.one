"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Link2, BarChart3, Layout } from "lucide-react"

type AdminTab = "profile" | "links" | "layout" | "analytics"

interface AdminSidebarProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "links" as const, label: "Links", icon: Link2 },
    { id: "layout" as const, label: "Layout", icon: Layout },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ]

  return (
    <aside className="w-56 border-r border-border bg-card/50 p-4 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3">Dashboard</p>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn("w-full justify-start gap-3", activeTab === tab.id && "bg-secondary text-foreground")}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Button>
      ))}
    </aside>
  )
}
