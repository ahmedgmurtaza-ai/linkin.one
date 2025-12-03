"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import type { ProfileColorTheme } from "@/lib/types";

interface ColorThemeSelectorProps {
  currentTheme?: ProfileColorTheme;
  onSelect: (theme: ProfileColorTheme) => void;
}

const PRESET_COLORS = [
  { value: "#d5534d", label: "Coral Red", rgb: "rgb(213, 83, 77)" },
  { value: "#a88bf8", label: "Purple", rgb: "rgb(168, 139, 248)" },
  { value: "#93c5f9", label: "Sky Blue", rgb: "rgb(147, 197, 249)" },
  { value: "#e18c45", label: "Orange", rgb: "rgb(225, 140, 69)" },
  { value: "#ffd699", label: "Peach", rgb: "rgb(255, 214, 153)" },
  { value: "#7ed44d", label: "Green", rgb: "rgb(126, 212, 77)" },
];

// Function to lighten a color for the second shade
function lightenColor(hex: string, percent: number = 30): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100))));
  const g = Math.min(255, (((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100))));
  const b = Math.min(255, ((num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100))));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export function ColorThemeSelector({
  currentTheme = "#a88bf8",
  onSelect,
}: ColorThemeSelectorProps) {
  const [customColor, setCustomColor] = useState(currentTheme);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onSelect(color);
  };

  return (
    <div className="space-y-6">
      {/* Preset Colors */}
      <div>
        <h4 className="text-sm font-medium mb-3">Preset Colors</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {PRESET_COLORS.map((color) => {
            const lightColor = lightenColor(color.value);
            const isSelected = currentTheme?.toLowerCase() === color.value.toLowerCase();
            
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  setCustomColor(color.value);
                  onSelect(color.value);
                }}
                className={`relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
                title={color.label}
              >
                {/* Color preview with gradient */}
                <div className="w-full h-16 rounded-md overflow-hidden shadow-sm">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${color.value} 0%, ${lightColor} 100%)`,
                    }}
                  />
                </div>
                
                {/* Label */}
                <span className="text-xs font-medium text-center line-clamp-1">
                  {color.label}
                </span>
                
                {/* Check icon for selected */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="pt-4 border-t">
        <Label htmlFor="custom-color" className="text-sm font-medium mb-3 block">
          Custom Color
        </Label>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="h-16 w-16 cursor-pointer border-2 p-1"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Input
              type="text"
              value={customColor}
              onChange={(e) => {
                const value = e.target.value;
                setCustomColor(value);
                // Only update if it's a valid hex color
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                  onSelect(value);
                }
              }}
              placeholder="#a88bf8"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter a hex color code or use the color picker
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground">
          The selected color will be used as the primary theme color. A lighter, professional shade will be automatically generated for contrast.
        </p>
      </div>
    </div>
  );
}
