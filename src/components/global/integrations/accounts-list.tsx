

// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Trash2, MoreVertical, RefreshCw } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface Account {
//   id: string
//   title: string
//   subtitle: string
//   avatar: string
//   isActive: boolean
//   platform: string
// }

// interface AccountsListProps {
//   accounts: Account[]
//   onRemove: (id: string) => void
// }

// export default function AccountsList({ accounts = [], onRemove }: AccountsListProps) {

//   const safeAccounts = Array.isArray(accounts) ? accounts : []

//   if (safeAccounts.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10 text-center">
//         <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
//           <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//         </div>
//         <h3 className="mt-4 text-lg font-medium">No accounts connected</h3>
//         <p className="mt-1 text-sm text-muted-foreground max-w-sm">
//           Connect your first account to start managing your social media presence
//         </p>
//       </div>
//     )
//   }

//   return (
//     <ul className="space-y-3 staggeredFadeIn">
//       <AnimatePresence>
//         {safeAccounts.map((account) => (
//           <motion.li
//             key={account.id}
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2 }}
//             className="rounded-lg border bg-card text-card-foreground shadow-sm shimmerBorder"
//           >
//             <div className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Avatar>
//                     <AvatarImage src={account.avatar} alt={account.title} />
//                     <AvatarFallback>{account.title.substring(0, 2).toUpperCase()}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <div className="flex items-center">
//                       <h4 className="font-medium">{account.title}</h4>
//                       {account.isActive ? (
//                         <Badge className="ml-2 bg-green-600 hover:bg-green-700">Active</Badge>
//                       ) : (
//                         <Badge variant="outline" className="ml-2">
//                           Inactive
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">{account.subtitle}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     checked={account.isActive}
//                     onCheckedChange={() => {}}
//                     aria-label="Toggle account active state"
//                   />
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreVertical className="h-4 w-4" />
//                         <span className="sr-only">More options</span>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Account Options</DropdownMenuLabel>
//                       <DropdownMenuItem>
//                         <RefreshCw className="mr-2 h-4 w-4" />
//                         Refresh Connection
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         className="text-red-600 focus:text-red-600"
//                         onClick={() => onRemove(account.id)}
//                       >
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Remove Account
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           </motion.li>
//         ))}
//       </AnimatePresence>
//     </ul>
//   )
// }
"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreHorizontal,
  Trash2,
  RefreshCw,
  ExternalLink,
  PowerOff,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Account {
  id: string
  title: string
  subtitle?: string
  avatar?: string
  isActive: boolean
  platform: string
  token?: string
  expiresAt?: Date | null
  stats?: {
    followers?: number
    posts?: number
  }
}

interface AccountsListProps {
  accounts: Account[]
  onRemove: (accountId: string, token: string) => Promise<void>
  onToggle?: (accountId: string, isActive: boolean) => Promise<void>
  onRefresh?: (accountId: string) => Promise<void>
  isRemoving?: string | null
  className?: string
}

export function AccountsList({ accounts, onRemove, onToggle, onRefresh, isRemoving, className }: AccountsListProps) {
  const [accountToRemove, setAccountToRemove] = useState<Account | null>(null)
  const [optimisticRemoving, setOptimisticRemoving] = useState<string | null>(null)
  const [refreshingAccount, setRefreshingAccount] = useState<string | null>(null)

  const handleRemove = useCallback(async () => {
    if (!accountToRemove) return

    setOptimisticRemoving(accountToRemove.id)
    setAccountToRemove(null)

    try {
      await onRemove(accountToRemove.id, accountToRemove.token || "")
    } catch (error) {
      console.error("Failed to remove account:", error)
    } finally {
      setOptimisticRemoving(null)
    }
  }, [accountToRemove, onRemove])

  const handleRefresh = useCallback(
    async (accountId: string) => {
      if (!onRefresh || refreshingAccount) return
      setRefreshingAccount(accountId)
      try {
        await onRefresh(accountId)
      } finally {
        setRefreshingAccount(null)
      }
    },
    [onRefresh, refreshingAccount],
  )

  const isTokenExpiringSoon = (expiresAt: Date | null | undefined) => {
    if (!expiresAt) return false
    const daysUntilExpiry = Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7
  }

  if (accounts.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center",
          className,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-medium text-foreground">No accounts connected</h3>
        <p className="mt-1 text-sm text-muted-foreground">Connect your first account to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <AnimatePresence mode="popLayout">
          {accounts.map((account, index) => {
            const isBeingRemoved = optimisticRemoving === account.id || isRemoving === account.id
            const isRefreshing = refreshingAccount === account.id
            const expiringSoon = isTokenExpiringSoon(account.expiresAt)

            return (
              <motion.div
                key={account.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isBeingRemoved ? 0.5 : 1,
                  y: 0,
                  scale: isBeingRemoved ? 0.98 : 1,
                }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300",
                  account.isActive ? "border-border hover:border-primary/30" : "border-border/50 bg-muted/30",
                  isBeingRemoved && "pointer-events-none",
                )}
              >
                {/* Removing overlay */}
                <AnimatePresence>
                  {isBeingRemoved && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Removing...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {account.avatar ? (
                        <img
                          src={account.avatar || "/placeholder.svg"}
                          alt={account.title}
                          className={cn(
                            "h-12 w-12 rounded-full object-cover ring-2 transition-all",
                            account.isActive ? "ring-primary/20" : "ring-border grayscale",
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold transition-all",
                            account.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {account.title.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Status indicator */}
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background",
                          account.isActive ? "bg-emerald-500" : "bg-muted-foreground",
                        )}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground truncate">{account.title}</h4>
                        {expiringSoon && (
                          <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Expires soon
                          </Badge>
                        )}
                      </div>
                      {account.subtitle && <p className="text-sm text-muted-foreground truncate">{account.subtitle}</p>}
                      {account.stats && (
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          {account.stats.followers !== undefined && (
                            <span>{account.stats.followers.toLocaleString()} followers</span>
                          )}
                          {account.stats.posts !== undefined && (
                            <span>{account.stats.posts.toLocaleString()} posts</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Active toggle */}
                      {onToggle && (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={account.isActive}
                            onCheckedChange={(checked) => onToggle(account.id, checked)}
                            disabled={isBeingRemoved}
                          />
                        </div>
                      )}

                      {/* Status badge */}
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5 transition-colors",
                          account.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {account.isActive ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>

                      {/* Dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={isBeingRemoved}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {onRefresh && (
                            <DropdownMenuItem onClick={() => handleRefresh(account.id)} disabled={isRefreshing}>
                              <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                              Refresh data
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <a
                              href={`https://instagram.com/${account.title.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View profile
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setAccountToRemove(account)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Remove confirmation dialog */}
      <AlertDialog open={!!accountToRemove} onOpenChange={() => setAccountToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect <strong>{accountToRemove?.title}</strong>? This will stop all
              automations associated with this account. You can reconnect it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AccountsList
