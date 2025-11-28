import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Facebook,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Music,
  FileText,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

interface PlatformIconProps {
  platform: string;
  className?: string;
  showColor?: boolean;
}

const PLATFORM_ICON_MAP: Record<string, LucideIcon> = {
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Music,
  website: Globe,
  email: Mail,
  discord: MessageCircle,
  telegram: Send,
  whatsapp: MessageCircle,
  spotify: Music,
  medium: FileText,
  substack: FileText,
  dribbble: Globe,
  behance: Globe,
  resume: FileText,
  pdf: FileText,
  file: FileText,
  default: LinkIcon,
};

const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
  twitter: { bg: "bg-[#1DA1F2]", text: "text-white" },
  x: { bg: "bg-black", text: "text-white" },
  linkedin: { bg: "bg-[#0A66C2]", text: "text-white" },
  github: { bg: "bg-[#181717]", text: "text-white" },
  instagram: {
    bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    text: "text-white",
  },
  youtube: { bg: "bg-[#FF0000]", text: "text-white" },
  facebook: { bg: "bg-[#1877F2]", text: "text-white" },
  tiktok: { bg: "bg-black", text: "text-white" },
  website: { bg: "bg-blue-500", text: "text-white" },
  email: { bg: "bg-gray-600", text: "text-white" },
  discord: { bg: "bg-[#5865F2]", text: "text-white" },
  telegram: { bg: "bg-[#26A5E4]", text: "text-white" },
  whatsapp: { bg: "bg-[#25D366]", text: "text-white" },
  spotify: { bg: "bg-[#1DB954]", text: "text-white" },
  medium: { bg: "bg-black", text: "text-white" },
  substack: { bg: "bg-[#FF6719]", text: "text-white" },
  dribbble: { bg: "bg-[#EA4C89]", text: "text-white" },
  behance: { bg: "bg-[#1769FF]", text: "text-white" },
  resume: { bg: "bg-indigo-600", text: "text-white" },
  pdf: { bg: "bg-red-600", text: "text-white" },
  file: { bg: "bg-gray-500", text: "text-white" },
  default: { bg: "bg-primary/10", text: "text-primary" },
};

export function PlatformIcon({
  platform,
  className = "h-5 w-5",
  showColor = false,
}: PlatformIconProps) {
  const IconComponent =
    PLATFORM_ICON_MAP[platform.toLowerCase()] || PLATFORM_ICON_MAP.default;
  const colors =
    PLATFORM_COLORS[platform.toLowerCase()] || PLATFORM_COLORS.default;

  if (showColor) {
    return (
      <div
        className={`flex items-center justify-center ${colors.bg} ${colors.text} rounded-md p-1.5`}
      >
        <IconComponent className={className} />
      </div>
    );
  }

  return <IconComponent className={className} />;
}

export function getPlatformColors(platform: string) {
  return PLATFORM_COLORS[platform.toLowerCase()] || PLATFORM_COLORS.default;
}
