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
import QRCode from "react-qr-code";

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
  // No need for canvasRef or loading state with react-qr-code
  const handleDownload = () => {
    const svg = document.getElementById("qr-svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${username}-qr.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Your QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <QRCode
              id="qr-svg"
              value={url}
              size={256}
              bgColor="#ffffff"
              fgColor="#000000"
              style={{ width: "16rem", height: "16rem" }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan to visit linkin.one/{username}
          </p>
          <Button
            onClick={handleDownload}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
