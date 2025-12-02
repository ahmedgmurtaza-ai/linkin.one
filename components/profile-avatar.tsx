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

  return (
    <div className="relative group">
      <div
        className={`absolute inset-2 bg-linear-to-r from-primary/50 via-primary to-primary/50 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity ${
          compact ? "scale-110" : "scale-125"
        }`}
      />
      <Avatar
        className={`relative ${
          compact
            ? "h-20 w-20 ring-2 ring-border/30 ring-offset-2"
            : "h-40 w-40 ring-4 ring-border/30 ring-offset-4"
        } border-background shadow-2xl ring-4 ring-primary/20 transition-transform group-hover:scale-105`}
      >
        <AvatarImage
          src={profile.thumbnailUrl || "/placeholder.svg"}
          alt={profile.displayName}
          className="object-cover"
        />
        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary text-3xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
