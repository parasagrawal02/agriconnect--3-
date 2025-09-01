"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type ChatContextType = {
  messages: Message[]
  addMessage: (content: string) => Promise<void>
  isOpen: boolean
  toggleChat: () => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Enhanced predefined responses with comprehensive AgriConnect information
const PREDEFINED_RESPONSES: Record<string, string> = {
  default: "I'm your AgriConnect assistant. How can I help you with farming or retail needs today?",
  greeting: "Hello! Welcome to AgriConnect. How can I assist you today?",
  help: "I can help you navigate the marketplace, learn about products, manage your orders, or connect with farmers/retailers. I can also tell you about AgriConnect's mission, features, and creator.",

  // Enhanced information about AgriConnect
  about_agriconnect:
    "AgriConnect is a revolutionary platform designed to connect farmers directly with retailers within a 100km radius. Our mission is to create sustainable local food systems by eliminating intermediaries, reducing food miles, and ensuring fair compensation for farmers while providing retailers with fresh, locally-sourced produce.",

  creator:
    "AgriConnect was created by Paras Agrawal, a visionary entrepreneur passionate about sustainable agriculture and technology. Paras developed AgriConnect to address the challenges faced by small-scale farmers in reaching markets and to help retailers source fresh local produce efficiently.",

  how_it_works:
    "AgriConnect works by creating a direct marketplace between farmers and retailers. Farmers list their available products with details and pricing. Retailers browse the marketplace and place orders directly. Our platform handles order management, provides weather insights for farming decisions, facilitates secure payments, and optimizes local delivery routes to ensure freshness.",

  features:
    "AgriConnect offers several key features: 1) Direct marketplace connecting farmers and retailers, 2) Real-time inventory management, 3) Secure ordering and payment processing, 4) Agricultural weather forecasting, 5) Order tracking and history, 6) AI-generated product videos, 7) Interactive chat support, and 8) User-specific dashboards for farmers and retailers.",

  benefits_farmers:
    "For farmers, AgriConnect provides: direct market access, fair pricing control, reduced waste through demand forecasting, weather insights for crop management, simplified logistics, and expanded customer reach—all while maintaining the focus on local, sustainable agriculture.",

  benefits_retailers:
    "Retailers benefit from AgriConnect through: access to fresher produce with lower food miles, direct relationships with local farmers, transparent pricing and sourcing, reduced supply chain complexity, inventory management tools, and the ability to promote locally-sourced products to consumers.",

  mission:
    "AgriConnect's mission is to revolutionize agricultural supply chains by fostering direct connections between local farmers and retailers. We aim to create more sustainable, efficient, and equitable food systems that benefit producers, sellers, consumers, and the environment.",

  technology:
    "AgriConnect leverages cutting-edge technology including Next.js for the web platform, real-time data synchronization, geolocation services for proximity matching, AI for product recommendations and content generation, secure payment processing, and responsive design for access across all devices.",

  // Original responses
  marketplace:
    "Our marketplace connects farmers directly with retailers. You can browse products, view details, and make purchases without intermediaries.",
  products:
    "AgriConnect offers a variety of fresh produce including vegetables, fruits, dairy, and specialty items from local farmers.",
  orders: "You can track your orders in the dashboard. Each order shows status, delivery date, and product details.",
  weather:
    "Our weather page provides real-time agricultural weather data to help with planting and harvesting decisions.",
  account: "You can manage your account from the dashboard, including profile information and preferences.",
  pricing: "Prices on AgriConnect are set directly by farmers, eliminating middlemen and ensuring fair compensation.",
  delivery: "Delivery options vary by location. Most products can be delivered within 24-48 hours of ordering.",
  payment: "We accept various payment methods including credit cards, bank transfers, and mobile payments.",
  contact: "You can contact support through the Help section or by emailing support@agriconnect.com.",
}

// Enhanced function to find the best matching response with improved pattern matching
function findBestResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim()

  // Check for questions about the creator
  if (
    message.includes("who created") ||
    message.includes("who made") ||
    message.includes("who is the creator") ||
    message.includes("who developed") ||
    message.includes("creator") ||
    message.includes("developer") ||
    message.includes("founder") ||
    message.includes("paras")
  ) {
    return PREDEFINED_RESPONSES.creator
  }

  // Check for questions about what AgriConnect is
  if (
    message.includes("what is agriconnect") ||
    message.includes("what's agriconnect") ||
    message.includes("tell me about agriconnect") ||
    message.includes("about agriconnect") ||
    (message.includes("what") && message.includes("agriconnect")) ||
    (message.includes("tell") && message.includes("about") && message.includes("platform"))
  ) {
    return PREDEFINED_RESPONSES.about_agriconnect
  }

  // Check for questions about how AgriConnect works
  if (
    message.includes("how does agriconnect work") ||
    message.includes("how agriconnect works") ||
    message.includes("how does the platform work") ||
    message.includes("how does it work") ||
    (message.includes("how") && message.includes("work")) ||
    (message.includes("explain") && message.includes("process"))
  ) {
    return PREDEFINED_RESPONSES.how_it_works
  }

  // Check for questions about features
  if (
    message.includes("features") ||
    message.includes("what can agriconnect do") ||
    message.includes("capabilities") ||
    message.includes("functionality")
  ) {
    return PREDEFINED_RESPONSES.features
  }

  // Check for questions about mission or purpose
  if (
    message.includes("mission") ||
    message.includes("purpose") ||
    message.includes("goal") ||
    message.includes("vision") ||
    message.includes("aim")
  ) {
    return PREDEFINED_RESPONSES.mission
  }

  // Check for questions about technology
  if (
    message.includes("technology") ||
    message.includes("tech stack") ||
    message.includes("how built") ||
    message.includes("developed with")
  ) {
    return PREDEFINED_RESPONSES.technology
  }

  // Check for questions about benefits for farmers
  if (
    (message.includes("farmer") && message.includes("benefit")) ||
    (message.includes("benefit") && message.includes("farmer")) ||
    (message.includes("how") && message.includes("help") && message.includes("farmer"))
  ) {
    return PREDEFINED_RESPONSES.benefits_farmers
  }

  // Check for questions about benefits for retailers
  if (
    (message.includes("retailer") && message.includes("benefit")) ||
    (message.includes("benefit") && message.includes("retailer")) ||
    (message.includes("how") && message.includes("help") && message.includes("retailer"))
  ) {
    return PREDEFINED_RESPONSES.benefits_retailers
  }

  // Original response matching
  if (message.includes("hello") || message.includes("hi ") || message.includes("hey")) {
    return PREDEFINED_RESPONSES.greeting
  }

  if (message.includes("help") || message.includes("assist")) {
    return PREDEFINED_RESPONSES.help
  }

  if (message.includes("marketplace") || message.includes("market")) {
    return PREDEFINED_RESPONSES.marketplace
  }

  if (message.includes("product") || message.includes("produce") || message.includes("item")) {
    return PREDEFINED_RESPONSES.products
  }

  if (message.includes("order") || message.includes("purchase") || message.includes("buy")) {
    return PREDEFINED_RESPONSES.orders
  }

  if (message.includes("weather") || message.includes("forecast") || message.includes("climate")) {
    return PREDEFINED_RESPONSES.weather
  }

  if (message.includes("account") || message.includes("profile") || message.includes("login")) {
    return PREDEFINED_RESPONSES.account
  }

  if (message.includes("price") || message.includes("cost") || message.includes("expensive")) {
    return PREDEFINED_RESPONSES.pricing
  }

  if (message.includes("deliver") || message.includes("shipping") || message.includes("receive")) {
    return PREDEFINED_RESPONSES.delivery
  }

  if (message.includes("pay") || message.includes("payment") || message.includes("transaction")) {
    return PREDEFINED_RESPONSES.payment
  }

  if (message.includes("contact") || message.includes("support") || message.includes("help")) {
    return PREDEFINED_RESPONSES.contact
  }

  // If no specific match, return default response
  return PREDEFINED_RESPONSES.default
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load messages from localStorage on initial render
  useEffect(() => {
    const storedMessages = localStorage.getItem("agriconnect-chat-messages")
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDateObjects)
      } catch (error) {
        console.error("Failed to parse stored messages:", error)
      }
    } else {
      // Add welcome message if no stored messages
      const welcomeMessage: Message = {
        id: "welcome-msg",
        role: "assistant",
        content:
          "Hello! I'm your AgriConnect assistant. I can tell you about our platform, its features, and how it works. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("agriconnect-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const addMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate a delay for more natural conversation flow
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get predefined response based on user message
      const responseText = findBestResponse(content)

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatContext.Provider value={{ messages, addMessage, isOpen, toggleChat, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
