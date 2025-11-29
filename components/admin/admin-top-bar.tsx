"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { UserNav } from "@/components/auth/user-nav";
import {
  Check,
  Copy,
  ExternalLink,
  QrCode,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import type { Profile } from "@/lib/types";

interface AdminTopBarProps {
  profile: Profile;
  saving?: boolean;
}

export function AdminTopBar({ profile, saving = false }: AdminTopBarProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `https://linkin.one/${profile.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* <UserNav /> */}
            {/* Save Status */}
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {!saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-0 transition-opacity duration-300">
                <Check className="h-3.5 w-3.5" />
                <span>Saved</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* URL Copy */}
            <div className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                linkin.one/{profile.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>

            {/* QR Code Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="h-4 w-4" />
            </Button>

            {/* View Profile */}
            <Link href={`/${profile.username}`} target="_blank">
              <Button size="sm" className="gap-2">
                <span className="hidden sm:inline">View Profile</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <QRCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        url={profileUrl}
        username={profile.username}
      />
    </>
  );
}
