"use client"

import { LinkCard } from "@/components/link-card"
import { CATEGORY_LABELS, type LinkCategory, type ProfileLink, type ProfileLayout } from "@/lib/types"

interface LinkListProps {
  links: ProfileLink[]
  compact?: boolean
  groupByCategory?: boolean
  layout?: ProfileLayout
}

export function LinkList({ links, compact = false, groupByCategory = true, layout = "classic" }: LinkListProps) {
  if (layout === "grid") {
    return (
      <div className={`grid grid-cols-2 ${compact ? "gap-2" : "gap-3"}`}>
        {links.map((link) => (
          <LinkCard key={link.id} link={link} compact={compact} />
        ))}
      </div>
    )
  }

  if (!groupByCategory) {
    return (
      <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"}`}>
        {links.map((link) => (
          <LinkCard key={link.id} link={link} compact={compact} />
        ))}
      </div>
    )
  }

  const groupedLinks = links.reduce(
    (acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = []
      }
      acc[link.category].push(link)
      return acc
    },
    {} as Record<LinkCategory, ProfileLink[]>,
  )

  const categoryOrder: LinkCategory[] = ["social", "business", "personal"]

  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-6"}`}>
      {categoryOrder.map((category) => {
        const categoryLinks = groupedLinks[category]
        if (!categoryLinks || categoryLinks.length === 0) return null

        return (
          <div key={category} className="space-y-2">
            <h3
              className={`text-muted-foreground font-medium uppercase tracking-wider ${
                compact ? "text-[10px]" : "text-xs"
              }`}
            >
              {CATEGORY_LABELS[category]}
            </h3>
            <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-2"}`}>
              {categoryLinks.map((link) => (
                <LinkCard key={link.id} link={link} compact={compact} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
