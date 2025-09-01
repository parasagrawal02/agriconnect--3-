"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  CloudLightning,
  Search,
  Plus,
  Minus,
  Layers,
} from "lucide-react"

interface WeatherMapProps {
  initialLocation?: { lat: number; lng: number; name: string }
  height?: string
  showControls?: boolean
}

// Mock weather data for different locations
const mockWeatherData = [
  {
    id: 1,
    location: { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
    current: {
      temp: 18,
      condition: "Partly Cloudy",
      icon: "cloud",
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      feelsLike: 17,
    },
    forecast: [
      { day: "Today", high: 19, low: 14, condition: "Partly Cloudy", icon: "cloud" },
      { day: "Tomorrow", high: 21, low: 15, condition: "Sunny", icon: "sun" },
      { day: "Wednesday", high: 20, low: 14, condition: "Cloudy", icon: "cloud" },
      { day: "Thursday", high: 18, low: 13, condition: "Rain", icon: "cloud-rain" },
      { day: "Friday", high: 17, low: 12, condition: "Rain", icon: "cloud-rain" },
    ],
    alerts: [{ type: "Wind Advisory", description: "Strong winds expected in the afternoon", severity: "moderate" }],
  },
  {
    id: 2,
    location: { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
    current: {
      temp: 25,
      condition: "Sunny",
      icon: "sun",
      humidity: 45,
      windSpeed: 8,
      precipitation: 0,
      feelsLike: 26,
    },
    forecast: [
      { day: "Today", high: 26, low: 18, condition: "Sunny", icon: "sun" },
      { day: "Tomorrow", high: 27, low: 19, condition: "Sunny", icon: "sun" },
      { day: "Wednesday", high: 28, low: 19, condition: "Sunny", icon: "sun" },
      { day: "Thursday", high: 27, low: 18, condition: "Partly Cloudy", icon: "cloud" },
      { day: "Friday", high: 25, low: 17, condition: "Partly Cloudy", icon: "cloud" },
    ],
    alerts: [],
  },
  {
    id: 3,
    location: { lat: 40.7128, lng: -74.006, name: "New York" },
    current: {
      temp: 15,
      condition: "Rain",
      icon: "cloud-rain",
      humidity: 80,
      windSpeed: 15,
      precipitation: 12,
      feelsLike: 13,
    },
    forecast: [
      { day: "Today", high: 16, low: 10, condition: "Rain", icon: "cloud-rain" },
      { day: "Tomorrow", high: 14, low: 9, condition: "Rain", icon: "cloud-rain" },
      { day: "Wednesday", high: 12, low: 8, condition: "Thunderstorm", icon: "cloud-lightning" },
      { day: "Thursday", high: 15, low: 10, condition: "Cloudy", icon: "cloud" },
      { day: "Friday", high: 18, low: 12, condition: "Partly Cloudy", icon: "cloud" },
    ],
    alerts: [
      { type: "Flood Warning", description: "Heavy rainfall may cause flooding in low-lying areas", severity: "high" },
      { type: "Thunderstorm Watch", description: "Possible thunderstorms in the evening", severity: "moderate" },
    ],
  },
  {
    id: 4,
    location: { lat: 41.8781, lng: -87.6298, name: "Chicago" },
    current: {
      temp: 10,
      condition: "Windy",
      icon: "wind",
      humidity: 55,
      windSpeed: 25,
      precipitation: 0,
      feelsLike: 6,
    },
    forecast: [
      { day: "Today", high: 12, low: 5, condition: "Windy", icon: "wind" },
      { day: "Tomorrow", high: 14, low: 7, condition: "Partly Cloudy", icon: "cloud" },
      { day: "Wednesday", high: 16, low: 9, condition: "Sunny", icon: "sun" },
      { day: "Thursday", high: 18, low: 10, condition: "Sunny", icon: "sun" },
      { day: "Friday", high: 15, low: 8, condition: "Partly Cloudy", icon: "cloud" },
    ],
    alerts: [
      {
        type: "Wind Advisory",
        description: "Strong winds may cause difficult driving conditions",
        severity: "moderate",
      },
    ],
  },
  {
    id: 5,
    location: { lat: 29.7604, lng: -95.3698, name: "Houston" },
    current: {
      temp: 30,
      condition: "Hot and Humid",
      icon: "sun",
      humidity: 85,
      windSpeed: 5,
      precipitation: 0,
      feelsLike: 34,
    },
    forecast: [
      { day: "Today", high: 32, low: 24, condition: "Hot and Humid", icon: "sun" },
      { day: "Tomorrow", high: 33, low: 25, condition: "Hot and Humid", icon: "sun" },
      { day: "Wednesday", high: 34, low: 25, condition: "Thunderstorm", icon: "cloud-lightning" },
      { day: "Thursday", high: 30, low: 23, condition: "Thunderstorm", icon: "cloud-lightning" },
      { day: "Friday", high: 29, low: 22, condition: "Partly Cloudy", icon: "cloud" },
    ],
    alerts: [
      { type: "Heat Advisory", description: "Extreme heat may cause heat-related illnesses", severity: "high" },
      { type: "Thunderstorm Watch", description: "Possible severe thunderstorms", severity: "high" },
    ],
  },
]

export function WeatherMap({ initialLocation, height = "500px", showControls = true }: WeatherMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapZoom, setMapZoom] = useState(5)
  const [mapType, setMapType] = useState("standard")
  const [showWeatherLayer, setShowWeatherLayer] = useState(true)
  const [activeTab, setActiveTab] = useState("current")
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Find the initial location or default to the first one
    const location = initialLocation
      ? mockWeatherData.find(
          (data) => data.location.lat === initialLocation.lat && data.location.lng === initialLocation.lng,
        )
      : mockWeatherData[0]

    setSelectedLocation(location)
  }, [initialLocation])

  const handleLocationClick = (locationId: number) => {
    const location = mockWeatherData.find((data) => data.id === locationId)
    if (location) {
      setSelectedLocation(location)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    // Simple mock search - just find a location that includes the search term
    const location = mockWeatherData.find((data) =>
      data.location.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (location) {
      setSelectedLocation(location)
      setSearchQuery("")
    }
  }

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 10))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1))
  }

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "cloud-rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "cloud-snow":
        return <CloudSnow className="h-6 w-6 text-blue-200" />
      case "wind":
        return <Wind className="h-6 w-6 text-gray-400" />
      case "cloud-lightning":
        return <CloudLightning className="h-6 w-6 text-purple-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "moderate":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Map and controls */}
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Weather Map</CardTitle>
              <CardDescription>Interactive weather conditions map</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapRef} className="relative w-full rounded-md overflow-hidden" style={{ height }}>
                {/* Mock map - in a real app, this would be a real map component */}
                <div
                  className="absolute inset-0 bg-blue-50"
                  style={{
                    backgroundImage: "https://www.pixelstalk.net/wp-content/uploads/2016/07/Weather-Desktop-Picture.jpg",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: `brightness(${mapType === "satellite" ? "0.8" : "1"})`,
                    transform: `scale(${mapZoom / 5})`,
                  }}
                >
                  {/* Weather layer */}
                  {showWeatherLayer && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-500/20">
                      {/* Weather markers */}
                      {mockWeatherData.map((data) => (
                        <div
                          key={data.id}
                          className={`absolute p-2 rounded-full cursor-pointer transition-all transform hover:scale-110 ${
                            selectedLocation?.id === data.id ? "ring-2 ring-green-600 ring-offset-2" : ""
                          }`}
                          style={{
                            left: `${((data.location.lng + 180) / 360) * 100}%`,
                            top: `${((90 - data.location.lat) / 180) * 100}%`,
                            backgroundColor: selectedLocation?.id === data.id ? "white" : "rgba(255,255,255,0.8)",
                          }}
                          onClick={() => handleLocationClick(data.id)}
                        >
                          {getWeatherIcon(data.current.icon)}
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-white px-1 rounded">
                            {data.current.temp}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Map controls */}
                {showControls && (
                  <>
                    <div className="absolute top-2 left-2 z-10 bg-white rounded-md shadow-md p-2">
                      <form onSubmit={handleSearch} className="flex">
                        <input
                          type="text"
                          placeholder="Search location..."
                          className="text-sm border rounded-l-md px-2 py-1 w-40"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="bg-green-600 text-white rounded-r-md px-2">
                          <Search className="h-4 w-4" />
                        </button>
                      </form>
                    </div>

                    <div className="absolute top-2 right-2 z-10 bg-white rounded-md shadow-md">
                      <div className="p-1">
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-1 border-t">
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 z-10 bg-white rounded-md shadow-md p-2">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4" />
                        <select
                          className="text-sm border rounded px-1"
                          value={mapType}
                          onChange={(e) => setMapType(e.target.value)}
                        >
                          <option value="standard">Standard</option>
                          <option value="satellite">Satellite</option>
                          <option value="terrain">Terrain</option>
                        </select>
                      </div>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="weather-layer"
                          checked={showWeatherLayer}
                          onChange={() => setShowWeatherLayer(!showWeatherLayer)}
                          className="mr-2"
                        />
                        <label htmlFor="weather-layer" className="text-xs">
                          Weather Layer
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
                <span>Zoom: {mapZoom}</span>
                <span>Map Type: {mapType.charAt(0).toUpperCase() + mapType.slice(1)}</span>
                <span>Weather Layer: {showWeatherLayer ? "On" : "Off"}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Weather details */}
        {selectedLocation && (
          <div className="w-full md:w-80">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{selectedLocation.location.name}</CardTitle>
                <CardDescription>
                  {selectedLocation.location.lat.toFixed(2)}°N, {selectedLocation.location.lng.toFixed(2)}°W
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
                    <TabsTrigger value="alerts">
                      Alerts
                      {selectedLocation.alerts.length > 0 && (
                        <Badge className="ml-1 bg-red-500">{selectedLocation.alerts.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getWeatherIcon(selectedLocation.current.icon)}
                        <span className="text-3xl font-bold ml-2">{selectedLocation.current.temp}°C</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{selectedLocation.current.condition}</div>
                        <div className="text-sm text-muted-foreground">
                          Feels like {selectedLocation.current.feelsLike}°C
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">Humidity</div>
                          <div className="text-sm">{selectedLocation.current.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Wind</div>
                          <div className="text-sm">{selectedLocation.current.windSpeed} km/h</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CloudRain className="h-4 w-4 mr-2 text-blue-400" />
                        <div>
                          <div className="text-sm font-medium">Precipitation</div>
                          <div className="text-sm">{selectedLocation.current.precipitation} mm</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                        <div>
                          <div className="text-sm font-medium">Pressure</div>
                          <div className="text-sm">1015 hPa</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="forecast" className="p-4">
                    <div className="space-y-3">
                      {selectedLocation.forecast.map((day: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="w-20 font-medium">{day.day}</div>
                          <div className="flex items-center w-10">{getWeatherIcon(day.icon)}</div>
                          <div className="text-right">
                            <span className="font-medium">{day.high}°</span>
                            <span className="text-muted-foreground ml-2">{day.low}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="alerts" className="p-4">
                    {selectedLocation.alerts.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No weather alerts for this location</div>
                    ) : (
                      <div className="space-y-3">
                        {selectedLocation.alerts.map((alert: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{alert.type}</div>
                              <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Forecast
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* Weather impact on agriculture */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact on Agriculture</CardTitle>
          <CardDescription>How current conditions affect farming in this region</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedLocation && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">Crop Conditions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Soil Moisture</span>
                      <div className="w-24">
                        <Slider
                          value={[selectedLocation.current.humidity]}
                          max={100}
                          disabled
                          className="cursor-default"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth Rate</span>
                      <div className="w-24">
                        <Slider
                          value={[
                            selectedLocation.current.temp > 25 ? 80 : selectedLocation.current.temp > 15 ? 60 : 40,
                          ]}
                          max={100}
                          disabled
                          className="cursor-default"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pest Risk</span>
                      <div className="w-24">
                        <Slider
                          value={[selectedLocation.current.humidity > 70 ? 75 : 30]}
                          max={100}
                          disabled
                          className="cursor-default"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">Recommended Activities</h3>
                  <ul className="space-y-1 text-sm">
                    {selectedLocation.current.condition === "Rain" && (
                      <>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                          Delay outdoor planting
                        </li>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                          Check drainage systems
                        </li>
                      </>
                    )}
                    {selectedLocation.current.condition === "Sunny" && (
                      <>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                          Ideal for harvesting
                        </li>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                          Good time for planting
                        </li>
                      </>
                    )}
                    {selectedLocation.current.condition === "Windy" && (
                      <>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></span>
                          Secure young plants
                        </li>
                        <li className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                          Avoid spraying pesticides
                        </li>
                      </>
                    )}
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Monitor soil moisture
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                      Check weather forecast regularly
                    </li>
                  </ul>
                </div>

                <div className="border rounded-md p-3">
                  <h3 className="font-medium mb-2">Crop Suitability</h3>
                  <div className="space-y-2">
                    {selectedLocation.current.temp > 25 ? (
                      <>
                        <Badge className="bg-green-600 mr-1">Tomatoes</Badge>
                        <Badge className="bg-green-600 mr-1">Peppers</Badge>
                        <Badge className="bg-green-600 mr-1">Corn</Badge>
                        <Badge className="bg-yellow-600 mr-1">Lettuce</Badge>
                        <Badge className="bg-red-600">Spinach</Badge>
                      </>
                    ) : selectedLocation.current.temp > 15 ? (
                      <>
                        <Badge className="bg-green-600 mr-1">Lettuce</Badge>
                        <Badge className="bg-green-600 mr-1">Peas</Badge>
                        <Badge className="bg-green-600 mr-1">Carrots</Badge>
                        <Badge className="bg-yellow-600 mr-1">Tomatoes</Badge>
                        <Badge className="bg-yellow-600">Peppers</Badge>
                      </>
                    ) : (
                      <>
                        <Badge className="bg-green-600 mr-1">Kale</Badge>
                        <Badge className="bg-green-600 mr-1">Spinach</Badge>
                        <Badge className="bg-green-600 mr-1">Cabbage</Badge>
                        <Badge className="bg-red-600 mr-1">Tomatoes</Badge>
                        <Badge className="bg-red-600">Peppers</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Note:</strong> These recommendations are based on current weather conditions and forecasts.
                  Always consult with local agricultural experts for specific advice for your crops and region.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
