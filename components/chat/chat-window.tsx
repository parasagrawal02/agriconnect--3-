"use client"

import { useChat } from "@/lib/chat"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export function ChatWindow() {
  const { messages, toggleChat, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[350px] flex-col rounded-lg border bg-background shadow-lg md:right-6 md:h-[600px] md:w-[400px]">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <span className="text-green-600">🌱</span>
          </div>
          <h2 className="font-semibold">AgriConnect Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleChat}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-1 self-start rounded-lg bg-muted px-3 py-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-green-600"></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-green-600"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-green-600"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput />
    </div>
  )
}
