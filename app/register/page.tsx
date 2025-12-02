import { RegisterForm } from "@/components/auth/register-form";
import { PAGE_SEO } from "@/lib/seo-config";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: PAGE_SEO.register.title,
  description: PAGE_SEO.register.description,
  keywords: PAGE_SEO.register.keywords,
  alternates: {
    canonical: PAGE_SEO.register.canonical,
  },
  openGraph: {
    title: PAGE_SEO.register.title,
    description: PAGE_SEO.register.description,
    url: PAGE_SEO.register.canonical,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
