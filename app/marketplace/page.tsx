"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { useToast } from "@/components/ui/use-toast"
import { Search, ShoppingCart, Filter, MapPin, ChevronDown, ChevronUp, Star } from "lucide-react"

// Mock data for demonstration
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
    image: "https://3.bp.blogspot.com/-60C2IZuUtkA/Tmn_yCEmpII/AAAAAAAAABs/a2ECZR-cVQA/s1600/tomato.jpg",
  },
  {
    id: "2",
    name: "Fresh Lettuce",
    price: 1.49,
    unit: "head",
    quantity: 30,
    location: "Riverside Gardens",
    distance: 8,
    farmer: "joy Agrawal",
    farmerId: "farmer-2",
    rating: 4.2,
    category: "vegetables",
    organic: true,
    image: "https://tse2.mm.bing.net/th?id=OIP.8zVsgRdYKboPiNuYs_wolQHaHI&pid=Api&P=0&h=180",
  },
  {
    id: "3",
    name: "Free-Range Eggs",
    price: 3.99,
    unit: "dozen",
    quantity: 20,
    location: "Sunny Meadows",
    distance: 12,
    farmer: "Mayank Gaur",
    farmerId: "farmer-3",
    rating: 4.8,
    category: "dairy",
    organic: false,
    image: "https://tse1.mm.bing.net/th?id=OIP.Z5AjPklue_m2vVzcsddmBgHaGI&pid=Api&P=0&h=180",
  },
  {
    id: "4",
    name: "Organic Apples",
    price: 2.49,
    unit: "kg",
    quantity: 40,
    location: "Orchard Hills",
    distance: 20,
    farmer: "Pushpendra Singh",
    farmerId: "farmer-4",
    rating: 4.0,
    category: "fruits",
    organic: true,
    image: "https://tse3.mm.bing.net/th?id=OIP.kori7Y8NQzmHi4RLlD-T9AHaE5&pid=Api&P=0&h=180",
  },
  {
    id: "5",
    name: "Fresh Milk",
    price: 1.99,
    unit: "liter",
    quantity: 25,
    location: "Green Pastures",
    distance: 18,
    farmer: "Anjali Singh",
    farmerId: "farmer-5",
    rating: 4.6,
    category: "dairy",
    organic: false,
    image: "https://tse4.mm.bing.net/th?id=OIP.IhcoBlkGfQbMdlQprPRc_AHaHe&pid=Api&P=0&h=180",
  },
  {
    id: "6",
    name: "Honey",
    price: 8.99,
    unit: "jar",
    quantity: 15,
    location: "Bee Haven",
    distance: 25,
    farmer: "Harsh sharma",
    farmerId: "farmer-6",
    rating: 4.9,
    category: "other",
    organic: true,
    image: "https://tse3.mm.bing.net/th?id=OIP.qCu5szdI12RCnUAGPcOKoAHaHa&pid=Api&P=0&h=180",
  },
  {
    id: "7",
    name: "Carrots",
    price: 1.29,
    unit: "kg",
    quantity: 60,
    location: "Root Farm",
    distance: 10,
    farmer: "Rajdeep Singh",
    farmerId: "farmer-7",
    rating: 4.3,
    category: "vegetables",
    organic: false,
    image: "https://www.theayurveda.org/wp-content/uploads/2015/09/Carrot-fruits.jpg",
  },
  {
    id: "8",
    name: "Strawberries",
    price: 3.49,
    unit: "basket",
    quantity: 35,
    location: "Berry Fields",
    distance: 22,
    farmer: "Yash Agrawal",
    farmerId: "farmer-8",
    rating: 4.7,
    category: "fruits",
    organic: true,
    image: "https://tse4.mm.bing.net/th?id=OIP.yZ3uDXziiEKvmgbtxc6wdQHaE7&pid=Api&P=0&h=180",
  },
]

const categories = [
  { id: "vegetables", name: "Vegetables" },
  { id: "fruits", name: "Fruits" },
  { id: "dairy", name: "Dairy & Eggs" },
  { id: "meat", name: "Meat" },
  { id: "other", name: "Other Products" },
]

export default function MarketplacePage() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState(100)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [organicOnly, setOrganicOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [sortBy, setSortBy] = useState("distance")

  useEffect(() => {
    let filtered = mockProducts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply distance filter
    filtered = filtered.filter((product) => product.distance <= maxDistance)

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply organic filter
    if (organicOnly) {
      filtered = filtered.filter((product) => product.organic)
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else {
      // Default: sort by distance
      filtered.sort((a, b) => a.distance - b.distance)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, maxDistance, selectedCategories, organicOnly, sortBy])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
            <div>
              <h3 className="font-medium mb-2">Distance (km)</h3>
              <div className="space-y-2">
                <Slider
                  value={[maxDistance]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMaxDistance(value[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 km</span>
                  <span>{maxDistance} km</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic-only"
                  checked={organicOnly}
                  onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
                />
                <Label htmlFor="organic-only">Organic products only</Label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Sort by</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-distance"
                    name="sort"
                    value="distance"
                    checked={sortBy === "distance"}
                    onChange={() => setSortBy("distance")}
                  />
                  <Label htmlFor="sort-distance">Distance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-price-low"
                    name="sort"
                    value="price-low"
                    checked={sortBy === "price-low"}
                    onChange={() => setSortBy("price-low")}
                  />
                  <Label htmlFor="sort-price-low">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-price-high"
                    name="sort"
                    value="price-high"
                    checked={sortBy === "price-high"}
                    onChange={() => setSortBy("price-high")}
                  />
                  <Label htmlFor="sort-price-high">Price: High to Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-rating"
                    name="sort"
                    value="rating"
                    checked={sortBy === "rating"}
                    onChange={() => setSortBy("rating")}
                  />
                  <Label htmlFor="sort-rating">Rating</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{filteredProducts.length} Products Available</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No products match your filters. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {product.location} ({product.distance}km)
                        </CardDescription>
                      </div>
                      {product.organic && <Badge className="bg-green-600">Organic</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg">
                        ${product.price.toFixed(2)}/{product.unit}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">By {product.farmer}</p>
                      <Badge variant="outline">{product.quantity} available</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleAddToCart(product)}
                      disabled={user?.role !== "retailer"}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
