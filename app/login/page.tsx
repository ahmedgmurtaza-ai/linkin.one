import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { PAGE_SEO } from "@/lib/seo-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: PAGE_SEO.login.title,
  description: PAGE_SEO.login.description,
  keywords: PAGE_SEO.login.keywords,
  alternates: {
    canonical: PAGE_SEO.login.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Theme toggle in top right corner */}
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}

      <LoginForm />
    </div>
  );
}
