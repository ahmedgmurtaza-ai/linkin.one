import { Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProfileAvatar({
  profile,
  compact = false,
}: {
  profile: Profile;
  compact?: boolean;
}) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get color theme
  const colorTheme = profile.colorTheme || "#a88bf8";

  return (
    <div className="relative group">
      <div
        className={`absolute inset-2 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity ${
          compact ? "scale-110" : "scale-125"
        }`}
        style={{
          background: `linear-gradient(to right, ${colorTheme}80, ${colorTheme}, ${colorTheme}80)`,
        }}
      />
      <Avatar
        className={`relative ${
          compact
            ? "h-20 w-20 ring-offset-2"
            : "h-40 w-40 ring-offset-4"
        } border-background shadow-2xl transition-transform group-hover:scale-105`}
        style={{
          boxShadow: `0 0 0 ${compact ? '2px' : '4px'} ${colorTheme}33`,
        }}
      >
        <AvatarImage
          src={profile.thumbnailUrl || "/placeholder.svg"}
          alt={profile.displayName}
          className="object-cover"
        />
        <AvatarFallback 
          className="text-3xl font-bold"
          style={{
            background: `linear-gradient(to bottom right, ${colorTheme}33, ${colorTheme}1a)`,
            color: colorTheme,
          }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
