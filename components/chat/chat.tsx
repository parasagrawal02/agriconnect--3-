"use client"

import { useChat } from "@/lib/chat"
import { ChatButton } from "./chat-button"
import { ChatWindow } from "./chat-window"

export function Chat() {
  const { isOpen } = useChat()

  return (
    <>
      <ChatButton />
      {isOpen && <ChatWindow />}
    </>
  )
}
