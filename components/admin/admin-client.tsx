"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProfileEditor } from "@/lib/use-profile-editor";
import { ProfileForm } from "@/components/admin/profile-form";
import { LinkListEditor } from "@/components/admin/link-list-editor";
import { MobilePreview } from "@/components/admin/mobile-preview";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { LayoutSelector } from "@/components/admin/layout-selector";
import { ThemeSelector } from "@/components/admin/theme-selector";
import { ColorThemeSelector } from "@/components/admin/color-theme-selector";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";
import type { ProfileTheme, ProfileColorTheme } from "@/lib/types";
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
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Skeleton className="h-8 w-48" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/20">
            <div className="space-y-4 max-w-5xl mx-auto w-full pt-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
          </div>
          <div className="ml-auto pr-4">
            <AdminTopBar profile={profile} saving={saving} />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto bg-muted/20">
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6 md:p-6 md:pt-8">
              {/* Content Area */}
              <div className="space-y-6 max-w-5xl mx-auto w-full">
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
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Layout & Appearance
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Customize how your profile looks and feels
                      </p>
                    </div>

                    {/* Layout Selection */}
                    <div className="bg-card rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-2">Profile Layout</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose how your profile content is organized
                      </p>
                      <LayoutSelector
                        currentLayout={profile.layout}
                        onSelect={setLayout}
                      />
                    </div>

                    {/* Theme Mode */}
                    <div className="bg-card rounded-lg border p-6 hidden">
                      <h3 className="text-lg font-semibold mb-2">Theme Mode</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose between light, dark, or system theme
                      </p>
                      <ThemeSelector
                        currentTheme={profile.theme}
                        onSelect={(theme: ProfileTheme) => updateProfile({ theme })}
                      />
                    </div>

                    {/* Color Theme */}
                    <div className="bg-card rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-2">Color Theme</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select a color combination for your profile (applies to split layout)
                      </p>
                      <ColorThemeSelector
                        currentTheme={profile.colorTheme}
                        onSelect={(colorTheme: ProfileColorTheme) => updateProfile({ colorTheme })}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <AnalyticsPanel links={profile.links} />
                )}
              </div>
            </div>
          </div>

          {/* Preview panel - separate full-height column */}
          <div className="hidden xl:flex w-[400px] 2xl:w-[500px] bg-muted/30">
            <div className="flex-1 flex items-center justify-center p-8">
              <MobilePreview profile={profile} saving={saving} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
