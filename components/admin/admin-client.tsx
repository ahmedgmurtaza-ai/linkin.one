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
import { Sheet, SheetContent } from "@/components/ui/sheet";

type AdminTab = "profile" | "links" | "layout" | "analytics";

export default function AdminClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = (searchParams.get("tab") as AdminTab) || "profile";
  const [activeTab, setActiveTab] = useState<AdminTab>(tabFromUrl);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false); // Close mobile menu after selecting tab
    router.push(`/admin?tab=${tab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r border-border bg-card/30 backdrop-blur-sm p-6">
          <Skeleton className="h-12 w-full mb-8" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border bg-card/30 backdrop-blur-sm p-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex">
      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar
          profile={profile}
          saving={saving}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Content wrapper */}
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                {activeTab === "profile" && "Profile Settings"}
                {activeTab === "links" && "Manage Links"}
                {activeTab === "layout" && "Choose Layout"}
                {activeTab === "analytics" && "Analytics"}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {activeTab === "profile" &&
                  "Customize your profile information and appearance"}
                {activeTab === "links" &&
                  "Add, edit, and organize your social media links"}
                {activeTab === "layout" &&
                  "Select a layout style for your profile page"}
                {activeTab === "analytics" &&
                  "Track your profile performance and link engagement"}
              </p>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
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

          {/* Preview panel - separate full-height column */}
          <div className="hidden lg:flex min-w-[400px] max-w-[600px] w-[35vw] border-l bg-linear-to-b from-muted/20 via-muted/30 to-muted/20 backdrop-blur-sm">
            <div className="flex-1 flex items-center justify-center p-8">
              <MobilePreview profile={profile} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
