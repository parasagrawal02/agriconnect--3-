"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CartItem as CartItemType, useCart } from "@/lib/cart"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeItem(item.id)
    }
  }

  return (
    <div className="flex items-start gap-4 py-2">
      <div className="h-16 w-16 overflow-hidden rounded-md border">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64"}
          alt={item.name}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)} / {item.unit}
        </p>
        <p className="text-xs text-muted-foreground">From: {item.farmerName}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-8 text-center">{item.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleIncrement}
            disabled={item.quantity >= item.maxAvailable}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
