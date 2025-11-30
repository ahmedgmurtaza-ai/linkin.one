import type { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback - linkin.one",
  description: "Share your feedback, suggestions, or report bugs for linkin.one",
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              We'd love to hear from you
            </h1>
            <p className="text-lg text-muted-foreground">
              Your feedback helps us improve linkin.one for everyone. Share your
              thoughts, report bugs, or suggest new features.
            </p>
          </div>

          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}
