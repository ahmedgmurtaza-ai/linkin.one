"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Link2, BarChart3, Layout, LogOut, Home, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type AdminTab = "profile" | "links" | "layout" | "analytics";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      href: "/admin?tab=profile",
    },
    {
      id: "links" as const,
      label: "Links",
      icon: Link2,
      href: "/admin?tab=links",
    },
    {
      id: "layout" as const,
      label: "Layout",
      icon: Layout,
      href: "/admin?tab=layout",
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: BarChart3,
      href: "/admin?tab=analytics",
    },
  ];

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    return (
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
    );
  };

  return (
    <div className="drawer-side z-50">
      <label htmlFor="admin-drawer" className="drawer-overlay"></label>
      <div className="min-h-screen w-80 bg-base-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-base-300">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-content">
              <Link2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base">linkin.one</span>
              <span className="text-xs text-base-content/60">Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 px-2">
              Navigation
            </h3>
            <ul className="menu menu-md bg-base-100 rounded-box space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "gap-3",
                      activeTab === tab.id && "active"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 px-2">
              Quick Links
            </h3>
            <ul className="menu menu-md bg-base-100 rounded-box">
              <li>
                <Link href="/" target="_blank" className="gap-3">
                  <Home className="h-5 w-5" />
                  <span>View Profile</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer - User Menu */}
        <div className="p-4 border-t border-base-300">
          <div className="dropdown dropdown-top w-full">
            <label tabIndex={0} className="btn btn-ghost w-full justify-start gap-3 h-auto py-3 px-3">
              <div className="avatar placeholder">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" />
                  ) : (
                    <span className="text-sm font-semibold">{getUserInitials()}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="font-medium text-sm truncate max-w-full">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-base-content/60 truncate max-w-full">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 rounded-box shadow-lg w-full mb-2 p-2 border border-base-300">
              <li>
                <button onClick={handleSignOut} className="gap-2 text-error">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
