import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGE_SEO } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: PAGE_SEO.privacy.title,
  description: PAGE_SEO.privacy.description,
  keywords: PAGE_SEO.privacy.keywords,
  alternates: {
    canonical: PAGE_SEO.privacy.canonical,
  },
};

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Privacy Policy</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: November 30, 2025
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none pt-6">
              <section className="space-y-6 text-sm">
                <div>
                  <h2 className="font-semibold mb-3">Introduction</h2>
                  <p className="text-muted-foreground">
                    Welcome to linkin.one ("we," "our," or "us"). We are committed to protecting your
                    privacy and ensuring the security of your personal information. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your information when you use
                    our service.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Information We Collect</h2>
                  <h3 className="font-medium mb-2 mt-4">Personal Information</h3>
                  <p className="text-muted-foreground mb-3">
                    When you create an account, we collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Email address</li>
                    <li>Username</li>
                    <li>Display name</li>
                    <li>Profile picture</li>
                    <li>Bio/description</li>
                  </ul>

                  <h3 className="font-medium mb-2 mt-4">Usage Information</h3>
                  <p className="text-muted-foreground mb-3">
                    We automatically collect certain information about your device and how you interact
                    with our service:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent</li>
                    <li>Link clicks and downloads</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-3">We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Create and manage your profile</li>
                    <li>Track analytics for your links</li>
                    <li>Communicate with you about updates and features</li>
                    <li>Respond to your feedback and support requests</li>
                    <li>Detect and prevent fraud or abuse</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Data Sharing and Disclosure</h2>
                  <p className="text-muted-foreground mb-3">
                    We do not sell your personal information. We may share your information only in the
                    following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>With your consent:</strong> When you explicitly agree to share information
                    </li>
                    <li>
                      <strong>Service providers:</strong> Third-party vendors who help us operate our
                      service (e.g., hosting, analytics)
                    </li>
                    <li>
                      <strong>Legal requirements:</strong> When required by law or to protect our rights
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your
                    personal information. However, no method of transmission over the internet or
                    electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Your Rights</h2>
                  <p className="text-muted-foreground mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Cookies and Tracking</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to enhance your experience, analyze
                    usage patterns, and deliver personalized content. You can control cookies through your
                    browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our service is not intended for children under 13 years of age. We do not knowingly
                    collect personal information from children under 13.
                  </p>
                </div>

                <div>
                  <h2 className=" font-semibold mb-3">Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes
                    by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy, please contact us through our{" "}
                    <Link href="/feedback" className="text-primary hover:underline">
                      feedback page
                    </Link>
                    .
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
