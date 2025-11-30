import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import { ChangelogRenderer } from "@/components/changelog-renderer";

export const metadata: Metadata = {
  title: "Changelog - linkin.one",
  description: "See what's new in linkin.one",
};

async function getChangelog() {
  try {
    const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
    const content = await fs.readFile(changelogPath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading changelog:", error);
    return "# Changelog\n\nNo changelog available.";
  }
}

export default async function ChangelogPage() {
  const changelogContent = await getChangelog();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Track all the latest updates, improvements, and new features added to linkin.one.
            </p>
          </div>

          <ChangelogRenderer content={changelogContent} />
        </div>
      </div>
    </div>
  );
}
