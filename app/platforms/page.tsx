import Link from "next/link";
import platformsData from "@/lib/platforms-config.json";

export default function PlatformsPage() {
  const { categories, platforms } = platformsData;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connect All Your Platforms
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose from {platforms.length} platforms across {categories.length} categories to build your perfect link-in-bio
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => {
          const categoryPlatforms = platforms.filter(
            (p) => p.category === category.id
          );

          if (categoryPlatforms.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {category.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>
              </div>

              {/* Platform Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryPlatforms.map((platform) => (
                  <Link
                    key={platform.id}
                    href={`/platforms/${platform.id}`}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Platform Icon Placeholder */}
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                          style={{
                            background: platform.color || "#6366F1",
                          }}
                        >
                          {platform.title.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {platform.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        {platform.urlPattern || "Custom link"}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                        Add →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="mb-6 text-blue-100">
            Create your custom link-in-bio page in minutes
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
