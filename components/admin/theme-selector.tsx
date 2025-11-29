"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ProfileTheme } from "@/lib/types";

interface ThemeSelectorProps {
  currentTheme?: ProfileTheme;
  onSelect: (theme: ProfileTheme) => void;
}

export function ThemeSelector({
  currentTheme = "system",
  onSelect,
}: ThemeSelectorProps) {
  const themes: {
    value: ProfileTheme;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Always show your profile in light mode",
      icon: <Sun className="h-5 w-5" />,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Always show your profile in dark mode",
      icon: <Moon className="h-5 w-5" />,
    },
    {
      value: "system",
      label: "System",
      description: "Match visitor's system preferences",
      icon: <Monitor className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Button
            key={theme.value}
            variant={currentTheme === theme.value ? "default" : "outline"}
            className={`h-auto flex-col items-start p-4 space-y-2 ${
              currentTheme === theme.value
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => onSelect(theme.value)}
          >
            <div className="flex items-center gap-2 w-full">
              {theme.icon}
              <span className="font-semibold">{theme.label}</span>
            </div>
            <p className="text-xs text-left font-normal opacity-90">
              {theme.description}
            </p>
          </Button>
        ))}
      </div>
    </div>
  );
}
