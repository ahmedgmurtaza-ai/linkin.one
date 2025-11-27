"use client"

import { useState } from "react"
import { useProfileEditor } from "@/lib/use-profile-editor"
import { ProfileForm } from "@/components/admin/profile-form"
import { LinkListEditor } from "@/components/admin/link-list-editor"
import { MobilePreview } from "@/components/admin/mobile-preview"
import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { LayoutSelector } from "@/components/admin/layout-selector"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AnalyticsPanel } from "@/components/admin/analytics-panel"

type AdminTab = "profile" | "links" | "layout" | "analytics"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("profile")
  const { profile, updateProfile, setLayout, addLink, updateLink, deleteLink, reorderLinks } =
    useProfileEditor("ahmedgmurtaza")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminTopBar profile={profile} />

      <div className="flex flex-1 pt-16">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Editor panel */}
              <div className="space-y-8">
                {activeTab === "profile" && <ProfileForm profile={profile} onUpdate={updateProfile} />}

                {activeTab === "links" && (
                  <LinkListEditor
                    links={profile.links}
                    onAdd={addLink}
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                    onReorder={reorderLinks}
                  />
                )}

                {activeTab === "layout" && <LayoutSelector currentLayout={profile.layout} onSelect={setLayout} />}

                {activeTab === "analytics" && <AnalyticsPanel links={profile.links} />}
              </div>

              {/* Preview panel - sticky on desktop */}
              <div className="lg:sticky lg:top-24 lg:h-fit">
                <MobilePreview profile={profile} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
