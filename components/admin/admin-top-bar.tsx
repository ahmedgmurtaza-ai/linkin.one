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
  Menu,
} from "lucide-react";
import type { Profile } from "@/lib/types";

interface AdminTopBarProps {
  profile: Profile;
  saving?: boolean;
  onMenuClick?: () => void;
}

export function AdminTopBar({
  profile,
  saving = false,
  onMenuClick,
}: AdminTopBarProps) {
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
      <header className="sticky top-0 z-50 bg-linear-to-r from-card/95 via-primary/5 to-accent/8 backdrop-blur-lg border-b border-primary/10 shadow-md">
        <div className="px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8"
                onClick={onMenuClick}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            {/* Save Status */}
            {saving && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}
            {!saving && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground opacity-0 transition-opacity duration-300">
                <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span className="hidden sm:inline">Saved</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* URL Copy */}
            <div className="hidden md:flex items-center gap-2 bg-card/50 border border-border/50 rounded-lg px-2 md:px-3 py-1.5">
              <span className="text-xs md:text-sm text-muted-foreground truncate max-w-[120px] md:max-w-[200px]">
                linkin.one/{profile.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 md:h-6 md:w-6"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3 w-3 md:h-3.5 md:w-3.5" />
                )}
              </Button>
            </div>

            {/* Mobile Copy Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>

            {/* QR Code Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 md:h-10 md:w-10"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>

            {/* View Profile */}
            <Link href={`/${profile.username}`} target="_blank">
              <Button
                size="sm"
                className="gap-1.5 md:gap-2 h-8 md:h-9 px-2.5 md:px-3 text-xs md:text-sm"
              >
                <span className="hidden sm:inline">View Profile</span>
                <span className="sm:hidden">View</span>
                <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5" />
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
