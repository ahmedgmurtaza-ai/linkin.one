"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Profile } from "@/lib/types";
import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Link as LinkIcon, Loader2, X, Camera, Image as ImageIcon } from "lucide-react";
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
    <div className="space-y-6">
      {/* Username Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-foreground">Profile URL</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your unique profile URL
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">Username</Label>
          <div className="flex items-center gap-2">
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
      </div>

      {/* Profile Picture Section */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="mb-4">
            <h3 className="card-title text-lg">Profile Picture</h3>
            <p className="text-sm text-base-content/60 mt-1">
              Add a photo to personalize your profile
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {externalUrl ? (
                    <img src={externalUrl} alt={displayName || "Profile"} />
                  ) : (
                    <div className="flex items-center justify-center bg-primary/10 text-primary">
                      <span className="text-3xl font-bold">{getUserInitials()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {externalUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-sm btn-ghost btn-error gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove Photo
                </button>
              )}
            </div>

            {/* Upload/URL Tabs */}
            <div className="flex-1">
              <div role="tablist" className="tabs tabs-boxed bg-base-200 mb-4">
                <input
                  type="radio"
                  name="photo_tabs"
                  role="tab"
                  className="tab"
                  aria-label="URL"
                  defaultChecked
                />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      <label className="label-text font-medium">Image URL</label>
                    </div>
                    <input
                      type="text"
                      value={externalUrl.includes("data:image") ? "" : externalUrl}
                      onChange={(e) => handleExternalUrlChange(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="input input-bordered w-full"
                    />
                    <p className="text-xs text-base-content/60">
                      Enter a direct link to your profile picture
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="photo_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Upload"
                />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="h-4 w-4 text-primary" />
                      <label className="label-text font-medium">Upload File</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="file-input file-input-bordered w-full"
                      />
                      {uploading && (
                        <span className="loading loading-spinner loading-sm text-primary"></span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/60">
                      Maximum file size: 1MB. Supported formats: JPG, PNG, GIF, WebP
                    </p>
                    {uploadError && (
                      <div className="alert alert-error py-2 px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs">{uploadError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-foreground">Profile Details</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tell visitors about yourself
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                debouncedUpdateDisplayName(e.target.value);
              }}
              placeholder="Your Name"
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              This is how your name will appear to visitors
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Bio</Label>
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
            <p className="text-xs text-muted-foreground">
              Brief description for your profile
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Section
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Customize how your profile looks to visitors
          </p>
        </div>
        <ThemeSelector
          currentTheme={profile.theme}
          onSelect={(theme: ProfileTheme) => onUpdate({ theme })}
        />
      </div> */}
    </div>
  );
}
