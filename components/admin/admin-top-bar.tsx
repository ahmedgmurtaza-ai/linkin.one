"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import { Check, Copy, ExternalLink, QrCode, Loader2 } from "lucide-react";
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
      <div className="flex items-center gap-2">
        {/* Save Status */}
        {saving && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline">Saving...</span>
          </div>
        )}

        {/* URL Copy */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
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
          className="h-9 w-9"
          onClick={() => setQrOpen(true)}
        >
          <QrCode className="h-4 w-4" />
        </Button>

        {/* View Profile */}
        <Link href={`/${profile.username}`} target="_blank">
          <Button size="sm" className="gap-2 h-9 text-sm">
            <span className="hidden sm:inline">View Profile</span>
            <span className="sm:hidden">View</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <QRCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        url={profileUrl}
        username={profile.username}
      />
    </>
  );
}
