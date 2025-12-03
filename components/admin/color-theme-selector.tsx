"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ProfileColorTheme } from "@/lib/types";

interface ColorThemeSelectorProps {
  currentTheme?: ProfileColorTheme;
  onSelect: (theme: ProfileColorTheme) => void;
}

const COLOR_THEMES: {
  value: ProfileColorTheme;
  label: string;
  description: string;
  leftColor: string;
  rightColor: string;
}[] = [
  {
    value: "blue-purple",
    label: "Blue & Purple",
    description: "Cool and professional",
    leftColor: "bg-blue-100",
    rightColor: "bg-purple-100",
  },
  {
    value: "green-teal",
    label: "Green & Teal",
    description: "Fresh and natural",
    leftColor: "bg-green-100",
    rightColor: "bg-teal-100",
  },
  {
    value: "orange-pink",
    label: "Orange & Pink",
    description: "Warm and vibrant",
    leftColor: "bg-orange-100",
    rightColor: "bg-pink-100",
  },
];

export function ColorThemeSelector({
  currentTheme = "blue-purple",
  onSelect,
}: ColorThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLOR_THEMES.map((theme) => (
          <Button
            key={theme.value}
            variant="outline"
            className={`h-auto flex flex-col items-start p-4 space-y-3 relative ${
              currentTheme === theme.value
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => onSelect(theme.value)}
          >
            {/* Color preview */}
            <div className="w-full h-20 rounded-md overflow-hidden flex">
              <div className={`flex-1 ${theme.leftColor}`} />
              <div className={`flex-1 ${theme.rightColor}`} />
            </div>

            {/* Theme info */}
            <div className="w-full text-left space-y-1">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">{theme.label}</span>
                {currentTheme === theme.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-normal">
                {theme.description}
              </p>
            </div>
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Choose a color combination for your profile's split layout. The left color will be applied to the profile section, and the right color to the links section.
      </p>
    </div>
  );
}
