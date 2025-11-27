"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProfileLink, LinkType } from "@/lib/types"
import { Upload, Link, FileText } from "lucide-react"

interface LinkEditorProps {
  link?: ProfileLink
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (link: Omit<ProfileLink, "id">) => void
}

const PLATFORM_OPTIONS = [
  { value: "x", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
  { value: "medium", label: "Medium" },
  { value: "substack", label: "Substack" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "spotify", label: "Spotify" },
  { value: "resume", label: "Resume/CV" },
  { value: "file", label: "Other File" },
]

export function LinkEditor({ link, open, onOpenChange, onSave }: LinkEditorProps) {
  const [linkType, setLinkType] = useState<LinkType>(link?.linkType || "url")
  const [title, setTitle] = useState(link?.title || "")
  const [url, setUrl] = useState(link?.url || "")
  const [platform, setPlatform] = useState(link?.platform || "website")
  const [fileName, setFileName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf" && !file.type.startsWith("application/")) {
      return
    }
    const fileUrl = URL.createObjectURL(file)
    setFileName(file.name)
    setUrl(fileUrl)
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
    setPlatform(file.type === "application/pdf" ? "resume" : "file")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return
    onSave({
      title,
      url,
      platform,
      category: "personal", // Default category since we removed dropdown
      linkType,
      isDownloadable: linkType === "file",
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setUrl("")
    setPlatform("website")
    setFileName("")
    setLinkType("url")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{link ? "Edit Link" : "Add New Link"}</DialogTitle>
        </DialogHeader>

        <Tabs value={linkType} onValueChange={(v) => setLinkType(v as LinkType)} className="w-full">
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
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
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
          </TabsContent>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="file-title">Title</Label>
              <Input id="file-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Resume" />
            </div>

            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
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
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
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
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !url.trim()}>
            {link ? "Save Changes" : "Add Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
