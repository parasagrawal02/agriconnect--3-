"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

export type NotificationType = "product" | "market" | "order" | "alert"

export type Notification = {
  id: string
  title: string
  description: string
  date: string
  isRead: boolean
  type: NotificationType
  hasVideo?: boolean
  videoUrl?: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "date" | "isRead">) => void
  deleteNotification: (id: string) => void
  getByType: (type: NotificationType | "all") => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock data for initial notifications
const mockNotifications = [
  {
    id: "1",
    title: "New Organic Fertilizer Available",
    description:
      "Check out the latest eco-friendly fertilizer for your crops. This new formula increases yield by up to 20% while being completely safe for the environment.",
    date: "2 hours ago",
    isRead: false,
    type: "product" as NotificationType,
    hasVideo: true,
    videoUrl: "#",
  },
  {
    id: "2",
    title: "Market Price Update",
    description:
      "Tomato prices have increased by 5% in your region due to seasonal changes. Consider adjusting your pricing strategy to maximize profits.",
    date: "1 day ago",
    isRead: true,
    type: "market" as NotificationType,
    hasVideo: false,
  },
  {
    id: "3",
    title: "New Order Received",
    description:
      "You have received a new order from Green Grocers for 50kg of organic tomatoes. Please review and confirm by end of day.",
    date: "2 days ago",
    isRead: true,
    type: "order" as NotificationType,
    hasVideo: false,
  },
  {
    id: "4",
    title: "New Irrigation System Technology",
    description:
      "Revolutionary smart irrigation system that reduces water usage by 30%. Perfect for drought-prone areas and environmentally conscious farmers.",
    date: "3 days ago",
    isRead: false,
    type: "product" as NotificationType,
    hasVideo: true,
    videoUrl: "#",
  },
  {
    id: "5",
    title: "Weather Alert",
    description:
      "Heavy rainfall expected in your area over the next 48 hours. Consider harvesting sensitive crops early to prevent damage.",
    date: "4 days ago",
    isRead: true,
    type: "alert" as NotificationType,
    hasVideo: false,
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`agriconnect-notifications-${user.id}`)
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications))
        } catch (error) {
          console.error("Failed to parse notifications data:", error)
          // If parsing fails, use mock data
          setNotifications(mockNotifications)
        }
      } else {
        // If no saved notifications, use mock data
        setNotifications(mockNotifications)
      }
    }
  }, [user])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`agriconnect-notifications-${user.id}`, JSON.stringify(notifications))
    }
  }, [notifications, user])

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })))

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const addNotification = (notification: Omit<Notification, "id" | "date" | "isRead">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      date: "Just now",
      isRead: false,
    }

    setNotifications((current) => [newNotification, ...current])

    toast({
      title: "New notification",
      description: notification.title,
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))

    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    })
  }

  const getByType = (type: NotificationType | "all") => {
    if (type === "all") return notifications
    return notifications.filter((notification) => notification.type === type)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        getByType,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
