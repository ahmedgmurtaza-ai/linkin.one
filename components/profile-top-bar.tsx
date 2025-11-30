"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, QrCode, Settings } from "lucide-react";
import { QRCodeDialog } from "@/components/qr-code-dialog";
import Link from "next/link";

interface ProfileTopBarProps {
  username: string;
  isLoggedIn?: boolean;
}

export function ProfileTopBar({
  username,
  isLoggedIn = false,
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
      <header className="top-0 left-0 right-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="icon"
              className="shrink-0 bg-transparent"
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="h-4 w-4" />
            </Button> */}
            {isLoggedIn && (
              <Button variant="default" size="sm" className="shrink-0" asChild>
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Link>
              </Button>
            )}
          </div>

          <div className="flex min-w-0">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 ">
              <span className="text-sm text-muted-foreground truncate flex-1">
                linkin.one/{username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
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
