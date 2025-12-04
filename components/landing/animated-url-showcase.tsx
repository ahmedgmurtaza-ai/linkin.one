"use client";

import { useState, useEffect } from "react";
import { PlatformIcon } from "@/components/platform-icon";
import { getAllPlatforms } from "@/lib/platforms-config";

const SHOWCASE_PLATFORMS = [
  "x",
  "linkedin",
  "github",
  "youtube",
  "instagram",
  "behance",
  "dribbble",
  "medium",
  "spotify",
  "tiktok",
  "resume",
];

export function AnimatedUrlShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const platforms = getAllPlatforms().filter((p) =>
    SHOWCASE_PLATFORMS.includes(p.id)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % platforms.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [platforms.length]);

  const currentPlatform = platforms[currentIndex];
  const nextPlatform = platforms[(currentIndex + 1) % platforms.length];

  if (!currentPlatform) return null;

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Animated URL Container */}
      <div className="relative h-20 overflow-hidden">
        <div
          key={currentIndex}
          className="absolute inset-0 flex items-center gap-4 px-4"
        >
          {/* Animated Icon */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            {platforms.map((platform, index) => (
              <div
                key={platform.id}
                className="absolute inset-0 flex items-center justify-center rounded-xl transition-all duration-500"
                style={{ 
                  backgroundColor: platform.color,
                  transform: `translateY(${(index - currentIndex) * 100}%)`,
                  opacity: index === currentIndex ? 1 : 0
                }}
              >
                <PlatformIcon
                  platform={platform.id}
                  className="h-8 w-8 text-white"
                  showColor={false}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex gap-1 items-center">
            <p className="text-3xl font-medium text-muted-foreground">
              linkin.one/alex/
            </p>
            {/* Animated platform name */}
            <div className="relative h-10 min-w-40 overflow-hidden">
              {platforms.map((platform, index) => {
                const isActive = index === currentIndex;
                const isPrev =
                  index ===
                  (currentIndex - 1 + platforms.length) % platforms.length;

                return (
                  <span
                    key={platform.id}
                    className={`absolute top-0 left-0 text-3xl font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-500 inline-block ${
                      isActive
                        ? "animate-slideInUp"
                        : isPrev
                          ? "animate-slideOutUp"
                          : ""
                    }`}
                    style={{
                      backgroundColor: `${platform.color}20`,
                      color: platform.color,
                      transform: `translateY(${(index - currentIndex) * 100}%)`,
                      opacity: index === currentIndex ? 1 : 0
                    }}
                  >
                    {platform.id}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-slideOutUp {
          animation: slideOutUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}