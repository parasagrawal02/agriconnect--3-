"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/lib/notifications"
import { useAuth } from "@/lib/auth"

export function NotificationIndicator() {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  if (!user) {
    return null
  }

  // Get the 5 most recent notifications
  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && <Badge variant="outline">{unreadCount} unread</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {recentNotifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer flex flex-col items-start py-2 px-4"
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id)
                  }
                  setOpen(false)
                }}
              >
                <div className="flex w-full items-center gap-2">
                  <span className="font-medium">
                    {!notification.isRead && <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500" />}
                    {notification.title}
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {notification.type}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{notification.description}</p>
                <span className="mt-1 text-xs text-muted-foreground">{notification.date}</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/notifications"
            className="w-full cursor-pointer justify-center font-medium"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
