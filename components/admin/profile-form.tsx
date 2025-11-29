"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Profile } from "@/lib/types";
import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Link as LinkIcon, Loader2, X } from "lucide-react";

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState(profile.thumbnailUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Local state for inputs
  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [description, setDescription] = useState(profile.description);

  // Update local state when profile prop changes
  useEffect(() => {
    setUsername(profile.username);
    setDisplayName(profile.displayName);
    setDescription(profile.description);
    setExternalUrl(profile.thumbnailUrl || "");
  }, [
    profile.username,
    profile.displayName,
    profile.description,
    profile.thumbnailUrl,
  ]);

  // Debounce timer refs
  const usernameTimerRef = useRef<NodeJS.Timeout>();
  const displayNameTimerRef = useRef<NodeJS.Timeout>();
  const descriptionTimerRef = useRef<NodeJS.Timeout>();
  const urlTimerRef = useRef<NodeJS.Timeout>();

  // Debounced update functions
  const debouncedUpdateUsername = useCallback(
    (value: string) => {
      if (usernameTimerRef.current) {
        clearTimeout(usernameTimerRef.current);
      }
      usernameTimerRef.current = setTimeout(() => {
        onUpdate({ username: value.toLowerCase().replace(/[^a-z0-9_-]/g, "") });
      }, 500);
    },
    [onUpdate]
  );

  const debouncedUpdateDisplayName = useCallback(
    (value: string) => {
      if (displayNameTimerRef.current) {
        clearTimeout(displayNameTimerRef.current);
      }
      displayNameTimerRef.current = setTimeout(() => {
        onUpdate({ displayName: value });
      }, 500);
    },
    [onUpdate]
  );

  const debouncedUpdateDescription = useCallback(
    (value: string) => {
      if (descriptionTimerRef.current) {
        clearTimeout(descriptionTimerRef.current);
      }
      descriptionTimerRef.current = setTimeout(() => {
        onUpdate({ description: value });
      }, 500);
    },
    [onUpdate]
  );

  const debouncedUpdateUrl = useCallback(
    (value: string) => {
      if (urlTimerRef.current) {
        clearTimeout(urlTimerRef.current);
      }
      urlTimerRef.current = setTimeout(() => {
        onUpdate({ thumbnailUrl: value });
      }, 500);
    },
    [onUpdate]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
      if (displayNameTimerRef.current)
        clearTimeout(displayNameTimerRef.current);
      if (descriptionTimerRef.current)
        clearTimeout(descriptionTimerRef.current);
      if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      setUploadError("File size must be less than 1MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Update profile with base64 image
        onUpdate({ thumbnailUrl: base64String });
        setExternalUrl(base64String);
        setUploading(false);
      };

      reader.onerror = () => {
        setUploadError("Failed to read image file");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to process image");
      setUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExternalUrlChange = (url: string) => {
    setExternalUrl(url);
    debouncedUpdateUrl(url);
  };

  const handleRemoveImage = () => {
    setExternalUrl("");
    onUpdate({ thumbnailUrl: "" });
  };

  const getUserInitials = () => {
    return (
      displayName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  // Validate username (LinkedIn-style: letters, numbers, hyphens, underscores)
  const isUsernameValid =
    username.length >= 3 &&
    username.length <= 20 &&
    /^[a-z0-9_-]+$/.test(username);
  const usernameError =
    username.length > 0 && !isUsernameValid
      ? username.length < 3
        ? "Username must be at least 3 characters"
        : username.length > 20
        ? "Username must be at most 20 characters"
        : "Username can only contain letters, numbers, hyphens, and underscores"
      : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">linkin.one/</span>
          <Input
            id="username"
            value={username}
            onChange={(e) => {
              const sanitized = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "");
              setUsername(sanitized);
              debouncedUpdateUsername(sanitized);
            }}
            placeholder="yourname"
            className={`flex-1 ${usernameError ? "border-destructive" : ""}`}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          3-20 characters, letters, numbers, hyphens (-), and underscores (_)
        </p>
        {usernameError && (
          <p className="text-xs text-destructive">{usernameError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            debouncedUpdateDisplayName(e.target.value);
          }}
          placeholder="Your Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Bio</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            debouncedUpdateDescription(e.target.value);
          }}
          placeholder="Tell the world about yourself..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Profile Image</Label>

        {/* Image Preview */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={externalUrl} alt={displayName} />
            <AvatarFallback className="text-xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {externalUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        {/* Upload/URL Tabs */}
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              Image URL
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-2">
            <Input
              id="thumbnailUrl"
              value={externalUrl}
              onChange={(e) => handleExternalUrlChange(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to an image hosted online
            </p>
          </TabsContent>

          <TabsContent value="upload" className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload an image file (max 1MB). Image will be stored as base64.
            </p>
            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
