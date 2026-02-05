"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"
import { Star, MapPin, ShoppingCart, ArrowLeft, Truck, Calendar, BarChart } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    name: "Organic Tomatoes",
    price: 2.99,
    unit: "kg",
    quantity: 50,
    location: "Green Valley Farm",
    distance: 15,
    farmer: "Paras Agrawal",
    farmerId: "farmer-1",
    rating: 4.5,
    category: "vegetables",
    organic: true,
    description:
      "Freshly grown organic tomatoes, perfect for salads and cooking. These tomatoes are grown without pesticides and are harvested at peak ripeness for maximum flavor.",
    harvestDate: "2023-05-01",
    availableUntil: "2023-05-15",
    nutritionalInfo: {
      calories: 18,
      protein: "0.9g",
      carbs: "3.9g",
      fat: "0.2g",
      fiber: "1.2g",
      vitamins: ["Vitamin C", "Vitamin K", "Potassium", "Folate"],
    },
    growingConditions:
      "Grown in nutrient-rich soil with natural fertilizers. Watered with filtered rainwater and protected from pests using natural predators.",
    certifications: ["USDA Organic", "Non-GMO Project Verified"],
    image: "https://3.bp.blogspot.com/-60C2IZuUtkA/Tmn_yCEmpII/AAAAAAAAABs/a2ECZR-cVQA/s1600/tomato.jpg",
    hasVideo: true,
    videoPrompt:
      "Show a timelapse of organic tomatoes growing from seedling to harvest, with close-ups of the ripe tomatoes being picked and packed for market.",
  },
  {
    id: "2",
    name: "Fresh Lettuce",
    price: 1.49,
    unit: "head",
    quantity: 30,
    location: "Riverside Gardens",
    distance: 8,
    farmer: "Mayank Gaur",
    farmerId: "farmer-2",
    rating: 4.2,
    category: "vegetables",
    organic: true,
    description:
      "Crisp and fresh lettuce, perfect for salads and sandwiches. Our lettuce is grown using sustainable farming practices and harvested daily for maximum freshness.",
    harvestDate: "2023-05-03",
    availableUntil: "2023-05-10",
    nutritionalInfo: {
      calories: 5,
      protein: "0.5g",
      carbs: "1.0g",
      fat: "0.1g",
      fiber: "0.5g",
      vitamins: ["Vitamin A", "Vitamin K", "Folate", "Iron"],
    },
    growingConditions:
      "Grown in controlled greenhouse environment with optimal temperature and humidity. Watered with purified water and nourished with organic compost.",
    certifications: ["USDA Organic", "Certified Naturally Grown"],
    image: "https://tse2.mm.bing.net/th?id=OIP.8zVsgRdYKboPiNuYs_wolQHaHI&pid=Api&P=0&h=180",
    hasVideo: true,
    videoPrompt:
      "Show a farmer harvesting fresh lettuce in the early morning, demonstrating the careful handling and packaging process to maintain freshness.",
  },
  {
    id: "3",
    name: "Free-Range Eggs",
    price: 3.99,
    unit: "dozen",
    quantity: 20,
    location: "Sunny Meadows",
    distance: 12,
    farmer: "Anjali Singh",
    farmerId: "farmer-3",
    rating: 4.8,
    category: "dairy",
    organic: false,
    description:
      "Farm-fresh eggs from free-range chickens. Our hens roam freely on pasture, eating a natural diet supplemented with organic feed, resulting in eggs with rich, golden yolks.",
    harvestDate: "2023-05-04",
    availableUntil: "2023-05-18",
    nutritionalInfo: {
      calories: 70,
      protein: "6g",
      carbs: "0.6g",
      fat: "5g",
      vitamins: ["Vitamin B12", "Vitamin D", "Choline", "Selenium"],
    },
    growingConditions:
      "Our chickens have access to over 4 acres of pasture where they can forage for insects and plants. They are housed in mobile coops that are moved regularly to fresh grass.",
    certifications: ["Certified Humane", "Animal Welfare Approved"],
    image: "https://tse1.mm.bing.net/th?id=OIP.Z5AjPklue_m2vVzcsddmBgHaGI&pid=Api&P=0&h=180",
    hasVideo: false,
  },
  {
    id: "4",
    name: "Organic Apples",
    price: 2.49,
    unit: "kg",
    quantity: 40,
    location: "Orchard Hills",
    distance: 20,
    farmer: "Tanisha Patel",
    farmerId: "farmer-4",
    rating: 4.0,
    category: "fruits",
    organic: true,
    description:
      "Sweet and crisp organic apples, perfect for snacking or baking. Our apples are grown using traditional methods without synthetic pesticides or fertilizers.",
    harvestDate: "2023-04-15",
    availableUntil: "2023-05-30",
    nutritionalInfo: {
      calories: 52,
      protein: "0.3g",
      carbs: "14g",
      fat: "0.2g",
      fiber: "2.4g",
      vitamins: ["Vitamin C", "Potassium", "Vitamin K"],
    },
    growingConditions:
      "Our apple orchard uses integrated pest management and natural predators to control pests. Trees are pruned by hand and fruit is picked at optimal ripeness.",
    certifications: ["USDA Organic", "Rainforest Alliance Certified"],
    image: "https://tse3.mm.bing.net/th?id=OIP.kori7Y8NQzmHi4RLlD-T9AHaE5&pid=Api&P=0&h=180",
    hasVideo: true,
    videoPrompt:
      "Show an aerial view of an apple orchard through the seasons, from spring blossoms to fall harvest, with close-ups of workers carefully picking and sorting the apples.",
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user, loading: authLoading } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundProduct = mockProducts.find((p) => p.id === id)
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          toast({
            title: "Product not found",
            description: "The requested product could not be found",
            variant: "destructive",
          })
          router.push("/marketplace")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, router, toast])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity,
      farmerId: product.farmerId,
      farmerName: product.farmer,
      image: product.image,
      maxAvailable: product.quantity,
    })
  }

  if (loading || authLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/marketplace")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.organic && <Badge className="absolute top-4 right-4 bg-green-600">Organic</Badge>}
          </div>

          {product.hasVideo && (
            <Card>
              <CardHeader>
                <CardTitle>Product Video</CardTitle>
                <CardDescription>Watch our AI-generated video about this product</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoPlayer productId={product.id} prompt={product.videoPrompt} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {product.location} ({product.distance}km)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-muted-foreground">per {product.unit}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Farmer: {product.farmer}</p>
            <p className="text-sm text-muted-foreground">
              Available: {product.quantity} {product.unit}s
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Category:</p>
              <Badge variant="outline" className="capitalize">
                {product.category}
              </Badge>
            </div>
          </div>

          {user?.role === "retailer" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity ({product.unit}s)
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.min(product.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)))
                      }
                      className="h-8 w-16 border-y text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-xl font-bold">${(product.price * quantity).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => router.push("/checkout")}>
                  Buy Now
                </Button>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="growing">Growing Info</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 mt-4">
              <p>{product.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Harvest Date</p>
                  <p className="text-sm text-muted-foreground">{product.harvestDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Available Until</p>
                  <p className="text-sm text-muted-foreground">{product.availableUntil}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert: string) => (
                    <Badge key={cert} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Calories</p>
                  <p className="text-sm text-muted-foreground">{product.nutritionalInfo.calories} per 100g</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Protein</p>
                  <p className="text-sm text-muted-foreground">{product.nutritionalInfo.protein}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Carbohydrates</p>
                  <p className="text-sm text-muted-foreground">{product.nutritionalInfo.carbs}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fat</p>
                  <p className="text-sm text-muted-foreground">{product.nutritionalInfo.fat}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Vitamins & Minerals</p>
                <div className="flex flex-wrap gap-2">
                  {product.nutritionalInfo.vitamins.map((vitamin: string) => (
                    <Badge key={vitamin} variant="outline">
                      {vitamin}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="growing" className="space-y-4 mt-4">
              <p>{product.growingConditions}</p>
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Harvest Season
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Spring - Summer</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Truck className="h-4 w-4 mr-2" /> Transport
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Same day delivery</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <BarChart className="h-4 w-4 mr-2" /> Carbon Footprint
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">Low impact</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
