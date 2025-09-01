"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useNotifications, type Notification } from "@/lib/notifications"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Bell,
  Video,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ExternalLink,
  Calendar,
  FileText,
  ClipboardList,
  Download,
} from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user, loading: authLoading } = useAuth()
  const { notifications, markAsRead, deleteNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()
  const [notification, setNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedContent, setRelatedContent] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchNotification = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundNotification = notifications.find((n) => n.id === id)
        if (foundNotification) {
          setNotification(foundNotification)

          // Mark as read if it's not already
          if (!foundNotification.isRead) {
            markAsRead(foundNotification.id)
          }

          // Generate mock related content based on notification type
          generateRelatedContent(foundNotification.type)
        } else {
          toast({
            title: "Notification not found",
            description: "The requested notification could not be found",
            variant: "destructive",
          })
          router.push("/notifications")
        }
      } catch (error) {
        console.error("Error fetching notification:", error)
        toast({
          title: "Error",
          description: "Failed to load notification details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view notification details",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchNotification()
  }, [id, router, toast, user, authLoading, notifications, markAsRead])

  const generateRelatedContent = (type: string) => {
    // Generate mock related content based on notification type
    switch (type) {
      case "product":
        setRelatedContent([
          { id: "1", title: "Organic Farming Techniques", type: "article" },
          { id: "2", title: "Sustainable Agriculture Webinar", type: "event", date: "June 15, 2023" },
          { id: "3", title: "New Product Showcase", type: "video" },
        ])
        break
      case "market":
        setRelatedContent([
          { id: "1", title: "Market Trends Report Q2 2023", type: "report" },
          { id: "2", title: "Price Forecasting Workshop", type: "event", date: "May 28, 2023" },
          { id: "3", title: "Supply Chain Optimization Guide", type: "article" },
        ])
        break
      case "order":
        setRelatedContent([
          { id: "1", title: "Order Management Best Practices", type: "article" },
          { id: "2", title: "Customer Satisfaction Survey", type: "survey" },
          { id: "3", title: "Delivery Optimization Tips", type: "video" },
        ])
        break
      case "alert":
        setRelatedContent([
          { id: "1", title: "Weather Preparedness Guide", type: "article" },
          { id: "2", title: "Crop Protection Webinar", type: "event", date: "June 5, 2023" },
          { id: "3", title: "Emergency Response Plan Template", type: "download" },
        ])
        break
      default:
        setRelatedContent([])
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <TrendingUp className="h-5 w-5" />
      case "market":
        return <TrendingUp className="h-5 w-5" />
      case "order":
        return <ShoppingCart className="h-5 w-5" />
      case "alert":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <ExternalLink className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      case "survey":
        return <ClipboardList className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const handleDelete = () => {
    if (notification) {
      deleteNotification(notification.id)
      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      })
      router.push("/notifications")
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading notification details...</p>
        </div>
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Notification Not Found</h2>
        <p className="mb-6">The notification you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/notifications")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notifications
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-muted">{getTypeIcon(notification.type)}</div>
                  <div>
                    <CardTitle>{notification.title}</CardTitle>
                    <CardDescription>{notification.date}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {notification.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{notification.description}</p>

              {notification.hasVideo && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Video Demonstration</h3>
                  <VideoPlayer
                    productId={id}
                    prompt={
                      notification.type === "product"
                        ? "Show a detailed demonstration of this agricultural product being used in various farming scenarios with close-ups of its features and benefits."
                        : "Show a visual explanation of this agricultural market trend with data visualizations and real-world examples of its impact on farmers and retailers."
                    }
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                {notification.type === "order"
                  ? "View Order"
                  : notification.type === "product"
                    ? "View Product"
                    : notification.type === "market"
                      ? "View Market Data"
                      : "Learn More"}
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={handleDelete}>
                Delete Notification
              </Button>
            </CardFooter>
          </Card>

          {relatedContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Content</CardTitle>
                <CardDescription>Resources related to this notification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-muted">{getContentIcon(content.type)}</div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">{content.type}</p>
                        </div>
                      </div>
                      {content.date && <Badge variant="outline">{content.date}</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Things you can do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {notification.type === "order"
                  ? "Track Order"
                  : notification.type === "product"
                    ? "Purchase Product"
                    : notification.type === "market"
                      ? "View Market Analysis"
                      : notification.type === "alert"
                        ? "View Safety Guidelines"
                        : "Take Action"}
              </Button>
              <Button variant="outline" className="w-full">
                Share
              </Button>
              <Button variant="outline" className="w-full">
                Save for Later
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="mute-similar" className="text-sm font-medium">
                  Mute similar notifications
                </label>
                <input type="checkbox" id="mute-similar" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="email-notif" className="text-sm font-medium">
                  Receive by email
                </label>
                <input type="checkbox" id="email-notif" className="h-4 w-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="priority" className="text-sm font-medium">
                  Mark as priority
                </label>
                <input type="checkbox" id="priority" className="h-4 w-4" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage All Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
