import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMyRecentActivity } from "@/actions/dashboard/business-dashboard-actions"
import { onCurrentUser } from "@/actions/user"

export async function RecentActivity() {
  const user = await onCurrentUser()
  const activities = await getMyRecentActivity(user.id)

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt="Avatar" />
            <AvatarFallback>
              {activity.user.firstname?.[0]}
              {activity.user.lastname?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.action} {activity.target}
            </p>
            <p className="text-sm text-muted-foreground">{activity.details || "No additional details"}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {new Date(activity.timestamp).toLocaleDateString()}
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  )
}
