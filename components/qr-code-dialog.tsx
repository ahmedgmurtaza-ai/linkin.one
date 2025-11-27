"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  username: string
}

export function QRCodeDialog({ open, onOpenChange, url, username }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [QRCode, setQRCode] = useState<any>(null)

  useEffect(() => {
    import("qrcode").then((mod) => setQRCode(mod.default))
  }, [])

  useEffect(() => {
    if (open && QRCode && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#14b8a6",
          light: "#0a0a0b",
        },
      })
    }
  }, [open, QRCode, url])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `${username}-qr.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Your QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-background p-4 rounded-xl border border-border">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-sm text-muted-foreground text-center">Scan to visit linkin.one/{username}</p>
          <Button onClick={handleDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
