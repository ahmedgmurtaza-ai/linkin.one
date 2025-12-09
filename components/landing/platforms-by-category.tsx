"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformIcon } from "@/components/platform-icon"
import platformsData from "@/lib/platforms-config.json"

export function PlatformsByCategory() {
  const [activeTab, setActiveTab] = useState("social")

  // Group platforms by category
  const platformsByCategory = platformsData.platforms.reduce((acc, platform) => {
    const category = platform.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(platform)
    return acc
  }, {} as Record<string, typeof platformsData.platforms>)

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-primary">30+</span> Platforms Supported
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect all your social profiles, portfolios, and links in one place
          </p>
        </div>

        {/* Tabbed Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center w-full gap-3 h-auto bg-transparent p-2 mb-8">
            {platformsData.categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary px-6 py-3 text-sm md:text-base rounded-full border-2 border-muted-foreground/20 bg-background hover:border-primary/50 transition-all"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {platformsData.categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {platformsByCategory[category.id]?.map((platform) => (
                  <div
                    key={platform.id}
                    className="group relative overflow-hidden  transition-all duration-300 "
                  >
                    <div className="p-6 flex flex-col items-center justify-center space-y-3">
                      {/* Platform Icon with background color */}
                      <div
                        className="w-18 h-18 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: platform.color,
                          background: platform.gradient || platform.color,
                        }}
                      >
                        <PlatformIcon
                          platform={platform.id}
                          className="w-7 h-7 text-white"
                        />
                      </div>
                      
                      {/* Platform Name */}
                      <h3 className="text-sm font-semibold text-center">
                        {platform.title}
                      </h3>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
