interface FeatureSectionProps {
  title: string
  description: string
  features: string[]
  imageSide: "left" | "right"
  icon: React.ReactNode
}

export function FeatureSection({
  title,
  description,
  features,
  imageSide,
  icon,
}: FeatureSectionProps) {
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center ${
            imageSide === "right" ? "" : "md:flex-row-reverse"
          }`}
        >
          {/* Content Side */}
          <div className={imageSide === "right" ? "md:order-1" : "md:order-2"}>
            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-lg">
                {icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground">{description}</p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-primary shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual Side */}
          <div className={imageSide === "right" ? "md:order-2" : "md:order-1"}>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="aspect-square flex items-center justify-center">
                  <div className="w-full space-y-4">
                    {/* Mockup content */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-primary/10 rounded-2xl">
                        {icon}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded-full w-3/4 mx-auto" />
                      <div className="h-3 bg-muted rounded-full w-full" />
                      <div className="h-3 bg-muted rounded-full w-5/6 mx-auto" />
                    </div>
                    <div className="pt-6 grid grid-cols-2 gap-3">
                      <div className="h-12 bg-primary/20 rounded-lg" />
                      <div className="h-12 bg-accent/20 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
