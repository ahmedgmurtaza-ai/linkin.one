import { Link2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Link2 className="h-5 w-5 text-primary" />
      <span className="text-xl font-semibold">linkin.one</span>
    </div>
  );
}
