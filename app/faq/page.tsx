import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ - AgriConnect",
  description: "Frequently asked questions about AgriConnect",
}

export default function FAQPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-3xl font-bold">Frequently Asked Questions</h1>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is AgriConnect?</AccordionTrigger>
          <AccordionContent>
            AgriConnect is a digital platform that connects farmers directly with retailers within a 100km radius. Our
            mission is to create a more efficient and sustainable agricultural supply chain by eliminating unnecessary
            middlemen, reducing food waste, and ensuring fair prices for both farmers and retailers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do I sign up as a farmer?</AccordionTrigger>
          <AccordionContent>
            To sign up as a farmer, click the "Sign Up" button in the top right corner of the homepage. Select "Farmer"
            as your account type, and fill in your details including your farm location. You'll need to verify your
            identity and farming credentials before you can start listing products.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How do I sign up as a retailer?</AccordionTrigger>
          <AccordionContent>
            To sign up as a retailer, click the "Sign Up" button in the top right corner of the homepage. Select
            "Retailer" as your account type, and fill in your business details including your store location. You'll
            need to verify your business credentials before you can start purchasing products.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How does the 100km radius work?</AccordionTrigger>
          <AccordionContent>
            When you sign up, we use your location to determine your operational radius. Farmers will only see retailers
            within 100km of their location, and retailers will only see farmers within 100km of their store. This
            ensures fresh produce and reduces transportation costs and environmental impact.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>How do payments work?</AccordionTrigger>
          <AccordionContent>
            AgriConnect uses a secure payment system. When a retailer places an order, the payment is held in escrow
            until the order is confirmed as delivered and accepted. This protects both parties and ensures fair
            transactions. We accept major credit cards, bank transfers, and mobile payment options.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>What fees does AgriConnect charge?</AccordionTrigger>
          <AccordionContent>
            AgriConnect charges a small transaction fee of 5% on each successful order. There are no monthly
            subscription fees or listing fees. This model ensures we only make money when our users successfully do
            business together.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>How is delivery handled?</AccordionTrigger>
          <AccordionContent>
            AgriConnect offers two delivery options: farmer delivery or third-party logistics. Farmers can choose to
            deliver their products directly to retailers, or use our network of verified delivery partners. Delivery
            costs are transparent and shown before order confirmation.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>What if there's a problem with my order?</AccordionTrigger>
          <AccordionContent>
            If there's an issue with an order, both parties can use our dispute resolution system. Simply go to the
            order details and click "Report Issue." Our team will review the case and help reach a fair resolution.
            Payments are held in escrow until disputes are resolved.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger>How does the weather feature help me?</AccordionTrigger>
          <AccordionContent>
            Our integrated weather system provides real-time weather data and forecasts specific to your location.
            Farmers can use this to plan harvests and predict yields, while retailers can anticipate supply fluctuations
            based on weather conditions affecting their supplier farmers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger>Who created AgriConnect?</AccordionTrigger>
          <AccordionContent>
            AgriConnect was created by Paras Agrawal, who envisioned a more efficient and sustainable agricultural
            ecosystem. The platform was developed to address the challenges faced by small and medium-sized farmers in
            reaching fair markets for their produce.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
