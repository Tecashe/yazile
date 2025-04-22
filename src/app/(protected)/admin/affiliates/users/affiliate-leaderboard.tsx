"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAffiliateLeaderboard } from "@/actions/new-referral/referral-actions"
import { useToast } from "@/hooks/use-toast"
import { Users, TrendingUp } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  totalEarned: number
  userId: string | null
  bio: string | null
  _count: {
    referrals: number
  }
}

interface AffiliateLeaderboardProps {
  programId?: string
  limit?: number
}

export default function AffiliateLeaderboard({ programId, limit = 10 }: AffiliateLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const result = await getAffiliateLeaderboard(limit)

        if (result.success) {
          // Make sure we're setting an array, even if the API returns null or undefined
          setLeaderboard(result.leaderboard || [])
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to fetch leaderboard",
            variant: "destructive",
          })
          // Set empty array on error
          setLeaderboard([])
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        toast({
          title: "Error",
          description: "Failed to load leaderboard",
          variant: "destructive",
        })
        // Set empty array on error
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [limit, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return "bg-yellow-500"
    if (index === 1) return "bg-gray-400"
    if (index === 2) return "bg-amber-700"
    return "bg-gray-200"
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center p-4">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No affiliates data available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${getMedalColor(index)}`}
                >
                  {index + 1}
                </div>
                <Avatar>
                  <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {entry.name}
                    {entry.userId ? (
                      <Badge variant="outline" className="text-xs">
                        User
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        External
                      </Badge>
                    )}
                  </div>
                  {entry.bio && <p className="text-sm text-muted-foreground truncate max-w-md">{entry.bio}</p>}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    Referrals
                  </span>
                  <span className="font-medium">{entry._count.referrals}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Earnings
                  </span>
                  <span className="font-medium">${entry.totalEarned.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

