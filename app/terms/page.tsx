import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service - linkin.one",
  description: "Terms of service for linkin.one",
};

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: November 30, 2025
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none pt-6">
              <section className="text-sm space-y-6">
                <div>
                  <h2 className="font-semibold mb-3">1. Agreement to Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using linkin.one ("Service"), you agree to be bound by these Terms
                    of Service ("Terms"). If you disagree with any part of these terms, you may not access
                    the Service.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">2. Description of Service</h2>
                  <p className="text-muted-foreground">
                    linkin.one provides a platform for creating and managing personal profile pages that
                    consolidate multiple links in one place. The Service allows users to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                    <li>Create custom profile pages with unique usernames</li>
                    <li>Add, organize, and categorize links</li>
                    <li>Upload files and make them downloadable</li>
                    <li>Track analytics for links and downloads</li>
                    <li>Customize profile appearance and layout</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">3. User Accounts</h2>
                  <h3 className="font-medium mb-2 mt-4">3.1 Registration</h3>
                  <p className="text-muted-foreground">
                    To use certain features of the Service, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Be responsible for all activities under your account</li>
                  </ul>

                  <h3 className="font-medium mb-2 mt-4">3.2 Username Policy</h3>
                  <p className="text-muted-foreground">
                    Usernames must not:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                    <li>Infringe on trademarks or intellectual property rights</li>
                    <li>Impersonate others or mislead users</li>
                    <li>Contain offensive or inappropriate content</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">4. User Content</h2>
                  <h3 className="font-medium mb-2 mt-4">4.1 Your Responsibilities</h3>
                  <p className="text-muted-foreground mb-2">
                    You are responsible for all content you upload or link to through the Service. You
                    agree not to post content that:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Violates laws or regulations</li>
                    <li>Infringes intellectual property rights</li>
                    <li>Contains malware or harmful code</li>
                    <li>Is defamatory, obscene, or offensive</li>
                    <li>Promotes illegal activities</li>
                    <li>Contains spam or unauthorized advertising</li>
                  </ul>

                  <h3 className="font-medium mb-2 mt-4">4.2 License to Your Content</h3>
                  <p className="text-muted-foreground">
                    You retain ownership of your content. By using the Service, you grant us a worldwide,
                    non-exclusive license to host, store, and display your content as necessary to provide
                    the Service.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">5. Prohibited Activities</h2>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Use the Service for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Create multiple accounts to evade restrictions</li>
                    <li>Scrape or collect data from the Service without permission</li>
                    <li>Use automated systems to access the Service (except approved bots)</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">6. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    The Service and its original content (excluding user content), features, and
                    functionality are owned by linkin.one and are protected by international copyright,
                    trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">7. Analytics and Tracking</h2>
                  <p className="text-muted-foreground">
                    We track clicks, downloads, and other analytics on your profile to provide you with
                    insights. This data is private and only visible to you unless you choose to make it
                    public.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">8. Service Modifications</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify or discontinue the Service at any time, with or without
                    notice. We will not be liable to you or any third party for any modification,
                    suspension, or discontinuation of the Service.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">9. Termination</h2>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your account and access to the Service immediately, without
                    prior notice or liability, for any reason, including if you breach these Terms. Upon
                    termination, your right to use the Service will cease immediately.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">10. Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                    EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                    SECURE, OR ERROR-FREE.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">11. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    IN NO EVENT SHALL LINKIN.ONE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                    CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">12. Indemnification</h2>
                  <p className="text-muted-foreground">
                    You agree to indemnify and hold harmless linkin.one from any claims, damages, losses,
                    and expenses arising from your use of the Service or violation of these Terms.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">13. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms at any time. We will notify users of any
                    material changes by updating the "Last updated" date. Your continued use of the Service
                    after changes constitutes acceptance of the new Terms.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">14. Governing Law</h2>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance with applicable laws,
                    without regard to conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-3">15. Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have questions about these Terms, please contact us through our{" "}
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
