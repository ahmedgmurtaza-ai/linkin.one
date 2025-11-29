"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type ProfileLink } from "@/lib/types";
import { LinkEditor } from "./link-editor";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { PlatformIcon, getPlatformColors } from "@/components/platform-icon";

interface LinkListEditorProps {
  links: ProfileLink[];
  showCategories: boolean;
  onShowCategoriesChange: (show: boolean) => void;
  onAdd: (link: Omit<ProfileLink, "id">) => void;
  onUpdate: (id: string, updates: Partial<ProfileLink>) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function LinkListEditor({
  links,
  showCategories,
  onShowCategoriesChange,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: LinkListEditorProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProfileLink | undefined>();
  const [selectedPlatform, setSelectedPlatform] = useState<
    string | undefined
  >();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleEdit = (link: ProfileLink) => {
    setEditingLink(link);
    setEditorOpen(true);
  };

  const handleSave = (linkData: Omit<ProfileLink, "id">) => {
    if (editingLink) {
      onUpdate(editingLink.id, linkData);
    } else {
      onAdd(linkData);
    }
    setEditingLink(undefined);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.target as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorder(draggedIndex, index);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="show-categories"
            checked={showCategories}
            onCheckedChange={onShowCategoriesChange}
          />
          <Label htmlFor="show-categories" className="cursor-pointer">
            Show categories on profile page
          </Label>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingLink(undefined);
            setSelectedPlatform(undefined);
            setEditorOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            Add your social links below - here are some suggestions:
          </p>
          {[
            {
              platform: "x",
              title: "Twitter / X",
              url: "https://x.com/yourusername",
            },
            {
              platform: "instagram",
              title: "Instagram",
              url: "https://instagram.com/yourusername",
            },
            {
              platform: "tiktok",
              title: "TikTok",
              url: "https://tiktok.com/@yourusername",
            },
            {
              platform: "youtube",
              title: "YouTube",
              url: "https://youtube.com/@yourusername",
            },
            {
              platform: "linkedin",
              title: "LinkedIn",
              url: "https://linkedin.com/in/yourusername",
            },
            {
              platform: "facebook",
              title: "Facebook",
              url: "https://facebook.com/yourusername",
            },
            {
              platform: "github",
              title: "GitHub",
              url: "https://github.com/yourusername",
            },
            { platform: "email", title: "Email", url: "mailto:your@email.com" },
            {
              platform: "website",
              title: "Website",
              url: "https://yourwebsite.com",
            },
            {
              platform: "resume",
              title: "Resume",
              url: "https://yourresume.com",
            },
          ].map((link, index) => {
            const colors = getPlatformColors(link.platform);
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-card/50 border-2 border-dashed border-border rounded-lg px-3 py-2.5 opacity-60"
              >
                <div
                  className={`flex items-center justify-center h-9 w-9 ${colors.bg} ${colors.text} rounded-md shrink-0`}
                >
                  <PlatformIcon platform={link.platform} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {link.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {link.url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingLink(undefined);
                    setSelectedPlatform(link.platform);
                    setEditorOpen(true);
                  }}
                  className="shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Drag and drop to reorder your links
          </p>
          {links.map((link, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver =
              dragOverIndex === index && draggedIndex !== index;
            const colors = getPlatformColors(link.platform);

            return (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 bg-card border-2 rounded-lg px-3 py-2.5 group transition-all duration-200 ${
                  isDragging
                    ? "opacity-50 scale-[0.98] border-primary"
                    : isDragOver
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-muted-foreground/50"
                } cursor-grab active:cursor-grabbing`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div
                  className={`flex items-center justify-center h-9 w-9 ${colors.bg} ${colors.text} rounded-md shrink-0`}
                >
                  <PlatformIcon platform={link.platform} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {link.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {link.url}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(link)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(link.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LinkEditor
        link={editingLink}
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) {
            setEditingLink(undefined);
            setSelectedPlatform(undefined);
          }
        }}
        onSave={handleSave}
        initialPlatform={selectedPlatform}
      />
    </div>
  );
}
