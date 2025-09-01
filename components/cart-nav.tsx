"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import { CartItem } from "@/components/cart-item"

export function CartNav() {
  const { user } = useAuth()
  const { items, subtotal, itemCount, clearCart } = useCart()
  const [open, setOpen] = useState(false)

  // Only retailers can see the cart
  if (!user || user.role !== "retailer") {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/marketplace">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => clearCart()}>
                    Clear Cart
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
