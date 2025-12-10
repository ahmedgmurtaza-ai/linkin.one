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
import { Menu } from "lucide-react";

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
        <div className="drawer-content flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 bg-base-100 border-b border-base-300">
            <div className="flex h-16 items-center gap-2 px-4">
              <label htmlFor="admin-drawer" className="btn btn-ghost btn-square lg:hidden">
                <Menu className="h-5 w-5" />
              </label>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li><a href="/admin">Dashboard</a></li>
                  <li>{getTabTitle()}</li>
                </ul>
              </div>
            </div>
          </header>
          <div className="flex-1 bg-base-200 p-4">
            <div className="space-y-4 max-w-5xl mx-auto w-full pt-6">
              <div className="skeleton h-10 w-64"></div>
              <div className="skeleton h-6 w-96"></div>
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          </div>
        </div>
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  return (
    <>
      <div className="drawer-content flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-base-100 border-b border-base-300">
          <div className="flex h-16 items-center gap-2 px-4">
            <label htmlFor="admin-drawer" className="btn btn-ghost btn-square lg:hidden">
              <Menu className="h-5 w-5" />
            </label>
            <div className="breadcrumbs text-sm">
              <ul>
                <li><a href="/admin">Dashboard</a></li>
                <li>{getTabTitle()}</li>
              </ul>
            </div>
            <div className="ml-auto">
              <AdminTopBar profile={profile} saving={saving} />
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto bg-base-200">
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
          <div className="hidden xl:flex w-[400px] 2xl:w-[500px] bg-base-300">
            <div className="flex-1 flex items-center justify-center p-8">
              <MobilePreview profile={profile} saving={saving} />
            </div>
          </div>
        </div>
      </div>
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
