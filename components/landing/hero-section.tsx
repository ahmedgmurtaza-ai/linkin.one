"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { FloatingIcons } from "./floating-icons"

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
      {/* Floating Icons Background */}
      <FloatingIcons />

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              ✨ All your links in one place
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
            One Link for
            <br />
            <span className="text-primary bg-clip-text">Everything You Share</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Consolidate all your social media, portfolio, resume, and important
            links in one beautiful, customizable profile
          </p>
        </div>

        {/* Username Input CTA */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                linkin.one/
              </span>
              <Input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-[85px] h-12 text-lg"
              />
            </div>
            <Button
              size="lg"
              onClick={handleSecureUsername}
              className="gap-2 h-12 px-6"
            >
              Secure
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Free to start • No credit card required
          </p>
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
