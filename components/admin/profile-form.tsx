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
import { ThemeSelector } from "@/components/admin/theme-selector";
import type { ProfileTheme } from "@/lib/types";

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

  // Username availability state
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [originalUsername] = useState(profile.username);

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
  const usernameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const displayNameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const urlTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check username availability
  const checkUsernameAvailability = useCallback(
    async (usernameToCheck: string) => {
      // If it's the original username, it's available (user's own)
      if (usernameToCheck === originalUsername) {
        setUsernameAvailable(true);
        return true;
      }

      setCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", usernameToCheck)
          .maybeSingle();

        if (error) {
          console.error("Error checking username:", error);
          setUsernameAvailable(null);
          return false;
        }

        const available = !data;
        setUsernameAvailable(available);
        return available;
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
        return false;
      } finally {
        setCheckingUsername(false);
      }
    },
    [supabase, originalUsername]
  );

  // Debounced update functions
  const debouncedUpdateUsername = useCallback(
    (value: string) => {
      if (usernameTimerRef.current) {
        clearTimeout(usernameTimerRef.current);
      }
      usernameTimerRef.current = setTimeout(async () => {
        const available = await checkUsernameAvailability(value);
        if (available) {
          onUpdate({
            username: value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
          });
        }
      }, 800);
    },
    [onUpdate, checkUsernameAvailability]
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

  // Username availability message
  const getUsernameStatusMessage = () => {
    if (!isUsernameValid || username.length === 0) return null;
    if (username === originalUsername)
      return (
        <p className="text-xs text-green-600 dark:text-green-500">
          ✓ This is your current username
        </p>
      );
    if (checkingUsername)
      return (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking availability...
        </p>
      );
    if (usernameAvailable === true)
      return (
        <p className="text-xs text-green-600 dark:text-green-500">
          ✓ Username is available
        </p>
      );
    if (usernameAvailable === false)
      return (
        <p className="text-xs text-destructive">✗ Username is already taken</p>
      );
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-base">
            Username
          </Label>
          <div className="flex items-center gap-2 md:max-w-1/2 max-w-full">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              linkin.one/
            </span>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                const sanitized = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]/g, "");
                setUsername(sanitized);
                setUsernameAvailable(null);
                debouncedUpdateUsername(sanitized);
              }}
              placeholder="yourname"
              className={`flex-1 ${
                usernameError || usernameAvailable === false
                  ? "border-destructive"
                  : usernameAvailable === true && username !== originalUsername
                  ? "border-green-600 dark:border-green-500"
                  : ""
              }`}
            />
          </div>
          {usernameError && (
            <p className="text-xs text-destructive">{usernameError}</p>
          )}
          {!usernameError && getUsernameStatusMessage()}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Profile Picture</Label>
            {externalUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {/* Image Preview */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-border/30 ring-offset-2 ring-offset-background">
              <AvatarImage src={externalUrl} alt={displayName} />
              <AvatarFallback className="text-xl font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* Upload/URL Tabs */}
            <Tabs defaultValue="url" className="flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-3">
                <Input
                  id="thumbnailUrl"
                  value={externalUrl}
                  onChange={(e) => handleExternalUrlChange(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </TabsContent>

              <TabsContent value="upload" className="mt-3">
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
                {uploadError && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertDescription className="text-sm">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="space-y-6 pt-6 ">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-base">
            Display Name
          </Label>
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
          <Label htmlFor="description" className="text-base">
            Bio
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              debouncedUpdateDescription(e.target.value);
            }}
            placeholder="Tell the world about yourself..."
            rows={4}
            className="resize-none"
          />
        </div>
      </div>

      {/* Appearance Section */}
      <div className="pt-6 ">
        <div className="mb-4">
          <Label className="text-base">Theme</Label>
        </div>
        <ThemeSelector
          currentTheme={profile.theme}
          onSelect={(theme: ProfileTheme) => onUpdate({ theme })}
        />
      </div>
    </div>
  );
}
