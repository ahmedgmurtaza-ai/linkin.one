"use client";

import { useState } from "react";
import { getAllPlatforms, getAllCategories } from "@/lib/platforms-config";
import { PlatformIcon } from "@/components/platform-icon";

export function SocialPlatformsSection() {
  const categories = getAllCategories();
  const platforms = getAllPlatforms();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPlatforms =
    activeCategory === "all"
      ? platforms
      : platforms.filter(platform => platform.category === activeCategory);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Connect All Your Platforms
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Consolidate all your social media, portfolio, resume, and projects in one beautiful, customizable profile
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            All Platforms
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: platform.color }}
              >
                <PlatformIcon
                  platform={platform.id}
                  className="h-8 w-8 text-white"
                  showColor={false}
                />
              </div>
              <h3 className="font-medium text-foreground text-center">{platform.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}