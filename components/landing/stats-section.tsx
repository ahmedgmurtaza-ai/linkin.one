export function StatsSection() {
  const stats = [
    {
      value: "10,000+",
      label: "Active Users",
      description: "Professionals trust us",
    },
    {
      value: "50,000+",
      label: "Links Shared",
      description: "Across all platforms",
    },
    {
      value: "1M+",
      label: "Profile Visits",
      description: "Monthly page views",
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Always available",
    },
  ]

  return (
    <div className="py-16 px-4 md:px-8 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
