"use client"

export function AnimatedProfessions() {
  const professionsRow1 = [
    "Photographers",
    "Designers",
    "Developers",
    "Freelancers",
    "Content Creators",
    "Writers",
    "Musicians",
    "Marketers",
    "Educators",
    "Podcasters",
    "Influencers",
    "Professionals",
  ]

  const professionsRow2 = [
    "Artists",
    "Entrepreneurs",
    "Consultants",
    "Coaches",
    "Streamers",
    "Bloggers",
    "Youtubers",
    "Software Engineers",
    "UX Designers",
    "Product Managers",
    "Data Scientists",
    "Social Media Managers",
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Trusted by <span className="text-primary">Professionals</span> Worldwide
        </h2>
        <p className="text-xl text-muted-foreground">
          Join thousands of creators and professionals showcasing their work
        </p>
      </div>

      <div className="space-y-8">
        {/* Row 1 - Moving Left to Right */}
        <div className="relative">
          <div className="flex animate-scroll-left">
            {[...professionsRow1, ...professionsRow1].map((profession, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 mx-4 px-8 py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20 backdrop-blur-sm"
              >
                <span className="text-lg font-semibold whitespace-nowrap">
                  {profession}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Moving Right to Left */}
        <div className="relative">
          <div className="flex animate-scroll-right">
            {[...professionsRow2, ...professionsRow2].map((profession, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 mx-4 px-8 py-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-full border border-accent/20 backdrop-blur-sm"
              >
                <span className="text-lg font-semibold whitespace-nowrap">
                  {profession}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Moving Left to Right (Different speed) */}
        <div className="relative">
          <div className="flex animate-scroll-left-slow">
            {[...professionsRow1.slice(0, 6), ...professionsRow2.slice(0, 6), ...professionsRow1.slice(0, 6), ...professionsRow2.slice(0, 6)].map((profession, index) => (
              <div
                key={`row3-${index}`}
                className="flex-shrink-0 mx-4 px-8 py-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-full border border-secondary/20 backdrop-blur-sm"
              >
                <span className="text-lg font-semibold whitespace-nowrap">
                  {profession}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
