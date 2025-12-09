"use client"

import { Card } from "@/components/ui/card"
import { 
  Camera, 
  Palette, 
  Code, 
  Briefcase, 
  Users, 
  Music, 
  Video, 
  Pencil,
  Megaphone,
  GraduationCap,
  Heart,
  Mic
} from "lucide-react"
import { PlatformIcon } from "@/components/platform-icon"

const categories = [
  {
    id: "photographers",
    title: "Photographers",
    icon: Camera,
    description: "Showcase your portfolio",
    platforms: ["instagram", "behance", "dribbble", "website", "email"],
    gradient: "from-pink-500 to-purple-500"
  },
  {
    id: "designers",
    title: "Designers",
    icon: Palette,
    description: "Display creative work",
    platforms: ["dribbble", "behance", "instagram", "linkedin", "website"],
    gradient: "from-purple-500 to-blue-500"
  },
  {
    id: "developers",
    title: "Developers",
    icon: Code,
    description: "Share your projects",
    platforms: ["github", "linkedin", "devto", "twitter", "website"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "freelancers",
    title: "Freelancers",
    icon: Briefcase,
    description: "Connect with clients",
    platforms: ["linkedin", "website", "email", "whatsapp", "resume"],
    gradient: "from-cyan-500 to-green-500"
  },
  {
    id: "content-creators",
    title: "Content Creators",
    icon: Video,
    description: "Grow your audience",
    platforms: ["youtube", "tiktok", "instagram", "twitter", "twitch"],
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: "writers",
    title: "Writers",
    icon: Pencil,
    description: "Share your stories",
    platforms: ["medium", "substack", "twitter", "linkedin", "website"],
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    id: "musicians",
    title: "Musicians",
    icon: Music,
    description: "Share your sound",
    platforms: ["spotify", "soundcloud", "youtube", "instagram", "tiktok"],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "marketers",
    title: "Marketers",
    icon: Megaphone,
    description: "Build your brand",
    platforms: ["linkedin", "twitter", "instagram", "website", "email"],
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "educators",
    title: "Educators",
    icon: GraduationCap,
    description: "Teach and inspire",
    platforms: ["youtube", "linkedin", "twitter", "website", "medium"],
    gradient: "from-yellow-500 to-amber-500"
  },
  {
    id: "podcasters",
    title: "Podcasters",
    icon: Mic,
    description: "Share your voice",
    platforms: ["spotify", "youtube", "twitter", "instagram", "website"],
    gradient: "from-teal-500 to-blue-500"
  },
  {
    id: "influencers",
    title: "Influencers",
    icon: Heart,
    description: "Engage your followers",
    platforms: ["instagram", "tiktok", "youtube", "twitter", "bluesky"],
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: "professionals",
    title: "Professionals",
    icon: Users,
    description: "Network effectively",
    platforms: ["linkedin", "twitter", "email", "resume", "website"],
    gradient: "from-slate-500 to-gray-500"
  }
]

export function CategoriesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Perfect for <span className="text-primary">Every Professional</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a creator, freelancer, or professional, we've curated the perfect platforms for your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card 
                key={category.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-6 space-y-4">
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  {/* Platform Icons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.platforms.map((platform) => (
                      <div 
                        key={platform}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:scale-110 transition-transform"
                        title={platform}
                      >
                        <PlatformIcon platform={platform} className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            And many more... <span className="font-semibold text-foreground">30+ platforms supported</span>
          </p>
        </div>
      </div>
    </section>
  )
}
