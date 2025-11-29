"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Link2,
  BarChart3,
  Layout,
  Link as LinkIcon,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";

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
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "links" as const, label: "Links", icon: Link2 },
    { id: "layout" as const, label: "Layout", icon: Layout },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
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
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm p-6 flex flex-col overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4 group">
        <Logo />
      </Link>
      {/* Navigation */}
      <div className="flex-1 space-y-1">
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            Dashboard
          </p>
        </div>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "hover:bg-muted/50"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 space-y-4">
        <Separator />
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-sm font-medium hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
