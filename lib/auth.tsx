"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string | null
  email: string
  image?: string | null
  role: "farmer" | "retailer"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: "farmer" | "retailer") => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to verify the session
        const storedUser = localStorage.getItem("agriconnect-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to authenticate
      // Simulating authentication for demo purposes
      if (email && password) {
        // Mock user data - in a real app this would come from your backend
        const mockUser: User = {
          id: "user-1",
          name: email.split("@")[0],
          email,
          role: email.includes("farmer") ? "farmer" : "retailer",
        }

        setUser(mockUser)
        localStorage.setItem("agriconnect-user", JSON.stringify(mockUser))

        toast({
          title: "Login successful",
          description: "Welcome back to AgriConnect!",
        })

        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: "farmer" | "retailer") => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to register
      // Simulating registration for demo purposes
      if (email && password && name && role) {
        // Mock user data - in a real app this would come from your backend
        const mockUser: User = {
          id: "user-" + Date.now(),
          name,
          email,
          role,
        }

        setUser(mockUser)
        localStorage.setItem("agriconnect-user", JSON.stringify(mockUser))

        toast({
          title: "Registration successful",
          description: "Welcome to AgriConnect!",
        })

        router.push("/dashboard")
      } else {
        throw new Error("Invalid registration data")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // In a real app, this would be an API call to logout
      setUser(null)
      localStorage.removeItem("agriconnect-user")

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      })
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
