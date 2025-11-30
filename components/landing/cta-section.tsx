import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-accent/10" />
          <div className="relative z-10 p-12 md:p-16 text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Ready to create your profile?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have already simplified their
              online presence. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-lg h-14 px-8">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ahmedgmurtaza">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg h-14 px-8"
                >
                  View Demo Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
