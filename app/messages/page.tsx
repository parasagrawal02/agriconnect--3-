"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { Search, Send, Phone, Video, MoreHorizontal } from "lucide-react"

// Mock data for demonstration
const mockContacts = [
  {
    id: "1",
    name: "Paras Kumar",
    role: "Farmer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I have those tomatoes you asked about",
    lastMessageTime: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "joy Agrawal",
    role: "Retailer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you deliver by Thursday?",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Mayank Gaur",
    role: "Farmer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The price sounds good to me",
    lastMessageTime: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Anjali Singh",
    role: "Retailer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We need 20kg of apples for next week",
    lastMessageTime: "Monday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Pushpendra Singh",
    role: "Farmer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let me know if you need anything else",
    lastMessageTime: "Monday",
    unread: 0,
    online: true,
  },
]

const mockMessages = [
  {
    id: "1",
    senderId: "1",
    text: "Hi there! I saw you're looking for organic tomatoes.",
    timestamp: "10:15 AM",
    isRead: true,
  },
  {
    id: "2",
    senderId: "current-user",
    text: "Yes, I need about 20kg for my store this week. What varieties do you have?",
    timestamp: "10:18 AM",
    isRead: true,
  },
  {
    id: "3",
    senderId: "1",
    text: "I have Roma, Cherry, and Beefsteak tomatoes available right now. All organically grown.",
    timestamp: "10:20 AM",
    isRead: true,
  },
  {
    id: "4",
    senderId: "current-user",
    text: "Great! How much for 10kg of Roma and 10kg of Cherry tomatoes?",
    timestamp: "10:22 AM",
    isRead: true,
  },
  {
    id: "5",
    senderId: "1",
    text: "Roma are $2.50/kg and Cherry are $3.20/kg. So that would be $57 total. I can deliver them to your store on Wednesday if that works for you.",
    timestamp: "10:25 AM",
    isRead: true,
  },
  {
    id: "6",
    senderId: "1",
    text: "I have those tomatoes you asked about. They're ready for delivery whenever you are.",
    timestamp: "10:30 AM",
    isRead: false,
  },
]

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState(mockContacts[0])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [contacts, setContacts] = useState(mockContacts)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view messages",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, loading, router, toast])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectContact = (contact: (typeof mockContacts)[0]) => {
    setSelectedContact(contact)

    // Mark messages as read
    if (contact.unread > 0) {
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)))

      setMessages((prev) => prev.map((m) => (m.senderId === contact.id && !m.isRead ? { ...m, isRead: true } : m)))
    }
  }

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: true,
    }

    setMessages([...messages, newMessage])

    // Update last message in contacts
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              lastMessage: message,
              lastMessageTime: "Just now",
            }
          : c,
      ),
    )

    setMessage("")

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: selectedContact.id,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: true,
      }

      setMessages((prev) => [...prev, replyMessage])

      // Update last message in contacts
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? {
                ...c,
                lastMessage: replyMessage.text,
                lastMessageTime: "Just now",
              }
            : c,
        ),
      )
    }, 2000)
  }

  if (loading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Contacts sidebar */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No contacts found</div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 ${
                    selectedContact?.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => selectContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && <Badge className="ml-2 bg-green-600">{contact.unread}</Badge>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 lg:col-span-3 border rounded-lg overflow-hidden flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center">
                      {selectedContact.role}
                      {selectedContact.online && (
                        <span className="ml-2 flex items-center text-green-600">
                          <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                          Online
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card className={`max-w-[80%] ${msg.senderId === "current-user" ? "bg-green-600 text-white" : ""}`}>
                      <CardContent className="p-3">
                        <p>{msg.text}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.senderId === "current-user" ? "text-green-100" : "text-muted-foreground"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage()
                      }
                    }}
                  />
                  <Button className="bg-green-600 hover:bg-green-700" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Select a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
