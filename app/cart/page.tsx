"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"
import { CartItem } from "@/components/cart-item"

export default function CartPage() {
  const { user, loading } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!loading && user?.role !== "retailer") {
      toast({
        title: "Access denied",
        description: "Only retailers can access the cart",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [user, loading, router, toast])

  if (loading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground">Add items to your cart to see them here</p>
          <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
            <Link href="/marketplace">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/marketplace">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(subtotal * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(subtotal + subtotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
