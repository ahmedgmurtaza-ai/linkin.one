interface UserProfile {
  username: string
  name: string
  bio: string
  theme: string
  layout: string
}

interface ProfileShowcaseProps {
  profiles: UserProfile[]
}

export function ProfileShowcase({ profiles }: ProfileShowcaseProps) {
  return (
    <div className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beautiful profiles created by our users
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals showcasing their work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="h-32 bg-linear-to-br from-primary/20 to-accent/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-card border-4 border-background flex items-center justify-center text-2xl font-bold text-primary">
                    {profile.name[0]}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-12 text-center space-y-3">
                <h3 className="font-bold text-lg text-foreground">
                  {profile.name}
                </h3>
                <p className="text-sm text-primary">
                  linkin.one/{profile.username}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {profile.bio}
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    {profile.theme}
                  </span>
                  <span className="px-2 py-1 text-xs bg-accent/10 text-accent-foreground rounded">
                    {profile.layout}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
