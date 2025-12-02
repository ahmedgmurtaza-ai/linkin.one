import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PricingPreviewSection() {
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to get started. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Free Forever
                </h3>
                <p className="text-muted-foreground">
                  Perfect for getting started
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Unlimited links</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    Basic analytics & tracking
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    Multiple themes & layouts
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">QR code generation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    Individual platform URLs
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">Mobile responsive</span>
                </div>
              </div>

              <Link href="/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-primary-foreground/20 backdrop-blur-sm text-xs font-semibold rounded-full">
                POPULAR
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-primary-foreground/80">
                  For professionals & creators
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$9</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Everything in Free, plus:</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Custom domain support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Advanced analytics & exports</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Custom color themes</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Remove Linkin.one branding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Early access to new features</span>
                </div>
              </div>

              <Link href="/register" className="block">
                <Button
                  variant="secondary"
                  className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  size="lg"
                >
                  Start Pro Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          💳 No credit card required • Cancel anytime • 14-day money-back
          guarantee
        </div>
      </div>
    </div>
  )
}
