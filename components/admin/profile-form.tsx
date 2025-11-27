"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
  profile: Profile
  onUpdate: (updates: Partial<Profile>) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">linkin.one/</span>
          <Input
            id="username"
            value={profile.username}
            onChange={(e) => onUpdate({ username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "") })}
            placeholder="yourname"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={profile.displayName}
          onChange={(e) => onUpdate({ displayName: e.target.value })}
          placeholder="Your Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Bio</Label>
        <Textarea
          id="description"
          value={profile.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Tell the world about yourself..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Profile Image URL</Label>
        <Input
          id="thumbnail"
          value={profile.thumbnailUrl}
          onChange={(e) => onUpdate({ thumbnailUrl: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
    </div>
  )
}
