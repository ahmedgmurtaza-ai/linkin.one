import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            One link for <span className="text-primary">everything</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Create your personal profile page with all your important links in one place. Simple, fast, and beautiful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/admin">
              <Button size="lg" className="gap-2">
                Create Your Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ahmedgmurtaza">
              <Button variant="outline" size="lg">
                View Demo Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
