"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { CartNav } from "@/components/cart-nav"
import { NotificationIndicator } from "@/components/notification-indicator"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Menu, X, CloudSun } from "lucide-react"
import Image from "next/image"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Marketplace",
      href: "/marketplace",
    },
    {
      name: "Weather",
      href: "/weather",
    },
    {
      name: "FAQ",
      href: "/faq",
    },
    {
      name: "About",
      href: "/about",
    },
  ]

  const authenticatedItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Messages",
      href: "/messages",
    },
    {
      name: "Notifications",
      href: "/notifications",
    },
  ]

  const items = user ? [...navItems, ...authenticatedItems] : navItems

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://tse4.mm.bing.net/th?id=OIP.Lxl7PDVTh3tJixoT7Ze0vgHaHa&pid=Api&P=0&h=180" alt="AgriConnect Logo" width={32} height={32} />
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2 items-center">
            <Link href="/weather" className={pathname === "/weather" ? "" : "text-muted-foreground"}>
              <Button variant="ghost" size="icon" className="relative">
                <CloudSun className="h-5 w-5" />
                <span className="sr-only">Weather</span>
              </Button>
            </Link>

            {user && (
              <>
                <NotificationIndicator />
                <CartNav />
              </>
            )}

            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <UserNav />
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 grid gap-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <div className="flex gap-2 pt-2">
                <NotificationIndicator />
                <CartNav />
              </div>
            )}
            {!user ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <UserNav isMobile />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
