import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

type ChatMessageProps = {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      <div className="flex items-center gap-2">
        {!isUser && (
          <Avatar className="h-6 w-6">
            <AvatarImage src="/images/logo.png" alt="AgriBot" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        )}
        <span className="text-xs text-muted-foreground">{isUser ? "You" : "AgriBot"}</span>
        <span className="text-xs text-muted-foreground">{format(new Date(message.timestamp), "h:mm a")}</span>
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  )
}
