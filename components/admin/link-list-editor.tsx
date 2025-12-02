"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  type ProfileLink,
  type LinkCategory,
  CATEGORY_LABELS,
} from "@/lib/types";
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
  const [draggedCategory, setDraggedCategory] = useState<LinkCategory | null>(
    null
  );
  const [dragOverCategory, setDragOverCategory] = useState<LinkCategory | null>(
    null
  );
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
    setDraggedCategory(null);
    setDragOverCategory(null);
    dragNodeRef.current = null;
  };

  // Category drag handlers
  const handleCategoryDragStart = (
    e: React.DragEvent,
    category: LinkCategory
  ) => {
    setDraggedCategory(category);
    dragNodeRef.current = e.target as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleCategoryDragEnter = (
    e: React.DragEvent,
    category: LinkCategory
  ) => {
    e.preventDefault();
    if (draggedCategory === null || draggedCategory === category) return;
    setDragOverCategory(category);
  };

  const handleCategoryDrop = (
    e: React.DragEvent,
    targetCategory: LinkCategory
  ) => {
    e.preventDefault();
    if (draggedCategory === null || draggedCategory === targetCategory) return;

    // Get all links grouped by category
    const groupedLinks = links.reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    }, {} as Record<LinkCategory, ProfileLink[]>);

    const draggedCategoryLinks = groupedLinks[draggedCategory];
    const targetCategoryLinks = groupedLinks[targetCategory];

    if (!draggedCategoryLinks?.length || !targetCategoryLinks?.length) return;

    // Find where each category starts
    const draggedStartIdx = links.findIndex(
      (l) => l.id === draggedCategoryLinks[0].id
    );
    const targetStartIdx = links.findIndex(
      (l) => l.id === targetCategoryLinks[0].id
    );

    if (draggedStartIdx === -1 || targetStartIdx === -1) return;

    // Move each link in the dragged category sequentially
    // We need to account for how indices shift after each move
    const movingDown = draggedStartIdx < targetStartIdx;

    if (movingDown) {
      // When moving down, move from last to first to maintain positions
      for (let i = draggedCategoryLinks.length - 1; i >= 0; i--) {
        const linkId = draggedCategoryLinks[i].id;
        const currentIdx = links.findIndex((l) => l.id === linkId);
        if (currentIdx !== -1) {
          // Target is after the target category
          const targetIdx = targetStartIdx + targetCategoryLinks.length - 1;
          onReorder(currentIdx, targetIdx);
        }
      }
    } else {
      // When moving up, move from first to last
      for (let i = 0; i < draggedCategoryLinks.length; i++) {
        const linkId = draggedCategoryLinks[i].id;
        const currentIdx = links.findIndex((l) => l.id === linkId);
        if (currentIdx !== -1) {
          onReorder(currentIdx, targetStartIdx);
        }
      }
    }
  };

  // Group links by category
  const groupedLinks = showCategories
    ? links.reduce((acc, link) => {
        if (!acc[link.category]) {
          acc[link.category] = [];
        }
        acc[link.category].push(link);
        return acc;
      }, {} as Record<LinkCategory, ProfileLink[]>)
    : null;

  const categoryOrder: LinkCategory[] = [
    "social",
    "professional",
    "portfolio",
    "content",
    "shop",
    "music",
    "video",
    "contact",
    "resources",
    "others",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">Your Links</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add and organize your social links and important content
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="show-categories"
            checked={showCategories}
            onCheckedChange={onShowCategoriesChange}
          />
          <Label htmlFor="show-categories" className="cursor-pointer text-sm">
            Show categories on profile page
          </Label>
        </div>
        <Button
          size="default"
          onClick={() => {
            setEditingLink(undefined);
            setSelectedPlatform(undefined);
            setEditorOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Get started by adding your first link
          </p>
          <p className="text-xs text-muted-foreground">
            Here are some popular suggestions:
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
                className="flex items-center gap-3 bg-muted/50 border-dashed rounded-lg px-3 py-2.5 opacity-60 shadow-sm"
              >
                <div
                  className={`flex items-center justify-center h-9 w-9 ${colors.bg} ${colors.text} rounded-md shrink-0`}
                >
                  <PlatformIcon
                    platform={link.platform}
                    url={link.url}
                    className="h-5 w-5"
                  />
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
      ) : showCategories && groupedLinks ? (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Drag categories or individual links to reorder
          </p>
          {categoryOrder.map((category) => {
            const categoryLinks = groupedLinks[category];
            if (!categoryLinks || categoryLinks.length === 0) return null;

            const isCategoryDragging = draggedCategory === category;
            const isCategoryDragOver =
              dragOverCategory === category && draggedCategory !== category;

            return (
              <div
                key={category}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, category)}
                onDragEnter={(e) => handleCategoryDragEnter(e, category)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleCategoryDrop(e, category)}
                onDragEnd={handleDragEnd}
                className={`space-y-2 rounded-lg p-3 transition-all duration-200 shadow-sm ${
                  isCategoryDragging
                    ? "opacity-50 scale-[0.98] bg-primary/5 shadow-md"
                    : isCategoryDragOver
                    ? "bg-primary/10 scale-[1.02] shadow-md"
                    : "bg-muted/50"
                } cursor-grab active:cursor-grabbing`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_LABELS[category]}
                  </h3>
                  <span className="text-xs text-muted-foreground/60">
                    ({categoryLinks.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {categoryLinks.map((link) => {
                    const linkIndex = links.findIndex((l) => l.id === link.id);
                    const isDragging = draggedIndex === linkIndex;
                    const isDragOver =
                      dragOverIndex === linkIndex && draggedIndex !== linkIndex;
                    const colors = getPlatformColors(link.platform);

                    return (
                      <div
                        key={link.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(e, linkIndex);
                        }}
                        onDragEnter={(e) => {
                          e.stopPropagation();
                          handleDragEnter(e, linkIndex);
                        }}
                        onDragOver={(e) => {
                          e.stopPropagation();
                          handleDragOver(e);
                        }}
                        onDrop={(e) => {
                          e.stopPropagation();
                          handleDrop(e, linkIndex);
                        }}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-3 bg-card rounded-lg px-3 py-2.5 group transition-all duration-200 shadow-sm ${
                          isDragging
                            ? "opacity-50 scale-[0.98] shadow-md"
                            : isDragOver
                            ? "bg-primary/5 scale-[1.02] shadow-md"
                            : "hover:shadow-md"
                        } cursor-grab active:cursor-grabbing`}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div
                          className={`flex items-center justify-center h-9 w-9 ${colors.bg} ${colors.text} rounded-md shrink-0`}
                        >
                          <PlatformIcon
                            platform={link.platform}
                            url={link.url}
                            className="h-5 w-5"
                          />
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
                className={`flex items-center gap-3 bg-card rounded-lg px-3 py-2.5 group transition-all duration-200 shadow-sm ${
                  isDragging
                    ? "opacity-50 scale-[0.98] shadow-md"
                    : isDragOver
                    ? "bg-primary/5 scale-[1.02] shadow-md"
                    : "hover:shadow-md"
                } cursor-grab active:cursor-grabbing`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div
                  className={`flex items-center justify-center h-9 w-9 ${colors.bg} ${colors.text} rounded-md shrink-0`}
                >
                  <PlatformIcon
                    platform={link.platform}
                    url={link.url}
                    className="h-5 w-5"
                  />
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
