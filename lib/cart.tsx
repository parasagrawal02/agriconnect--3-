"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

export type CartItem = {
  id: string
  name: string
  price: number
  unit: string
  quantity: number
  farmerId: string
  farmerName: string
  image: string
  maxAvailable: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  // Calculate derived values
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`agriconnect-cart-${user.id}`)
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart data:", error)
        }
      }
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`agriconnect-cart-${user.id}`, JSON.stringify(items))
    }
  }, [items, user])

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      })
      return
    }

    if (user.role !== "retailer") {
      toast({
        title: "Action not allowed",
        description: "Only retailers can add items to cart",
        variant: "destructive",
      })
      return
    }

    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + (newItem.quantity || 1)

        // Check if new quantity exceeds available stock
        if (newQuantity > existingItem.maxAvailable) {
          toast({
            title: "Maximum quantity reached",
            description: `Only ${existingItem.maxAvailable} units available`,
            variant: "destructive",
          })
          return currentItems
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        }

        toast({
          title: "Cart updated",
          description: `${existingItem.name} quantity updated to ${newQuantity}`,
        })

        return updatedItems
      } else {
        // Add new item
        const itemToAdd = {
          ...newItem,
          quantity: newItem.quantity || 1,
        } as CartItem

        toast({
          title: "Item added to cart",
          description: `${itemToAdd.name} added to your cart`,
        })

        return [...currentItems, itemToAdd]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item.id === id)

      if (itemIndex === -1) return currentItems

      const item = currentItems[itemIndex]

      // Validate quantity
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== id)
      }

      if (quantity > item.maxAvailable) {
        toast({
          title: "Maximum quantity reached",
          description: `Only ${item.maxAvailable} units available`,
          variant: "destructive",
        })
        quantity = item.maxAvailable
      }

      const updatedItems = [...currentItems]
      updatedItems[itemIndex] = {
        ...item,
        quantity,
      }

      return updatedItems
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id)

      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from your cart`,
        })
      }

      return currentItems.filter((item) => item.id !== id)
    })
  }

  const clearCart = () => {
    setItems([])
    if (user) {
      localStorage.removeItem(`agriconnect-cart-${user.id}`)
    }
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
