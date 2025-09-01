"use client"

import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/lib/chat"

export function ChatInput() {
  const [input, setInput] = useState("")
  const { addMessage, isLoading, messages } = useChat()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await addMessage(message)
  }

  // Suggested questions to help users discover chatbot capabilities
  const suggestedQuestions = [
    "Who created AgriConnect?",
    "What is AgriConnect?",
    "How does AgriConnect work?",
    "What features does AgriConnect offer?",
  ]

  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return
    setInput("")
    await addMessage(question)
  }

  return (
    <div className="border-t border-border p-4">
      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-w-0 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}
