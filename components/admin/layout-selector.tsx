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
    <div className="space-y-4">
      <div>
        <label className="text-base font-medium text-foreground">Profile Layout</label>
        <p className="text-sm text-muted-foreground mt-1">Choose how your links are displayed</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {LAYOUT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-all ${
              currentLayout === option.value
                ? "bg-primary/10 text-primary shadow-md ring-2 ring-primary/20"
                : "bg-card text-muted-foreground hover:text-foreground hover:shadow-md shadow-sm"
            }`}
          >
            {LAYOUT_ICONS[option.value]}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
