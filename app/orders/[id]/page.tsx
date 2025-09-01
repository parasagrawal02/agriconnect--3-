"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Truck, Calendar, Clock, MapPin, Phone, MessageSquare } from "lucide-react"

// Update the mockOrders array to use our new images
const mockOrders = [
  {
    id: "ord-001",
    date: "2023-05-01",
    status: "Delivered",
    total: 45.97,
    items: [
      {
        id: "1",
        name: "Organic Tomatoes",
        price: 2.99,
        quantity: 5,
        unit: "kg",
        image: "https://3.bp.blogspot.com/-60C2IZuUtkA/Tmn_yCEmpII/AAAAAAAAABs/a2ECZR-cVQA/s1600/tomato.jpg",
        farmer: "John Smith",
      },
      {
        id: "3",
        name: "Free-Range Eggs",
        price: 3.99,
        quantity: 2,
        unit: "dozen",
        image: "https://tse1.mm.bing.net/th?id=OIP.Z5AjPklue_m2vVzcsddmBgHaGI&pid=Api&P=0&h=180",
        farmer: "David Johnson",
      },
      {
        id: "4",
        name: "Organic Apples",
        price: 2.49,
        quantity: 10,
        unit: "kg",
        image: "https://tse3.mm.bing.net/th?id=OIP.kori7Y8NQzmHi4RLlD-T9AHaE5&pid=Api&P=0&h=180",
        farmer: "Sarah Williams",
      },
    ],
    shipping: {
      address: "123 Main St, Farmville, CA 94107",
      method: "Standard Delivery",
      cost: 0,
      estimatedDelivery: "May 3, 2023",
      actualDelivery: "May 3, 2023",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
      subtotal: 45.97,
      tax: 3.68,
      total: 49.65,
    },
    timeline: [
      { status: "Order Placed", date: "May 1, 2023 - 10:30 AM" },
      { status: "Payment Confirmed", date: "May 1, 2023 - 10:35 AM" },
      { status: "Processing", date: "May 1, 2023 - 2:15 PM" },
      { status: "Shipped", date: "May 2, 2023 - 9:00 AM" },
      { status: "Out for Delivery", date: "May 3, 2023 - 8:30 AM" },
      { status: "Delivered", date: "May 3, 2023 - 2:45 PM" },
    ],
  },
  {
    id: "ord-002",
    date: "2023-05-10",
    status: "Processing",
    total: 32.5,
    items: [
      {
        id: "2",
        name: "Fresh Lettuce",
        price: 1.49,
        quantity: 3,
        unit: "head",
        image: "https://tse2.mm.bing.net/th?id=OIP.8zVsgRdYKboPiNuYs_wolQHaHI&pid=Api&P=0&h=180",
        farmer: "Maria Garcia",
      },
      {
        id: "6",
        name: "Honey",
        price: 8.99,
        quantity: 2,
        unit: "jar",
        image: "/images/honey.png",
        farmer: "Emma Wilson",
      },
      {
        id: "7",
        name: "Carrots",
        price: 1.29,
        quantity: 5,
        unit: "kg",
        image: "/images/carrots.png",
        farmer: "Robert Taylor",
      },
    ],
    shipping: {
      address: "456 Oak Ave, Riverside, CA 92501",
      method: "Express Delivery",
      cost: 5.99,
      estimatedDelivery: "May 12, 2023",
    },
    payment: {
      method: "Bank Transfer",
      subtotal: 32.5,
      tax: 2.6,
      shipping: 5.99,
      total: 41.09,
    },
    timeline: [
      { status: "Order Placed", date: "May 10, 2023 - 3:45 PM" },
      { status: "Payment Confirmed", date: "May 10, 2023 - 3:50 PM" },
      { status: "Processing", date: "May 11, 2023 - 9:30 AM" },
    ],
  },
  {
    id: "ord-003",
    date: "2023-05-15",
    status: "Pending",
    total: 78.25,
    items: [
      {
        id: "4",
        name: "Organic Apples",
        price: 2.49,
        quantity: 8,
        unit: "kg",
        image: "/images/apples.png",
        farmer: "Sarah Williams",
      },
      {
        id: "5",
        name: "Fresh Milk",
        price: 1.99,
        quantity: 4,
        unit: "liter",
        image: "/images/milk.png",
        farmer: "Michael Brown",
      },
      {
        id: "8",
        name: "Strawberries",
        price: 3.49,
        quantity: 5,
        unit: "basket",
        image: "/images/strawberries.png",
        farmer: "Jennifer Lee",
      },
      {
        id: "3",
        name: "Free-Range Eggs",
        price: 3.99,
        quantity: 3,
        unit: "dozen",
        image: "/images/eggs.png",
        farmer: "David Johnson",
      },
      {
        id: "1",
        name: "Organic Tomatoes",
        price: 2.99,
        quantity: 10,
        unit: "kg",
        image: "/images/tomatoes.png",
        farmer: "John Smith",
      },
    ],
    shipping: {
      address: "789 Pine St, Meadowville, CA 95814",
      method: "Standard Delivery",
      cost: 0,
      estimatedDelivery: "May 17, 2023",
    },
    payment: {
      method: "Cash on Delivery",
      subtotal: 78.25,
      tax: 6.26,
      total: 84.51,
    },
    timeline: [
      { status: "Order Placed", date: "May 15, 2023 - 11:20 AM" },
      { status: "Pending Confirmation", date: "May 15, 2023 - 11:25 AM" },
    ],
  },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchOrder = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundOrder = mockOrders.find((o) => o.id === id)
        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          toast({
            title: "Order not found",
            description: "The requested order could not be found",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view order details",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchOrder()
  }, [id, router, toast, user, authLoading])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "Processing":
        return "bg-blue-500"
      case "Shipped":
        return "bg-purple-500"
      case "Out for Delivery":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>
        <Badge
          className={`text-white ${order.status === "Delivered" ? "bg-green-600" : order.status === "Processing" ? "bg-blue-600" : "bg-yellow-600"}`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">From: {item.farmer}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm">
                          {item.quantity} × ${item.price.toFixed(2)}/{item.unit}
                        </p>
                        <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track your order status</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                {order.timeline.map((event: any, index: number) => (
                  <li key={index} className="mb-6 ml-6 last:mb-0">
                    <span
                      className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${getStatusColor(event.status)} text-white`}
                    >
                      {index + 1}
                    </span>
                    <h3 className="font-medium">{event.status}</h3>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.payment.subtotal.toFixed(2)}</span>
                </div>
                {order.payment.shipping && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.payment.shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.payment.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Shipping Method</p>
                    <p className="text-sm text-muted-foreground">{order.shipping.method}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">{order.shipping.estimatedDelivery}</p>
                  </div>
                </div>
                {order.shipping.actualDelivery && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Actual Delivery</p>
                      <p className="text-sm text-muted-foreground">{order.shipping.actualDelivery}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  {order.payment.method}
                  {order.payment.cardLast4 && ` (**** **** **** ${order.payment.cardLast4})`}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Contact Support
              </Button>
            </CardFooter>
          </Card>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            <MessageSquare className="mr-2 h-4 w-4" /> Message Seller
          </Button>
        </div>
      </div>
    </div>
  )
}
