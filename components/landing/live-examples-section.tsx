import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface LiveExample {
  username: string
  name: string
  title: string
  imageUrl?: string
}

interface LiveExamplesSectionProps {
  examples?: LiveExample[]
}

export function LiveExamplesSection({ examples }: LiveExamplesSectionProps) {
  const defaultExamples: LiveExample[] = [
    {
      username: "ahmedgmurtaza",
      name: "Ahmed G. Murtaza",
      title: "Full Stack Developer",
    },
    {
      username: "sarahdesigns",
      name: "Sarah Johnson",
      title: "Product Designer",
    },
    {
      username: "michaeldev",
      name: "Michael Chen",
      title: "Software Engineer",
    },
    {
      username: "emmawriter",
      name: "Emma Rodriguez",
      title: "Freelance Writer",
    },
    {
      username: "davidmarketing",
      name: "David Park",
      title: "Marketing Consultant",
    },
    {
      username: "lisacreates",
      name: "Lisa Thompson",
      title: "Content Creator",
    },
  ]

  const displayExamples = examples || defaultExamples

  return (
    <div className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live Examples
          </h2>
          <p className="text-lg text-muted-foreground">
            See real profiles created with Linkin.one
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayExamples.map((example, index) => (
            <Link
              key={index}
              href={`/${example.username}`}
              target="_blank"
              className="group"
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
                {/* Profile Header */}
                <div className="h-24 bg-linear-to-br from-primary/20 to-accent/20 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold text-primary shadow-lg">
                      {example.name[0]}
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="pt-12 p-6 text-center space-y-2">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {example.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {example.title}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-primary pt-2">
                    <span className="font-mono">linkin.one/{example.username}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="px-6 pb-6">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    size="sm"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to see your profile here?
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Create Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
