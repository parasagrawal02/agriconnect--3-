import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Mail, Github, Linkedin, Twitter } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">About AgriConnect</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting farmers and retailers directly to build sustainable local food systems and strengthen
            agricultural communities.
          </p>
        </section>

        {/* Creator Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">The Creator</h2>
            <p className="text-lg mb-4">
              AgriConnect was created by <span className="font-bold">Paras Agrawal</span>, a visionary entrepreneur
              passionate about sustainable agriculture and local food systems.
            </p>
            <p className="mb-4">
              With a background in both agriculture and technology, Paras identified a critical gap in the agricultural
              supply chain where farmers were receiving minimal profits while retailers struggled to source fresh, local
              produce efficiently. This insight led to the development of AgriConnect, a platform designed to eliminate
              unnecessary middlemen and create direct connections between farmers and retailers.
            </p>
            <p className="mb-6">
              Paras believes that by strengthening local agricultural ecosystems, we can create more sustainable food
              systems, reduce environmental impact, and improve economic outcomes for rural communities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" /> Contact
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" /> Github
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Twitter className="h-4 w-4" /> Twitter
              </Button>
            </div>
          </div>
          <div className="absolute h-[400px] rounded-xl overflow-hidden">
            <Image src="https://images.app.goo.gl/imXQP9txENmTvT2CA" alt="Paras Agrawal,creator of AgriConnect" fill className="object-cover" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-green-50 dark:bg-green-950 p-8 rounded-xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                AgriConnect's mission is to revolutionize the agricultural supply chain by directly connecting farmers
                with retailers, eliminating unnecessary middlemen, and creating a more sustainable and profitable
                ecosystem for all stakeholders.
              </p>
              <p>
                We believe in a future where farmers receive fair compensation for their hard work, retailers access
                fresher produce at better prices, and communities benefit from stronger local food systems.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="mb-4">
                We envision a world where local food systems thrive, where the distance from farm to table is measured
                in kilometers rather than continents, and where technology empowers rather than replaces human
                connections in agriculture.
              </p>
              <p>
                By 2030, we aim to help establish resilient agricultural networks in communities worldwide, reducing
                food miles by 50% and increasing farmer profits by 40% compared to traditional supply chains.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We prioritize environmental sustainability in all aspects of our platform, promoting practices that
                  protect our planet for future generations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in complete transparency throughout the supply chain, ensuring trust between farmers,
                  retailers, and consumers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We're committed to strengthening local communities by supporting regional food systems and rural
                  economies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to solve agricultural challenges, using technology to enhance rather than
                  replace human connections.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
          <p className="text-lg mb-6">
            AgriConnect leverages cutting-edge technology to create a seamless experience for farmers and retailers:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Platform Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge className="mr-2 bg-green-600">Feature</Badge>
                  <span>Real-time inventory management</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-green-600">Feature</Badge>
                  <span>Secure messaging system</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-green-600">Feature</Badge>
                  <span>Integrated payment processing</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-green-600">Feature</Badge>
                  <span>Order tracking and management</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-green-600">Feature</Badge>
                  <span>Weather and market insights</span>
                </li>
              </ul>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">AI Capabilities</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge className="mr-2 bg-blue-600">AI</Badge>
                  <span>Crop yield prediction</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-blue-600">AI</Badge>
                  <span>Market trend analysis</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-blue-600">AI</Badge>
                  <span>Personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-blue-600">AI</Badge>
                  <span>Weather impact forecasting</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-blue-600">AI</Badge>
                  <span>Video content generation</span>
                </li>
              </ul>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Tech Stack</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge className="mr-2 bg-gray-600">Tech</Badge>
                  <span>Next.js for frontend and API</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-gray-600">Tech</Badge>
                  <span>React and Tailwind CSS</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-gray-600">Tech</Badge>
                  <span>Serverless architecture</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-gray-600">Tech</Badge>
                  <span>Real-time database</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2 bg-gray-600">Tech</Badge>
                  <span>AI/ML integration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-100 dark:bg-green-900 p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Agricultural Revolution</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Be part of the movement to transform agriculture and build more sustainable food systems. Whether you're a
            farmer or retailer, AgriConnect provides the tools you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
