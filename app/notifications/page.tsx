"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useNotifications, type NotificationType } from "@/lib/notifications"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Video, TrendingUp, ShoppingCart, AlertCircle } from "lucide-react"

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const { notifications, markAsRead, markAllAsRead, getByType, deleteNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all")

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view notifications",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, loading, router, toast])

  const filteredNotifications = getByType(activeTab)

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read",
    })
  }

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id)
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "product":
        return <TrendingUp className="h-4 w-4" />
      case "market":
        return <TrendingUp className="h-4 w-4" />
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "alert":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (loading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as NotificationType | "all")}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="market">Market Updates</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No notifications in this category</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id} className={notification.isRead ? "" : "border-green-500"}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>}
                      {notification.title}
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTypeIcon(notification.type)}
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{notification.date}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p>{notification.description}</p>

                  {notification.hasVideo && (
                    <div className="mt-4 border rounded-md p-4 flex items-center justify-between bg-muted/50">
                      <div className="flex items-center">
                        <Video className="h-5 w-5 mr-2 text-green-600" />
                        <span>AI-generated video demonstration available</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Watch Video
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button variant="ghost" onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
