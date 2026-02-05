"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { useNotifications } from "@/lib/notifications"
import { useToast } from "@/components/ui/use-toast"
import { BarChart3, ShoppingCart, Package, Plus, Search, MapPin, CloudSun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    name: "Organic Tomatoes",
    price: 2.99,
    unit: "kg",
    quantity: 50,
    location: "Green Valley Farm",
    distance: "15km",
    farmer: "Paras Agrawal",
    farmerId: "farmer-1",
    image: "https://3.bp.blogspot.com/-60C2IZuUtkA/Tmn_yCEmpII/AAAAAAAAABs/a2ECZR-cVQA/s1600/tomato.jpg",
  },
  {
    id: "2",
    name: "Fresh Lettuce",
    price: 1.49,
    unit: "head",
    quantity: 30,
    location: "Riverside Gardens",
    distance: "8km",
    farmer: "joy Agrawal",
    farmerId: "farmer-2",
    image: "https://tse2.mm.bing.net/th?id=OIP.8zVsgRdYKboPiNuYs_wolQHaHI&pid=Api&P=0&h=180",
  },
  {
    id: "3",
    name: "Free-Range Eggs",
    price: 3.99,
    unit: "dozen",
    quantity: 20,
    location: "Sunny Meadows",
    distance: "12km",
    farmer: "Mayank Gaur",
    farmerId: "farmer-3",
    image: "https://tse1.mm.bing.net/th?id=OIP.Z5AjPklue_m2vVzcsddmBgHaGI&pid=Api&P=0&h=180",
  },
  {
    id: "4",
    name: "Organic Apples",
    price: 2.49,
    unit: "kg",
    quantity: 40,
    location: "Orchard Hills",
    distance: "20km",
    farmer: "Pushpendra Singh",
    farmerId: "farmer-4",
    image: "https://tse3.mm.bing.net/th?id=OIP.kori7Y8NQzmHi4RLlD-T9AHaE5&pid=Api&P=0&h=180",
  },
]

const mockOrders = [
  {
    id: "ord-001",
    date: "2023-05-01",
    status: "Delivered",
    total: 45.97,
    items: 3,
  },
  {
    id: "ord-002",
    date: "2023-05-10",
    status: "Processing",
    total: 32.5,
    items: 2,
  },
  {
    id: "ord-003",
    date: "2023-05-15",
    status: "Pending",
    total: 78.25,
    items: 5,
  },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { items, addItem } = useCart()
  const { notifications, unreadCount } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, loading, router, toast])

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.location.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else {
      setFilteredProducts(mockProducts)
    }
  }, [searchTerm])

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmer,
      image: product.image,
      maxAvailable: product.quantity,
    })
  }

  if (loading || !user) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === "farmer" ? "Total Sales" : "Total Purchases"}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,248.56</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === "farmer" ? "Active Listings" : "Active Orders"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === "farmer" ? "Pending Orders" : "Items in Cart"}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.role === "retailer" ? items.length : 3}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === "retailer" ? (
                <Link href="/cart" className="text-green-600 hover:underline">
                  View cart
                </Link>
              ) : (
                "Requires attention"
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Conditions</CardTitle>
            <CloudSun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18°C</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/weather" className="text-green-600 hover:underline">
                View forecast
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 && <Badge className="ml-2 bg-green-600">{unreadCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{user.role === "farmer" ? "Your Listings" : "Available Products"}</h2>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {user.role === "farmer" && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {product.location} ({product.distance})
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">
                      ${product.price.toFixed(2)}/{product.unit}
                    </p>
                    <Badge variant="outline">{product.quantity} available</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">By {product.farmer}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  {user.role === "retailer" ? (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1" variant="outline">
                        Edit Listing
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Button variant="outline">View All Orders</Button>
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "outline"
                          : order.status === "Processing"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <p>{order.items} items</p>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/orders/${order.id}`}>View Order Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <Button variant="outline" asChild>
              <Link href="/notifications">View All Notifications</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <Card key={notification.id} className={notification.isRead ? "" : "border-green-500"}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>}
                      {notification.title}
                    </CardTitle>
                    <Badge variant="outline">{notification.type}</Badge>
                  </div>
                  <CardDescription>{notification.date}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p>{notification.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/notifications/${notification.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
