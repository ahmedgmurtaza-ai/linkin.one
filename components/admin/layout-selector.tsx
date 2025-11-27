"use client"

import type React from "react"

import { LAYOUT_OPTIONS, type ProfileLayout } from "@/lib/types"
import { LayoutList, Columns2, Grid2X2 } from "lucide-react"

interface LayoutSelectorProps {
  currentLayout: ProfileLayout
  onSelect: (layout: ProfileLayout) => void
}

const LAYOUT_ICONS: Record<ProfileLayout, React.ReactNode> = {
  classic: <LayoutList className="h-5 w-5" />,
  split: <Columns2 className="h-5 w-5" />,
  grid: <Grid2X2 className="h-5 w-5" />,
}

export function LayoutSelector({ currentLayout, onSelect }: LayoutSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Profile Layout</label>
      <div className="grid grid-cols-3 gap-3">
        {LAYOUT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              currentLayout === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {LAYOUT_ICONS[option.value]}
            <span className="text-xs font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
