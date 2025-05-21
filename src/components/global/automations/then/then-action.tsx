"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useListener } from "@/hooks/use-automations"
import { AUTOMATION_LISTENERS } from "@/constants/automation"
import { SubscriptionPlan } from "../../subscription-plan"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import {
  PlusCircle,
  MessageSquare,
  Store,
  Briefcase,
  Users,
  ChevronDown,
  ChevronRight,
  Info,
  FileText,
  Copy,
  CheckCheck,
  Save,
  Clock,
  CheckCircle,
  Loader2,
  Scissors,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Star,
  Award,
  Sparkles,
  ExternalLink,
  Lightbulb,
} from "lucide-react"
import FloatingPanel from "../../panel"
import ResponseLibrary from "../response"
import { ContextCard } from "../context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { saveBusinessProfile } from "@/actions/business"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import Loader from "../../loader"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

// Business profile template categories
type TemplateCategory = {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  templates: BusinessTemplate[]
}

type BusinessTemplate = {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  example?: string
}

const ThenAction = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const { onSetListener, listener: Listener, onFormSubmit, register, isPending } = useListener(id)
  const [showTip, setShowTip] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("comprehensive")
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [showTemplateDetails, setShowTemplateDetails] = useState(false)
  const [businessProfile, setBusinessProfile] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Message templates (from original component)
  const messageTemplates = [
    "Thanks for your comment! We appreciate your feedback.",
    "Hello! Thanks for reaching out. How can I help you today?",
    "We're glad you're interested in our products! Would you like more information?",
    "Thank you for your support! We'd love to hear more about your experience.",
  ]

  // AI suggestion examples (from original component)
  const aiSuggestions = [
    "Thank them for their comment and ask a follow-up question about their experience",
    "Offer a personalized discount code based on their comment",
    "Provide more information about the product they're interested in",
    "Ask them to share their experience on social media",
  ]

  // Example business profile for Scissors & Style salon (placeholder, you'll have the full content)
  const exampleBusinessProfile = `# Scissors & Style - Complete Business Profile

## BASIC INFORMATION
- Business Name: Scissors & Style
- Founded: 2018
- Location: 123 Main Street, Downtown, Metropolis, CA 90210
- Website: www.scissorsandstyle.com
- Contact: (555) 123-4567, info@scissorsandstyle.com
- Business Hours: Monday-Friday: 9am-7pm, Saturday: 9am-5pm, Sunday: Closed
- Social Media: @ScissorsAndStyle on Instagram, Facebook, and TikTok

## BUSINESS OVERVIEW
Scissors & Style is a premium hair salon located in Downtown Metropolis that specializes in haircuts, coloring, styling, and hair treatments. Founded in 2018 by master stylist Emma Rodriguez, our mission is to help every client look and feel their best through personalized hair services that enhance their natural beauty.

We serve clients of all ages and hair types, with particular expertise in curly hair, balayage techniques, and precision cuts. What sets us apart from competitors is our commitment to ongoing stylist education, our use of eco-friendly and cruelty-free products, and our relaxing, inclusive salon environment.

## PRODUCTS AND SERVICES

### Main Offerings:
1. Haircuts: Precision cuts tailored to face shape and hair texture - Starting at $65
2. Color Services: Full color, highlights, balayage, and ombre techniques - Starting at $95
3. Styling: Blowouts, special occasion styling, and updos - Starting at $55

### Specialty Services:
- Curly Hair Treatments: Specialized cuts and styling for all curl patterns - $85
- Keratin Treatments: Smoothing services for frizz reduction - $250
- Hair Extensions: Premium quality extensions for length and volume - $350+

### Packages and Promotions:
- New Client Special: 15% off first service - Available year-round
- Bridal Package: Trial styling, day-of styling for bride and up to 3 attendants - $450
- Color Maintenance: Book color and cut together and save 10%

## BOOKING AND APPOINTMENTS
- Booking Methods: Online through website, Phone, Instagram DM
- Booking Website: www.scissorsandstyle.com/book
- Typical Appointment Duration: 45-90 minutes depending on service
- Cancellation Policy: 24-hour notice required or 50% charge applies

## TEAM INFORMATION
Our team consists of 8 professionals with expertise in cutting, coloring, and styling.

Key team members:
- Emma Rodriguez: Owner/Master Stylist - Specializes in precision cuts and balayage, 15 years experience
- James Chen: Senior Stylist - Specializes in vivid colors and avant-garde styles, 8 years experience
- Sophia Williams: Curl Specialist - Certified in DevaCurl and Ouidad techniques, 6 years experience

## CUSTOMER EXPERIENCE
- What to expect during your visit: Complimentary consultation, relaxing scalp massage with shampoo, styling tutorial
- Amenities provided: Complimentary beverages (coffee, tea, infused water), free WiFi, charging stations
- Accessibility features: Wheelchair accessible entrance and washrooms, fragrance-free options available

## POLICIES
- Payment Methods: Credit/debit cards, Apple Pay, Google Pay, Cash
- Refund Policy: We don't offer refunds, but will gladly fix any service you're unhappy with within 7 days
- Satisfaction Guarantee: If you're not completely satisfied, we'll adjust your cut or color within one week at no charge
- COVID-19/Health Protocols: Enhanced sanitization, optional mask wearing, contactless payment options

## FREQUENTLY ASKED QUESTIONS
1. Q: How far in advance should I book an appointment?
   A: We recommend booking 1-2 weeks in advance for regular services, and 3-4 weeks for special occasions or with our most requested stylists.

2. Q: Do you provide consultations before services?
   A: Yes, every service includes a complimentary consultation to discuss your hair goals, maintenance requirements, and styling preferences.

3. Q: What happens if I'm late for my appointment?
   A: If you're more than 15 minutes late, we may need to reschedule or modify your service depending on the day's schedule. Please call ahead if you're running late.

4. Q: Do you offer gift certificates?
   A: Yes! Gift certificates are available for purchase in-salon or through our website and never expire.

5. Q: What should I do if I'm not satisfied with my service?
   A: Please let us know within 7 days, and we'll schedule a complimentary adjustment appointment to make it right.

## TESTIMONIALS AND REVIEWS
- "Emma transformed my dull, lifeless hair into the most gorgeous, dimensional color I've ever had. The entire experience at Scissors & Style is luxurious from start to finish." - Maria J.
- "As someone with 3C curls, I've struggled to find stylists who understand my hair. Sophia at Scissors & Style not only gave me the best cut of my life but taught me how to style it at home!" - Jamal T.
- "The attention to detail at this salon is unmatched. From the thorough consultation to the amazing head massage to the styling tips - everything is perfect." - Alexis P.

## COMMUNITY AND VALUES
- Our values: Inclusivity, Sustainability, Continuous Education, Client-Centered Service
- Community involvement: Monthly free haircuts for job seekers, annual fundraiser for local women's shelter
- Sustainability practices: Eco-friendly product lines, recycling program for color tubes and foils, water-saving fixtures

## ADDITIONAL INFORMATION
- Parking information: Street parking available, validated parking at Downtown Garage (2 hours free)
- Nearby landmarks: Across from Central Park, two blocks from Metropolis Museum of Art
- Public transportation access: Bus routes 10 and 14 stop directly in front, Metro Blue Line is 3 blocks away`

  // Business profile template categories
  const templateCategories: TemplateCategory[] = [
    {
      id: "comprehensive",
      name: "Comprehensive Profile",
      icon: <Briefcase className="h-4 w-4" />,
      description: "Complete business information",
      templates: [
        {
          id: "full-business-profile",
          title: "Complete Business Profile",
          description: "All-in-one comprehensive business information",
          tags: ["complete", "all-in-one"],
          content: `# [BUSINESS_NAME] - Complete Business Profile

## BASIC INFORMATION
- Business Name: [BUSINESS_NAME]
- Founded: [YEAR]
- Location: [FULL_ADDRESS]
- Website: [WEBSITE_URL]
- Contact: [PHONE], [EMAIL]
- Business Hours: [HOURS_OF_OPERATION] (e.g., Monday-Friday: 9am-6pm, Saturday: 10am-4pm, Sunday: Closed)
- Social Media: [SOCIAL_MEDIA_LINKS]

## BUSINESS OVERVIEW
[BUSINESS_NAME] is a [TYPE_OF_BUSINESS] located in [CITY/LOCATION] that specializes in [PRIMARY_SERVICES/PRODUCTS]. Founded in [YEAR] by [FOUNDER_NAMES], our mission is to [MISSION_STATEMENT].

We serve [TARGET_AUDIENCE] by providing [VALUE_PROPOSITION]. What sets us apart from competitors is our [UNIQUE_SELLING_POINTS], including [SPECIFIC_ADVANTAGE_1], [SPECIFIC_ADVANTAGE_2], and [SPECIFIC_ADVANTAGE_3].

## PRODUCTS AND SERVICES

### Main Offerings:
1. [SERVICE/PRODUCT_1]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]
2. [SERVICE/PRODUCT_2]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]
3. [SERVICE/PRODUCT_3]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]

### Specialty Services:
- [SPECIALTY_SERVICE_1]: [DESCRIPTION] - $[PRICE]
- [SPECIALTY_SERVICE_2]: [DESCRIPTION] - $[PRICE]

### Packages and Promotions:
- [PACKAGE_NAME_1]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - $[PRICE]
- [PROMOTION_1]: [DESCRIPTION] - Available [TIMEFRAME]

## BOOKING AND APPOINTMENTS
- Booking Methods: [BOOKING_METHODS] (e.g., Online, Phone, Walk-in)
- Booking Website/App: [BOOKING_URL]
- Typical Appointment Duration: [DURATION]
- Cancellation Policy: [CANCELLATION_POLICY]

## TEAM INFORMATION
Our team consists of [NUMBER] professionals with expertise in [AREAS_OF_EXPERTISE].

Key team members:
- [NAME_1]: [POSITION] - [BRIEF_BIO/SPECIALTIES]
- [NAME_2]: [POSITION] - [BRIEF_BIO/SPECIALTIES]
- [NAME_3]: [POSITION] - [BRIEF_BIO/SPECIALTIES]

## CUSTOMER EXPERIENCE
- What to expect during your visit: [CUSTOMER_JOURNEY]
- Amenities provided: [AMENITIES]
- Accessibility features: [ACCESSIBILITY_INFORMATION]

## POLICIES
- Payment Methods: [PAYMENT_METHODS]
- Refund Policy: [REFUND_POLICY]
- Satisfaction Guarantee: [GUARANTEE_DETAILS]
- COVID-19/Health Protocols: [HEALTH_PROTOCOLS]

## FREQUENTLY ASKED QUESTIONS
1. Q: [COMMON_QUESTION_1]?
   A: [DETAILED_ANSWER_1]

2. Q: [COMMON_QUESTION_2]?
   A: [DETAILED_ANSWER_2]

3. Q: [COMMON_QUESTION_3]?
   A: [DETAILED_ANSWER_3]

4. Q: [COMMON_QUESTION_4]?
   A: [DETAILED_ANSWER_4]

5. Q: [COMMON_QUESTION_5]?
   A: [DETAILED_ANSWER_5]

## TESTIMONIALS AND REVIEWS
- "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
- "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
- "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

## COMMUNITY AND VALUES
- Our values: [COMPANY_VALUES]
- Community involvement: [COMMUNITY_INITIATIVES]
- Sustainability practices: [SUSTAINABILITY_EFFORTS]

## ADDITIONAL INFORMATION
- Parking information: [PARKING_DETAILS]
- Nearby landmarks: [NEARBY_LANDMARKS]
- Public transportation access: [PUBLIC_TRANSPORTATION]`,
          example: exampleBusinessProfile,
        },
      ],
    },
    {
      id: "service",
      name: "Service Business",
      icon: <Store className="h-4 w-4" />,
      description: "For service-based businesses",
      templates: [
        {
          id: "salon-spa-template",
          title: "Salon/Spa Business Profile",
          description: "Detailed template for salons, spas, and beauty businesses",
          tags: ["salon", "spa", "beauty"],
          content: `# [SALON_NAME] - Beauty Business Profile

## BASIC INFORMATION
- Business Name: [SALON_NAME]
- Type of Business: [TYPE] (e.g., Hair Salon, Full-Service Spa, Nail Salon, Barbershop)
- Founded: [YEAR]
- Location: [FULL_ADDRESS]
- Contact: [PHONE], [EMAIL]
- Website: [WEBSITE_URL]
- Business Hours: 
  - Monday: [HOURS]
  - Tuesday: [HOURS]
  - Wednesday: [HOURS]
  - Thursday: [HOURS]
  - Friday: [HOURS]
  - Saturday: [HOURS]
  - Sunday: [HOURS]
- Social Media: [INSTAGRAM], [FACEBOOK], [TIKTOK], etc.

## BUSINESS OVERVIEW
[SALON_NAME] is a [PREMIUM/AFFORDABLE/LUXURY] [TYPE_OF_SALON] located in [CITY/LOCATION] that specializes in [PRIMARY_SERVICES]. Founded in [YEAR] by [FOUNDER_NAMES], we are committed to [MISSION_STATEMENT].

Our salon is known for [UNIQUE_SELLING_POINTS] and we pride ourselves on [SPECIAL_APPROACH]. We serve a clientele of [TARGET_AUDIENCE] and have built our reputation on [KEY_REPUTATION_FACTORS].

## SERVICES AND PRICING

### Hair Services:
- Women's Haircut: $[PRICE] - [DURATION]
- Men's Haircut: $[PRICE] - [DURATION]
- Children's Haircut: $[PRICE] - [DURATION]
- Color Services: $[PRICE_RANGE] - [DURATION_RANGE]
- Highlights/Balayage: $[PRICE_RANGE] - [DURATION_RANGE]
- Blowout/Styling: $[PRICE] - [DURATION]
- Hair Treatments: $[PRICE_RANGE] - [DURATION_RANGE]

### Spa/Facial Services:
- Basic Facial: $[PRICE] - [DURATION]
- Premium Facial: $[PRICE] - [DURATION]
- Specialty Treatments: $[PRICE_RANGE] - [DURATION_RANGE]

### Nail Services:
- Manicure: $[PRICE] - [DURATION]
- Pedicure: $[PRICE] - [DURATION]
- Gel/Shellac: $[PRICE] - [DURATION]
- Nail Art: $[PRICE_RANGE]

### Additional Services:
- Waxing: $[PRICE_RANGE]
- Massage: $[PRICE_RANGE] - [DURATION_RANGE]
- Makeup Application: $[PRICE_RANGE] - [DURATION_RANGE]

### Packages and Specials:
- [PACKAGE_NAME]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - $[PRICE]
- Bridal Packages: [DESCRIPTION] - $[PRICE_RANGE]
- First-Time Client Special: [DESCRIPTION] - $[PRICE]

## BOOKING AND APPOINTMENTS
- Booking Methods: [BOOKING_METHODS] (e.g., Online, Phone, Walk-in)
- Booking Website/App: [BOOKING_URL]
- Deposit Required: [YES/NO] - $[AMOUNT]
- Cancellation Policy: [CANCELLATION_POLICY] (e.g., 24-hour notice required or 50% charge)

## STYLISTS AND STAFF
Our team consists of [NUMBER] professionals with expertise in [AREAS_OF_EXPERTISE].

Featured stylists:
- [STYLIST_NAME_1]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience
- [STYLIST_NAME_2]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience
- [STYLIST_NAME_3]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience

## PRODUCTS AND RETAIL
We proudly use and sell the following professional brands:
- [BRAND_1]: [TYPES_OF_PRODUCTS]
- [BRAND_2]: [TYPES_OF_PRODUCTS]
- [BRAND_3]: [TYPES_OF_PRODUCTS]

## CLIENT EXPERIENCE
- What to expect during your visit: [CUSTOMER_JOURNEY]
- Amenities provided: [AMENITIES] (e.g., Complimentary beverages, WiFi)
- Preparation tips: [PREPARATION_TIPS]

## POLICIES
- Payment Methods: [PAYMENT_METHODS]
- Tipping Policy: [TIPPING_POLICY]
- Refund Policy: [REFUND_POLICY]
- Children Policy: [CHILDREN_POLICY]
- Health and Safety Protocols: [HEALTH_PROTOCOLS]

## FREQUENTLY ASKED QUESTIONS
1. Q: How far in advance should I book an appointment?
   A: [ANSWER]

2. Q: Do you provide consultations before services?
   A: [ANSWER]

3. Q: What happens if I'm late for my appointment?
   A: [ANSWER]

4. Q: Do you offer gift certificates?
   A: [ANSWER]

5. Q: What should I do if I'm not satisfied with my service?
   A: [ANSWER]

## TESTIMONIALS
- "[TESTIMONIAL_1]" - [CLIENT_NAME_1]
- "[TESTIMONIAL_2]" - [CLIENT_NAME_2]
- "[TESTIMONIAL_3]" - [CLIENT_NAME_3]`,
          example: exampleBusinessProfile,
        },
        {
          id: "restaurant-template",
          title: "Restaurant/Café Profile",
          description: "Comprehensive template for food service businesses",
          tags: ["restaurant", "café", "food"],
          content: `# [RESTAURANT_NAME] - Food Business Profile

## BASIC INFORMATION
- Business Name: [RESTAURANT_NAME]
- Type of Establishment: [TYPE] (e.g., Fine Dining, Casual Restaurant, Café, Bistro, Food Truck)
- Cuisine: [CUISINE_TYPE]
- Founded: [YEAR]
- Location: [FULL_ADDRESS]
- Contact: [PHONE], [EMAIL]
- Website: [WEBSITE_URL]
- Hours of Operation:
  - Monday: [HOURS]
  - Tuesday: [HOURS]
  - Wednesday: [HOURS]
  - Thursday: [HOURS]
  - Friday: [HOURS]
  - Saturday: [HOURS]
  - Sunday: [HOURS]
- Social Media: [INSTAGRAM], [FACEBOOK], [TWITTER], etc.

## RESTAURANT OVERVIEW
[RESTAURANT_NAME] is a [DESCRIPTION_OF_AMBIANCE] [TYPE_OF_RESTAURANT] located in [CITY/LOCATION] that specializes in [CUISINE_TYPE] cuisine. Founded in [YEAR] by [FOUNDER_NAMES/CHEF], we offer [UNIQUE_SELLING_PROPOSITION].

Our restaurant is known for [SIGNATURE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We source our ingredients from [SOURCING_INFORMATION] and prioritize [VALUES_LIKE_SUSTAINABILITY/LOCAL_SOURCING].

## MENU HIGHLIGHTS

### Appetizers:
- [APPETIZER_1]: [DESCRIPTION] - $[PRICE]
- [APPETIZER_2]: [DESCRIPTION] - $[PRICE]
- [APPETIZER_3]: [DESCRIPTION] - $[PRICE]

### Main Courses:
- [MAIN_DISH_1]: [DESCRIPTION] - $[PRICE]
- [MAIN_DISH_2]: [DESCRIPTION] - $[PRICE]
- [MAIN_DISH_3]: [DESCRIPTION] - $[PRICE]

### Signature Dishes:
- [SIGNATURE_DISH_1]: [DETAILED_DESCRIPTION] - $[PRICE]
- [SIGNATURE_DISH_2]: [DETAILED_DESCRIPTION] - $[PRICE]

### Desserts:
- [DESSERT_1]: [DESCRIPTION] - $[PRICE]
- [DESSERT_2]: [DESCRIPTION] - $[PRICE]

### Beverages:
- [BEVERAGE_CATEGORY_1] (e.g., Wines, Cocktails, Coffee): [OPTIONS_AND_PRICE_RANGE]
- [BEVERAGE_CATEGORY_2]: [OPTIONS_AND_PRICE_RANGE]

### Special Menus:
- [SPECIAL_MENU_1] (e.g., Tasting Menu, Prix Fixe): [DESCRIPTION] - $[PRICE]
- Seasonal Offerings: [CURRENT_SEASONAL_ITEMS]
- Dietary Accommodations: [VEGETARIAN/VEGAN/GLUTEN-FREE_OPTIONS]

## DINING EXPERIENCE
- Seating Capacity: [NUMBER_OF_SEATS]
- Dining Areas: [TYPES_OF_SEATING] (e.g., Main Dining Room, Bar, Outdoor Patio)
- Ambiance: [AMBIANCE_DESCRIPTION]
- Dress Code: [DRESS_CODE]
- Average Dining Time: [DURATION]
- Special Features: [UNIQUE_FEATURES] (e.g., Open Kitchen, Chef's Table, Live Music)

## RESERVATIONS AND POLICIES
- Reservation Methods: [BOOKING_METHODS] (e.g., Online, Phone)
- Reservation Website/App: [BOOKING_URL]
- Large Party Accommodations: [LARGE_PARTY_POLICY]
- Cancellation Policy: [CANCELLATION_POLICY]
- Corkage Fee: [FEE_AMOUNT]
- Private Events: [PRIVATE_EVENT_INFORMATION]

## TEAM
- Head Chef: [CHEF_NAME] - [BRIEF_BIO/BACKGROUND]
- Key Staff: [OTHER_KEY_STAFF_MEMBERS]

## ADDITIONAL SERVICES
- Takeout/Delivery: [AVAILABILITY_AND_PLATFORMS]
- Catering: [CATERING_INFORMATION]
- Gift Cards: [GIFT_CARD_INFORMATION]
- Loyalty Program: [PROGRAM_DETAILS]

## POLICIES
- Payment Methods: [PAYMENT_METHODS]
- Tipping Policy: [TIPPING_POLICY]
- Children Policy: [CHILDREN_POLICY]
- Pet Policy: [PET_POLICY]

## FREQUENTLY ASKED QUESTIONS
1. Q: Do you take reservations?
   A: [ANSWER]

2. Q: Is there parking available?
   A: [ANSWER]

3. Q: Can you accommodate dietary restrictions?
   A: [ANSWER]

4. Q: Do you have a corkage policy?
   A: [ANSWER]

5. Q: What's your policy on celebrations (birthdays, anniversaries)?
   A: [ANSWER]

## REVIEWS AND ACCOLADES
- "[REVIEW_QUOTE_1]" - [PUBLICATION/CRITIC_1]
- "[REVIEW_QUOTE_2]" - [PUBLICATION/CRITIC_2]
- Awards: [LIST_OF_AWARDS_AND_RECOGNITIONS]

## LOCATION INFORMATION
- Parking: [PARKING_INFORMATION]
- Public Transportation: [PUBLIC_TRANSPORTATION_ACCESS]
- Nearby Landmarks: [NEARBY_LANDMARKS]`,
        },
      ],
    },
    {
      id: "retail",
      name: "Retail Business",
      icon: <Store className="h-4 w-4" />,
      description: "For product-based businesses",
      templates: [
        {
          id: "retail-store-template",
          title: "Retail Store Profile",
          description: "Comprehensive template for retail businesses",
          tags: ["retail", "store", "products"],
          content: `# [STORE_NAME] - Retail Business Profile

## BASIC INFORMATION
- Business Name: [STORE_NAME]
- Type of Store: [TYPE] (e.g., Clothing Boutique, Electronics Store, Bookstore, Home Goods)
- Founded: [YEAR]
- Location(s): [LIST_OF_LOCATIONS_WITH_ADDRESSES]
- Contact: [PHONE], [EMAIL]
- Website: [WEBSITE_URL]
- Store Hours:
  - Monday: [HOURS]
  - Tuesday: [HOURS]
  - Wednesday: [HOURS]
  - Thursday: [HOURS]
  - Friday: [HOURS]
  - Saturday: [HOURS]
  - Sunday: [HOURS]
- Social Media: [INSTAGRAM], [FACEBOOK], [PINTEREST], etc.

## BUSINESS OVERVIEW
[STORE_NAME] is a [DESCRIPTION] retail store located in [CITY/LOCATION] that specializes in [PRODUCT_CATEGORIES]. Founded in [YEAR] by [FOUNDER_NAMES], we offer [UNIQUE_SELLING_PROPOSITION].

Our store is known for [UNIQUE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We cater to [TARGET_AUDIENCE] looking for [CUSTOMER_NEEDS_MET].

## PRODUCT OFFERINGS

### Main Product Categories:
1. [CATEGORY_1]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

2. [CATEGORY_2]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

3. [CATEGORY_3]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

### Featured Brands:
- [BRAND_1]: [TYPES_OF_PRODUCTS]
- [BRAND_2]: [TYPES_OF_PRODUCTS]
- [BRAND_3]: [TYPES_OF_PRODUCTS]

### Exclusive Products:
- [EXCLUSIVE_PRODUCT_1]: [DESCRIPTION] - $[PRICE]
- [EXCLUSIVE_PRODUCT_2]: [DESCRIPTION] - $[PRICE]

### Seasonal Collections:
- Current Season ([SEASON/YEAR]): [DESCRIPTION_OF_COLLECTION]
- Upcoming Collections: [PREVIEW_INFORMATION]

## SHOPPING EXPERIENCE
- Store Layout: [DESCRIPTION_OF_LAYOUT]
- Customer Service Offerings: [SERVICES_PROVIDED]
- Personal Shopping/Assistance: [AVAILABILITY_AND_DETAILS]
- In-Store Events: [TYPES_OF_EVENTS_HOSTED]
- Special Amenities: [AMENITIES] (e.g., Fitting Rooms, Refreshments, Seating Areas)

## PURCHASING OPTIONS
- In-Store Shopping: [DETAILS]
- Online Shopping: [WEBSITE_URL]
- Buy Online, Pick Up In-Store (BOPIS): [AVAILABILITY_AND_PROCESS]
- Shipping Options: [SHIPPING_METHODS_AND_TIMEFRAMES]
- International Shipping: [AVAILABILITY_AND_RESTRICTIONS]

## POLICIES
- Return Policy: [RETURN_POLICY_DETAILS]
- Exchange Policy: [EXCHANGE_POLICY_DETAILS]
- Payment Methods: [ACCEPTED_PAYMENT_METHODS]
- Gift Receipts: [GIFT_RECEIPT_POLICY]
- Price Matching: [PRICE_MATCH_POLICY]
- Layaway/Financing: [AVAILABLE_OPTIONS]

## LOYALTY AND REWARDS
- Loyalty Program: [PROGRAM_NAME_AND_DETAILS]
- Rewards Structure: [HOW_REWARDS_ARE_EARNED]
- Member Benefits: [SPECIAL_PERKS_FOR_MEMBERS]
- How to Join: [SIGNUP_PROCESS]

## GIFT OPTIONS
- Gift Cards: [GIFT_CARD_OPTIONS]
- Gift Wrapping: [GIFT_WRAP_SERVICES_AND_COST]
- Corporate Gifting: [CORPORATE_GIFT_PROGRAMS]

## FREQUENTLY ASKED QUESTIONS
1. Q: What is your return policy?
   A: [ANSWER]

2. Q: Do you offer alterations or customization?
   A: [ANSWER]

3. Q: How can I check if an item is in stock?
   A: [ANSWER]

4. Q: Do you ship internationally?
   A: [ANSWER]

5. Q: How do I redeem loyalty points?
   A: [ANSWER]

## CUSTOMER TESTIMONIALS
- "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
- "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
- "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

## STORE LOCATION DETAILS
- Parking: [PARKING_INFORMATION]
- Public Transportation: [PUBLIC_TRANSPORTATION_ACCESS]
- Nearby Landmarks: [NEARBY_LANDMARKS]
- Accessibility Features: [ACCESSIBILITY_INFORMATION]

## COMPANY VALUES
- Sustainability Practices: [SUSTAINABILITY_INITIATIVES]
- Community Involvement: [COMMUNITY_PROGRAMS]
- Ethical Sourcing: [ETHICAL_SOURCING_POLICIES]`,
        },
        {
          id: "ecommerce-template",
          title: "E-Commerce Business Profile",
          description: "Detailed template for online retail businesses",
          tags: ["ecommerce", "online", "digital"],
          content: `# [BUSINESS_NAME] - E-Commerce Business Profile

## BASIC INFORMATION
- Business Name: [BUSINESS_NAME]
- Type of E-Commerce: [TYPE] (e.g., Direct-to-Consumer Brand, Marketplace, Subscription Service)
- Founded: [YEAR]
- Headquarters: [LOCATION]
- Contact: [EMAIL], [PHONE]
- Website: [WEBSITE_URL]
- Customer Service Hours: [HOURS_OF_OPERATION]
- Social Media: [INSTAGRAM], [FACEBOOK], [TWITTER], [TIKTOK], etc.

## BUSINESS OVERVIEW
[BUSINESS_NAME] is an [ONLINE_RETAIL_TYPE] that specializes in [PRODUCT_CATEGORIES]. Founded in [YEAR] by [FOUNDER_NAMES], we offer [UNIQUE_SELLING_PROPOSITION].

Our online store is known for [UNIQUE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We serve [TARGET_AUDIENCE] by providing [VALUE_PROPOSITION].

## PRODUCT OFFERINGS

### Main Product Categories:
1. [CATEGORY_1]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

2. [CATEGORY_2]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

3. [CATEGORY_3]:
   - [PRODUCT_TYPE_1]: [PRICE_RANGE]
   - [PRODUCT_TYPE_2]: [PRICE_RANGE]
   - [PRODUCT_TYPE_3]: [PRICE_RANGE]

### Bestsellers:
- [BESTSELLER_1]: [DESCRIPTION] - $[PRICE]
- [BESTSELLER_2]: [DESCRIPTION] - $[PRICE]
- [BESTSELLER_3]: [DESCRIPTION] - $[PRICE]

### New Arrivals:
- [NEW_PRODUCT_1]: [DESCRIPTION] - $[PRICE]
- [NEW_PRODUCT_2]: [DESCRIPTION] - $[PRICE]

### Collections/Lines:
- [COLLECTION_1]: [DESCRIPTION_OF_COLLECTION]
- [COLLECTION_2]: [DESCRIPTION_OF_COLLECTION]

## ONLINE SHOPPING EXPERIENCE
- Website Features: [KEY_WEBSITE_FEATURES]
- Mobile App: [APP_AVAILABILITY_AND_FEATURES]
- Product Customization: [CUSTOMIZATION_OPTIONS]
- Virtual Try-On/AR Features: [VIRTUAL_FEATURES]
- Customer Account Benefits: [ACCOUNT_PERKS]

## ORDERING AND FULFILLMENT
- Ordering Process: [STEP_BY_STEP_PROCESS]
- Payment Methods: [ACCEPTED_PAYMENT_METHODS]
- Shipping Options:
  - Standard Shipping: [TIMEFRAME] - $[COST]
  - Expedited Shipping: [TIMEFRAME] - $[COST]
  - International Shipping: [COUNTRIES_SERVED] - [TIMEFRAME] - $[COST]
- Free Shipping Threshold: $[AMOUNT]
- Order Tracking: [TRACKING_PROCESS]
- Fulfillment Partners: [FULFILLMENT_CENTERS/PARTNERS]

## POLICIES
- Return Policy: [RETURN_POLICY_DETAILS]
- Refund Process: [REFUND_PROCESS_AND_TIMEFRAME]
- Exchange Policy: [EXCHANGE_POLICY_DETAILS]
- Warranty Information: [WARRANTY_DETAILS]
- Privacy Policy: [KEY_PRIVACY_POLICY_POINTS]
- Terms of Service: [KEY_TERMS_POINTS]

## CUSTOMER SUPPORT
- Support Channels: [EMAIL], [LIVE_CHAT], [PHONE], [SOCIAL_MEDIA]
- Response Time: [TYPICAL_RESPONSE_TIME]
- Self-Service Options: [HELP_CENTER/FAQ_RESOURCES]
- Return/Exchange Process: [PROCESS_DETAILS]

## LOYALTY AND PROMOTIONS
- Loyalty Program: [PROGRAM_NAME_AND_DETAILS]
- Rewards Structure: [HOW_REWARDS_ARE_EARNED]
- Promotional Emails: [FREQUENCY_AND_CONTENT]
- Referral Program: [REFERRAL_PROGRAM_DETAILS]
- Discount Codes: [TYPICAL_DISCOUNTS_OFFERED]
- Sale Events: [MAJOR_SALE_PERIODS]

## FREQUENTLY ASKED QUESTIONS
1. Q: How long will shipping take?
   A: [ANSWER]

2. Q: What is your return policy?
   A: [ANSWER]

3. Q: Do you ship internationally?
   A: [ANSWER]

4. Q: How can I track my order?
   A: [ANSWER]

5. Q: Are my payment details secure?
   A: [ANSWER]

## CUSTOMER TESTIMONIALS
- "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
- "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
- "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

## COMPANY VALUES AND PRACTICES
- Sustainability Initiatives: [SUSTAINABILITY_PRACTICES]
- Ethical Sourcing: [ETHICAL_SOURCING_POLICIES]
- Packaging Approach: [PACKAGING_DETAILS]
- Carbon Offset Programs: [CARBON_OFFSET_INITIATIVES]
- Charitable Partnerships: [CHARITY_AFFILIATIONS]

## TECHNICAL INFORMATION
- Website Platform: [E-COMMERCE_PLATFORM]
- Payment Processing: [PAYMENT_PROCESSORS]
- Security Certifications: [SECURITY_FEATURES]
- Device Compatibility: [SUPPORTED_DEVICES]
- Accessibility Features: [ACCESSIBILITY_INFORMATION]`,
        },
      ],
    },
    {
      id: "professional",
      name: "Professional Services",
      icon: <Briefcase className="h-4 w-4" />,
      description: "For service professionals",
      templates: [
        {
          id: "consulting-template",
          title: "Consulting/Professional Services",
          description: "Template for consulting and professional service firms",
          tags: ["consulting", "professional", "services"],
          content: `# [FIRM_NAME] - Professional Services Profile

## BASIC INFORMATION
- Business Name: [FIRM_NAME]
- Type of Practice: [TYPE] (e.g., Management Consulting, Legal Services, Accounting, Financial Advisory)
- Founded: [YEAR]
- Location(s): [LIST_OF_OFFICE_LOCATIONS]
- Contact: [PHONE], [EMAIL]
- Website: [WEBSITE_URL]
- Business Hours: [HOURS_OF_OPERATION]
- Social Media: [LINKEDIN], [TWITTER], etc.

## FIRM OVERVIEW
[FIRM_NAME] is a [TYPE_OF_FIRM] that specializes in providing [PRIMARY_SERVICES] to [TARGET_CLIENTS]. Founded in [YEAR] by [FOUNDER_NAMES], we have established ourselves as [MARKET_POSITION] in the [INDUSTRY/SECTOR] space.

Our firm is built on the principles of [CORE_VALUES] and we are committed to [MISSION_STATEMENT]. We differentiate ourselves through [UNIQUE_SELLING_POINTS], including [SPECIFIC_ADVANTAGE_1], [SPECIFIC_ADVANTAGE_2], and [SPECIFIC_ADVANTAGE_3].

## SERVICES OFFERED

### Core Service Areas:
1. [SERVICE_AREA_1]:
   - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

2. [SERVICE_AREA_2]:
   - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

3. [SERVICE_AREA_3]:
   - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
   - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

### Specialized Offerings:
- [SPECIALIZED_SERVICE_1]: [DETAILED_DESCRIPTION]
- [SPECIALIZED_SERVICE_2]: [DETAILED_DESCRIPTION]

### Service Packages:
- [PACKAGE_NAME_1]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - [PRICING_MODEL]
- [PACKAGE_NAME_2]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - [PRICING_MODEL]

## EXPERTISE AND METHODOLOGY
- Areas of Expertise: [LIST_OF_SPECIALIZATIONS]
- Methodologies Used: [METHODOLOGIES/FRAMEWORKS]
- Research Capabilities: [RESEARCH_RESOURCES]
- Technology/Tools Utilized: [SPECIALIZED_TOOLS]
- Certifications/Accreditations: [RELEVANT_CERTIFICATIONS]

## TEAM INFORMATION
Our team consists of [NUMBER] professionals with expertise across [AREAS_OF_EXPERTISE].

Key team members:
- [NAME_1]: [POSITION] - [CREDENTIALS/BACKGROUND]
- [NAME_2]: [POSITION] - [CREDENTIALS/BACKGROUND]
- [NAME_3]: [POSITION] - [CREDENTIALS/BACKGROUND]

## CLIENT ENGAGEMENT PROCESS
1. Initial Consultation: [DESCRIPTION_OF_PROCESS]
2. Needs Assessment: [DESCRIPTION_OF_PROCESS]
3. Proposal Development: [DESCRIPTION_OF_PROCESS]
4. Service Delivery: [DESCRIPTION_OF_PROCESS]
5. Evaluation and Follow-up: [DESCRIPTION_OF_PROCESS]

## PRICING AND BILLING
- Fee Structure: [FEE_STRUCTURE] (e.g., Hourly Rates, Project-Based, Retainer)
- Rate Ranges: [RATE_RANGES]
- Billing Cycle: [BILLING_FREQUENCY]
- Payment Terms: [PAYMENT_TERMS]
- Accepted Payment Methods: [PAYMENT_METHODS]

## CLIENT RELATIONSHIPS
- Types of Clients Served: [CLIENT_TYPES]
- Industries Served: [INDUSTRIES]
- Client Onboarding Process: [ONBOARDING_PROCESS]
- Ongoing Communication: [COMMUNICATION_PRACTICES]
- Confidentiality Practices: [CONFIDENTIALITY_APPROACH]

## CASE STUDIES AND SUCCESS STORIES
1. [CLIENT_TYPE_1] Success Story:
   - Challenge: [PROBLEM_FACED]
   - Solution: [SOLUTION_PROVIDED]
   - Results: [MEASURABLE_OUTCOMES]

2. [CLIENT_TYPE_2] Success Story:
   - Challenge: [PROBLEM_FACED]
   - Solution: [SOLUTION_PROVIDED]
   - Results: [MEASURABLE_OUTCOMES]

## POLICIES
- Confidentiality Policy: [CONFIDENTIALITY_POLICY]
- Conflict of Interest Policy: [CONFLICT_POLICY]
- Quality Assurance: [QA_PROCESSES]
- Client Rights: [CLIENT_RIGHTS]
- Termination Policy: [TERMINATION_TERMS]

## FREQUENTLY ASKED QUESTIONS
1. Q: How do you typically structure your engagements?
   A: [ANSWER]

2. Q: What industries do you specialize in?
   A: [ANSWER]

3. Q: How do you measure success in your projects?
   A: [ANSWER]

4. Q: What is your typical timeline for [COMMON_SERVICE]?
   A: [ANSWER]

5. Q: How do you stay current in your field?
   A: [ANSWER]

## TESTIMONIALS
- "[TESTIMONIAL_1]" - [CLIENT_NAME_1], [CLIENT_POSITION_1] at [CLIENT_COMPANY_1]
- "[TESTIMONIAL_2]" - [CLIENT_NAME_2], [CLIENT_POSITION_2] at [CLIENT_COMPANY_2]
- "[TESTIMONIAL_3]" - [CLIENT_NAME_3], [CLIENT_POSITION_3] at [CLIENT_COMPANY_3]

## THOUGHT LEADERSHIP
- Publications: [NOTABLE_PUBLICATIONS]
- Speaking Engagements: [SPEAKING_EVENTS]
- Research Initiatives: [RESEARCH_PROJECTS]
- Industry Contributions: [INDUSTRY_CONTRIBUTIONS]

## PROFESSIONAL NETWORKS
- Professional Associations: [ASSOCIATION_MEMBERSHIPS]
- Strategic Partnerships: [KEY_PARTNERSHIPS]
- Community Involvement: [COMMUNITY_INITIATIVES]`,
        },
      ],
    },
  ]


  // Handle saving business profile to database
  const handleSaveProfile = async () => {
    if (!businessProfile.trim()) {
      toast({
        title: "Error",
        description: "Please enter or select a business profile before saving",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const result = await saveBusinessProfile({
        automationId: id,
        content: businessProfile,
      })

      if (result.success) {
        setSaveSuccess(true)
        toast({
          title: "Success",
          description: "Business profile saved successfully",
          variant: "default",
        })

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        throw new Error(result.error || "Failed to save business profile")
      }
    } catch (error) {
      console.error("Error saving business profile:", error)
      toast({
        title: "Error",
        description: "Failed to save business profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectTemplate = (content: string) => {
    setSelectedTemplate(content)
    setBusinessProfile(content)
    if (textareaRef.current) {
      textareaRef.current.value = content
      textareaRef.current.focus()
    }
  }

  const handleCopyTemplate = (templateId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedTemplate(templateId)
    setTimeout(() => setCopiedTemplate(null), 2000)
  }

  const handleExpandTemplate = (templateId: string) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null)
    } else {
      setExpandedTemplate(templateId)
    }
  }

  // Update businessProfile when textarea changes
  useEffect(() => {
    if (textareaRef.current) {
      const handleInput = () => {
        setBusinessProfile(textareaRef.current?.value || "")
      }

      textareaRef.current.addEventListener("input", handleInput)

      return () => {
        textareaRef.current?.removeEventListener("input", handleInput)
      }
    }
  }, [])

  // Handle template selection for the original listener component
  const handleSelectMessageTemplate = (content: string) => {
    setSelectedTemplate(content)
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
    if (textarea) {
      textarea.value = content
      textarea.focus()
    }
  }

  return (
    <FloatingPanel
      title="Business Knowledge Hub"
      trigger={
        <motion.div
          className="group relative overflow-hidden rounded-xl mt-4 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Border with animation */}
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

          {/* Inner content */}
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#768BDD]" />
              <p className="text-[#768BDD] font-bold">Business Knowledge Hub</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="flex flex-col gap-4">
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-500 font-medium">Business Knowledge Hub</AlertTitle>
          <AlertDescription className="text-blue-400">
            Create a comprehensive profile of your business and set up automated responses to help AI understand and accurately represent your
            brand in customer interactions.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="listeners" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="listeners" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Automation Listeners
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Business Templates
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">
              <Briefcase className="h-4 w-4 mr-2" />
              Profile Editor
            </TabsTrigger>
            <TabsTrigger value="example" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Example Profile
            </TabsTrigger>
          </TabsList>

          {/* Tab for Original Listeners Functionality */}
          <TabsContent value="listeners" className="space-y-4">
            {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AUTOMATION_LISTENERS.map((listener) =>
                listener.type === "SMARTAI" ? (
                  <SubscriptionPlan key={listener.type} type="PRO">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSetListener(listener.type)}
                      className={cn(
                        Listener === listener.type ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]" : "bg-background-80",
                        "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                      )}
                    >
                      <div className="flex gap-x-2 items-center">
                        {listener.icon}
                        <p>{listener.label}</p>
                      </div>
                      <p className="text-sm">{listener.description}</p>
                    </motion.div>
                  </SubscriptionPlan>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSetListener(listener.type)}
                    key={listener.id}
                    className={cn(
                      Listener === listener.type ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]" : "bg-background-80",
                      "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                    )}
                  >
                    <div className="flex gap-x-2 items-center">
                      {listener.icon}
                      <p>{listener.label}</p>
                    </div>
                    <p className="text-sm">{listener.description}</p>
                  </motion.div>
                ),
              )}
            </div>

            <form onSubmit={onFormSubmit} className="flex flex-col gap-4 mt-2">
              {Listener && (
                <div className={`bg-background-80 p-4 rounded-xl mb-2`}>
                  <div className="flex items-center justify-between mb-3">
                    {/* <h3 className="text-white font-medium flex items-center"> */}
                      {/* {Listener === "SMARTAI" ? (
                        <>
                          <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
                          AI Suggestions
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                          Quick Responses
                        </>
                      )} */}
                    {/* </h3> */}
                    <ResponseLibrary
                      isAI={Listener === "SMARTAI"}
                      onSelectTemplate={handleSelectMessageTemplate}
                      selectedTemplate={selectedTemplate}
                      userSubscription={Listener}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(Listener === "SMARTAI" ? aiSuggestions : messageTemplates).map((suggestion, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-background-90 p-2 rounded-lg text-sm cursor-pointer ${Listener === "SMARTAI" ? "text-keyword-purple" : "text-light-blue"}`}
                        onClick={() => {
                          const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
                          if (textarea) {
                            textarea.value = suggestion
                            textarea.focus()
                          }
                        }}
                      >
                        {suggestion}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-text-secondary">
                  {Listener === "SMARTAI"
                    ? "Add a prompt that your smart AI can use..."
                    : "Add a message you want to send to your customers"}
                </label>
                <Textarea
                  placeholder={
                    Listener === "SMARTAI"
                      ? "Add a prompt that your smart AI can use..."
                      : "Add a message you want to send to your customers"
                  }
                  {...register("prompt")}
                  className="bg-background-80 outline-none border-none ring-0 focus:ring-0 min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
                <Input
                  {...register("reply")}
                  placeholder="Add a reply for comments (Optional)"
                  className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
                />
              </div>

              <Button
                className={cn(
                  "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
                  Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
                )}
              >
                <Loader state={isPending}>Add a listener</Loader>
              </Button>
            </form>
          </TabsContent>

          {/* Business Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="bg-background-80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-light-blue" />
                  Business Profile Templates
                </h3>
                <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
                  <Info className="h-3 w-3 mr-1" />
                  Select a template that best fits your business
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {templateCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedCategory === category.id
                        ? "bg-light-blue hover:bg-light-blue/90"
                        : "bg-background-90 hover:bg-background-80"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                {templateCategories
                  .find((c) => c.id === selectedCategory)
                  ?.templates.map((template) => (
                    <Card
                      key={template.id}
                      className="bg-background-90 border-background-80 hover:border-light-blue/30 transition-all duration-200"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-light-blue">{template.title}</h4>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </div>
                          <div className="flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleExpandTemplate(template.id)}
                                  >
                                    {expandedTemplate === template.id ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {expandedTemplate === template.id ? "Collapse" : "Expand"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleCopyTemplate(template.id, template.content)}
                                  >
                                    {copiedTemplate === template.id ? (
                                      <CheckCheck className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedTemplate === template.id ? "Copied!" : "Copy to clipboard"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {expandedTemplate === template.id ? (
                          <div className="mt-2 text-sm whitespace-pre-wrap max-h-80 overflow-y-auto border border-background-80 rounded-md p-3 bg-background/50">
                            {template.content}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
                        )}

                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-light-blue hover:bg-light-blue/90 text-white"
                            onClick={() => handleSelectTemplate(template.content)}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Editor Tab */}
          <TabsContent value="editor" className="space-y-4">
            <div className="bg-background-80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                  Business Profile Editor
                </h3>
                <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
                  <Info className="h-3 w-3 mr-1" />
                  Fill in your business details
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-profile" className="text-sm text-text-secondary flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-light-blue" />
                    Business Profile Information
                  </Label>
                  <Textarea
                    id="business-profile"
                    ref={textareaRef}
                    placeholder="Enter comprehensive information about your business..."
                    className="bg-background-90 outline-none border-background-80 ring-0 focus:ring-1 focus:ring-light-blue/50 min-h-[400px] text-sm"
                    defaultValue={businessProfile}
                  />
                  <p className="text-xs text-muted-foreground">
                    Replace the placeholder text in [BRACKETS] with your specific business information. The more
                    detailed your profile, the better the AI can represent your business.
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Last updated: {new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-light-blue/30 text-light-blue hover:bg-light-blue/10"
                      onClick={() => setBusinessProfile("")}
                    >
                      Clear
                    </Button>
                    <Button
                      className="bg-light-blue hover:bg-light-blue/90 text-white"
                      onClick={handleSaveProfile}
                      disabled={isSaving || !businessProfile.trim()}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500 font-medium">Tips for a Great Business Profile</AlertTitle>
              <AlertDescription className="text-green-400">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Be specific about your products, services, and pricing</li>
                  <li>Include your business hours, location, and contact information</li>
                  <li>Describe your unique selling points and what sets you apart</li>
                  <li>Add common questions customers ask with detailed answers</li>
                  <li>Include policies like returns, cancellations, and guarantees</li>
                </ul>
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Example Profile Tab */}
          <TabsContent value="example" className="space-y-4">
            <div className="bg-background-80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  <Scissors className="h-5 w-5 mr-2 text-light-blue" />
                  Example: Scissors & Style Salon
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
                    <MapPin className="h-3 w-3 mr-1" />
                    Metropolis, CA
                  </Badge>
                  <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
                    <Store className="h-3 w-3 mr-1" />
                    Hair Salon
                  </Badge>
                </div>
              </div>

              <div className="bg-background-90 rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="bg-background-80 rounded-lg p-3 flex-1">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-light-blue" />
                      Contact Information
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>163 Main Street, Downtown, Mineapolis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>(111) 054-9963</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>info@scissorsandstyle.com</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>www.scissorsandstyle.com</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background-80 rounded-lg p-3 flex-1">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-light-blue" />
                      Business Hours
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Monday-Friday:</span>
                        <span>9am-7pm</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday:</span>
                        <span>9am-5pm</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="text-muted-foreground">Closed</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background-80 rounded-lg p-3 flex-1">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-light-blue" />
                      Established
                    </h4>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-2xl font-bold">2025</p>
                        <p className="text-xs text-muted-foreground">Founded by Angel Vavi</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background-80 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium mb-2">Business Overview</h4>
                  <p className="text-sm">
                    Scissors & Style is a premium hair salon located in Downtown Metropolis that specializes in
                    haircuts, coloring, styling, and hair treatments. Founded in 2025 by master stylist Vavi Angel,
                    our mission is to help every client look and feel their best through personalized hair services that
                    enhance their natural beauty.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-background-80 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-light-blue" />
                      Popular Services
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Haircuts</span>
                        <span>Starting at $65</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Color Services</span>
                        <span>Starting at $95</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Styling</span>
                        <span>Starting at $55</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Keratin Treatments</span>
                        <span>$250</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background-80 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-light-blue" />
                      Team Highlights
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Angel Vavi</span>
                          <p className="text-xs text-muted-foreground">Owner/Master Stylist - 15 years experience</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Lady Cashe</span>
                          <p className="text-xs text-muted-foreground">Senior Stylist - 8 years experience</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Cashe is King</span>
                          <p className="text-xs text-muted-foreground">Curl Specialist - 6 years experience</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleCopyTemplate("example", exampleBusinessProfile)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy Full Example
                  </Button>
                  <Button
                    size="sm"
                    className="bg-light-blue hover:bg-light-blue/90 text-white text-xs"
                    onClick={() => handleSelectTemplate(exampleBusinessProfile)}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Use This Example
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] bg-background-90 rounded-lg p-4 border border-background-80">
                <div className="whitespace-pre-wrap text-sm">{exampleBusinessProfile}</div>
              </ScrollArea>

              <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-400 flex items-center mb-2">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Why This Example Works Well
                </h4>
                <ul className="space-y-1 text-xs text-blue-300 list-disc list-inside">
                  <li>Includes comprehensive contact information and business hours</li>
                  <li>Clearly describes services with specific pricing information</li>
                  <li>Highlights team members with their specialties and experience</li>
                  <li>Provides detailed policies for cancellations and satisfaction guarantees</li>
                  <li>Answers common customer questions with thorough responses</li>
                  <li>Includes testimonials that showcase the businesss strengths</li>
                  <li>Mentions unique selling points that differentiate from competitors</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FloatingPanel>
  )
}

export default ThenAction

