"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, QrCode, Settings } from "lucide-react";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import Link from "next/link";
import { useIsMobile } from "./ui/use-mobile";

interface ProfileTopBarProps {
  username: string;
  isLoggedIn?: boolean;
  colorTheme?: string;
}

export function ProfileTopBar({
  username,
  isLoggedIn = false,
  colorTheme = "#a88bf8",
}: ProfileTopBarProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://linkin.one/${username}`;

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
      <header className="absolute top-0 right-0">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* Left side - empty for now */}
          <div className="flex-1"></div>

          {/* Right side - URL and Dashboard buttons */}
          <div className="flex items-center gap-2">
            {/* URL display with copy button */}
            <div className="flex items-center gap-2 rounded-lg px-3 py-2">
              <span className="text-sm text-muted-foreground truncate hidden md:inline">
                linkin.one/{username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleCopy}
                title="Copy URL"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>

            {/* Dashboard button */}
            {isLoggedIn && (
              <>
                {/* Desktop - with text */}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="shrink-0 hidden md:flex" 
                  style={{ backgroundColor: colorTheme }}
                  asChild
                >
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-1.5" />
                    {useIsMobile() ? "" : "Dashboard"}
                  </Link>
                </Button>
                {/* Mobile - icon only */}
                <Button 
                  variant="default" 
                  size="icon" 
                  className="shrink-0 md:hidden" 
                  style={{ backgroundColor: colorTheme }}
                  asChild
                >
                  <Link href="/admin">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <QRCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        url={profileUrl}
        username={username}
      />
    </>
  );
}
