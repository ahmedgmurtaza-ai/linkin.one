"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface ChangelogRendererProps {
  content: string;
}

interface ChangeItem {
  type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security" | "improved";
  items: string[];
}

interface Version {
  version: string;
  date: string;
  changes: ChangeItem[];
}

const typeConfig = {
  added: {
    label: "Added",
    color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    emoji: "✨",
  },
  changed: {
    label: "Changed",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    emoji: "🔄",
  },
  deprecated: {
    label: "Deprecated",
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    emoji: "⚠️",
  },
  removed: {
    label: "Removed",
    color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    emoji: "🗑️",
  },
  fixed: {
    label: "Fixed",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    emoji: "🐛",
  },
  security: {
    label: "Security",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    emoji: "🔒",
  },
  improved: {
    label: "Improved",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    emoji: "⚡",
  },
};

function parseChangelog(content: string): Version[] {
  const versions: Version[] = [];
  const lines = content.split("\n");
  
  let currentVersion: Version | null = null;
  let currentChangeType: ChangeItem | null = null;

  for (const line of lines) {
    // Match version header: ## [1.0.0] - 2025-11-30
    const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s+-\s+(.+)/);
    if (versionMatch) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      currentVersion = {
        version: versionMatch[1],
        date: versionMatch[2],
        changes: [],
      };
      currentChangeType = null;
      continue;
    }

    // Match change type: ### Added
    const typeMatch = line.match(/^###\s+(.+)/);
    if (typeMatch && currentVersion) {
      const typeName = typeMatch[1].toLowerCase();
      currentChangeType = {
        type: typeName as any,
        items: [],
      };
      currentVersion.changes.push(currentChangeType);
      continue;
    }

    // Match list item: - Something was added
    const itemMatch = line.match(/^-\s+(.+)/);
    if (itemMatch && currentChangeType) {
      currentChangeType.items.push(itemMatch[1]);
    }
  }

  // Push the last version
  if (currentVersion) {
    versions.push(currentVersion);
  }

  return versions;
}

export function ChangelogRenderer({ content }: ChangelogRendererProps) {
  const versions = parseChangelog(content);

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No changelog entries found. Check back later for updates!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {versions.map((version) => (
        <Card key={version.version}>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-2xl">
                Version {version.version}
              </CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {version.date}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {version.changes.map((change, idx) => {
              const config = typeConfig[change.type] || typeConfig.changed;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.emoji}</span>
                    <h4 className="font-semibold text-sm uppercase tracking-wide">
                      {config.label}
                    </h4>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {change.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span className="text-sm leading-relaxed flex-1">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
