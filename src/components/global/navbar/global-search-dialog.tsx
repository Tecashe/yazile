"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Building2,
  Users,
  Bot,
  Star,
  Megaphone,
  Briefcase,
  Workflow,
  MessageSquare,
  Clock,
  Filter,
  X,
} from "lucide-react"
import { useSearch } from "@/hooks/use-search"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface GlobalSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeIcons = {
  business: Building2,
  lead: Users,
  automation: Bot,
  influencer: Star,
  campaign: Megaphone,
  opportunity: Briefcase,
  workflow: Workflow,
  message: MessageSquare,
  user: Users,
}

const typeColors = {
  business: "bg-blue-100 text-blue-800 border-blue-200",
  lead: "bg-green-100 text-green-800 border-green-200",
  automation: "bg-purple-100 text-purple-800 border-purple-200",
  influencer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  campaign: "bg-pink-100 text-pink-800 border-pink-200",
  opportunity: "bg-indigo-100 text-indigo-800 border-indigo-200",
  workflow: "bg-orange-100 text-orange-800 border-orange-200",
  message: "bg-gray-100 text-gray-800 border-gray-200",
  user: "bg-teal-100 text-teal-800 border-teal-200",
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const { query, setQuery, results, totalCount, categories, isLoading, searchTime, clearSearch } = useSearch()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const router = useRouter()

  const handleResultClick = (result: any) => {
    router.push(result.url)
    onOpenChange(false)
    clearSearch()
  }

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setSelectedTypes([])
  }

  // Filter results based on selected types
  const filteredResults =
    selectedTypes.length > 0 ? results.filter((result) => selectedTypes.includes(result.type)) : results

  useEffect(() => {
    if (!open) {
      clearSearch()
      setSelectedTypes([])
    }
  }, [open, clearSearch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search businesses, leads, automations, influencers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
          </div>

          {/* Type Filters */}
          {Object.keys(categories).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filter by type:
              </div>
              {Object.entries(categories).map(([type, count]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const isSelected = selectedTypes.includes(type)

                return (
                  <Button
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTypeFilter(type)}
                    className="h-7 text-xs"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {type} ({count})
                  </Button>
                )
              })}
              {selectedTypes.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-muted-foreground">
                  <X className="h-3 w-3 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 max-h-[400px]">
          <div className="px-6 py-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Searching...</span>
              </div>
            )}

            {!isLoading && query && filteredResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            )}

            {!isLoading && filteredResults.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {filteredResults.length} of {totalCount} results
                    </span>
                    {searchTime > 0 && (
                      <>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{searchTime}ms</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredResults.map((result) => {
                    const Icon = typeIcons[result.type as keyof typeof typeIcons]
                    const colorClass = typeColors[result.type as keyof typeof typeColors]

                    return (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-muted">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{result.title}</h3>
                              <Badge variant="outline" className={cn("text-xs", colorClass)}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                            {result.metadata && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Object.entries(result.metadata)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="text-xs">
                                      {key}: {String(value)}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {!isLoading && query && (
          <div className="px-6 py-3 border-t bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Enter</kbd> to search,
              <kbd className="px-1 py-0.5 bg-background border rounded text-xs ml-1">Esc</kbd> to close
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
