"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function UserNav() {
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

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="text-sm">{user.email}</span>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
