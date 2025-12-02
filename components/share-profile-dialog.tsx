"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import {
  AiFillLinkedin,
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillMessage,
  AiOutlineMail,
} from "react-icons/ai";
import { FaWhatsapp, FaSnapchatGhost, FaTiktok } from "react-icons/fa";

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  displayName?: string;
  thumbnailUrl?: string;
  description?: string;
  isLoggedIn?: boolean;
}

const socialShareButtons = [
  {
    name: "LinkedIn",
    icon: AiFillLinkedin,
    color: "bg-[#0077B5] hover:bg-[#006097]",
    getUrl: (url: string, text: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: AiFillFacebook,
    color: "bg-[#1877F2] hover:bg-[#0C63D4]",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    icon: AiOutlineTwitter,
    color: "bg-black hover:bg-gray-800",
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "bg-[#25D366] hover:bg-[#1EBE57]",
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    name: "Messenger",
    icon: AiFillMessage,
    color: "bg-[#0084FF] hover:bg-[#0073E6]",
    getUrl: (url: string) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`,
  },
  {
    name: "Snapchat",
    icon: FaSnapchatGhost,
    color: "bg-[#FFFC00] hover:bg-[#E6E300] text-black",
    getUrl: (url: string) =>
      `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`,
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    color: "bg-[#000000] hover:bg-gray-800",
    getUrl: (url: string, text: string) =>
      `https://www.tiktok.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
  {
    name: "Email",
    icon: AiOutlineMail,
    color: "bg-gray-600 hover:bg-gray-700",
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent("Check out my profile")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
];

export function ShareProfileDialog({
  open,
  onOpenChange,
  username,
  displayName,
  thumbnailUrl,
  description,
  isLoggedIn = false,
}: ShareProfileDialogProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://linkin.one/${username}`;

  const ogImageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/og?username=${username}`
      : `https://linkin.one/api/og?username=${username}`;

  const shareText = `Check out ${displayName || username}'s profile on linkin.one!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (getUrl: (url: string, text: string) => string) => {
    const shareUrl = getUrl(profileUrl, shareText);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          <DialogDescription>
            Share this profile with your network
          </DialogDescription>
        </DialogHeader>

        {/* OG Image Preview */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Preview (how it looks when shared):
          </p>
          <div className="relative w-full aspect-[1.91/1] bg-muted rounded-lg overflow-hidden border">
            <img
              src={ogImageUrl}
              alt="Social media preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Profile Preview */}
        {/* <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
          <Avatar className="h-16 w-16">
            <AvatarImage src={thumbnailUrl} alt={displayName || username} />
            <AvatarFallback>
              {(displayName || username).substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {displayName || username}
            </h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div> */}

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {socialShareButtons.map((platform) => (
            <button
              key={platform.name}
              className={`${platform.color} cursor-pointer flex justify-center items-center rounded-lg px-1 py-2 text-white shadow-sm hover:scale-105 transition-transform`}
              onClick={() => handleShare(platform.getUrl)}
            >
              {React.createElement(platform.icon, { size: 36 })}
            </button>
          ))}
        </div>

        {/* Copy Link Button */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border truncate"
          />
          <Button onClick={handleCopy} size="sm" variant="secondary">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* CTA for non-logged-in users */}
        {!isLoggedIn && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Create your own link-in-bio profile
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1" size="sm">
                <Link href="/register">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="sm">
                <Link href="/">Find Out More</Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ShareButton({
  username,
  displayName,
  thumbnailUrl,
  description,
  isLoggedIn,
}: Omit<ShareProfileDialogProps, "open" | "onOpenChange">) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size={"lg"}
        // size="icon"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <ShareProfileDialog
        open={open}
        onOpenChange={setOpen}
        username={username}
        displayName={displayName}
        thumbnailUrl={thumbnailUrl}
        description={description}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
