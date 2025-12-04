"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { FloatingIcons } from "./floating-icons"
import { AnimatedUrlShowcase } from "./animated-url-showcase"

export function HeroSection() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSecureUsername = () => {
    if (username.trim()) {
      // Navigate to register page with username pre-filled
      router.push(`/register?username=${encodeURIComponent(username.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSecureUsername()
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
            One Link for
            <br />
            <span className="text-primary bg-clip-text">Everything You Share</span>
          </h1>
          <p className="text-xl font-medium  text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Consolidate all your{" "}
            <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md font-medium">
              social media
            </span>
            ,{" "}
            <span className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md font-medium">
              portfolio
            </span>
            ,{" "}
            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md font-medium">
              resume
            </span>
            , and{" "}
            <span className="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md font-medium">
              projects
            </span>{" "}
            in one beautiful, customizable profile
          </p>
        </div>

        {/* Animated URL Showcase */}
        <AnimatedUrlShowcase />

        {/* Username Input CTA */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground text-3xl font-medium">
                linkin.one/
              </span>
              <Input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-44 h-20 text-3xl font-medium"
                style={{ fontSize: '1.875rem' }}
              />
            </div>
            <Button
              size="lg"
              onClick={handleSecureUsername}
              className="gap-2 h-20 px-8 text-xl font-semibold"
            >
              Secure
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              10K+
            </p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              50K+
            </p>
            <p className="text-sm text-muted-foreground">Links Shared</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              1M+
            </p>
            <p className="text-sm text-muted-foreground">Profile Visits</p>
          </div>
        </div>
      </div>
    </div>
  )
}
