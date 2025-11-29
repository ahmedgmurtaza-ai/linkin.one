"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileLink, LinkType, LinkCategory } from "@/lib/types";
import { CATEGORY_LABELS, PLATFORM_CATEGORY_MAP } from "@/lib/types";
import { Upload, Link, FileText } from "lucide-react";

interface LinkEditorProps {
  link?: ProfileLink;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (link: Omit<ProfileLink, "id">) => void;
  initialPlatform?: string;
}

const PLATFORM_OPTIONS = [
  { value: "x", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
  { value: "medium", label: "Medium" },
  { value: "substack", label: "Substack" },
  { value: "devto", label: "Dev.to" },
  { value: "spotify", label: "Spotify" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "twitch", label: "Twitch" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "resume", label: "Resume/CV" },
  { value: "file", label: "Other File" },
];

// Platform prefixes and titles for predefined social platforms
const PLATFORM_CONFIG: Record<
  string,
  { prefix: string; title: string; placeholder: string }
> = {
  x: {
    prefix: "https://x.com/",
    title: "Twitter / X",
    placeholder: "username",
  },
  linkedin: {
    prefix: "https://linkedin.com/in/",
    title: "LinkedIn",
    placeholder: "username",
  },
  github: {
    prefix: "https://github.com/",
    title: "GitHub",
    placeholder: "username",
  },
  instagram: {
    prefix: "https://instagram.com/",
    title: "Instagram",
    placeholder: "username",
  },
  youtube: {
    prefix: "https://youtube.com/@",
    title: "YouTube",
    placeholder: "username",
  },
  tiktok: {
    prefix: "https://tiktok.com/@",
    title: "TikTok",
    placeholder: "username",
  },
  facebook: {
    prefix: "https://facebook.com/",
    title: "Facebook",
    placeholder: "username",
  },
  dribbble: {
    prefix: "https://dribbble.com/",
    title: "Dribbble",
    placeholder: "username",
  },
  behance: {
    prefix: "https://behance.net/",
    title: "Behance",
    placeholder: "username",
  },
  medium: {
    prefix: "https://medium.com/@",
    title: "Medium",
    placeholder: "username",
  },
  substack: {
    prefix: "https://",
    title: "Substack",
    placeholder: "yourname.substack.com",
  },
  discord: {
    prefix: "https://discord.gg/",
    title: "Discord",
    placeholder: "invite-code",
  },
  telegram: {
    prefix: "https://t.me/",
    title: "Telegram",
    placeholder: "username",
  },
  whatsapp: {
    prefix: "https://wa.me/",
    title: "WhatsApp",
    placeholder: "phone-number",
  },
  spotify: {
    prefix: "https://open.spotify.com/user/",
    title: "Spotify",
    placeholder: "username",
  },
  soundcloud: {
    prefix: "https://soundcloud.com/",
    title: "SoundCloud",
    placeholder: "username",
  },
  twitch: {
    prefix: "https://twitch.tv/",
    title: "Twitch",
    placeholder: "username",
  },
  devto: {
    prefix: "https://dev.to/",
    title: "Dev.to",
    placeholder: "username",
  },
};

export function LinkEditor({
  link,
  open,
  onOpenChange,
  onSave,
  initialPlatform,
}: LinkEditorProps) {
  const [linkType, setLinkType] = useState<LinkType>(link?.linkType || "url");
  const [title, setTitle] = useState(link?.title || "");
  const [url, setUrl] = useState(link?.url || "");
  const [platform, setPlatform] = useState(
    link?.platform || initialPlatform || "website"
  );
  const [category, setCategory] = useState<LinkCategory>(
    link?.category || "others"
  );
  const [username, setUsername] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current platform is a predefined social platform
  const isPredefinedPlatform = PLATFORM_CONFIG[platform] !== undefined;
  const platformConfig = PLATFORM_CONFIG[platform];

  // Only show file upload for custom platforms (website, email, resume, file)
  const showFileUpload = ["website", "email", "resume", "file"].includes(
    platform
  );

  // Initialize state when dialog opens
  useEffect(() => {
    if (open) {
      if (link) {
        // Editing existing link
        setLinkType(link.linkType || "url");
        setTitle(link.title || "");
        setUrl(link.url || "");
        setPlatform(link.platform || "website");
        setCategory(link.category || "others");
        setFileName("");

        // Extract username from URL for predefined platforms
        const config = PLATFORM_CONFIG[link.platform];
        if (config && link.url) {
          const extractedUsername = link.url.replace(config.prefix, "");
          setUsername(extractedUsername);
        } else {
          setUsername("");
        }
      } else if (initialPlatform) {
        // Adding new link with preselected platform
        setPlatform(initialPlatform);
        const config = PLATFORM_CONFIG[initialPlatform];
        if (config) {
          setTitle(config.title);
        }
        setUsername("");
        // Auto-assign category based on platform
        const autoCategory = PLATFORM_CATEGORY_MAP[initialPlatform] || "others";
        setCategory(autoCategory);
      } else {
        // Adding new link without preselection
        resetForm();
      }
    }
  }, [open, link, initialPlatform]);

  const handleFileSelect = (file: File) => {
    if (
      file.type !== "application/pdf" &&
      !file.type.startsWith("application/")
    ) {
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    setFileName(file.name);
    setUrl(fileUrl);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    const newPlatform = file.type === "application/pdf" ? "resume" : "file";
    setPlatform(newPlatform);
    // Auto-assign category for file uploads
    setCategory(PLATFORM_CATEGORY_MAP[newPlatform] || "resources");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    const config = PLATFORM_CONFIG[newPlatform];

    // Auto-assign category based on platform
    const autoCategory = PLATFORM_CATEGORY_MAP[newPlatform] || "others";
    // Only auto-assign if not editing or if platform changed
    if (!link || link.platform !== newPlatform) {
      setCategory(autoCategory);
    }

    if (config) {
      // Auto-populate title for predefined platforms
      setTitle(config.title);
      // Only clear username if switching platforms, not when editing
      if (!link || link.platform !== newPlatform) {
        setUsername("");
        setUrl("");
      }
    } else {
      // For custom platforms, keep existing data when editing
      if (!link) {
        setTitle("");
        setUrl("");
      }
      setUsername("");
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (platformConfig) {
      setUrl(platformConfig.prefix + value);
    }
  };

  const handleSave = () => {
    const finalUrl = isPredefinedPlatform
      ? platformConfig.prefix + username
      : url;
    const finalTitle = isPredefinedPlatform ? platformConfig.title : title;

    if (!finalTitle.trim() || !finalUrl.trim()) return;

    onSave({
      title: finalTitle,
      url: finalUrl,
      platform,
      category,
      linkType,
      isDownloadable: linkType === "file",
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setUsername("");
    setPlatform("website");
    setCategory("others");
    setFileName("");
    setLinkType("url");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{link ? "Edit Link" : "Add New Link"}</DialogTitle>
        </DialogHeader>

        {showFileUpload ? (
          <Tabs
            value={linkType}
            onValueChange={(v) => setLinkType(v as LinkType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={handlePlatformChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category (Optional)</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as LinkCategory)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isPredefinedPlatform ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username / Handle</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {platformConfig.prefix}
                      </span>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder={platformConfig.placeholder}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="link-title">Title</Label>
                    <Input
                      id="link-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="My Website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file-title">Title</Label>
                  <Input
                    id="file-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Resume"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category (Optional)</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as LinkCategory)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Drop Zone */}
              <div
                className={`border border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-muted-foreground/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, TXT
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category (Optional)</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as LinkCategory)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username / Handle</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {platformConfig.prefix}
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder={platformConfig.placeholder}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isPredefinedPlatform
                ? !username.trim()
                : !title.trim() || !url.trim()
            }
          >
            {link ? "Save Changes" : "Add Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
