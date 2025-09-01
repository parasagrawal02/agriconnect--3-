"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherMap } from "@/components/weather-map"
import { useAuth } from "@/lib/auth"
import { CloudRain, Droplets, Thermometer, Wind, Calendar, Clock, MapPin, Info } from "lucide-react"

export default function WeatherPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("map")
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
    name: "San Francisco",
  })

  // Mock data for weather insights
  const weatherInsights = [
    {
      title: "Rainfall Patterns",
      description:
        "Rainfall has been 15% above average for this time of year, which is beneficial for most crops but may increase disease pressure.",
      icon: <CloudRain className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Soil Moisture",
      description:
        "Current soil moisture levels are optimal for most crops. No irrigation is needed for the next 3-5 days based on forecasts.",
      icon: <Droplets className="h-8 w-8 text-blue-400" />,
    },
    {
      title: "Temperature Trends",
      description:
        "Temperatures are trending 2°C above seasonal averages, which may accelerate crop development and harvest timelines.",
      icon: <Thermometer className="h-8 w-8 text-red-500" />,
    },
    {
      title: "Wind Conditions",
      description:
        "Wind speeds are expected to remain below 15 km/h, providing good conditions for spraying and field operations.",
      icon: <Wind className="h-8 w-8 text-gray-500" />,
    },
  ]

  // Mock data for upcoming weather events
  const upcomingEvents = [
    {
      date: "May 15-17",
      event: "Heavy Rainfall",
      impact: "May delay planting and field operations",
      severity: "moderate",
    },
    {
      date: "May 20-22",
      event: "Temperature Drop",
      impact: "Potential frost risk for sensitive crops",
      severity: "high",
    },
    {
      date: "June 1-5",
      event: "Heat Wave",
      impact: "Increased irrigation needs, potential heat stress",
      severity: "high",
    },
    {
      date: "June 10-12",
      event: "Strong Winds",
      impact: "Possible damage to tall crops and structures",
      severity: "moderate",
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Weather Conditions</h1>
      <p className="text-muted-foreground mb-6">
        Real-time weather data and forecasts to help plan your farming activities
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="insights">Weather Insights</TabsTrigger>
          <TabsTrigger value="planning">Planning Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <WeatherMap initialLocation={selectedLocation} height="600px" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" /> Planting Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View optimal planting times based on current and forecasted weather conditions.
                </p>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">View Calendar</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" /> Weather Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set up custom alerts for specific weather conditions that affect your crops.
                </p>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Configure Alerts</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" /> Add Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your specific farm or field locations for more accurate weather data.
                </p>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Add Location</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-green-600" /> Weather History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access historical weather data to compare with current conditions.
                </p>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">View History</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weatherInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    {insight.icon}
                    <CardTitle>{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Weather Events</CardTitle>
              <CardDescription>Weather events that may impact your agricultural operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                    <div
                      className={`h-3 w-3 rounded-full mt-1.5 ${event.severity === "high" ? "bg-red-500" : "bg-yellow-500"}`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.event}</h3>
                        <span className="text-sm text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700">Download Full Weather Report</Button>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather-Based Planning Tools</CardTitle>
              <CardDescription>Optimize your farming operations based on weather forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="text-lg font-medium mb-2">Irrigation Scheduler</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate optimal irrigation schedules based on rainfall forecasts, soil moisture, and crop water
                    needs.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open Scheduler
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="text-lg font-medium mb-2">Spray Window Planner</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Identify optimal windows for pesticide and fertilizer application based on wind, rain, and
                    temperature forecasts.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open Planner
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="text-lg font-medium mb-2">Harvest Optimizer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan your harvest schedule based on weather forecasts to maximize quality and minimize losses.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open Optimizer
                  </Button>
                </div>

                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="text-lg font-medium mb-2">Frost Risk Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate frost risk for your specific crops and locations, with alerts and protection
                    recommendations.
                  </p>
                  <Button variant="outline" className="w-full">
                    Open Calculator
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Weather Notifications</CardTitle>
              <CardDescription>Set up personalized weather alerts for your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CloudRain className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Heavy Rainfall Alert</h3>
                      <p className="text-sm text-muted-foreground">Notify when forecast exceeds 25mm in 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-green-600 mr-2">Active</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium">Frost Warning</h3>
                      <p className="text-sm text-muted-foreground">Notify when temperature drops below 2°C</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-green-600 mr-2">Active</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">High Wind Alert</h3>
                      <p className="text-sm text-muted-foreground">Notify when wind speed exceeds 30 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Inactive</span>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="font-medium">Drought Conditions</h3>
                      <p className="text-sm text-muted-foreground">Notify when no rainfall for 7+ days</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-green-600 mr-2">Active</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Add New Weather Alert</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
