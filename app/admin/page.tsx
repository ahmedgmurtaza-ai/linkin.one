import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClient from "@/components/admin/admin-client";
import { PAGE_SEO } from "@/lib/seo-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: PAGE_SEO.admin.title,
  description: PAGE_SEO.admin.description,
  keywords: PAGE_SEO.admin.keywords,
  alternates: {
    canonical: PAGE_SEO.admin.canonical,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AdminClient />;
}
