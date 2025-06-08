// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { useListener } from "@/hooks/use-automations"
// import { AUTOMATION_LISTENERS } from "@/constants/automation"
// import { SubscriptionPlan } from "../../subscription-plan"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { motion } from "framer-motion"
// import {
//   PlusCircle,
//   MessageSquare,
//   Store,
//   Briefcase,
//   Users,
//   ChevronDown,
//   ChevronRight,
//   Info,
//   FileText,
//   Copy,
//   CheckCheck,
//   Save,
//   Clock,
//   CheckCircle,
//   Loader2,
//   Scissors,
//   MapPin,
//   Phone,
//   Mail,
//   Calendar,
//   DollarSign,
//   Star,
//   Award,
//   Sparkles,
//   ExternalLink,
//   Lightbulb,
// } from "lucide-react"
// import FloatingPanel from "../../panel"
// import ResponseLibrary from "../response"
// import { ContextCard } from "../context"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { saveBusinessProfile } from "@/actions/business"
// import { toast } from "@/hooks/use-toast"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Loader from "../../loader"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// // Business profile template categories
// type TemplateCategory = {
//   id: string
//   name: string
//   icon: React.ReactNode
//   description: string
//   templates: BusinessTemplate[]
// }

// type BusinessTemplate = {
//   id: string
//   title: string
//   description: string
//   content: string
//   tags: string[]
//   example?: string
// }

// const ThenAction = ({
//   id,
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
// }: Props) => {
//   const { onSetListener, listener: Listener, onFormSubmit, register, isPending } = useListener(id)
//   const [showTip, setShowTip] = useState(true)
//   const [selectedTemplate, setSelectedTemplate] = useState<string>("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("comprehensive")
//   const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
//   const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
//   const [showTemplateDetails, setShowTemplateDetails] = useState(false)
//   const [businessProfile, setBusinessProfile] = useState("")
//   const [isSaving, setIsSaving] = useState(false)
//   const [saveSuccess, setSaveSuccess] = useState(false)
//   const [showExample, setShowExample] = useState(false)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   // Message templates (from original component)
//   const messageTemplates = [
//     "Thanks for your comment! We appreciate your feedback.",
//     "Hello! Thanks for reaching out. How can I help you today?",
//     "We're glad you're interested in our products! Would you like more information?",
//     "Thank you for your support! We'd love to hear more about your experience.",
//   ]

//   // AI suggestion examples (from original component)
//   const aiSuggestions = [
//     "Thank them for their comment and ask a follow-up question about their experience",
//     "Offer a personalized discount code based on their comment",
//     "Provide more information about the product they're interested in",
//     "Ask them to share their experience on social media",
//   ]

//   // Example business profile for Scissors & Style salon (placeholder, you'll have the full content)
//   const exampleBusinessProfile = `# Scissors & Style - Complete Business Profile

// ## BASIC INFORMATION
// - Business Name: Scissors & Style
// - Founded: 2018
// - Location: 123 Main Street, Downtown, Metropolis, CA 90210
// - Website: www.scissorsandstyle.com
// - Contact: (555) 123-4567, info@scissorsandstyle.com
// - Business Hours: Monday-Friday: 9am-7pm, Saturday: 9am-5pm, Sunday: Closed
// - Social Media: @ScissorsAndStyle on Instagram, Facebook, and TikTok

// ## BUSINESS OVERVIEW
// Scissors & Style is a premium hair salon located in Downtown Metropolis that specializes in haircuts, coloring, styling, and hair treatments. Founded in 2018 by master stylist Emma Rodriguez, our mission is to help every client look and feel their best through personalized hair services that enhance their natural beauty.

// We serve clients of all ages and hair types, with particular expertise in curly hair, balayage techniques, and precision cuts. What sets us apart from competitors is our commitment to ongoing stylist education, our use of eco-friendly and cruelty-free products, and our relaxing, inclusive salon environment.

// ## PRODUCTS AND SERVICES

// ### Main Offerings:
// 1. Haircuts: Precision cuts tailored to face shape and hair texture - Starting at $65
// 2. Color Services: Full color, highlights, balayage, and ombre techniques - Starting at $95
// 3. Styling: Blowouts, special occasion styling, and updos - Starting at $55

// ### Specialty Services:
// - Curly Hair Treatments: Specialized cuts and styling for all curl patterns - $85
// - Keratin Treatments: Smoothing services for frizz reduction - $250
// - Hair Extensions: Premium quality extensions for length and volume - $350+

// ### Packages and Promotions:
// - New Client Special: 15% off first service - Available year-round
// - Bridal Package: Trial styling, day-of styling for bride and up to 3 attendants - $450
// - Color Maintenance: Book color and cut together and save 10%

// ## BOOKING AND APPOINTMENTS
// - Booking Methods: Online through website, Phone, Instagram DM
// - Booking Website: www.scissorsandstyle.com/book
// - Typical Appointment Duration: 45-90 minutes depending on service
// - Cancellation Policy: 24-hour notice required or 50% charge applies

// ## TEAM INFORMATION
// Our team consists of 8 professionals with expertise in cutting, coloring, and styling.

// Key team members:
// - Emma Rodriguez: Owner/Master Stylist - Specializes in precision cuts and balayage, 15 years experience
// - James Chen: Senior Stylist - Specializes in vivid colors and avant-garde styles, 8 years experience
// - Sophia Williams: Curl Specialist - Certified in DevaCurl and Ouidad techniques, 6 years experience

// ## CUSTOMER EXPERIENCE
// - What to expect during your visit: Complimentary consultation, relaxing scalp massage with shampoo, styling tutorial
// - Amenities provided: Complimentary beverages (coffee, tea, infused water), free WiFi, charging stations
// - Accessibility features: Wheelchair accessible entrance and washrooms, fragrance-free options available

// ## POLICIES
// - Payment Methods: Credit/debit cards, Apple Pay, Google Pay, Cash
// - Refund Policy: We don't offer refunds, but will gladly fix any service you're unhappy with within 7 days
// - Satisfaction Guarantee: If you're not completely satisfied, we'll adjust your cut or color within one week at no charge
// - COVID-19/Health Protocols: Enhanced sanitization, optional mask wearing, contactless payment options

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: How far in advance should I book an appointment?
//    A: We recommend booking 1-2 weeks in advance for regular services, and 3-4 weeks for special occasions or with our most requested stylists.

// 2. Q: Do you provide consultations before services?
//    A: Yes, every service includes a complimentary consultation to discuss your hair goals, maintenance requirements, and styling preferences.

// 3. Q: What happens if I'm late for my appointment?
//    A: If you're more than 15 minutes late, we may need to reschedule or modify your service depending on the day's schedule. Please call ahead if you're running late.

// 4. Q: Do you offer gift certificates?
//    A: Yes! Gift certificates are available for purchase in-salon or through our website and never expire.

// 5. Q: What should I do if I'm not satisfied with my service?
//    A: Please let us know within 7 days, and we'll schedule a complimentary adjustment appointment to make it right.

// ## TESTIMONIALS AND REVIEWS
// - "Emma transformed my dull, lifeless hair into the most gorgeous, dimensional color I've ever had. The entire experience at Scissors & Style is luxurious from start to finish." - Maria J.
// - "As someone with 3C curls, I've struggled to find stylists who understand my hair. Sophia at Scissors & Style not only gave me the best cut of my life but taught me how to style it at home!" - Jamal T.
// - "The attention to detail at this salon is unmatched. From the thorough consultation to the amazing head massage to the styling tips - everything is perfect." - Alexis P.

// ## COMMUNITY AND VALUES
// - Our values: Inclusivity, Sustainability, Continuous Education, Client-Centered Service
// - Community involvement: Monthly free haircuts for job seekers, annual fundraiser for local women's shelter
// - Sustainability practices: Eco-friendly product lines, recycling program for color tubes and foils, water-saving fixtures

// ## ADDITIONAL INFORMATION
// - Parking information: Street parking available, validated parking at Downtown Garage (2 hours free)
// - Nearby landmarks: Across from Central Park, two blocks from Metropolis Museum of Art
// - Public transportation access: Bus routes 10 and 14 stop directly in front, Metro Blue Line is 3 blocks away`

//   // Business profile template categories
//   const templateCategories: TemplateCategory[] = [
//     {
//       id: "comprehensive",
//       name: "Comprehensive Profile",
//       icon: <Briefcase className="h-4 w-4" />,
//       description: "Complete business information",
//       templates: [
//         {
//           id: "full-business-profile",
//           title: "Complete Business Profile",
//           description: "All-in-one comprehensive business information",
//           tags: ["complete", "all-in-one"],
//           content: `# [BUSINESS_NAME] - Complete Business Profile

// ## BASIC INFORMATION
// - Business Name: [BUSINESS_NAME]
// - Founded: [YEAR]
// - Location: [FULL_ADDRESS]
// - Website: [WEBSITE_URL]
// - Contact: [PHONE], [EMAIL]
// - Business Hours: [HOURS_OF_OPERATION] (e.g., Monday-Friday: 9am-6pm, Saturday: 10am-4pm, Sunday: Closed)
// - Social Media: [SOCIAL_MEDIA_LINKS]

// ## BUSINESS OVERVIEW
// [BUSINESS_NAME] is a [TYPE_OF_BUSINESS] located in [CITY/LOCATION] that specializes in [PRIMARY_SERVICES/PRODUCTS]. Founded in [YEAR] by [FOUNDER_NAMES], our mission is to [MISSION_STATEMENT].

// We serve [TARGET_AUDIENCE] by providing [VALUE_PROPOSITION]. What sets us apart from competitors is our [UNIQUE_SELLING_POINTS], including [SPECIFIC_ADVANTAGE_1], [SPECIFIC_ADVANTAGE_2], and [SPECIFIC_ADVANTAGE_3].

// ## PRODUCTS AND SERVICES

// ### Main Offerings:
// 1. [SERVICE/PRODUCT_1]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]
// 2. [SERVICE/PRODUCT_2]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]
// 3. [SERVICE/PRODUCT_3]: [DETAILED_DESCRIPTION] - Starting at $[PRICE]

// ### Specialty Services:
// - [SPECIALTY_SERVICE_1]: [DESCRIPTION] - $[PRICE]
// - [SPECIALTY_SERVICE_2]: [DESCRIPTION] - $[PRICE]

// ### Packages and Promotions:
// - [PACKAGE_NAME_1]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - $[PRICE]
// - [PROMOTION_1]: [DESCRIPTION] - Available [TIMEFRAME]

// ## BOOKING AND APPOINTMENTS
// - Booking Methods: [BOOKING_METHODS] (e.g., Online, Phone, Walk-in)
// - Booking Website/App: [BOOKING_URL]
// - Typical Appointment Duration: [DURATION]
// - Cancellation Policy: [CANCELLATION_POLICY]

// ## TEAM INFORMATION
// Our team consists of [NUMBER] professionals with expertise in [AREAS_OF_EXPERTISE].

// Key team members:
// - [NAME_1]: [POSITION] - [BRIEF_BIO/SPECIALTIES]
// - [NAME_2]: [POSITION] - [BRIEF_BIO/SPECIALTIES]
// - [NAME_3]: [POSITION] - [BRIEF_BIO/SPECIALTIES]

// ## CUSTOMER EXPERIENCE
// - What to expect during your visit: [CUSTOMER_JOURNEY]
// - Amenities provided: [AMENITIES]
// - Accessibility features: [ACCESSIBILITY_INFORMATION]

// ## POLICIES
// - Payment Methods: [PAYMENT_METHODS]
// - Refund Policy: [REFUND_POLICY]
// - Satisfaction Guarantee: [GUARANTEE_DETAILS]
// - COVID-19/Health Protocols: [HEALTH_PROTOCOLS]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: [COMMON_QUESTION_1]?
//    A: [DETAILED_ANSWER_1]

// 2. Q: [COMMON_QUESTION_2]?
//    A: [DETAILED_ANSWER_2]

// 3. Q: [COMMON_QUESTION_3]?
//    A: [DETAILED_ANSWER_3]

// 4. Q: [COMMON_QUESTION_4]?
//    A: [DETAILED_ANSWER_4]

// 5. Q: [COMMON_QUESTION_5]?
//    A: [DETAILED_ANSWER_5]

// ## TESTIMONIALS AND REVIEWS
// - "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
// - "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
// - "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

// ## COMMUNITY AND VALUES
// - Our values: [COMPANY_VALUES]
// - Community involvement: [COMMUNITY_INITIATIVES]
// - Sustainability practices: [SUSTAINABILITY_EFFORTS]

// ## ADDITIONAL INFORMATION
// - Parking information: [PARKING_DETAILS]
// - Nearby landmarks: [NEARBY_LANDMARKS]
// - Public transportation access: [PUBLIC_TRANSPORTATION]`,
//           example: exampleBusinessProfile,
//         },
//       ],
//     },
//     {
//       id: "service",
//       name: "Service Business",
//       icon: <Store className="h-4 w-4" />,
//       description: "For service-based businesses",
//       templates: [
//         {
//           id: "salon-spa-template",
//           title: "Salon/Spa Business Profile",
//           description: "Detailed template for salons, spas, and beauty businesses",
//           tags: ["salon", "spa", "beauty"],
//           content: `# [SALON_NAME] - Beauty Business Profile

// ## BASIC INFORMATION
// - Business Name: [SALON_NAME]
// - Type of Business: [TYPE] (e.g., Hair Salon, Full-Service Spa, Nail Salon, Barbershop)
// - Founded: [YEAR]
// - Location: [FULL_ADDRESS]
// - Contact: [PHONE], [EMAIL]
// - Website: [WEBSITE_URL]
// - Business Hours: 
//   - Monday: [HOURS]
//   - Tuesday: [HOURS]
//   - Wednesday: [HOURS]
//   - Thursday: [HOURS]
//   - Friday: [HOURS]
//   - Saturday: [HOURS]
//   - Sunday: [HOURS]
// - Social Media: [INSTAGRAM], [FACEBOOK], [TIKTOK], etc.

// ## BUSINESS OVERVIEW
// [SALON_NAME] is a [PREMIUM/AFFORDABLE/LUXURY] [TYPE_OF_SALON] located in [CITY/LOCATION] that specializes in [PRIMARY_SERVICES]. Founded in [YEAR] by [FOUNDER_NAMES], we are committed to [MISSION_STATEMENT].

// Our salon is known for [UNIQUE_SELLING_POINTS] and we pride ourselves on [SPECIAL_APPROACH]. We serve a clientele of [TARGET_AUDIENCE] and have built our reputation on [KEY_REPUTATION_FACTORS].

// ## SERVICES AND PRICING

// ### Hair Services:
// - Women's Haircut: $[PRICE] - [DURATION]
// - Men's Haircut: $[PRICE] - [DURATION]
// - Children's Haircut: $[PRICE] - [DURATION]
// - Color Services: $[PRICE_RANGE] - [DURATION_RANGE]
// - Highlights/Balayage: $[PRICE_RANGE] - [DURATION_RANGE]
// - Blowout/Styling: $[PRICE] - [DURATION]
// - Hair Treatments: $[PRICE_RANGE] - [DURATION_RANGE]

// ### Spa/Facial Services:
// - Basic Facial: $[PRICE] - [DURATION]
// - Premium Facial: $[PRICE] - [DURATION]
// - Specialty Treatments: $[PRICE_RANGE] - [DURATION_RANGE]

// ### Nail Services:
// - Manicure: $[PRICE] - [DURATION]
// - Pedicure: $[PRICE] - [DURATION]
// - Gel/Shellac: $[PRICE] - [DURATION]
// - Nail Art: $[PRICE_RANGE]

// ### Additional Services:
// - Waxing: $[PRICE_RANGE]
// - Massage: $[PRICE_RANGE] - [DURATION_RANGE]
// - Makeup Application: $[PRICE_RANGE] - [DURATION_RANGE]

// ### Packages and Specials:
// - [PACKAGE_NAME]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - $[PRICE]
// - Bridal Packages: [DESCRIPTION] - $[PRICE_RANGE]
// - First-Time Client Special: [DESCRIPTION] - $[PRICE]

// ## BOOKING AND APPOINTMENTS
// - Booking Methods: [BOOKING_METHODS] (e.g., Online, Phone, Walk-in)
// - Booking Website/App: [BOOKING_URL]
// - Deposit Required: [YES/NO] - $[AMOUNT]
// - Cancellation Policy: [CANCELLATION_POLICY] (e.g., 24-hour notice required or 50% charge)

// ## STYLISTS AND STAFF
// Our team consists of [NUMBER] professionals with expertise in [AREAS_OF_EXPERTISE].

// Featured stylists:
// - [STYLIST_NAME_1]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience
// - [STYLIST_NAME_2]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience
// - [STYLIST_NAME_3]: [SPECIALTIES] - [EXPERIENCE_YEARS] years experience

// ## PRODUCTS AND RETAIL
// We proudly use and sell the following professional brands:
// - [BRAND_1]: [TYPES_OF_PRODUCTS]
// - [BRAND_2]: [TYPES_OF_PRODUCTS]
// - [BRAND_3]: [TYPES_OF_PRODUCTS]

// ## CLIENT EXPERIENCE
// - What to expect during your visit: [CUSTOMER_JOURNEY]
// - Amenities provided: [AMENITIES] (e.g., Complimentary beverages, WiFi)
// - Preparation tips: [PREPARATION_TIPS]

// ## POLICIES
// - Payment Methods: [PAYMENT_METHODS]
// - Tipping Policy: [TIPPING_POLICY]
// - Refund Policy: [REFUND_POLICY]
// - Children Policy: [CHILDREN_POLICY]
// - Health and Safety Protocols: [HEALTH_PROTOCOLS]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: How far in advance should I book an appointment?
//    A: [ANSWER]

// 2. Q: Do you provide consultations before services?
//    A: [ANSWER]

// 3. Q: What happens if I'm late for my appointment?
//    A: [ANSWER]

// 4. Q: Do you offer gift certificates?
//    A: [ANSWER]

// 5. Q: What should I do if I'm not satisfied with my service?
//    A: [ANSWER]

// ## TESTIMONIALS
// - "[TESTIMONIAL_1]" - [CLIENT_NAME_1]
// - "[TESTIMONIAL_2]" - [CLIENT_NAME_2]
// - "[TESTIMONIAL_3]" - [CLIENT_NAME_3]`,
//           example: exampleBusinessProfile,
//         },
//         {
//           id: "restaurant-template",
//           title: "Restaurant/Café Profile",
//           description: "Comprehensive template for food service businesses",
//           tags: ["restaurant", "café", "food"],
//           content: `# [RESTAURANT_NAME] - Food Business Profile

// ## BASIC INFORMATION
// - Business Name: [RESTAURANT_NAME]
// - Type of Establishment: [TYPE] (e.g., Fine Dining, Casual Restaurant, Café, Bistro, Food Truck)
// - Cuisine: [CUISINE_TYPE]
// - Founded: [YEAR]
// - Location: [FULL_ADDRESS]
// - Contact: [PHONE], [EMAIL]
// - Website: [WEBSITE_URL]
// - Hours of Operation:
//   - Monday: [HOURS]
//   - Tuesday: [HOURS]
//   - Wednesday: [HOURS]
//   - Thursday: [HOURS]
//   - Friday: [HOURS]
//   - Saturday: [HOURS]
//   - Sunday: [HOURS]
// - Social Media: [INSTAGRAM], [FACEBOOK], [TWITTER], etc.

// ## RESTAURANT OVERVIEW
// [RESTAURANT_NAME] is a [DESCRIPTION_OF_AMBIANCE] [TYPE_OF_RESTAURANT] located in [CITY/LOCATION] that specializes in [CUISINE_TYPE] cuisine. Founded in [YEAR] by [FOUNDER_NAMES/CHEF], we offer [UNIQUE_SELLING_PROPOSITION].

// Our restaurant is known for [SIGNATURE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We source our ingredients from [SOURCING_INFORMATION] and prioritize [VALUES_LIKE_SUSTAINABILITY/LOCAL_SOURCING].

// ## MENU HIGHLIGHTS

// ### Appetizers:
// - [APPETIZER_1]: [DESCRIPTION] - $[PRICE]
// - [APPETIZER_2]: [DESCRIPTION] - $[PRICE]
// - [APPETIZER_3]: [DESCRIPTION] - $[PRICE]

// ### Main Courses:
// - [MAIN_DISH_1]: [DESCRIPTION] - $[PRICE]
// - [MAIN_DISH_2]: [DESCRIPTION] - $[PRICE]
// - [MAIN_DISH_3]: [DESCRIPTION] - $[PRICE]

// ### Signature Dishes:
// - [SIGNATURE_DISH_1]: [DETAILED_DESCRIPTION] - $[PRICE]
// - [SIGNATURE_DISH_2]: [DETAILED_DESCRIPTION] - $[PRICE]

// ### Desserts:
// - [DESSERT_1]: [DESCRIPTION] - $[PRICE]
// - [DESSERT_2]: [DESCRIPTION] - $[PRICE]

// ### Beverages:
// - [BEVERAGE_CATEGORY_1] (e.g., Wines, Cocktails, Coffee): [OPTIONS_AND_PRICE_RANGE]
// - [BEVERAGE_CATEGORY_2]: [OPTIONS_AND_PRICE_RANGE]

// ### Special Menus:
// - [SPECIAL_MENU_1] (e.g., Tasting Menu, Prix Fixe): [DESCRIPTION] - $[PRICE]
// - Seasonal Offerings: [CURRENT_SEASONAL_ITEMS]
// - Dietary Accommodations: [VEGETARIAN/VEGAN/GLUTEN-FREE_OPTIONS]

// ## DINING EXPERIENCE
// - Seating Capacity: [NUMBER_OF_SEATS]
// - Dining Areas: [TYPES_OF_SEATING] (e.g., Main Dining Room, Bar, Outdoor Patio)
// - Ambiance: [AMBIANCE_DESCRIPTION]
// - Dress Code: [DRESS_CODE]
// - Average Dining Time: [DURATION]
// - Special Features: [UNIQUE_FEATURES] (e.g., Open Kitchen, Chef's Table, Live Music)

// ## RESERVATIONS AND POLICIES
// - Reservation Methods: [BOOKING_METHODS] (e.g., Online, Phone)
// - Reservation Website/App: [BOOKING_URL]
// - Large Party Accommodations: [LARGE_PARTY_POLICY]
// - Cancellation Policy: [CANCELLATION_POLICY]
// - Corkage Fee: [FEE_AMOUNT]
// - Private Events: [PRIVATE_EVENT_INFORMATION]

// ## TEAM
// - Head Chef: [CHEF_NAME] - [BRIEF_BIO/BACKGROUND]
// - Key Staff: [OTHER_KEY_STAFF_MEMBERS]

// ## ADDITIONAL SERVICES
// - Takeout/Delivery: [AVAILABILITY_AND_PLATFORMS]
// - Catering: [CATERING_INFORMATION]
// - Gift Cards: [GIFT_CARD_INFORMATION]
// - Loyalty Program: [PROGRAM_DETAILS]

// ## POLICIES
// - Payment Methods: [PAYMENT_METHODS]
// - Tipping Policy: [TIPPING_POLICY]
// - Children Policy: [CHILDREN_POLICY]
// - Pet Policy: [PET_POLICY]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: Do you take reservations?
//    A: [ANSWER]

// 2. Q: Is there parking available?
//    A: [ANSWER]

// 3. Q: Can you accommodate dietary restrictions?
//    A: [ANSWER]

// 4. Q: Do you have a corkage policy?
//    A: [ANSWER]

// 5. Q: What's your policy on celebrations (birthdays, anniversaries)?
//    A: [ANSWER]

// ## REVIEWS AND ACCOLADES
// - "[REVIEW_QUOTE_1]" - [PUBLICATION/CRITIC_1]
// - "[REVIEW_QUOTE_2]" - [PUBLICATION/CRITIC_2]
// - Awards: [LIST_OF_AWARDS_AND_RECOGNITIONS]

// ## LOCATION INFORMATION
// - Parking: [PARKING_INFORMATION]
// - Public Transportation: [PUBLIC_TRANSPORTATION_ACCESS]
// - Nearby Landmarks: [NEARBY_LANDMARKS]`,
//         },
//       ],
//     },
//     {
//       id: "retail",
//       name: "Retail Business",
//       icon: <Store className="h-4 w-4" />,
//       description: "For product-based businesses",
//       templates: [
//         {
//           id: "retail-store-template",
//           title: "Retail Store Profile",
//           description: "Comprehensive template for retail businesses",
//           tags: ["retail", "store", "products"],
//           content: `# [STORE_NAME] - Retail Business Profile

// ## BASIC INFORMATION
// - Business Name: [STORE_NAME]
// - Type of Store: [TYPE] (e.g., Clothing Boutique, Electronics Store, Bookstore, Home Goods)
// - Founded: [YEAR]
// - Location(s): [LIST_OF_LOCATIONS_WITH_ADDRESSES]
// - Contact: [PHONE], [EMAIL]
// - Website: [WEBSITE_URL]
// - Store Hours:
//   - Monday: [HOURS]
//   - Tuesday: [HOURS]
//   - Wednesday: [HOURS]
//   - Thursday: [HOURS]
//   - Friday: [HOURS]
//   - Saturday: [HOURS]
//   - Sunday: [HOURS]
// - Social Media: [INSTAGRAM], [FACEBOOK], [PINTEREST], etc.

// ## BUSINESS OVERVIEW
// [STORE_NAME] is a [DESCRIPTION] retail store located in [CITY/LOCATION] that specializes in [PRODUCT_CATEGORIES]. Founded in [YEAR] by [FOUNDER_NAMES], we offer [UNIQUE_SELLING_PROPOSITION].

// Our store is known for [UNIQUE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We cater to [TARGET_AUDIENCE] looking for [CUSTOMER_NEEDS_MET].

// ## PRODUCT OFFERINGS

// ### Main Product Categories:
// 1. [CATEGORY_1]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// 2. [CATEGORY_2]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// 3. [CATEGORY_3]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// ### Featured Brands:
// - [BRAND_1]: [TYPES_OF_PRODUCTS]
// - [BRAND_2]: [TYPES_OF_PRODUCTS]
// - [BRAND_3]: [TYPES_OF_PRODUCTS]

// ### Exclusive Products:
// - [EXCLUSIVE_PRODUCT_1]: [DESCRIPTION] - $[PRICE]
// - [EXCLUSIVE_PRODUCT_2]: [DESCRIPTION] - $[PRICE]

// ### Seasonal Collections:
// - Current Season ([SEASON/YEAR]): [DESCRIPTION_OF_COLLECTION]
// - Upcoming Collections: [PREVIEW_INFORMATION]

// ## SHOPPING EXPERIENCE
// - Store Layout: [DESCRIPTION_OF_LAYOUT]
// - Customer Service Offerings: [SERVICES_PROVIDED]
// - Personal Shopping/Assistance: [AVAILABILITY_AND_DETAILS]
// - In-Store Events: [TYPES_OF_EVENTS_HOSTED]
// - Special Amenities: [AMENITIES] (e.g., Fitting Rooms, Refreshments, Seating Areas)

// ## PURCHASING OPTIONS
// - In-Store Shopping: [DETAILS]
// - Online Shopping: [WEBSITE_URL]
// - Buy Online, Pick Up In-Store (BOPIS): [AVAILABILITY_AND_PROCESS]
// - Shipping Options: [SHIPPING_METHODS_AND_TIMEFRAMES]
// - International Shipping: [AVAILABILITY_AND_RESTRICTIONS]

// ## POLICIES
// - Return Policy: [RETURN_POLICY_DETAILS]
// - Exchange Policy: [EXCHANGE_POLICY_DETAILS]
// - Payment Methods: [ACCEPTED_PAYMENT_METHODS]
// - Gift Receipts: [GIFT_RECEIPT_POLICY]
// - Price Matching: [PRICE_MATCH_POLICY]
// - Layaway/Financing: [AVAILABLE_OPTIONS]

// ## LOYALTY AND REWARDS
// - Loyalty Program: [PROGRAM_NAME_AND_DETAILS]
// - Rewards Structure: [HOW_REWARDS_ARE_EARNED]
// - Member Benefits: [SPECIAL_PERKS_FOR_MEMBERS]
// - How to Join: [SIGNUP_PROCESS]

// ## GIFT OPTIONS
// - Gift Cards: [GIFT_CARD_OPTIONS]
// - Gift Wrapping: [GIFT_WRAP_SERVICES_AND_COST]
// - Corporate Gifting: [CORPORATE_GIFT_PROGRAMS]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: What is your return policy?
//    A: [ANSWER]

// 2. Q: Do you offer alterations or customization?
//    A: [ANSWER]

// 3. Q: How can I check if an item is in stock?
//    A: [ANSWER]

// 4. Q: Do you ship internationally?
//    A: [ANSWER]

// 5. Q: How do I redeem loyalty points?
//    A: [ANSWER]

// ## CUSTOMER TESTIMONIALS
// - "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
// - "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
// - "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

// ## STORE LOCATION DETAILS
// - Parking: [PARKING_INFORMATION]
// - Public Transportation: [PUBLIC_TRANSPORTATION_ACCESS]
// - Nearby Landmarks: [NEARBY_LANDMARKS]
// - Accessibility Features: [ACCESSIBILITY_INFORMATION]

// ## COMPANY VALUES
// - Sustainability Practices: [SUSTAINABILITY_INITIATIVES]
// - Community Involvement: [COMMUNITY_PROGRAMS]
// - Ethical Sourcing: [ETHICAL_SOURCING_POLICIES]`,
//         },
//         {
//           id: "ecommerce-template",
//           title: "E-Commerce Business Profile",
//           description: "Detailed template for online retail businesses",
//           tags: ["ecommerce", "online", "digital"],
//           content: `# [BUSINESS_NAME] - E-Commerce Business Profile

// ## BASIC INFORMATION
// - Business Name: [BUSINESS_NAME]
// - Type of E-Commerce: [TYPE] (e.g., Direct-to-Consumer Brand, Marketplace, Subscription Service)
// - Founded: [YEAR]
// - Headquarters: [LOCATION]
// - Contact: [EMAIL], [PHONE]
// - Website: [WEBSITE_URL]
// - Customer Service Hours: [HOURS_OF_OPERATION]
// - Social Media: [INSTAGRAM], [FACEBOOK], [TWITTER], [TIKTOK], etc.

// ## BUSINESS OVERVIEW
// [BUSINESS_NAME] is an [ONLINE_RETAIL_TYPE] that specializes in [PRODUCT_CATEGORIES]. Founded in [YEAR] by [FOUNDER_NAMES], we offer [UNIQUE_SELLING_PROPOSITION].

// Our online store is known for [UNIQUE_ASPECTS] and we pride ourselves on [SPECIAL_APPROACH]. We serve [TARGET_AUDIENCE] by providing [VALUE_PROPOSITION].

// ## PRODUCT OFFERINGS

// ### Main Product Categories:
// 1. [CATEGORY_1]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// 2. [CATEGORY_2]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// 3. [CATEGORY_3]:
//    - [PRODUCT_TYPE_1]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_2]: [PRICE_RANGE]
//    - [PRODUCT_TYPE_3]: [PRICE_RANGE]

// ### Bestsellers:
// - [BESTSELLER_1]: [DESCRIPTION] - $[PRICE]
// - [BESTSELLER_2]: [DESCRIPTION] - $[PRICE]
// - [BESTSELLER_3]: [DESCRIPTION] - $[PRICE]

// ### New Arrivals:
// - [NEW_PRODUCT_1]: [DESCRIPTION] - $[PRICE]
// - [NEW_PRODUCT_2]: [DESCRIPTION] - $[PRICE]

// ### Collections/Lines:
// - [COLLECTION_1]: [DESCRIPTION_OF_COLLECTION]
// - [COLLECTION_2]: [DESCRIPTION_OF_COLLECTION]

// ## ONLINE SHOPPING EXPERIENCE
// - Website Features: [KEY_WEBSITE_FEATURES]
// - Mobile App: [APP_AVAILABILITY_AND_FEATURES]
// - Product Customization: [CUSTOMIZATION_OPTIONS]
// - Virtual Try-On/AR Features: [VIRTUAL_FEATURES]
// - Customer Account Benefits: [ACCOUNT_PERKS]

// ## ORDERING AND FULFILLMENT
// - Ordering Process: [STEP_BY_STEP_PROCESS]
// - Payment Methods: [ACCEPTED_PAYMENT_METHODS]
// - Shipping Options:
//   - Standard Shipping: [TIMEFRAME] - $[COST]
//   - Expedited Shipping: [TIMEFRAME] - $[COST]
//   - International Shipping: [COUNTRIES_SERVED] - [TIMEFRAME] - $[COST]
// - Free Shipping Threshold: $[AMOUNT]
// - Order Tracking: [TRACKING_PROCESS]
// - Fulfillment Partners: [FULFILLMENT_CENTERS/PARTNERS]

// ## POLICIES
// - Return Policy: [RETURN_POLICY_DETAILS]
// - Refund Process: [REFUND_PROCESS_AND_TIMEFRAME]
// - Exchange Policy: [EXCHANGE_POLICY_DETAILS]
// - Warranty Information: [WARRANTY_DETAILS]
// - Privacy Policy: [KEY_PRIVACY_POLICY_POINTS]
// - Terms of Service: [KEY_TERMS_POINTS]

// ## CUSTOMER SUPPORT
// - Support Channels: [EMAIL], [LIVE_CHAT], [PHONE], [SOCIAL_MEDIA]
// - Response Time: [TYPICAL_RESPONSE_TIME]
// - Self-Service Options: [HELP_CENTER/FAQ_RESOURCES]
// - Return/Exchange Process: [PROCESS_DETAILS]

// ## LOYALTY AND PROMOTIONS
// - Loyalty Program: [PROGRAM_NAME_AND_DETAILS]
// - Rewards Structure: [HOW_REWARDS_ARE_EARNED]
// - Promotional Emails: [FREQUENCY_AND_CONTENT]
// - Referral Program: [REFERRAL_PROGRAM_DETAILS]
// - Discount Codes: [TYPICAL_DISCOUNTS_OFFERED]
// - Sale Events: [MAJOR_SALE_PERIODS]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: How long will shipping take?
//    A: [ANSWER]

// 2. Q: What is your return policy?
//    A: [ANSWER]

// 3. Q: Do you ship internationally?
//    A: [ANSWER]

// 4. Q: How can I track my order?
//    A: [ANSWER]

// 5. Q: Are my payment details secure?
//    A: [ANSWER]

// ## CUSTOMER TESTIMONIALS
// - "[TESTIMONIAL_1]" - [CUSTOMER_NAME_1]
// - "[TESTIMONIAL_2]" - [CUSTOMER_NAME_2]
// - "[TESTIMONIAL_3]" - [CUSTOMER_NAME_3]

// ## COMPANY VALUES AND PRACTICES
// - Sustainability Initiatives: [SUSTAINABILITY_PRACTICES]
// - Ethical Sourcing: [ETHICAL_SOURCING_POLICIES]
// - Packaging Approach: [PACKAGING_DETAILS]
// - Carbon Offset Programs: [CARBON_OFFSET_INITIATIVES]
// - Charitable Partnerships: [CHARITY_AFFILIATIONS]

// ## TECHNICAL INFORMATION
// - Website Platform: [E-COMMERCE_PLATFORM]
// - Payment Processing: [PAYMENT_PROCESSORS]
// - Security Certifications: [SECURITY_FEATURES]
// - Device Compatibility: [SUPPORTED_DEVICES]
// - Accessibility Features: [ACCESSIBILITY_INFORMATION]`,
//         },
//       ],
//     },
//     {
//       id: "professional",
//       name: "Professional Services",
//       icon: <Briefcase className="h-4 w-4" />,
//       description: "For service professionals",
//       templates: [
//         {
//           id: "consulting-template",
//           title: "Consulting/Professional Services",
//           description: "Template for consulting and professional service firms",
//           tags: ["consulting", "professional", "services"],
//           content: `# [FIRM_NAME] - Professional Services Profile

// ## BASIC INFORMATION
// - Business Name: [FIRM_NAME]
// - Type of Practice: [TYPE] (e.g., Management Consulting, Legal Services, Accounting, Financial Advisory)
// - Founded: [YEAR]
// - Location(s): [LIST_OF_OFFICE_LOCATIONS]
// - Contact: [PHONE], [EMAIL]
// - Website: [WEBSITE_URL]
// - Business Hours: [HOURS_OF_OPERATION]
// - Social Media: [LINKEDIN], [TWITTER], etc.

// ## FIRM OVERVIEW
// [FIRM_NAME] is a [TYPE_OF_FIRM] that specializes in providing [PRIMARY_SERVICES] to [TARGET_CLIENTS]. Founded in [YEAR] by [FOUNDER_NAMES], we have established ourselves as [MARKET_POSITION] in the [INDUSTRY/SECTOR] space.

// Our firm is built on the principles of [CORE_VALUES] and we are committed to [MISSION_STATEMENT]. We differentiate ourselves through [UNIQUE_SELLING_POINTS], including [SPECIFIC_ADVANTAGE_1], [SPECIFIC_ADVANTAGE_2], and [SPECIFIC_ADVANTAGE_3].

// ## SERVICES OFFERED

// ### Core Service Areas:
// 1. [SERVICE_AREA_1]:
//    - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

// 2. [SERVICE_AREA_2]:
//    - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

// 3. [SERVICE_AREA_3]:
//    - [SPECIFIC_SERVICE_1]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_2]: [BRIEF_DESCRIPTION]
//    - [SPECIFIC_SERVICE_3]: [BRIEF_DESCRIPTION]

// ### Specialized Offerings:
// - [SPECIALIZED_SERVICE_1]: [DETAILED_DESCRIPTION]
// - [SPECIALIZED_SERVICE_2]: [DETAILED_DESCRIPTION]

// ### Service Packages:
// - [PACKAGE_NAME_1]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - [PRICING_MODEL]
// - [PACKAGE_NAME_2]: [DESCRIPTION_OF_WHAT'S_INCLUDED] - [PRICING_MODEL]

// ## EXPERTISE AND METHODOLOGY
// - Areas of Expertise: [LIST_OF_SPECIALIZATIONS]
// - Methodologies Used: [METHODOLOGIES/FRAMEWORKS]
// - Research Capabilities: [RESEARCH_RESOURCES]
// - Technology/Tools Utilized: [SPECIALIZED_TOOLS]
// - Certifications/Accreditations: [RELEVANT_CERTIFICATIONS]

// ## TEAM INFORMATION
// Our team consists of [NUMBER] professionals with expertise across [AREAS_OF_EXPERTISE].

// Key team members:
// - [NAME_1]: [POSITION] - [CREDENTIALS/BACKGROUND]
// - [NAME_2]: [POSITION] - [CREDENTIALS/BACKGROUND]
// - [NAME_3]: [POSITION] - [CREDENTIALS/BACKGROUND]

// ## CLIENT ENGAGEMENT PROCESS
// 1. Initial Consultation: [DESCRIPTION_OF_PROCESS]
// 2. Needs Assessment: [DESCRIPTION_OF_PROCESS]
// 3. Proposal Development: [DESCRIPTION_OF_PROCESS]
// 4. Service Delivery: [DESCRIPTION_OF_PROCESS]
// 5. Evaluation and Follow-up: [DESCRIPTION_OF_PROCESS]

// ## PRICING AND BILLING
// - Fee Structure: [FEE_STRUCTURE] (e.g., Hourly Rates, Project-Based, Retainer)
// - Rate Ranges: [RATE_RANGES]
// - Billing Cycle: [BILLING_FREQUENCY]
// - Payment Terms: [PAYMENT_TERMS]
// - Accepted Payment Methods: [PAYMENT_METHODS]

// ## CLIENT RELATIONSHIPS
// - Types of Clients Served: [CLIENT_TYPES]
// - Industries Served: [INDUSTRIES]
// - Client Onboarding Process: [ONBOARDING_PROCESS]
// - Ongoing Communication: [COMMUNICATION_PRACTICES]
// - Confidentiality Practices: [CONFIDENTIALITY_APPROACH]

// ## CASE STUDIES AND SUCCESS STORIES
// 1. [CLIENT_TYPE_1] Success Story:
//    - Challenge: [PROBLEM_FACED]
//    - Solution: [SOLUTION_PROVIDED]
//    - Results: [MEASURABLE_OUTCOMES]

// 2. [CLIENT_TYPE_2] Success Story:
//    - Challenge: [PROBLEM_FACED]
//    - Solution: [SOLUTION_PROVIDED]
//    - Results: [MEASURABLE_OUTCOMES]

// ## POLICIES
// - Confidentiality Policy: [CONFIDENTIALITY_POLICY]
// - Conflict of Interest Policy: [CONFLICT_POLICY]
// - Quality Assurance: [QA_PROCESSES]
// - Client Rights: [CLIENT_RIGHTS]
// - Termination Policy: [TERMINATION_TERMS]

// ## FREQUENTLY ASKED QUESTIONS
// 1. Q: How do you typically structure your engagements?
//    A: [ANSWER]

// 2. Q: What industries do you specialize in?
//    A: [ANSWER]

// 3. Q: How do you measure success in your projects?
//    A: [ANSWER]

// 4. Q: What is your typical timeline for [COMMON_SERVICE]?
//    A: [ANSWER]

// 5. Q: How do you stay current in your field?
//    A: [ANSWER]

// ## TESTIMONIALS
// - "[TESTIMONIAL_1]" - [CLIENT_NAME_1], [CLIENT_POSITION_1] at [CLIENT_COMPANY_1]
// - "[TESTIMONIAL_2]" - [CLIENT_NAME_2], [CLIENT_POSITION_2] at [CLIENT_COMPANY_2]
// - "[TESTIMONIAL_3]" - [CLIENT_NAME_3], [CLIENT_POSITION_3] at [CLIENT_COMPANY_3]

// ## THOUGHT LEADERSHIP
// - Publications: [NOTABLE_PUBLICATIONS]
// - Speaking Engagements: [SPEAKING_EVENTS]
// - Research Initiatives: [RESEARCH_PROJECTS]
// - Industry Contributions: [INDUSTRY_CONTRIBUTIONS]

// ## PROFESSIONAL NETWORKS
// - Professional Associations: [ASSOCIATION_MEMBERSHIPS]
// - Strategic Partnerships: [KEY_PARTNERSHIPS]
// - Community Involvement: [COMMUNITY_INITIATIVES]`,
//         },
//       ],
//     },
//   ]


//   // Handle saving business profile to database
//   const handleSaveProfile = async () => {
//     if (!businessProfile.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter or select a business profile before saving",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSaving(true)
//     try {
//       const result = await saveBusinessProfile({
//         automationId: id,
//         content: businessProfile,
//       })

//       if (result.success) {
//         setSaveSuccess(true)
//         toast({
//           title: "Success",
//           description: "Business profile saved successfully",
//           variant: "default",
//         })

//         // Reset success message after 3 seconds
//         setTimeout(() => {
//           setSaveSuccess(false)
//         }, 3000)
//       } else {
//         throw new Error(result.error || "Failed to save business profile")
//       }
//     } catch (error) {
//       console.error("Error saving business profile:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save business profile. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleSelectTemplate = (content: string) => {
//     setSelectedTemplate(content)
//     setBusinessProfile(content)
//     if (textareaRef.current) {
//       textareaRef.current.value = content
//       textareaRef.current.focus()
//     }
//   }

//   const handleCopyTemplate = (templateId: string, content: string) => {
//     navigator.clipboard.writeText(content)
//     setCopiedTemplate(templateId)
//     setTimeout(() => setCopiedTemplate(null), 2000)
//   }

//   const handleExpandTemplate = (templateId: string) => {
//     if (expandedTemplate === templateId) {
//       setExpandedTemplate(null)
//     } else {
//       setExpandedTemplate(templateId)
//     }
//   }

//   // Update businessProfile when textarea changes
//   useEffect(() => {
//     if (textareaRef.current) {
//       const handleInput = () => {
//         setBusinessProfile(textareaRef.current?.value || "")
//       }

//       textareaRef.current.addEventListener("input", handleInput)

//       return () => {
//         textareaRef.current?.removeEventListener("input", handleInput)
//       }
//     }
//   }, [])

//   // Handle template selection for the original listener component
//   const handleSelectMessageTemplate = (content: string) => {
//     setSelectedTemplate(content)
//     const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
//     if (textarea) {
//       textarea.value = content
//       textarea.focus()
//     }
//   }

//   return (
//     <FloatingPanel
//       title="Business Knowledge Hub"
//       trigger={
//         <motion.div
//           className="group relative overflow-hidden rounded-xl mt-4 w-full"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           {/* Border with animation */}
//           <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
//           <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

//           {/* Inner content */}
//           <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
//             <div className="flex items-center justify-center gap-3">
//               <PlusCircle className="h-5 w-5 text-[#768BDD]" />
//               <p className="text-[#768BDD] font-bold">Business Knowledge Hub</p>
//             </div>
//           </div>
//         </motion.div>
//       }
//     >
//       <div className="flex flex-col gap-4">
//         <Alert className="bg-blue-500/10 border-blue-500/30">
//           <Info className="h-4 w-4 text-blue-500" />
//           <AlertTitle className="text-blue-500 font-medium">Business Knowledge Hub</AlertTitle>
//           <AlertDescription className="text-blue-400">
//             Create a comprehensive profile of your business and set up automated responses to help AI understand and accurately represent your
//             brand in customer interactions.
//           </AlertDescription>
//         </Alert>

//         <Tabs defaultValue="listeners" className="w-full">
//           <TabsList className="w-full mb-4">
//             <TabsTrigger value="listeners" className="flex-1">
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Automation Listeners
//             </TabsTrigger>
//             <TabsTrigger value="templates" className="flex-1">
//               <FileText className="h-4 w-4 mr-2" />
//               Business Templates
//             </TabsTrigger>
//             <TabsTrigger value="editor" className="flex-1">
//               <Briefcase className="h-4 w-4 mr-2" />
//               Profile Editor
//             </TabsTrigger>
//             <TabsTrigger value="example" className="flex-1">
//               <Sparkles className="h-4 w-4 mr-2" />
//               Example Profile
//             </TabsTrigger>
//           </TabsList>

//           {/* Tab for Original Listeners Functionality */}
//           <TabsContent value="listeners" className="space-y-4">
//             {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {AUTOMATION_LISTENERS.map((listener) =>
//                 listener.type === "SMARTAI" ? (
//                   <SubscriptionPlan key={listener.type} type="PRO">
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => onSetListener(listener.type)}
//                       className={cn(
//                         Listener === listener.type ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]" : "bg-background-80",
//                         "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
//                       )}
//                     >
//                       <div className="flex gap-x-2 items-center">
//                         {listener.icon}
//                         <p>{listener.label}</p>
//                       </div>
//                       <p className="text-sm">{listener.description}</p>
//                     </motion.div>
//                   </SubscriptionPlan>
//                 ) : (
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => onSetListener(listener.type)}
//                     key={listener.id}
//                     className={cn(
//                       Listener === listener.type ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]" : "bg-background-80",
//                       "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
//                     )}
//                   >
//                     <div className="flex gap-x-2 items-center">
//                       {listener.icon}
//                       <p>{listener.label}</p>
//                     </div>
//                     <p className="text-sm">{listener.description}</p>
//                   </motion.div>
//                 ),
//               )}
//             </div>

//             <form onSubmit={onFormSubmit} className="flex flex-col gap-4 mt-2">
//               {Listener && (
//                 <div className={`bg-background-80 p-4 rounded-xl mb-2`}>
//                   <div className="flex items-center justify-between mb-3">
//                     {/* <h3 className="text-white font-medium flex items-center"> */}
//                       {/* {Listener === "SMARTAI" ? (
//                         <>
//                           <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
//                           AI Suggestions
//                         </>
//                       ) : (
//                         <>
//                           <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
//                           Quick Responses
//                         </>
//                       )} */}
//                     {/* </h3> */}
//                     <ResponseLibrary
//                       isAI={Listener === "SMARTAI"}
//                       onSelectTemplate={handleSelectMessageTemplate}
//                       selectedTemplate={selectedTemplate}
//                       userSubscription={Listener}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {(Listener === "SMARTAI" ? aiSuggestions : messageTemplates).map((suggestion, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.02 }}
//                         className={`bg-background-90 p-2 rounded-lg text-sm cursor-pointer ${Listener === "SMARTAI" ? "text-keyword-purple" : "text-light-blue"}`}
//                         onClick={() => {
//                           const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
//                           if (textarea) {
//                             textarea.value = suggestion
//                             textarea.focus()
//                           }
//                         }}
//                       >
//                         {suggestion}
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <label className="text-sm text-text-secondary">
//                   {Listener === "SMARTAI"
//                     ? "Add a prompt that your smart AI can use..."
//                     : "Add a message you want to send to your customers"}
//                 </label>
//                 <Textarea
//                   placeholder={
//                     Listener === "SMARTAI"
//                       ? "Add a prompt that your smart AI can use..."
//                       : "Add a message you want to send to your customers"
//                   }
//                   {...register("prompt")}
//                   className="bg-background-80 outline-none border-none ring-0 focus:ring-0 min-h-[120px]"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
//                 <Input
//                   {...register("reply")}
//                   placeholder="Add a reply for comments (Optional)"
//                   className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
//                 />
//               </div>

//               <Button
//                 className={cn(
//                   "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
//                   Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
//                 )}
//               >
//                 <Loader state={isPending}>Add a listener</Loader>
//               </Button>
//             </form>
//           </TabsContent>

//           {/* Business Templates Tab */}
//           <TabsContent value="templates" className="space-y-4">
//             <div className="bg-background-80 p-4 rounded-xl">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-white font-medium flex items-center">
//                   <Briefcase className="h-5 w-5 mr-2 text-light-blue" />
//                   Business Profile Templates
//                 </h3>
//                 <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
//                   <Info className="h-3 w-3 mr-1" />
//                   Select a template that best fits your business
//                 </Badge>
//               </div>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {templateCategories.map((category) => (
//                   <Badge
//                     key={category.id}
//                     variant={selectedCategory === category.id ? "default" : "outline"}
//                     className={`cursor-pointer ${
//                       selectedCategory === category.id
//                         ? "bg-light-blue hover:bg-light-blue/90"
//                         : "bg-background-90 hover:bg-background-80"
//                     }`}
//                     onClick={() => setSelectedCategory(category.id)}
//                   >
//                     {category.icon}
//                     <span className="ml-1">{category.name}</span>
//                   </Badge>
//                 ))}
//               </div>

//               <div className="space-y-3">
//                 {templateCategories
//                   .find((c) => c.id === selectedCategory)
//                   ?.templates.map((template) => (
//                     <Card
//                       key={template.id}
//                       className="bg-background-90 border-background-80 hover:border-light-blue/30 transition-all duration-200"
//                     >
//                       <CardContent className="p-3">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h4 className="font-medium text-light-blue">{template.title}</h4>
//                             <p className="text-xs text-muted-foreground">{template.description}</p>
//                           </div>
//                           <div className="flex space-x-1">
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 w-7 p-0"
//                                     onClick={() => handleExpandTemplate(template.id)}
//                                   >
//                                     {expandedTemplate === template.id ? (
//                                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                                     ) : (
//                                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                                     )}
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                   {expandedTemplate === template.id ? "Collapse" : "Expand"}
//                                 </TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>

//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="h-7 w-7 p-0"
//                                     onClick={() => handleCopyTemplate(template.id, template.content)}
//                                   >
//                                     {copiedTemplate === template.id ? (
//                                       <CheckCheck className="h-4 w-4 text-green-500" />
//                                     ) : (
//                                       <Copy className="h-4 w-4 text-muted-foreground" />
//                                     )}
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                   {copiedTemplate === template.id ? "Copied!" : "Copy to clipboard"}
//                                 </TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                           </div>
//                         </div>

//                         {expandedTemplate === template.id ? (
//                           <div className="mt-2 text-sm whitespace-pre-wrap max-h-80 overflow-y-auto border border-background-80 rounded-md p-3 bg-background/50">
//                             {template.content}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
//                         )}

//                         <div className="mt-3 flex justify-end">
//                           <Button
//                             size="sm"
//                             className="bg-light-blue hover:bg-light-blue/90 text-white"
//                             onClick={() => handleSelectTemplate(template.content)}
//                           >
//                             Use Template
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//               </div>
//             </div>
//           </TabsContent>

//           {/* Profile Editor Tab */}
//           <TabsContent value="editor" className="space-y-4">
//             <div className="bg-background-80 p-4 rounded-xl">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-white font-medium flex items-center">
//                   <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
//                   Business Profile Editor
//                 </h3>
//                 <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
//                   <Info className="h-3 w-3 mr-1" />
//                   Fill in your business details
//                 </Badge>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="business-profile" className="text-sm text-text-secondary flex items-center">
//                     <Briefcase className="h-4 w-4 mr-2 text-light-blue" />
//                     Business Profile Information
//                   </Label>
//                   <Textarea
//                     id="business-profile"
//                     ref={textareaRef}
//                     placeholder="Enter comprehensive information about your business..."
//                     className="bg-background-90 outline-none border-background-80 ring-0 focus:ring-1 focus:ring-light-blue/50 min-h-[400px] text-sm"
//                     defaultValue={businessProfile}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Replace the placeholder text in [BRACKETS] with your specific business information. The more
//                     detailed your profile, the better the AI can represent your business.
//                   </p>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <Clock className="h-4 w-4 mr-1" />
//                     <span>Last updated: {new Date().toLocaleString()}</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       className="border-light-blue/30 text-light-blue hover:bg-light-blue/10"
//                       onClick={() => setBusinessProfile("")}
//                     >
//                       Clear
//                     </Button>
//                     <Button
//                       className="bg-light-blue hover:bg-light-blue/90 text-white"
//                       onClick={handleSaveProfile}
//                       disabled={isSaving || !businessProfile.trim()}
//                     >
//                       {isSaving ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Saving...
//                         </>
//                       ) : saveSuccess ? (
//                         <>
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Saved!
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Save Profile
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Alert className="bg-green-500/10 border-green-500/30">
//               <CheckCircle className="h-4 w-4 text-green-500" />
//               <AlertTitle className="text-green-500 font-medium">Tips for a Great Business Profile</AlertTitle>
//               <AlertDescription className="text-green-400">
//                 <ul className="list-disc list-inside space-y-1 mt-2">
//                   <li>Be specific about your products, services, and pricing</li>
//                   <li>Include your business hours, location, and contact information</li>
//                   <li>Describe your unique selling points and what sets you apart</li>
//                   <li>Add common questions customers ask with detailed answers</li>
//                   <li>Include policies like returns, cancellations, and guarantees</li>
//                 </ul>
//               </AlertDescription>
//             </Alert>
//           </TabsContent>

//           {/* Example Profile Tab */}
//           <TabsContent value="example" className="space-y-4">
//             <div className="bg-background-80 p-4 rounded-xl">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-white font-medium flex items-center">
//                   <Scissors className="h-5 w-5 mr-2 text-light-blue" />
//                   Example: Scissors & Style Salon
//                 </h3>
//                 <div className="flex gap-2">
//                   <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
//                     <MapPin className="h-3 w-3 mr-1" />
//                     Metropolis, CA
//                   </Badge>
//                   <Badge variant="outline" className="bg-background-90 text-muted-foreground border-background-80">
//                     <Store className="h-3 w-3 mr-1" />
//                     Hair Salon
//                   </Badge>
//                 </div>
//               </div>

//               <div className="bg-background-90 rounded-lg p-4 mb-4">
//                 <div className="flex flex-col md:flex-row gap-4 mb-4">
//                   <div className="bg-background-80 rounded-lg p-3 flex-1">
//                     <h4 className="text-sm font-medium mb-2 flex items-center">
//                       <Phone className="h-4 w-4 mr-2 text-light-blue" />
//                       Contact Information
//                     </h4>
//                     <ul className="space-y-2 text-sm">
//                       <li className="flex items-center gap-2">
//                         <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span>163 Main Street, Downtown, Mineapolis</span>
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <Phone className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span>(111) 054-9963</span>
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <Mail className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span>info@scissorsandstyle.com</span>
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span>www.scissorsandstyle.com</span>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="bg-background-80 rounded-lg p-3 flex-1">
//                     <h4 className="text-sm font-medium mb-2 flex items-center">
//                       <Calendar className="h-4 w-4 mr-2 text-light-blue" />
//                       Business Hours
//                     </h4>
//                     <ul className="space-y-1 text-sm">
//                       <li className="flex justify-between">
//                         <span>Monday-Friday:</span>
//                         <span>9am-7pm</span>
//                       </li>
//                       <li className="flex justify-between">
//                         <span>Saturday:</span>
//                         <span>9am-5pm</span>
//                       </li>
//                       <li className="flex justify-between">
//                         <span>Sunday:</span>
//                         <span className="text-muted-foreground">Closed</span>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="bg-background-80 rounded-lg p-3 flex-1">
//                     <h4 className="text-sm font-medium mb-2 flex items-center">
//                       <Award className="h-4 w-4 mr-2 text-light-blue" />
//                       Established
//                     </h4>
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <p className="text-2xl font-bold">2025</p>
//                         <p className="text-xs text-muted-foreground">Founded by Angel Vavi</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-background-80 rounded-lg p-3 mb-4">
//                   <h4 className="text-sm font-medium mb-2">Business Overview</h4>
//                   <p className="text-sm">
//                     Scissors & Style is a premium hair salon located in Downtown Metropolis that specializes in
//                     haircuts, coloring, styling, and hair treatments. Founded in 2025 by master stylist Vavi Angel,
//                     our mission is to help every client look and feel their best through personalized hair services that
//                     enhance their natural beauty.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div className="bg-background-80 rounded-lg p-3">
//                     <h4 className="text-sm font-medium mb-2 flex items-center">
//                       <DollarSign className="h-4 w-4 mr-2 text-light-blue" />
//                       Popular Services
//                     </h4>
//                     <ul className="space-y-2 text-sm">
//                       <li className="flex justify-between">
//                         <span>Haircuts</span>
//                         <span>Starting at $65</span>
//                       </li>
//                       <li className="flex justify-between">
//                         <span>Color Services</span>
//                         <span>Starting at $95</span>
//                       </li>
//                       <li className="flex justify-between">
//                         <span>Styling</span>
//                         <span>Starting at $55</span>
//                       </li>
//                       <li className="flex justify-between">
//                         <span>Keratin Treatments</span>
//                         <span>$250</span>
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="bg-background-80 rounded-lg p-3">
//                     <h4 className="text-sm font-medium mb-2 flex items-center">
//                       <Star className="h-4 w-4 mr-2 text-light-blue" />
//                       Team Highlights
//                     </h4>
//                     <ul className="space-y-2 text-sm">
//                       <li className="flex items-start gap-2">
//                         <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <span className="font-medium">Angel Vavi</span>
//                           <p className="text-xs text-muted-foreground">Owner/Master Stylist - 15 years experience</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <span className="font-medium">Lady Cashe</span>
//                           <p className="text-xs text-muted-foreground">Senior Stylist - 8 years experience</p>
//                         </div>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
//                         <div>
//                           <span className="font-medium">Cashe is King</span>
//                           <p className="text-xs text-muted-foreground">Curl Specialist - 6 years experience</p>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="text-xs"
//                     onClick={() => handleCopyTemplate("example", exampleBusinessProfile)}
//                   >
//                     <Copy className="h-3.5 w-3.5 mr-1.5" />
//                     Copy Full Example
//                   </Button>
//                   <Button
//                     size="sm"
//                     className="bg-light-blue hover:bg-light-blue/90 text-white text-xs"
//                     onClick={() => handleSelectTemplate(exampleBusinessProfile)}
//                   >
//                     <FileText className="h-3.5 w-3.5 mr-1.5" />
//                     Use This Example
//                   </Button>
//                 </div>
//               </div>

//               <ScrollArea className="h-[400px] bg-background-90 rounded-lg p-4 border border-background-80">
//                 <div className="whitespace-pre-wrap text-sm">{exampleBusinessProfile}</div>
//               </ScrollArea>

//               <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
//                 <h4 className="text-sm font-medium text-blue-400 flex items-center mb-2">
//                   <Info className="h-4 w-4 mr-2 text-blue-500" />
//                   Why This Example Works Well
//                 </h4>
//                 <ul className="space-y-1 text-xs text-blue-300 list-disc list-inside">
//                   <li>Includes comprehensive contact information and business hours</li>
//                   <li>Clearly describes services with specific pricing information</li>
//                   <li>Highlights team members with their specialties and experience</li>
//                   <li>Provides detailed policies for cancellations and satisfaction guarantees</li>
//                   <li>Answers common customer questions with thorough responses</li>
//                   <li>Includes testimonials that showcase the businesss strengths</li>
//                   <li>Mentions unique selling points that differentiate from competitors</li>
//                 </ul>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </FloatingPanel>
//   )
// }

// export default ThenAction



"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useListener } from "@/hooks/use-automations"
import { AUTOMATION_LISTENERS } from "@/constants/automation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Heart, Home, Laptop, Camera } from "lucide-react"

import {
  PlusCircle,
  MessageSquare,
  Briefcase,
  FileText,
  Save,
  Clock,
  CheckCircle,
  Loader2,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
  Settings,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Info,
  Lightbulb,
  ExternalLink,
  Scissors,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Star,
  Award,
  Users,
  Store,
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
import { Progress } from "@/components/ui/progress"
import { SubscriptionPlan } from "../../subscription-plan"

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

  // State management
  const [activeTab, setActiveTab] = useState("setup")
  const [setupStep, setSetupStep] = useState(1)
  const [showTip, setShowTip] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("food-service")
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [businessProfile, setBusinessProfile] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Calculate setup progress
  const setupProgress = (completedSteps.length / 3) * 100

  // ===== PLACE YOUR CONSTANTS HERE =====
  // AUTOMATION_LISTENERS - Your automation listeners array
  // templateCategories - Your business template categories
  // messageTemplates - Your message templates array
  // aiSuggestions - Your AI suggestions array
  // exampleBusinessProfile - Your example business profile string
  // =====================================

 
 const templateCategories = [
  {
    id: "food-service",
    name: "Food & Dining",
    icon: <Utensils className="h-4 w-4" />,
    description: "Restaurants, cafés, food trucks, catering",
    templates: [
      {
        id: "restaurant-comprehensive",
        title: "Full-Service Restaurant",
        description: "Complete template for restaurants with dine-in, takeout, and delivery",
        tags: ["restaurant", "dining", "food", "comprehensive"],
        content: `# [RESTAURANT_NAME] - Complete Restaurant Profile

## BASIC INFORMATION
- **Business Name:** [RESTAURANT_NAME]
- **Restaurant Type:** [Fine Dining/Casual Dining/Fast Casual/Family Restaurant]
- **Cuisine Type:** [Italian/Mexican/American/Asian/Fusion/etc.]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS_WITH_CITY_STATE_ZIP]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** 
  - Instagram: [@INSTAGRAM_HANDLE]
  - Facebook: [FACEBOOK_PAGE]
  - TikTok: [@TIKTOK_HANDLE] (if applicable)

## HOURS OF OPERATION
- **Monday:** [HOURS or "Closed"]
- **Tuesday:** [HOURS or "Closed"]
- **Wednesday:** [HOURS or "Closed"]
- **Thursday:** [HOURS or "Closed"]
- **Friday:** [HOURS or "Closed"]
- **Saturday:** [HOURS or "Closed"]
- **Sunday:** [HOURS or "Closed"]
- **Holiday Hours:** [SPECIAL_HOLIDAY_SCHEDULE]

## RESTAURANT OVERVIEW
[RESTAURANT_NAME] is a [ATMOSPHERE_DESCRIPTION] [CUISINE_TYPE] restaurant located in [NEIGHBORHOOD/CITY]. Since [YEAR], we've been serving [TARGET_AUDIENCE] with [UNIQUE_SELLING_PROPOSITION]. 

Our restaurant specializes in [SPECIALTY_DISHES/COOKING_METHODS] and prides itself on [WHAT_MAKES_YOU_SPECIAL - e.g., farm-to-table ingredients, family recipes, authentic preparation methods].

**What Makes Us Special:**
- [UNIQUE_FEATURE_1 - e.g., Wood-fired pizza oven]
- [UNIQUE_FEATURE_2 - e.g., Locally sourced ingredients]
- [UNIQUE_FEATURE_3 - e.g., Family recipes passed down 3 generations]

## MENU HIGHLIGHTS

### APPETIZERS
- **[APPETIZER_1]:** [DESCRIPTION] - $[PRICE]
- **[APPETIZER_2]:** [DESCRIPTION] - $[PRICE]
- **[SIGNATURE_APPETIZER]:** [DETAILED_DESCRIPTION] - $[PRICE] ⭐ *Customer Favorite*

### MAIN COURSES
- **[MAIN_DISH_1]:** [DESCRIPTION] - $[PRICE]
- **[MAIN_DISH_2]:** [DESCRIPTION] - $[PRICE]
- **[SIGNATURE_DISH]:** [DETAILED_DESCRIPTION] - $[PRICE] ⭐ *Chef's Special*

### DESSERTS
- **[DESSERT_1]:** [DESCRIPTION] - $[PRICE]
- **[HOUSE_SPECIAL_DESSERT]:** [DESCRIPTION] - $[PRICE]

### BEVERAGES
- **Wine Selection:** [WINE_PROGRAM_DESCRIPTION] - $[PRICE_RANGE]
- **Craft Cocktails:** [COCKTAIL_PROGRAM_DESCRIPTION] - $[PRICE_RANGE]
- **Beer:** [BEER_SELECTION] - $[PRICE_RANGE]
- **Non-Alcoholic:** [OPTIONS] - $[PRICE_RANGE]

### DIETARY ACCOMMODATIONS
- **Vegetarian Options:** [NUMBER] dishes available
- **Vegan Options:** [NUMBER] dishes available
- **Gluten-Free Options:** [NUMBER] dishes available
- **Allergen Information:** We can accommodate [LIST_ALLERGENS] - please inform your server

## DINING OPTIONS
- **Dine-In:** [SEATING_CAPACITY] seats, [ATMOSPHERE_DESCRIPTION]
- **Takeout:** Available during all operating hours
- **Delivery:** Available through [DELIVERY_PLATFORMS] within [DELIVERY_RADIUS]
- **Catering:** Available for events of [MINIMUM_PEOPLE]+ people
- **Private Events:** [PRIVATE_DINING_CAPACITY] for special occasions

## RESERVATIONS & POLICIES
- **Reservations:** [ACCEPTED/WALK-IN_ONLY] via [BOOKING_METHOD]
- **Large Parties:** Parties of [NUMBER]+ require advance notice
- **Cancellation Policy:** [POLICY_DETAILS]
- **Dress Code:** [DRESS_CODE or "Casual"]
- **Children Policy:** [CHILDREN_WELCOME/RESTRICTIONS]
- **Pet Policy:** [PET_POLICY]

## PRICING & PAYMENT
- **Average Meal Cost:** $[PRICE_RANGE] per person
- **Payment Methods:** Cash, Credit/Debit Cards, Apple Pay, Google Pay
- **Gratuity:** [GRATUITY_POLICY]
- **Group Discounts:** [AVAILABLE/NOT_AVAILABLE]

## SPECIAL SERVICES
- **Happy Hour:** [DAYS_AND_TIMES] - [SPECIAL_OFFERS]
- **Daily Specials:** [DESCRIPTION_OF_DAILY_SPECIALS]
- **Seasonal Menu:** Updated [FREQUENCY] with seasonal ingredients
- **Wine Pairing:** Available with [SPECIFIC_DISHES]
- **Chef's Table:** [AVAILABILITY_AND_DESCRIPTION]

## LOCATION & ACCESSIBILITY
- **Parking:** [PARKING_OPTIONS_AND_AVAILABILITY]
- **Public Transportation:** [NEAREST_TRANSIT_OPTIONS]
- **Accessibility:** [WHEELCHAIR_ACCESSIBLE/ADA_COMPLIANT_FEATURES]
- **Nearby Landmarks:** [NOTABLE_NEARBY_LOCATIONS]

## TEAM
- **Head Chef:** [CHEF_NAME] - [BACKGROUND_AND_SPECIALTIES]
- **Restaurant Manager:** [MANAGER_NAME] - [EXPERIENCE]
- **Sommelier:** [NAME] - [WINE_EXPERTISE] (if applicable)

## FREQUENTLY ASKED QUESTIONS

**Q: Do you take reservations?**
A: [DETAILED_RESERVATION_POLICY]

**Q: Do you accommodate dietary restrictions?**
A: [DETAILED_DIETARY_ACCOMMODATION_POLICY]

**Q: Is there parking available?**
A: [DETAILED_PARKING_INFORMATION]

**Q: Do you have a kids menu?**
A: [KIDS_MENU_INFORMATION]

**Q: Can you host private events?**
A: [PRIVATE_EVENT_CAPABILITIES_AND_PROCESS]

**Q: Do you offer catering services?**
A: [CATERING_SERVICES_DETAILS]

**Q: What's your corkage policy?**
A: [CORKAGE_POLICY_IF_APPLICABLE]

## CUSTOMER REVIEWS & TESTIMONIALS
- *"[CUSTOMER_TESTIMONIAL_1]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]
- *"[CUSTOMER_TESTIMONIAL_2]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]
- *"[CUSTOMER_TESTIMONIAL_3]"* - [CUSTOMER_NAME], [REVIEW_SOURCE]

## AWARDS & RECOGNITION
- [AWARD_1] - [YEAR]
- [AWARD_2] - [YEAR]
- [MEDIA_MENTION] - [PUBLICATION], [YEAR]

## COMMUNITY INVOLVEMENT
- [COMMUNITY_INITIATIVE_1]
- [CHARITY_PARTNERSHIP]
- [LOCAL_SOURCING_COMMITMENT]

## CONTACT FOR INQUIRIES
- **General Manager:** [NAME] - [EMAIL] - [PHONE]
- **Event Coordinator:** [NAME] - [EMAIL] - [PHONE]
- **Catering Manager:** [NAME] - [EMAIL] - [PHONE]`,
      },
      {
        id: "cafe-coffee-shop",
        title: "Café & Coffee Shop",
        description: "Perfect for coffee shops, cafés, and casual dining spots",
        tags: ["café", "coffee", "casual", "breakfast"],
        content: `# [CAFE_NAME] - Coffee Shop & Café Profile

## BASIC INFORMATION
- **Business Name:** [CAFE_NAME]
- **Type:** [Coffee Shop/Café/Bakery Café/Specialty Coffee]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## HOURS OF OPERATION
- **Monday-Friday:** [WEEKDAY_HOURS]
- **Saturday:** [SATURDAY_HOURS]
- **Sunday:** [SUNDAY_HOURS]
- **Holiday Hours:** [HOLIDAY_SCHEDULE]

## CAFÉ OVERVIEW
[CAFE_NAME] is a [COZY/MODERN/RUSTIC] neighborhood café specializing in [SPECIALTY - e.g., artisan coffee, fresh pastries, healthy breakfast options]. Since [YEAR], we've been the go-to spot for [TARGET_AUDIENCE] looking for [VALUE_PROPOSITION].

**What We're Known For:**
- [SPECIALTY_1 - e.g., Single-origin coffee roasted in-house]
- [SPECIALTY_2 - e.g., Fresh-baked pastries daily]
- [SPECIALTY_3 - e.g., Cozy atmosphere perfect for work/study]

## COFFEE & BEVERAGES

### COFFEE MENU
- **Espresso:** $[PRICE]
- **Americano:** $[PRICE]
- **Cappuccino:** $[PRICE]
- **Latte:** $[PRICE] (Available with [MILK_OPTIONS])
- **Specialty Drinks:** [LIST_SIGNATURE_DRINKS] - $[PRICE_RANGE]

### ALTERNATIVE BEVERAGES
- **Tea Selection:** [TEA_VARIETIES] - $[PRICE_RANGE]
- **Cold Brew:** $[PRICE]
- **Smoothies:** [FLAVORS_AVAILABLE] - $[PRICE_RANGE]
- **Fresh Juices:** [JUICE_OPTIONS] - $[PRICE_RANGE]

### MILK & DIETARY OPTIONS
- **Milk Alternatives:** [ALMOND/OAT/SOY/COCONUT] - Additional $[PRICE]
- **Sugar-Free Syrups:** [AVAILABLE_FLAVORS]
- **Decaf Options:** Available for all coffee drinks

## FOOD MENU

### BREAKFAST
- **[BREAKFAST_ITEM_1]:** [DESCRIPTION] - $[PRICE]
- **[BREAKFAST_ITEM_2]:** [DESCRIPTION] - $[PRICE]
- **Fresh Pastries:** [DAILY_SELECTION] - $[PRICE_RANGE]

### LUNCH
- **Sandwiches:** [SANDWICH_OPTIONS] - $[PRICE_RANGE]
- **Salads:** [SALAD_OPTIONS] - $[PRICE_RANGE]
- **Soups:** [DAILY_SOUP_PROGRAM] - $[PRICE]

### SNACKS & TREATS
- **Baked Goods:** [MUFFINS/COOKIES/SCONES] - $[PRICE_RANGE]
- **Healthy Options:** [YOGURT_PARFAITS/FRUIT_BOWLS] - $[PRICE_RANGE]

## SERVICES & AMENITIES
- **Free WiFi:** High-speed internet throughout
- **Seating:** [NUMBER] seats including [SEATING_TYPES]
- **Takeout:** All items available to-go
- **Mobile Ordering:** Available through [APP/WEBSITE]
- **Loyalty Program:** [PROGRAM_DETAILS]
- **Catering:** Available for [OFFICE_MEETINGS/EVENTS]

## ATMOSPHERE & SPACE
- **Ambiance:** [DESCRIPTION_OF_ATMOSPHERE]
- **Work-Friendly:** [LAPTOP_POLICY] with plenty of outlets
- **Study Space:** [QUIET_AREAS/STUDY_POLICIES]
- **Meeting Space:** [AVAILABILITY_OF_MEETING_AREAS]
- **Outdoor Seating:** [PATIO/SIDEWALK_SEATING_DETAILS]

## SPECIAL PROGRAMS
- **Daily Specials:** [DESCRIPTION_OF_DAILY_OFFERS]
- **Happy Hour:** [DISCOUNTED_DRINKS_TIMES]
- **Student Discount:** [DISCOUNT_PERCENTAGE] with valid ID
- **Local Business Discount:** [DISCOUNT_FOR_LOCAL_EMPLOYEES]
- **Bulk Orders:** Discounts available for orders of [QUANTITY]+

## POLICIES
- **Payment:** Cash, Credit/Debit, Apple Pay, Google Pay
- **Tipping:** [TIPPING_POLICY]
- **Outside Food:** [POLICY_ON_OUTSIDE_FOOD]
- **Laptop/Study Policy:** [PEAK_HOURS_POLICY]
- **Group Reservations:** [LARGE_GROUP_POLICY]

## FREQUENTLY ASKED QUESTIONS

**Q: Do you have WiFi?**
A: Yes, we offer free high-speed WiFi to all customers.

**Q: Can I work/study here?**
A: [LAPTOP_AND_STUDY_POLICY_DETAILS]

**Q: Do you have dairy-free options?**
A: [DAIRY_FREE_MILK_AND_FOOD_OPTIONS]

**Q: Do you take custom orders for events?**
A: [CATERING_AND_CUSTOM_ORDER_POLICY]

**Q: What are your busiest hours?**
A: [PEAK_HOURS_INFORMATION]

## CUSTOMER TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_COFFEE_QUALITY]"* - [CUSTOMER_NAME]
- *"[TESTIMONIAL_ABOUT_ATMOSPHERE]"* - [CUSTOMER_NAME]
- *"[TESTIMONIAL_ABOUT_SERVICE]"* - [CUSTOMER_NAME]

## CONTACT
- **Manager:** [MANAGER_NAME] - [EMAIL]
- **Catering Inquiries:** [CATERING_EMAIL]
- **General Questions:** [GENERAL_EMAIL]`,
      },
    ],
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    icon: <Heart className="h-4 w-4" />,
    description: "Gyms, spas, clinics, wellness centers",
    templates: [
      {
        id: "fitness-gym",
        title: "Fitness Center & Gym",
        description: "Comprehensive template for gyms, fitness centers, and health clubs",
        tags: ["fitness", "gym", "health", "wellness"],
        content: `# [GYM_NAME] - Fitness Center Profile

## BASIC INFORMATION
- **Business Name:** [GYM_NAME]
- **Type:** [Full-Service Gym/Boutique Fitness/CrossFit/Yoga Studio/etc.]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE] | [@TIKTOK]

## HOURS OF OPERATION
- **Monday-Thursday:** [WEEKDAY_HOURS]
- **Friday:** [FRIDAY_HOURS]
- **Saturday:** [SATURDAY_HOURS]
- **Sunday:** [SUNDAY_HOURS]
- **Holiday Hours:** [HOLIDAY_SCHEDULE]
- **24/7 Access:** [AVAILABLE/NOT_AVAILABLE] for [MEMBERSHIP_LEVELS]

## GYM OVERVIEW
[GYM_NAME] is a [SIZE] fitness facility dedicated to helping members achieve their health and fitness goals. Since [YEAR], we've been serving the [COMMUNITY_NAME] community with [UNIQUE_APPROACH_TO_FITNESS].

**Our Mission:** [MISSION_STATEMENT]

**What Sets Us Apart:**
- [UNIQUE_FEATURE_1 - e.g., State-of-the-art equipment]
- [UNIQUE_FEATURE_2 - e.g., Certified personal trainers]
- [UNIQUE_FEATURE_3 - e.g., Supportive community atmosphere]

## FACILITIES & EQUIPMENT

### CARDIO EQUIPMENT
- **Treadmills:** [NUMBER] units including [FEATURES]
- **Elliptical Machines:** [NUMBER] units
- **Stationary Bikes:** [NUMBER] units ([UPRIGHT/RECUMBENT/SPIN])
- **Rowing Machines:** [NUMBER] units
- **Stair Climbers:** [NUMBER] units

### STRENGTH TRAINING
- **Free Weights:** Complete dumbbell set [WEIGHT_RANGE]
- **Barbells & Olympic Plates:** [EQUIPMENT_DETAILS]
- **Cable Machines:** [NUMBER] stations
- **Resistance Machines:** [BRAND/TYPE] covering all muscle groups
- **Functional Training Area:** [DESCRIPTION_OF_FUNCTIONAL_SPACE]

### SPECIALIZED AREAS
- **Group Fitness Studio:** [SIZE] with [AUDIO/VISUAL_EQUIPMENT]
- **Yoga/Pilates Studio:** [DEDICATED_SPACE_DETAILS]
- **Cycling Studio:** [NUMBER] bikes with [TECHNOLOGY_FEATURES]
- **Pool:** [POOL_DETAILS] (if applicable)
- **Sauna/Steam Room:** [AMENITY_DETAILS] (if applicable)
- **Basketball/Racquetball Courts:** [COURT_DETAILS] (if applicable)

## MEMBERSHIP OPTIONS

### MEMBERSHIP TYPES
1. **[BASIC_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [INCLUDED_FEATURES]
   - [ACCESS_HOURS]
   - [ADDITIONAL_BENEFITS]

2. **[PREMIUM_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [ALL_BASIC_FEATURES]
   - [ADDITIONAL_PREMIUM_FEATURES]
   - [GUEST_PRIVILEGES]

3. **[VIP_MEMBERSHIP_NAME]:** $[MONTHLY_PRICE]/month
   - [ALL_PREMIUM_FEATURES]
   - [VIP_EXCLUSIVE_BENEFITS]
   - [PERSONAL_TRAINING_CREDITS]

### MEMBERSHIP BENEFITS
- **No Enrollment Fee:** [PROMOTIONAL_PERIODS]
- **Month-to-Month:** No long-term contracts required
- **Guest Passes:** [NUMBER] per month for [MEMBERSHIP_LEVELS]
- **Reciprocal Access:** [PARTNER_GYM_LOCATIONS] (if applicable)
- **Member Discounts:** [RETAIL/SERVICE_DISCOUNTS]

## GROUP FITNESS CLASSES

### CLASS SCHEDULE
**Monday:**
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]

**Tuesday:**
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]
- [TIME]: [CLASS_NAME] with [INSTRUCTOR]

[Continue for all days...]

### POPULAR CLASSES
- **[CLASS_TYPE_1]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]
- **[CLASS_TYPE_2]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]
- **[CLASS_TYPE_3]:** [DESCRIPTION_AND_BENEFITS] - [DIFFICULTY_LEVEL]

### CLASS POLICIES
- **Reservations:** [REQUIRED/FIRST_COME_FIRST_SERVED]
- **Cancellation:** [CANCELLATION_POLICY]
- **Late Arrival:** [LATE_ARRIVAL_POLICY]
- **Class Size:** Maximum [NUMBER] participants

## PERSONAL TRAINING

### TRAINING OPTIONS
- **One-on-One Training:** $[PRICE] per session
- **Semi-Private Training:** $[PRICE] per person (2-3 people)
- **Small Group Training:** $[PRICE] per person (4-6 people)
- **Specialized Programs:** [SPORT_SPECIFIC/REHABILITATION/etc.]

### TRAINER QUALIFICATIONS
All trainers are certified through [CERTIFICATION_BODIES] and specialize in:
- [SPECIALIZATION_1]
- [SPECIALIZATION_2]
- [SPECIALIZATION_3]

### TRAINING PACKAGES
- **4 Sessions:** $[PRICE] ([SAVINGS] vs. individual)
- **8 Sessions:** $[PRICE] ([SAVINGS] vs. individual)
- **12 Sessions:** $[PRICE] ([SAVINGS] vs. individual)

## ADDITIONAL SERVICES
- **Nutritional Counseling:** [AVAILABLE/PRICING]
- **Body Composition Analysis:** [AVAILABLE/PRICING]
- **Massage Therapy:** [AVAILABLE/PRICING]
- **Physical Therapy:** [AVAILABLE/PRICING]
- **Childcare:** [AVAILABLE_HOURS_AND_PRICING]

## POLICIES & PROCEDURES

### GYM ETIQUETTE
- **Equipment Sharing:** [SHARING_POLICY]
- **Cleaning:** [EQUIPMENT_CLEANING_REQUIREMENTS]
- **Dress Code:** [APPROPRIATE_WORKOUT_ATTIRE]
- **Cell Phone Use:** [CELL_PHONE_POLICY]
- **Music:** [PERSONAL_MUSIC_POLICY]

### SAFETY POLICIES
- **Equipment Orientation:** [REQUIRED/AVAILABLE]
- **Spotting Policy:** [SPOTTING_ASSISTANCE_POLICY]
- **Injury Protocol:** [INJURY_REPORTING_PROCEDURE]
- **Emergency Procedures:** [EMERGENCY_CONTACT_INFO]

### MEMBERSHIP POLICIES
- **Freezing Membership:** [FREEZE_POLICY_AND_FEES]
- **Cancellation:** [CANCELLATION_REQUIREMENTS]
- **Guest Policy:** [GUEST_PASS_RULES]
- **Age Requirements:** [MINIMUM_AGE_POLICIES]

## FREQUENTLY ASKED QUESTIONS

**Q: Do you offer day passes?**
A: [DAY_PASS_AVAILABILITY_AND_PRICING]

**Q: Can I freeze my membership?**
A: [MEMBERSHIP_FREEZE_POLICY_DETAILS]

**Q: Do you have childcare?**
A: [CHILDCARE_SERVICES_DETAILS]

**Q: What if I'm new to working out?**
A: [NEW_MEMBER_ORIENTATION_AND_SUPPORT]

**Q: Do you have locker rooms and showers?**
A: [LOCKER_ROOM_AMENITIES_DETAILS]

**Q: Can I bring a friend?**
A: [GUEST_POLICY_DETAILS]

## SUCCESS STORIES
- *"[MEMBER_SUCCESS_STORY_1]"* - [MEMBER_NAME]
- *"[MEMBER_SUCCESS_STORY_2]"* - [MEMBER_NAME]
- *"[MEMBER_SUCCESS_STORY_3]"* - [MEMBER_NAME]

## CONTACT INFORMATION
- **General Manager:** [NAME] - [EMAIL] - [PHONE]
- **Membership Director:** [NAME] - [EMAIL] - [PHONE]
- **Personal Training Director:** [NAME] - [EMAIL] - [PHONE]
- **Group Fitness Coordinator:** [NAME] - [EMAIL] - [PHONE]`,
      },
      {
        id: "spa-wellness",
        title: "Spa & Wellness Center",
        description: "Perfect for day spas, wellness centers, and beauty treatment facilities",
        tags: ["spa", "wellness", "beauty", "relaxation"],
        content: `# [SPA_NAME] - Wellness & Spa Profile

## BASIC INFORMATION
- **Business Name:** [SPA_NAME]
- **Type:** [Day Spa/Medical Spa/Wellness Center/Beauty Spa]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## HOURS OF OPERATION
- **Monday:** [HOURS or "Closed"]
- **Tuesday:** [HOURS]
- **Wednesday:** [HOURS]
- **Thursday:** [HOURS]
- **Friday:** [HOURS]
- **Saturday:** [HOURS]
- **Sunday:** [HOURS or "Closed"]

## SPA OVERVIEW
[SPA_NAME] is a tranquil [TYPE_OF_SPA] dedicated to providing rejuvenating treatments and wellness services. Since [YEAR], we've been helping clients achieve [WELLNESS_GOALS] through our comprehensive menu of [TREATMENT_SPECIALTIES].

**Our Philosophy:** [SPA_PHILOSOPHY_STATEMENT]

**What Makes Us Special:**
- [UNIQUE_FEATURE_1 - e.g., Organic, locally-sourced products]
- [UNIQUE_FEATURE_2 - e.g., Licensed massage therapists and estheticians]
- [UNIQUE_FEATURE_3 - e.g., Serene, peaceful environment]

## TREATMENT MENU

### FACIAL TREATMENTS
- **[SIGNATURE_FACIAL]:** [DETAILED_DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Classic European Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Anti-Aging Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Acne Treatment Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Hydrating Facial:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### MASSAGE THERAPY
- **Swedish Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Deep Tissue Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Hot Stone Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Prenatal Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)
- **Couples Massage:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### BODY TREATMENTS
- **Body Wrap:** [DESCRIPTION_AND_BENEFITS] - $[PRICE] ([DURATION] minutes)
- **Body Scrub:** [DESCRIPTION_AND_BENEFITS] - $[PRICE] ([DURATION] minutes)
- **Cellulite Treatment:** [DESCRIPTION] - $[PRICE] ([DURATION] minutes)

### SPECIALTY SERVICES
- **[SPECIALTY_SERVICE_1]:** [DESCRIPTION] - $[PRICE]
- **[SPECIALTY_SERVICE_2]:** [DESCRIPTION] - $[PRICE]
- **Add-On Services:** [LIST_OF_ENHANCEMENT_OPTIONS] - $[PRICE_RANGE]

## SPA PACKAGES

### SIGNATURE PACKAGES
1. **[PACKAGE_NAME_1]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])
2. **[PACKAGE_NAME_2]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])
3. **[PACKAGE_NAME_3]:** [SERVICES_INCLUDED] - $[PACKAGE_PRICE] (Save $[SAVINGS])

### SEASONAL PACKAGES
- **[SEASONAL_PACKAGE]:** [DESCRIPTION_AND_SERVICES] - $[PRICE]
- Available [SEASON/MONTHS]

## FACILITIES & AMENITIES
- **Treatment Rooms:** [NUMBER] private rooms with [AMENITIES]
- **Relaxation Area:** [DESCRIPTION_OF_RELAXATION_SPACE]
- **Changing Rooms:** [AMENITIES_PROVIDED]
- **Steam Room/Sauna:** [AVAILABLE/NOT_AVAILABLE]
- **Retail Area:** [PRODUCT_LINES_CARRIED]
- **Parking:** [PARKING_AVAILABILITY]

## BOOKING & POLICIES

### APPOINTMENT BOOKING
- **Online Booking:** Available 24/7 at [WEBSITE_URL]
- **Phone Booking:** [PHONE_NUMBER] during business hours
- **Mobile App:** [APP_NAME] available for [iOS/ANDROID]

### SPA POLICIES
- **Arrival Time:** Please arrive [TIME] minutes before your appointment
- **Cancellation Policy:** [CANCELLATION_TIMEFRAME] notice required
- **Late Arrival:** [LATE_ARRIVAL_POLICY]
- **Gratuity:** [GRATUITY_POLICY]
- **Age Policy:** [MINIMUM_AGE_REQUIREMENTS]

### PAYMENT & PRICING
- **Payment Methods:** Cash, Credit/Debit Cards, Gift Cards
- **Package Pricing:** [PACKAGE_DISCOUNT_STRUCTURE]
- **Membership Programs:** [MEMBERSHIP_BENEFITS_IF_AVAILABLE]
- **Group Discounts:** Available for groups of [NUMBER]+

## PRODUCTS & RETAIL
We carry premium skincare and wellness products including:
- **[PRODUCT_LINE_1]:** [DESCRIPTION_OF_PRODUCTS]
- **[PRODUCT_LINE_2]:** [DESCRIPTION_OF_PRODUCTS]
- **[PRODUCT_LINE_3]:** [DESCRIPTION_OF_PRODUCTS]

**Product Guarantee:** [RETURN_POLICY_FOR_RETAIL_PRODUCTS]

## THERAPIST TEAM
Our licensed professionals include:
- **[THERAPIST_NAME_1]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]
- **[THERAPIST_NAME_2]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]
- **[THERAPIST_NAME_3]:** [SPECIALIZATIONS_AND_CERTIFICATIONS]

All therapists are licensed and certified in [STATE] and participate in ongoing education.

## SPECIAL PROGRAMS
- **Bridal Services:** [BRIDAL_PACKAGE_DETAILS]
- **Corporate Wellness:** [CORPORATE_PROGRAM_DETAILS]
- **Membership Program:** [MEMBERSHIP_BENEFITS_AND_PRICING]
- **Loyalty Rewards:** [LOYALTY_PROGRAM_DETAILS]

## FREQUENTLY ASKED QUESTIONS

**Q: What should I expect during my first visit?**
A: [FIRST_VISIT_PROCESS_DESCRIPTION]

**Q: What should I wear to my appointment?**
A: [ATTIRE_RECOMMENDATIONS]

**Q: Can I request a specific therapist?**
A: [THERAPIST_REQUEST_POLICY]

**Q: Do you offer couples treatments?**
A: [COUPLES_TREATMENT_AVAILABILITY]

**Q: What is your cancellation policy?**
A: [DETAILED_CANCELLATION_POLICY]

**Q: Do you offer gift certificates?**
A: [GIFT_CERTIFICATE_INFORMATION]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_RELAXATION]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_RESULTS]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_SERVICE]"* - [CLIENT_NAME]

## CONTACT FOR APPOINTMENTS
- **Spa Reception:** [PHONE] - [EMAIL]
- **Spa Director:** [NAME] - [EMAIL]
- **Group Bookings:** [EMAIL]
- **Gift Certificate Sales:** [PHONE/EMAIL]`,
      },
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: <Briefcase className="h-4 w-4" />,
    description: "Law firms, accounting, consulting, real estate",
    templates: [
      {
        id: "law-firm",
        title: "Law Firm & Legal Services",
        description: "Comprehensive template for law firms and legal practitioners",
        tags: ["law", "legal", "attorney", "professional"],
        content: `# [LAW_FIRM_NAME] - Legal Services Profile

## FIRM INFORMATION
- **Firm Name:** [LAW_FIRM_NAME]
- **Practice Type:** [Solo Practice/Small Firm/Mid-Size Firm/Boutique Firm]
- **Established:** [YEAR]
- **Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **LinkedIn:** [LINKEDIN_PROFILE]

## OFFICE HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS or "By Appointment Only"]
- **Sunday:** [WEEKEND_HOURS or "Closed"]
- **Emergency Contact:** [EMERGENCY_CONTACT_INFO]

## FIRM OVERVIEW
[LAW_FIRM_NAME] is a [FIRM_SIZE] law firm specializing in [PRIMARY_PRACTICE_AREAS]. Since [YEAR], we have been providing [CLIENT_TYPE] with comprehensive legal services throughout [GEOGRAPHIC_AREA].

**Our Mission:** [MISSION_STATEMENT]

**Our Approach:** [DESCRIPTION_OF_LEGAL_PHILOSOPHY_AND_CLIENT_SERVICE_APPROACH]

## PRACTICE AREAS

### PRIMARY PRACTICE AREAS
1. **[PRACTICE_AREA_1]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

2. **[PRACTICE_AREA_2]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

3. **[PRACTICE_AREA_3]**
   - [SPECIFIC_SERVICE_1]
   - [SPECIFIC_SERVICE_2]
   - [SPECIFIC_SERVICE_3]
   - Typical case value: $[RANGE]

### ADDITIONAL SERVICES
- **[ADDITIONAL_SERVICE_1]:** [DESCRIPTION]
- **[ADDITIONAL_SERVICE_2]:** [DESCRIPTION]
- **Legal Document Review:** [PRICING_STRUCTURE]
- **Legal Consultation:** [CONSULTATION_DETAILS]

## ATTORNEY PROFILES

### [ATTORNEY_NAME_1] - [TITLE]
- **Education:** [LAW_SCHOOL], [DEGREE], [YEAR]
- **Bar Admissions:** [STATE_BARS_AND_YEARS]
- **Experience:** [YEARS] years practicing law
- **Specializations:** [AREAS_OF_EXPERTISE]
- **Notable Cases/Achievements:** [SIGNIFICANT_CASES_OR_RECOGNITION]
- **Professional Memberships:** [BAR_ASSOCIATIONS_AND_ORGANIZATIONS]

### [ATTORNEY_NAME_2] - [TITLE]
- **Education:** [LAW_SCHOOL], [DEGREE], [YEAR]
- **Bar Admissions:** [STATE_BARS_AND_YEARS]
- **Experience:** [YEARS] years practicing law
- **Specializations:** [AREAS_OF_EXPERTISE]
- **Notable Cases/Achievements:** [SIGNIFICANT_CASES_OR_RECOGNITION]

## CLIENT SERVICES

### CONSULTATION PROCESS
1. **Initial Contact:** [HOW_CLIENTS_REACH_OUT]
2. **Case Evaluation:** [EVALUATION_PROCESS]
3. **Fee Discussion:** [FEE_STRUCTURE_EXPLANATION]
4. **Engagement:** [RETAINER_AND_ENGAGEMENT_PROCESS]
5. **Ongoing Communication:** [CLIENT_COMMUNICATION_PRACTICES]

### CONSULTATION OPTIONS
- **In-Person Consultation:** [DURATION] - $[FEE]
- **Phone Consultation:** [DURATION] - $[FEE]
- **Video Consultation:** [DURATION] - $[FEE]
- **Free Initial Consultation:** [AVAILABLE_FOR_WHICH_CASES]

## FEE STRUCTURE

### BILLING METHODS
- **Hourly Rate:** $[RATE_RANGE] depending on attorney and case complexity
- **Flat Fee Services:** [LIST_OF_FLAT_FEE_SERVICES_AND_PRICES]
- **Contingency Fee:** [PERCENTAGE]% for [APPLICABLE_CASE_TYPES]
- **Retainer:** [TYPICAL_RETAINER_AMOUNTS]

### PAYMENT POLICIES
- **Payment Methods:** Cash, Check, Credit Cards, Payment Plans
- **Payment Plans:** Available for [QUALIFYING_CASES]
- **Billing Frequency:** [MONTHLY/QUARTERLY]
- **Late Payment:** [LATE_PAYMENT_POLICY]

## CASE TYPES & EXPERIENCE

### [PRACTICE_AREA_1] CASES
**Typical Cases Include:**
- [CASE_TYPE_1]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_2]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_3]: [DESCRIPTION_AND_TYPICAL_OUTCOME]

**Recent Results:**
- [CASE_RESULT_1]
- [CASE_RESULT_2]
- [CASE_RESULT_3]

### [PRACTICE_AREA_2] CASES
**Typical Cases Include:**
- [CASE_TYPE_1]: [DESCRIPTION_AND_TYPICAL_OUTCOME]
- [CASE_TYPE_2]: [DESCRIPTION_AND_TYPICAL_OUTCOME]

## CLIENT COMMUNICATION
- **Regular Updates:** [UPDATE_FREQUENCY_AND_METHOD]
- **Document Sharing:** [SECURE_PORTAL/EMAIL_POLICY]
- **Emergency Contact:** [EMERGENCY_AVAILABILITY]
- **Language Services:** [LANGUAGES_SPOKEN_OR_TRANSLATION_SERVICES]

## FIRM POLICIES

### CONFIDENTIALITY
[ATTORNEY_CLIENT_PRIVILEGE_EXPLANATION_AND_CONFIDENTIALITY_PRACTICES]

### CONFLICT OF INTEREST
[CONFLICT_CHECK_PROCESS_AND_POLICIES]

### CASE ACCEPTANCE
[CRITERIA_FOR_ACCEPTING_CASES_AND_REFERRAL_PRACTICES]

## FREQUENTLY ASKED QUESTIONS

**Q: How much will my case cost?**
A: [DETAILED_EXPLANATION_OF_COST_FACTORS_AND_ESTIMATION_PROCESS]

**Q: How long will my case take?**
A: [EXPLANATION_OF_TIMELINE_FACTORS_FOR_DIFFERENT_CASE_TYPES]

**Q: Do you offer payment plans?**
A: [PAYMENT_PLAN_AVAILABILITY_AND_TERMS]

**Q: Will I work directly with the attorney?**
A: [EXPLANATION_OF_ATTORNEY_INVOLVEMENT_VS_STAFF_SUPPORT]

**Q: What should I bring to my first appointment?**
A: [LIST_OF_DOCUMENTS_AND_INFORMATION_TO_BRING]

**Q: Do you handle cases outside of [LOCAL_AREA]?**
A: [GEOGRAPHIC_SCOPE_OF_PRACTICE]

**Q: What happens if I'm not satisfied with the service?**
A: [CLIENT_SATISFACTION_POLICY_AND_RESOLUTION_PROCESS]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_CASE_OUTCOME]"* - [CLIENT_INITIALS], [CASE_TYPE]
- *"[TESTIMONIAL_ABOUT_SERVICE_QUALITY]"* - [CLIENT_INITIALS], [CASE_TYPE]
- *"[TESTIMONIAL_ABOUT_COMMUNICATION]"* - [CLIENT_INITIALS], [CASE_TYPE]

## PROFESSIONAL RECOGNITION
- **Awards:** [LEGAL_AWARDS_AND_RECOGNITION]
- **Publications:** [LEGAL_PUBLICATIONS_OR_ARTICLES]
- **Speaking Engagements:** [CONFERENCES_OR_SEMINARS]
- **Professional Ratings:** [AVVO/MARTINDALE_HUBBELL_RATINGS]

## COMMUNITY INVOLVEMENT
- **Pro Bono Work:** [PRO_BONO_COMMITMENT_AND_CASES]
- **Community Organizations:** [COMMUNITY_INVOLVEMENT]
- **Legal Education:** [TEACHING_OR_MENTORING_ACTIVITIES]

## CONTACT INFORMATION
- **Main Office:** [PHONE] - [EMAIL]
- **[ATTORNEY_NAME_1]:** [DIRECT_PHONE] - [EMAIL]
- **[ATTORNEY_NAME_2]:** [DIRECT_PHONE] - [EMAIL]
- **Case Inquiries:** [INTAKE_EMAIL]
- **Billing Questions:** [BILLING_EMAIL]

## OFFICE LOCATION & ACCESSIBILITY
- **Address:** [FULL_ADDRESS_WITH_SUITE_NUMBER]
- **Parking:** [PARKING_AVAILABILITY_AND_INSTRUCTIONS]
- **Public Transportation:** [TRANSIT_OPTIONS]
- **Accessibility:** [ADA_COMPLIANCE_AND_ACCOMMODATIONS]
- **Nearby Landmarks:** [NOTABLE_NEARBY_LOCATIONS]`,
      },
    ],
  },
  {
    id: "home-services",
    name: "Home Services",
    icon: <Home className="h-4 w-4" />,
    description: "Cleaning, landscaping, contractors, home repair",
    templates: [
      {
        id: "home-cleaning",
        title: "Home Cleaning Service",
        description: "Perfect for residential and commercial cleaning services",
        tags: ["cleaning", "home", "residential", "commercial"],
        content: `# [CLEANING_COMPANY_NAME] - Professional Cleaning Services

## COMPANY INFORMATION
- **Business Name:** [CLEANING_COMPANY_NAME]
- **Service Type:** [Residential/Commercial/Both] Cleaning Services
- **Established:** [YEAR]
- **Service Area:** [CITIES_AND_RADIUS_SERVED]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE]

## BUSINESS HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS]
- **Sunday:** [WEEKEND_HOURS or "Closed"]
- **Emergency Services:** [AVAILABLE/NOT_AVAILABLE]
- **Holiday Schedule:** [HOLIDAY_AVAILABILITY]

## COMPANY OVERVIEW
[CLEANING_COMPANY_NAME] has been providing professional cleaning services to [SERVICE_AREA] since [YEAR]. We specialize in [CLEANING_SPECIALTIES] and pride ourselves on [UNIQUE_SELLING_POINTS].

**Our Mission:** [MISSION_STATEMENT]

**Why Choose Us:**
- [BENEFIT_1 - e.g., Bonded and insured team]
- [BENEFIT_2 - e.g., Eco-friendly cleaning products]
- [BENEFIT_3 - e.g., 100% satisfaction guarantee]
- [BENEFIT_4 - e.g., Flexible scheduling]

## RESIDENTIAL CLEANING SERVICES

### REGULAR CLEANING SERVICES
**Weekly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

**Bi-Weekly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

**Monthly Cleaning:** $[PRICE_RANGE] per visit
- [SERVICE_DETAIL_1]
- [SERVICE_DETAIL_2]
- [SERVICE_DETAIL_3]

### DEEP CLEANING SERVICES
**Initial Deep Clean:** $[PRICE_RANGE]
- [DETAILED_SERVICE_1]
- [DETAILED_SERVICE_2]
- [DETAILED_SERVICE_3]
- [DETAILED_SERVICE_4]

**Spring/Fall Deep Clean:** $[PRICE_RANGE]
- [SEASONAL_SERVICE_1]
- [SEASONAL_SERVICE_2]
- [SEASONAL_SERVICE_3]

### SPECIALTY CLEANING SERVICES
- **Move-In/Move-Out Cleaning:** $[PRICE_RANGE]
- **Post-Construction Cleanup:** $[PRICE_RANGE]
- **Window Cleaning:** $[PRICE] per window
- **Carpet Cleaning:** $[PRICE] per room
- **Upholstery Cleaning:** $[PRICE_RANGE]

## COMMERCIAL CLEANING SERVICES

### OFFICE CLEANING
**Daily Service:** $[PRICE_RANGE] per square foot
- [OFFICE_SERVICE_1]
- [OFFICE_SERVICE_2]
- [OFFICE_SERVICE_3]

**Weekly Service:** $[PRICE_RANGE] per square foot
- [OFFICE_SERVICE_1]
- [OFFICE_SERVICE_2]

### SPECIALIZED COMMERCIAL SERVICES
- **Medical Office Cleaning:** $[PRICE_RANGE]
- **Restaurant Cleaning:** $[PRICE_RANGE]
- **Retail Store Cleaning:** $[PRICE_RANGE]
- **Warehouse Cleaning:** $[PRICE_RANGE]

## CLEANING PROCESS

### STANDARD CLEANING INCLUDES
**Kitchen:**
- [KITCHEN_TASK_1]
- [KITCHEN_TASK_2]
- [KITCHEN_TASK_3]
- [KITCHEN_TASK_4]

**Bathrooms:**
- [BATHROOM_TASK_1]
- [BATHROOM_TASK_2]
- [BATHROOM_TASK_3]
- [BATHROOM_TASK_4]

**Living Areas:**
- [LIVING_AREA_TASK_1]
- [LIVING_AREA_TASK_2]
- [LIVING_AREA_TASK_3]

**Bedrooms:**
- [BEDROOM_TASK_1]
- [BEDROOM_TASK_2]
- [BEDROOM_TASK_3]

### QUALITY ASSURANCE
- [QUALITY_CHECK_1]
- [QUALITY_CHECK_2]
- [QUALITY_CHECK_3]

## PRICING STRUCTURE

### FACTORS AFFECTING PRICING
- **Home Size:** [PRICING_BY_SQUARE_FOOTAGE_OR_ROOMS]
- **Frequency:** [DISCOUNT_FOR_REGULAR_SERVICE]
- **Condition:** [ADDITIONAL_CHARGES_FOR_HEAVILY_SOILED_AREAS]
- **Special Requests:** [PRICING_FOR_ADDITIONAL_SERVICES]

### PRICING EXAMPLES
- **1-2 Bedroom Apartment:** $[PRICE_RANGE]
- **3-4 Bedroom House:** $[PRICE_RANGE]
- **5+ Bedroom House:** $[PRICE_RANGE]

### DISCOUNTS & PROMOTIONS
- **New Customer Discount:** [DISCOUNT_PERCENTAGE]% off first cleaning
- **Referral Program:** [REFERRAL_REWARD_DETAILS]
- **Senior/Military Discount:** [DISCOUNT_PERCENTAGE]%
- **Regular Service Discount:** [DISCOUNT_FOR_WEEKLY_BIWEEKLY_SERVICE]

## BOOKING & SCHEDULING

### HOW TO BOOK
- **Online Booking:** [WEBSITE_URL/BOOKING_PAGE]
- **Phone Booking:** [PHONE_NUMBER]
- **Text Booking:** [TEXT_NUMBER] (if available)
- **Email Booking:** [EMAIL_ADDRESS]

### SCHEDULING OPTIONS
- **Same-Day Service:** [AVAILABLE/NOT_AVAILABLE] with [ADDITIONAL_FEE]
- **Recurring Appointments:** [PREFERRED_SCHEDULING_METHOD]
- **Flexible Timing:** [TIME_WINDOWS_AVAILABLE]
- **Key Holding Service:** [AVAILABLE_FOR_REGULAR_CUSTOMERS]

## POLICIES & PROCEDURES

### SERVICE POLICIES
- **Cancellation Policy:** [CANCELLATION_TIMEFRAME_AND_FEES]
- **Rescheduling:** [RESCHEDULING_POLICY]
- **Access Requirements:** [KEY_OR_ACCESS_REQUIREMENTS]
- **Pet Policy:** [PET_FRIENDLY_POLICY]
- **Satisfaction Guarantee:** [GUARANTEE_DETAILS]

### PAYMENT POLICIES
- **Payment Methods:** Cash, Check, Credit/Debit Cards, Online Payment
- **Payment Timing:** [PAYMENT_DUE_BEFORE/AFTER_SERVICE]
- **Late Payment:** [LATE_PAYMENT_POLICY]
- **Automatic Payment:** [AUTOPAY_OPTIONS]

### INSURANCE & BONDING
- **Liability Insurance:** $[COVERAGE_AMOUNT]
- **Bonding:** $[BONDING_AMOUNT]
- **Workers' Compensation:** [COVERAGE_DETAILS]
- **Background Checks:** [EMPLOYEE_SCREENING_PROCESS]

## CLEANING SUPPLIES & EQUIPMENT

### SUPPLIES PROVIDED
- **Cleaning Products:** [ECO_FRIENDLY/STANDARD] products included
- **Equipment:** [VACUUM_CLEANERS/MOPS/ETC] provided
- **Special Products:** [DISINFECTANTS/SPECIALTY_CLEANERS]

### CLIENT-PROVIDED SUPPLIES
- **Optional:** Clients may request use of their preferred products
- **Special Needs:** [ALLERGY_FRIENDLY/CHEMICAL_FREE_OPTIONS]

## TEAM INFORMATION
- **Team Size:** [NUMBER] professional cleaners
- **Experience:** Average [YEARS] years of cleaning experience
- **Training:** [TRAINING_PROGRAM_DETAILS]
- **Background Checks:** All employees undergo [SCREENING_PROCESS]
- **Uniforms:** [UNIFORM_POLICY]

## FREQUENTLY ASKED QUESTIONS

**Q: Do I need to be home during the cleaning?**
A: [HOME_PRESENCE_POLICY]

**Q: What if I'm not satisfied with the cleaning?**
A: [SATISFACTION_GUARANTEE_PROCESS]

**Q: Do you bring your own supplies?**
A: [SUPPLY_POLICY_DETAILS]

**Q: Are you insured and bonded?**
A: [INSURANCE_AND_BONDING_DETAILS]

**Q: How do I prepare for my first cleaning?**
A: [PREPARATION_INSTRUCTIONS]

**Q: Can you clean around my pets?**
A: [PET_POLICY_DETAILS]

**Q: Do you offer one-time cleanings?**
A: [ONE_TIME_SERVICE_AVAILABILITY]

## CUSTOMER TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_QUALITY]"* - [CUSTOMER_NAME], [LOCATION]
- *"[TESTIMONIAL_ABOUT_RELIABILITY]"* - [CUSTOMER_NAME], [LOCATION]
- *"[TESTIMONIAL_ABOUT_STAFF]"* - [CUSTOMER_NAME], [LOCATION]

## CONTACT INFORMATION
- **Owner/Manager:** [NAME] - [PHONE] - [EMAIL]
- **Scheduling:** [PHONE] - [EMAIL]
- **Billing Questions:** [PHONE] - [EMAIL]
- **Emergency Contact:** [PHONE]

## SERVICE AREA
We proudly serve the following areas:
- [CITY_1] and surrounding areas
- [CITY_2] and surrounding areas
- [CITY_3] and surrounding areas
- **Travel Fee:** [FEE_STRUCTURE] for areas outside [PRIMARY_SERVICE_AREA]`,
      },
    ],
  },
  {
    id: "technology",
    name: "Technology Services",
    icon: <Laptop className="h-4 w-4" />,
    description: "IT services, web development, tech support",
    templates: [
      {
        id: "it-services",
        title: "IT Services & Tech Support",
        description: "Comprehensive template for IT service providers and tech support companies",
        tags: ["IT", "technology", "support", "services"],
        content: `# [COMPANY_NAME] - IT Services & Technology Solutions

## COMPANY INFORMATION
- **Business Name:** [COMPANY_NAME]
- **Service Type:** [Managed IT Services/IT Support/Cybersecurity/Cloud Services]
- **Established:** [YEAR]
- **Service Area:** [GEOGRAPHIC_COVERAGE]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **LinkedIn:** [LINKEDIN_PROFILE]

## BUSINESS HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS or "Emergency Only"]
- **Sunday:** [WEEKEND_HOURS or "Emergency Only"]
- **24/7 Emergency Support:** [AVAILABLE/NOT_AVAILABLE]
- **Response Time:** [GUARANTEED_RESPONSE_TIME]

## COMPANY OVERVIEW
[COMPANY_NAME] provides comprehensive IT solutions to [TARGET_MARKET] throughout [SERVICE_AREA]. Since [YEAR], we've been helping businesses [VALUE_PROPOSITION] through reliable technology services and proactive support.

**Our Mission:** [MISSION_STATEMENT]

**Core Values:**
- [VALUE_1 - e.g., Proactive problem prevention]
- [VALUE_2 - e.g., Transparent communication]
- [VALUE_3 - e.g., Cutting-edge solutions]
- [VALUE_4 - e.g., Exceptional customer service]

## SERVICES OFFERED

### MANAGED IT SERVICES
**Complete IT Management:** $[PRICE_RANGE] per user/month
- [SERVICE_COMPONENT_1]
- [SERVICE_COMPONENT_2]
- [SERVICE_COMPONENT_3]
- [SERVICE_COMPONENT_4]

**Includes:**
- 24/7 Network Monitoring
- Help Desk Support
- Software Updates & Patches
- Backup & Disaster Recovery
- Cybersecurity Protection

### CYBERSECURITY SERVICES
**Security Assessment:** $[PRICE_RANGE]
- [ASSESSMENT_COMPONENT_1]
- [ASSESSMENT_COMPONENT_2]
- [ASSESSMENT_COMPONENT_3]

**Ongoing Security Management:** $[PRICE_RANGE] per month
- [SECURITY_SERVICE_1]
- [SECURITY_SERVICE_2]
- [SECURITY_SERVICE_3]

### CLOUD SERVICES
**Cloud Migration:** $[PRICE_RANGE]
- [MIGRATION_SERVICE_1]
- [MIGRATION_SERVICE_2]
- [MIGRATION_SERVICE_3]

**Cloud Management:** $[PRICE_RANGE] per month
- [CLOUD_MANAGEMENT_1]
- [CLOUD_MANAGEMENT_2]
- [CLOUD_MANAGEMENT_3]

### BACKUP & DISASTER RECOVERY
**Backup Solutions:** $[PRICE_RANGE] per month
- [BACKUP_FEATURE_1]
- [BACKUP_FEATURE_2]
- [BACKUP_FEATURE_3]

**Disaster Recovery Planning:** $[PRICE_RANGE]
- [DR_COMPONENT_1]
- [DR_COMPONENT_2]
- [DR_COMPONENT_3]

### NETWORK INFRASTRUCTURE
**Network Design & Installation:** $[PRICE_RANGE]
- [NETWORK_SERVICE_1]
- [NETWORK_SERVICE_2]
- [NETWORK_SERVICE_3]

**Network Maintenance:** $[PRICE_RANGE] per month
- [MAINTENANCE_SERVICE_1]
- [MAINTENANCE_SERVICE_2]

## SUPPORT SERVICES

### HELP DESK SUPPORT
**Unlimited Support:** Included with managed services
- **Phone Support:** [PHONE_NUMBER]
- **Email Support:** [SUPPORT_EMAIL]
- **Remote Support:** [REMOTE_ACCESS_TOOLS]
- **On-Site Support:** [AVAILABILITY_AND_PRICING]

### RESPONSE TIMES
- **Critical Issues:** [TIME_FRAME] response
- **High Priority:** [TIME_FRAME] response
- **Medium Priority:** [TIME_FRAME] response
- **Low Priority:** [TIME_FRAME] response

### SUPPORT CHANNELS
- **Phone:** [PHONE_NUMBER] - [AVAILABILITY]
- **Email:** [SUPPORT_EMAIL] - [RESPONSE_TIME]
- **Online Portal:** [PORTAL_URL] - 24/7 ticket submission
- **Remote Access:** [REMOTE_SUPPORT_AVAILABILITY]

## INDUSTRY SPECIALIZATIONS

### [INDUSTRY_1]
**Specialized Services:**
- [INDUSTRY_SPECIFIC_SERVICE_1]
- [INDUSTRY_SPECIFIC_SERVICE_2]
- [COMPLIANCE_REQUIREMENTS]

### [INDUSTRY_2]
**Specialized Services:**
- [INDUSTRY_SPECIFIC_SERVICE_1]
- [INDUSTRY_SPECIFIC_SERVICE_2]
- [COMPLIANCE_REQUIREMENTS]

## TECHNOLOGY PARTNERSHIPS
We partner with leading technology vendors:
- **[VENDOR_1]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]
- **[VENDOR_2]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]
- **[VENDOR_3]:** [PARTNERSHIP_LEVEL] - [SERVICES_PROVIDED]

## TEAM & CERTIFICATIONS

### TECHNICAL TEAM
**[TEAM_MEMBER_1] - [TITLE]**
- **Certifications:** [LIST_OF_CERTIFICATIONS]
- **Experience:** [YEARS] years in IT
- **Specializations:** [AREAS_OF_EXPERTISE]

**[TEAM_MEMBER_2] - [TITLE]**
- **Certifications:** [LIST_OF_CERTIFICATIONS]
- **Experience:** [YEARS] years in IT
- **Specializations:** [AREAS_OF_EXPERTISE]

### COMPANY CERTIFICATIONS
- [CERTIFICATION_1]
- [CERTIFICATION_2]
- [CERTIFICATION_3]

## PRICING STRUCTURE

### MANAGED SERVICES PRICING
**Essential Plan:** $[PRICE] per user/month
- [ESSENTIAL_FEATURE_1]
- [ESSENTIAL_FEATURE_2]
- [ESSENTIAL_FEATURE_3]

**Professional Plan:** $[PRICE] per user/month
- [ALL_ESSENTIAL_FEATURES]
- [PROFESSIONAL_FEATURE_1]
- [PROFESSIONAL_FEATURE_2]

**Enterprise Plan:** $[PRICE] per user/month
- [ALL_PROFESSIONAL_FEATURES]
- [ENTERPRISE_FEATURE_1]
- [ENTERPRISE_FEATURE_2]

### PROJECT-BASED PRICING
- **Network Setup:** $[PRICE_RANGE]
- **Server Installation:** $[PRICE_RANGE]
- **Security Audit:** $[PRICE_RANGE]
- **Cloud Migration:** $[PRICE_RANGE]

### HOURLY RATES
- **On-Site Support:** $[RATE] per hour
- **Remote Support:** $[RATE] per hour
- **Emergency Support:** $[RATE] per hour
- **Minimum Billing:** [MINIMUM_HOURS] hours

## SERVICE LEVEL AGREEMENTS (SLA)

### UPTIME GUARANTEES
- **Network Uptime:** [PERCENTAGE]%
- **Server Uptime:** [PERCENTAGE]%
- **Email Uptime:** [PERCENTAGE]%

### RESPONSE TIME COMMITMENTS
- **Critical Issues:** [TIME_COMMITMENT]
- **Non-Critical Issues:** [TIME_COMMITMENT]
- **Scheduled Maintenance:** [ADVANCE_NOTICE_PERIOD]

## FREQUENTLY ASKED QUESTIONS

**Q: What is included in your managed IT services?**
A: [COMPREHENSIVE_LIST_OF_MANAGED_SERVICES]

**Q: How quickly do you respond to support requests?**
A: [DETAILED_RESPONSE_TIME_BREAKDOWN]

**Q: Do you provide 24/7 support?**
A: [24_7_SUPPORT_AVAILABILITY_DETAILS]

**Q: Can you help with compliance requirements?**
A: [COMPLIANCE_SUPPORT_CAPABILITIES]

**Q: What happens if our systems go down?**
A: [EMERGENCY_RESPONSE_PROCEDURE]

**Q: Do you work with small businesses?**
A: [SMALL_BUSINESS_SERVICE_APPROACH]

**Q: How do you ensure data security?**
A: [SECURITY_MEASURES_AND_PROTOCOLS]

## CLIENT SUCCESS STORIES
- *"[TESTIMONIAL_ABOUT_RELIABILITY]"* - [CLIENT_NAME], [COMPANY_TITLE]
- *"[TESTIMONIAL_ABOUT_EXPERTISE]"* - [CLIENT_NAME], [COMPANY_TITLE]
- *"[TESTIMONIAL_ABOUT_SUPPORT]"* - [CLIENT_NAME], [COMPANY_TITLE]

## GETTING STARTED

### CONSULTATION PROCESS
1. **Initial Assessment:** [FREE_CONSULTATION_DETAILS]
2. **Needs Analysis:** [ASSESSMENT_PROCESS]
3. **Proposal Development:** [PROPOSAL_TIMELINE]
4. **Implementation:** [IMPLEMENTATION_PROCESS]
5. **Ongoing Support:** [SUPPORT_TRANSITION]

### ONBOARDING PROCESS
- **Week 1:** [ONBOARDING_STEP_1]
- **Week 2:** [ONBOARDING_STEP_2]
- **Week 3:** [ONBOARDING_STEP_3]
- **Ongoing:** [ONGOING_RELATIONSHIP_MANAGEMENT]

## CONTACT INFORMATION
- **General Manager:** [NAME] - [PHONE] - [EMAIL]
- **Technical Director:** [NAME] - [PHONE] - [EMAIL]
- **Sales Inquiries:** [PHONE] - [EMAIL]
- **Support Requests:** [PHONE] - [EMAIL]
- **Emergency Support:** [PHONE] - Available [HOURS]`,
      },
    ],
  },
  {
    id: "creative-services",
    name: "Creative Services",
    icon: <Camera className="h-4 w-4" />,
    description: "Photography, design, marketing, creative agencies",
    templates: [
      {
        id: "photography-studio",
        title: "Photography Studio",
        description: "Perfect for photographers, photo studios, and visual artists",
        tags: ["photography", "creative", "studio", "portraits"],
        content: `# [STUDIO_NAME] - Professional Photography Services

## STUDIO INFORMATION
- **Studio Name:** [STUDIO_NAME]
- **Photography Style:** [PORTRAIT/WEDDING/COMMERCIAL/EVENT/LIFESTYLE]
- **Established:** [YEAR]
- **Studio Location:** [FULL_ADDRESS]
- **Phone:** [PHONE_NUMBER]
- **Email:** [EMAIL_ADDRESS]
- **Website:** [WEBSITE_URL]
- **Social Media:** [@INSTAGRAM] | [FACEBOOK_PAGE] | [@PINTEREST]

## STUDIO HOURS
- **Monday-Friday:** [BUSINESS_HOURS]
- **Saturday:** [WEEKEND_HOURS]
- **Sunday:** [WEEKEND_HOURS or "By Appointment"]
- **Evening Sessions:** [AVAILABLE/BY_REQUEST]
- **Holiday Availability:** [HOLIDAY_BOOKING_POLICY]

## PHOTOGRAPHER PROFILE
**[PHOTOGRAPHER_NAME]** has been capturing [PHOTOGRAPHY_SPECIALTY] for [YEARS] years. [BRIEF_BACKGROUND_AND_PHILOSOPHY].

**Photography Style:** [DESCRIPTION_OF_ARTISTIC_STYLE]
**Approach:** [DESCRIPTION_OF_WORKING_APPROACH_WITH_CLIENTS]

**Education & Training:**
- [PHOTOGRAPHY_EDUCATION]
- [RELEVANT_WORKSHOPS_OR_CERTIFICATIONS]
- [PROFESSIONAL_ASSOCIATIONS]

## PHOTOGRAPHY SERVICES

### PORTRAIT PHOTOGRAPHY
**Individual Portraits:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

**Family Portraits:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

**Professional Headshots:** $[PRICE_RANGE]
- [SESSION_DURATION] session
- [NUMBER] edited high-resolution images
- [ADDITIONAL_INCLUSIONS]

### WEDDING PHOTOGRAPHY
**Wedding Package 1:** $[PRICE]
- [COVERAGE_HOURS] hours of coverage
- [NUMBER] edited high-resolution images
- [ADDITIONAL_SERVICES_INCLUDED]

**Wedding Package 2:** $[PRICE]
- [COVERAGE_HOURS] hours of coverage
- [NUMBER] edited high-resolution images
- [ADDITIONAL_SERVICES_INCLUDED]

**Engagement Sessions:** $[PRICE]
- [SESSION_DETAILS]

### EVENT PHOTOGRAPHY
**Corporate Events:** $[HOURLY_RATE] per hour
- [MINIMUM_HOURS] hour minimum
- [DELIVERABLES_INCLUDED]

**Private Events:** $[HOURLY_RATE] per hour
- [MINIMUM_HOURS] hour minimum
- [DELIVERABLES_INCLUDED]

### COMMERCIAL PHOTOGRAPHY
**Product Photography:** $[PRICE_RANGE]
- [NUMBER] products per session
- [EDITING_INCLUDED]
- [USAGE_RIGHTS]

**Business Photography:** $[PRICE_RANGE]
- [SESSION_DETAILS]
- [DELIVERABLES]

## STUDIO FACILITIES
**Main Studio:**
- [STUDIO_SIZE] with [LIGHTING_SETUP]
- [BACKDROP_OPTIONS]
- [PROPS_AVAILABLE]

**Equipment:**
- [CAMERA_EQUIPMENT]
- [LIGHTING_EQUIPMENT]
- [SPECIALIZED_EQUIPMENT]

**Amenities:**
- [CLIENT_AMENITIES]
- [CHANGING_AREA]
- [REFRESHMENTS]

## BOOKING PROCESS

### CONSULTATION
**Initial Consultation:** [FREE/PAID] - [DURATION]
- Discuss vision and goals
- Review portfolio and style
- Explain process and pricing
- Answer questions

### BOOKING REQUIREMENTS
- **Retainer:** [PERCENTAGE]% to secure date
- **Contract:** Signed photography agreement required
- **Final Payment:** Due [TIMEFRAME] before session
- **Rescheduling:** [RESCHEDULING_POLICY]

### SESSION PREPARATION
**What to Expect:**
- [PRE_SESSION_CONSULTATION_DETAILS]
- [SESSION_DURATION_AND_FLOW]
- [WARDROBE_GUIDANCE]
- [LOCATION_DETAILS]

## PRICING & PACKAGES

### SESSION FEES
All sessions include:
- [INCLUDED_SERVICE_1]
- [INCLUDED_SERVICE_2]
- [INCLUDED_SERVICE_3]
- [INCLUDED_SERVICE_4]

### ADDITIONAL SERVICES
- **Extra Editing:** $[PRICE] per image
- **Rush Delivery:** $[PRICE] for [TIMEFRAME] delivery
- **Additional Hours:** $[HOURLY_RATE]
- **Travel Fee:** $[RATE] for locations beyond [DISTANCE]

### PRINT SERVICES
- **8x10 Prints:** $[PRICE] each
- **11x14 Prints:** $[PRICE] each
- **16x20 Prints:** $[PRICE] each
- **Canvas Prints:** $[PRICE_RANGE]
- **Photo Albums:** $[PRICE_RANGE]

## DELIVERY & TIMELINE

### STANDARD DELIVERY
- **Sneak Peeks:** [TIMEFRAME] after session
- **Full Gallery:** [TIMEFRAME] after session
- **Delivery Method:** [ONLINE_GALLERY/USB/CLOUD_DOWNLOAD]
- **Gallery Access:** [DURATION] of access

### RUSH DELIVERY
- **Available:** [YES/NO] for additional fee
- **Timeline:** [RUSH_TIMEFRAME]
- **Additional Cost:** $[RUSH_FEE]

## POLICIES

### PAYMENT POLICY
- **Accepted Methods:** Cash, Check, Credit Cards, PayPal
- **Payment Schedule:** [RETAINER_AND_FINAL_PAYMENT_SCHEDULE]
- **Late Payment:** [LATE_PAYMENT_POLICY]

### CANCELLATION POLICY
- **Client Cancellation:** [CANCELLATION_TERMS_AND_REFUND_POLICY]
- **Weather Cancellation:** [WEATHER_POLICY_FOR_OUTDOOR_SESSIONS]
- **Photographer Cancellation:** [PHOTOGRAPHER_CANCELLATION_POLICY]

### USAGE RIGHTS
- **Client Rights:** [PERSONAL_USE_RIGHTS]
- **Commercial Use:** [COMMERCIAL_USE_POLICY]
- **Social Media:** [SOCIAL_MEDIA_USAGE_RIGHTS]
- **Photographer Rights:** [PORTFOLIO_AND_MARKETING_USAGE]

## SPECIALTY SERVICES

### [SPECIALTY_1]
**Description:** [DETAILED_DESCRIPTION]
**Pricing:** $[PRICE_RANGE]
**Includes:** [WHAT_IS_INCLUDED]

### [SPECIALTY_2]
**Description:** [DETAILED_DESCRIPTION]
**Pricing:** $[PRICE_RANGE]
**Includes:** [WHAT_IS_INCLUDED]

## FREQUENTLY ASKED QUESTIONS

**Q: How far in advance should I book?**
A: [BOOKING_TIMELINE_RECOMMENDATIONS]

**Q: What should I wear for my session?**
A: [WARDROBE_GUIDANCE_AND_STYLING_TIPS]

**Q: Can we include props or pets?**
A: [PROPS_AND_PETS_POLICY]

**Q: What happens if it rains during our outdoor session?**
A: [WEATHER_CONTINGENCY_PLAN]

**Q: How many photos will I receive?**
A: [PHOTO_DELIVERY_EXPECTATIONS]

**Q: Can I purchase the raw/unedited images?**
A: [RAW_IMAGE_POLICY]

**Q: Do you offer payment plans?**
A: [PAYMENT_PLAN_AVAILABILITY]

## CLIENT TESTIMONIALS
- *"[TESTIMONIAL_ABOUT_QUALITY]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_EXPERIENCE]"* - [CLIENT_NAME]
- *"[TESTIMONIAL_ABOUT_PROFESSIONALISM]"* - [CLIENT_NAME]

## AWARDS & RECOGNITION
- [PHOTOGRAPHY_AWARD_1] - [YEAR]
- [PHOTOGRAPHY_AWARD_2] - [YEAR]
- [PUBLICATION_FEATURE] - [PUBLICATION_NAME]

## CONTACT & BOOKING
- **Photographer:** [PHOTOGRAPHER_NAME] - [PHONE] - [EMAIL]
- **Booking Inquiries:** [BOOKING_EMAIL]
- **General Questions:** [GENERAL_EMAIL]
- **Studio Address:** [FULL_ADDRESS]

## PORTFOLIO
View our complete portfolio at [WEBSITE_URL]
Follow our latest work on Instagram [@INSTAGRAM_HANDLE]`,
      },
    ],
  },
]



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

  const exampleBusinessProfile = `
    // Your exampleBusinessProfile constant goes here
  `

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
        setCompletedSteps((prev) => [...prev.filter((s) => s !== 2), 2])
        toast({
          title: "Success",
          description: "Business profile saved successfully! Now set up your automation listeners.",
          variant: "default",
        })

        // Auto-navigate to automation setup after saving
        setTimeout(() => {
          setActiveTab("automation")
          setSetupStep(3)
        }, 1500)

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

    // Mark step 1 as completed and move to editor
    setCompletedSteps((prev) => [...prev.filter((s) => s !== 1), 1])
    setActiveTab("editor")
    setSetupStep(2)

    toast({
      title: "Template Selected!",
      description: "Template loaded in editor. Customize it with your business details.",
      variant: "default",
    })
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

  const handleAutomationSetup = () => {
    setCompletedSteps((prev) => [...prev.filter((s) => s !== 3), 3])
    toast({
      title: "Automation Setup Complete!",
      description: "Your business knowledge hub is now fully configured.",
      variant: "default",
    })
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

  const handleSelectMessageTemplate = (content: string) => {
    setSelectedTemplate(content)
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
    if (textarea) {
      textarea.value = content
      textarea.focus()
    }
  }

  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) return "completed"
    if (setupStep === step) return "active"
    return "pending"
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
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#768BDD]" />
              <p className="text-[#768BDD] font-bold">Business Knowledge Hub</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Progress Header */}
        <div className="bg-background-80 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-light-blue" />
              Setup Progress
            </h2>
            <Badge variant="outline" className="bg-background-90 text-muted-foreground">
              {completedSteps.length}/3 Complete
            </Badge>
          </div>

          <Progress value={setupProgress} className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { step: 1, title: "Choose Template", icon: FileText, description: "Select a business profile template" },
              {
                step: 2,
                title: "Customize Profile",
                icon: Settings,
                description: "Edit and save your business details",
              },
              { step: 3, title: "Setup Automation", icon: Zap, description: "Configure your automation listeners" },
            ].map(({ step, title, icon: Icon, description }) => {
              const status = getStepStatus(step)
              return (
                <Card
                  key={step}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    status === "completed" && "bg-green-500/10 border-green-500/30",
                    status === "active" && "bg-light-blue/10 border-light-blue/30",
                    status === "pending" && "bg-background-90 border-background-80",
                  )}
                  onClick={() => {
                    if (step === 1) {
                      setActiveTab("templates")
                      setSetupStep(1)
                    }
                    if (step === 2) {
                      setActiveTab("editor")
                      setSetupStep(2)
                    }
                    if (step === 3) {
                      setActiveTab("automation")
                      setSetupStep(3)
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          status === "completed" && "bg-green-500/20",
                          status === "active" && "bg-light-blue/20",
                          status === "pending" && "bg-background-80",
                        )}
                      >
                        {status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Icon
                            className={cn("h-4 w-4", status === "active" ? "text-light-blue" : "text-muted-foreground")}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={cn(
                            "font-medium text-sm",
                            status === "completed" && "text-green-400",
                            status === "active" && "text-light-blue",
                            status === "pending" && "text-muted-foreground",
                          )}
                        >
                          {title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      {status === "active" && <ArrowRight className="h-4 w-4 text-light-blue" />}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="templates" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="example" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Example
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab - Step 1 */}
          <TabsContent value="templates" className="space-y-4">
            <AnimatePresence>
              {setupStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert className="bg-blue-500/10 border-blue-500/30 mb-4">
                    <Target className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-500 font-medium">Step 1: Choose Your Template</AlertTitle>
                    <AlertDescription className="text-blue-400">
                      Select a template that matches your business type. This will give you a comprehensive starting
                      point.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-background-80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-light-blue" />
                  Business Profile Templates
                </h3>
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
                          <div className="flex-1">
                            <h4 className="font-medium text-light-blue">{template.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-background-80 border-background-70"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-3">
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
                          <div className="mt-3 text-sm whitespace-pre-wrap max-h-80 overflow-y-auto border border-background-80 rounded-md p-3 bg-background/50">
                            {template.content}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                            {template.content.substring(0, 200)}...
                          </p>
                        )}

                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-light-blue hover:bg-light-blue/90 text-white"
                            onClick={() => handleSelectTemplate(template.content)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Editor Tab - Step 2 */}
          <TabsContent value="editor" className="space-y-4">
            <AnimatePresence>
              {setupStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert className="bg-orange-500/10 border-orange-500/30 mb-4">
                    <Settings className="h-4 w-4 text-orange-500" />
                    <AlertTitle className="text-orange-500 font-medium">Step 2: Customize Your Profile</AlertTitle>
                    <AlertDescription className="text-orange-400">
                      Replace the placeholder text with your specific business information. The more detailed, the
                      better!
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-background-80 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                  Business Profile Editor
                </h3>
                {businessProfile && (
                  <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Content Ready
                  </Badge>
                )}
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
                    Replace the placeholder text in [BRACKETS] with your specific business information.
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
                      onClick={() => {
                        setBusinessProfile("")
                        if (textareaRef.current) {
                          textareaRef.current.value = ""
                        }
                      }}
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
                          Saved! Next: Setup Automation
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save & Continue
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

          {/* Automation Tab - Step 3 */}
          <TabsContent value="automation" className="space-y-4">
            <AnimatePresence>
              {setupStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Alert className="bg-green-500/10 border-green-500/30 mb-4">
                    <Zap className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500 font-medium">Step 3: Setup Automation</AlertTitle>
                    <AlertDescription className="text-green-400">
                      Configure how your AI will respond to customers using your business profile.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

            <div className="bg-background-80 p-4 rounded-xl">
              <h3 className="text-white font-medium flex items-center mb-4">
                <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                Automation Listeners
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {AUTOMATION_LISTENERS.map((listener) =>
                  listener.type === "SMARTAI" ? (
                    <SubscriptionPlan key={listener.type} type="PRO">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSetListener(listener.type)}
                        className={cn(
                          Listener === listener.type
                            ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]"
                            : "bg-background-90",
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
                        Listener === listener.type
                          ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]"
                          : "bg-background-90",
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

              <form
                onSubmit={(e) => {
                  onFormSubmit(e)
                  handleAutomationSetup()
                }}
                className="flex flex-col gap-4 mt-2"
              >
                {Listener && (
                  <div className="bg-background-90 p-4 rounded-xl mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium flex items-center">
                        {Listener === "SMARTAI" ? (
                          <>
                            <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
                            AI Suggestions
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                            Quick Responses
                          </>
                        )}
                      </h4>
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
                          className={`bg-background-80 p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                            Listener === "SMARTAI"
                              ? "text-keyword-purple hover:bg-keyword-purple/10"
                              : "text-light-blue hover:bg-light-blue/10"
                          }`}
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
                    className="bg-background-90 outline-none border-none ring-0 focus:ring-0 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
                  <Input
                    {...register("reply")}
                    placeholder="Add a reply for comments (Optional)"
                    className="bg-background-90 outline-none border-none ring-0 focus:ring-0"
                  />
                </div>

                <Button
                  className={cn(
                    "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
                    Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
                  )}
                >
                  <Loader state={isPending}>Complete Setup</Loader>
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Example Tab */}
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
                        <span>123 Main Street, Downtown, Metropolis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>(555) 123-4567</span>
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
                        <p className="text-2xl font-bold">2018</p>
                        <p className="text-xs text-muted-foreground">Founded by Emma Rodriguez</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background-80 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium mb-2">Business Overview</h4>
                  <p className="text-sm">
                    Scissors & Style is a premium hair salon located in Downtown Metropolis that specializes in
                    haircuts, coloring, styling, and hair treatments. Founded in 2018 by master stylist Emma Rodriguez,
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
                          <span className="font-medium">Emma Rodriguez</span>
                          <p className="text-xs text-muted-foreground">Owner/Master Stylist - 15 years experience</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">James Chen</span>
                          <p className="text-xs text-muted-foreground">Senior Stylist - 8 years experience</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Sophia Williams</span>
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
                  <li>Includes testimonials that showcase the business&apos;s strengths</li>
                  <li>Mentions unique selling points that differentiate from competitors</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Footer */}
        {completedSteps.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-green-400">Setup Complete!</h3>
                  <p className="text-sm text-green-300">Your Business Knowledge Hub is ready to use.</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                onClick={() => {
                  setActiveTab("automation")
                  setSetupStep(3)
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Automations
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </FloatingPanel>
  )
}

export default ThenAction
