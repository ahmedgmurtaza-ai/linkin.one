"use client";

import { useEffect } from "react";
import type { ProfileTheme } from "@/lib/types";

interface ProfileThemeProviderProps {
  theme?: ProfileTheme;
  children: React.ReactNode;
}

export function ProfileThemeProvider({
  theme = "system",
  children,
}: ProfileThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "system") {
      // Use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return <>{children}</>;
}
