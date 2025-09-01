import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth"
import { CartProvider } from "@/lib/cart"
import { NotificationProvider } from "@/lib/notifications"
import { ChatProvider } from "@/lib/chat"
import { MainNav } from "@/components/main-nav"
import { Chat } from "@/components/chat/chat"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AgriConnect",
  description: "Connecting farmers and retailers directly",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <ChatProvider>
                  <div className="flex min-h-screen flex-col">
                    <MainNav />
                    <main className="flex-1">{children}</main>
                    <footer className="border-t py-6">
                      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                          &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
                        </p>
                      </div>
                    </footer>
                    <Chat />
                  </div>
                  <Toaster />
                </ChatProvider>
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
