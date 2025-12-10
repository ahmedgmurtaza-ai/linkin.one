import Link from "next/link";
import { notFound } from "next/navigation";
import platformsData from "@/lib/platforms-config.json";

interface PlatformPageProps {
  params: Promise<{
    platform: string;
  }>;
}

export async function generateStaticParams() {
  return platformsData.platforms.map((platform) => ({
    platform: platform.id,
  }));
}

export default async function PlatformPage({ params }: PlatformPageProps) {
  const { platform: platformId } = await params;
  const platform = platformsData.platforms.find(
    (p) => p.id === platformId
  );

  if (!platform) {
    notFound();
  }

  const category = platformsData.categories.find(
    (c) => c.id === platform.category
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/platforms"
          className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
          ← Back to all platforms
        </Link>

        {/* Platform Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {/* Platform Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{
                background: platform.color || "#6366F1",
              }}
            >
              {platform.title.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {platform.title}
                </h1>
                {category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {category.title}
                  </span>
                )}
              </div>
              {platform.urlPattern && (
                <p className="text-slate-600 dark:text-slate-400">
                  {platform.urlPattern}
                </p>
              )}
            </div>
          </div>

          {/* Platform Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Category
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {category?.title || "Uncategorized"}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                URL Pattern
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {platform.placeholder}
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all text-center"
            >
              Add {platform.title} to Your Profile
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-center"
            >
              Sign In to Add Link
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            How to Add Your {platform.title} Link
          </h2>
          <ol className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span>Create an account or sign in to your profile</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span>
                Add your {platform.title} link using the format:{" "}
                <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-sm">
                  {platform.placeholder}
                </code>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <span>
                Customize the appearance and share your link-in-bio page
              </span>
            </li>
          </ol>
        </div>

        {/* Related Platforms */}
        {category && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              More {category.title} Platforms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformsData.platforms
                .filter(
                  (p) => p.category === platform.category && p.id !== platform.id
                )
                .slice(0, 6)
                .map((relatedPlatform) => (
                  <Link
                    key={relatedPlatform.id}
                    href={`/platforms/${relatedPlatform.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          background: relatedPlatform.color || "#6366F1",
                        }}
                      >
                        {relatedPlatform.title.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedPlatform.title}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}