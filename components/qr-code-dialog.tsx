"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  username: string;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  url,
  username,
}: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current && url) {
      setIsLoading(true);
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#14b8a6",
          light: "#ffffff",
        },
      })
        .catch((error) => {
          console.error("QR Code generation failed:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, url]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${username}-qr.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Your QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-xl border border-border">
            <canvas ref={canvasRef} className="w-64 h-64" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan to visit linkin.one/{username}
          </p>
          <Button
            onClick={handleDownload}
            className="w-full"
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Generating..." : "Download QR Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
