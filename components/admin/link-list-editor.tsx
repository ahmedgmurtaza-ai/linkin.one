"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { PLATFORM_ICONS, type ProfileLink } from "@/lib/types"
import { LinkEditor } from "./link-editor"
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react"

interface LinkListEditorProps {
  links: ProfileLink[]
  onAdd: (link: Omit<ProfileLink, "id">) => void
  onUpdate: (id: string, updates: Partial<ProfileLink>) => void
  onDelete: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function LinkListEditor({ links, onAdd, onUpdate, onDelete, onReorder }: LinkListEditorProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<ProfileLink | undefined>()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)

  const handleEdit = (link: ProfileLink) => {
    setEditingLink(link)
    setEditorOpen(true)
  }

  const handleSave = (linkData: Omit<ProfileLink, "id">) => {
    if (editingLink) {
      onUpdate(editingLink.id, linkData)
    } else {
      onAdd(linkData)
    }
    setEditingLink(undefined)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    dragNodeRef.current = e.target as HTMLDivElement
    e.dataTransfer.effectAllowed = "move"
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.5"
      }
    }, 0)
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    onReorder(draggedIndex, index)
  }

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1"
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Links</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingLink(undefined)
            setEditorOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          <p className="mb-2">No links yet</p>
          <p className="text-sm">Click "Add Link" to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Drag and drop to reorder your links</p>
          {links.map((link, index) => {
            const iconLabel = PLATFORM_ICONS[link.platform.toLowerCase()] || PLATFORM_ICONS.default
            const isDragging = draggedIndex === index
            const isDragOver = dragOverIndex === index && draggedIndex !== index

            return (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 bg-card border rounded-lg px-3 py-2.5 group transition-all duration-200 ${
                  isDragging
                    ? "opacity-50 scale-[0.98] border-primary"
                    : isDragOver
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-border hover:border-muted-foreground/50"
                } cursor-grab active:cursor-grabbing`}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex items-center justify-center h-8 w-8 bg-secondary text-primary font-semibold text-xs rounded-md shrink-0">
                  {iconLabel}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(link)}>
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
            )
          })}
        </div>
      )}

      <LinkEditor
        link={editingLink}
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open)
          if (!open) setEditingLink(undefined)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
