"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProfileEditor } from "@/lib/use-profile-editor";
import { ProfileForm } from "@/components/admin/profile-form";
import { LinkListEditor } from "@/components/admin/link-list-editor";
import { MobilePreview } from "@/components/admin/mobile-preview";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { LayoutSelector } from "@/components/admin/layout-selector";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AdminTab = "profile" | "links" | "layout" | "analytics";

export default function AdminClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = (searchParams.get("tab") as AdminTab) || "profile";
  const [activeTab, setActiveTab] = useState<AdminTab>(tabFromUrl);
  const {
    profile,
    loading,
    saving,
    updateProfile,
    setLayout,
    setShowCategories,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  } = useProfileEditor();

  // Sync activeTab with URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab") as AdminTab;
    if (tab && ["profile", "links", "layout", "analytics"].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("profile");
    }
  }, [searchParams]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "profile":
        return "Profile";
      case "links":
        return "Links";
      case "layout":
        return "Layout";
      case "analytics":
        return "Analytics";
      default:
        return "Dashboard";
    }
  };

  if (loading) {
    return (
      <>
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Skeleton className="h-8 w-48" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mt-4 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </SidebarInset>
      </>
    );
  }

  return (
    <>
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getTabTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <AdminTopBar profile={profile} saving={saving} />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Content Area */}
              <div className="space-y-6 max-w-4xl">
                {activeTab === "profile" && (
                  <ProfileForm profile={profile} onUpdate={updateProfile} />
                )}

                {activeTab === "links" && (
                  <LinkListEditor
                    links={profile.links}
                    showCategories={profile.showCategories || false}
                    onShowCategoriesChange={setShowCategories}
                    onAdd={addLink}
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                    onReorder={reorderLinks}
                  />
                )}

                {activeTab === "layout" && (
                  <LayoutSelector
                    currentLayout={profile.layout}
                    onSelect={setLayout}
                  />
                )}

                {activeTab === "analytics" && (
                  <AnalyticsPanel links={profile.links} />
                )}
              </div>
            </div>
          </div>

          {/* Preview panel - separate full-height column */}
          <div className="hidden xl:flex w-[400px] 2xl:w-[500px] border-l bg-muted/20">
            <div className="flex-1 flex items-center justify-center p-8">
              <MobilePreview profile={profile} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
