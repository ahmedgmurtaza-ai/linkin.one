"use client";

export function ProfileFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className={`text-center text-muted-foreground ${
        compact ? "text-[10px] mt-4" : "text-xs mt-8"
      }`}
    >
      {/* <p>
        Powered by{" "}
        <a href="/" className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
          linkin.one
        </a>
      </p> */}
    </footer>
  );
}
