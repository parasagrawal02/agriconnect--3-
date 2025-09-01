"use client"

import { useChat } from "@/lib/chat"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function ChatButton() {
  const { toggleChat, isOpen } = useChat()

  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-green-600 p-0 shadow-lg hover:bg-green-700 md:right-6"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
