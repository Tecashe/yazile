
"use client"

import type React from "react"

import { useState } from "react"
import {
  Clock,
  Phone,
  Check,
  X,
  Plus,
  Trash2,
  ShoppingBagIcon as BagShopping,
  PocketKnifeIcon as ForkKnife,
  PlaneIcon as Airplane,
  HomeIcon as House,
  Heart,
  GraduationCap,
  Briefcase,
  Flower,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { saveBusinessTypeData } from "@/actions/businfo" 


interface BusinessType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  gradient: string
  followUpComponent: React.ReactNode
}

// Common validation and formatting functions
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const formatPhoneNumber = (phone: string, countryCode: string): string => {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, "")
  return `+${countryCode} ${cleaned}`
}

interface FAQItem {
  question: string
  answer: string
}

// FAQ Component for all forms
function FAQSection({ id }: { id: string }) {
  const [faqs, setFaqs] = useState<FAQItem[]>([{ question: "", answer: "" }])

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const removeFAQ = (index: number) => {
    if (faqs.length > 1) {
      const newFaqs = [...faqs]
      newFaqs.splice(index, 1)
      setFaqs(newFaqs)
    }
  }

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs]
    newFaqs[index][field] = value
    setFaqs(newFaqs)
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="text-gray-300 flex items-center justify-between">
        <span>Common Customer Questions</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-gray-700 text-gray-300 hover:bg-gray-700"
          onClick={addFAQ}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Question
        </Button>
      </Label>

      {faqs.map((faq, index) => (
        <div key={index} className="space-y-2 border border-gray-700 rounded-md p-3">
          <div className="flex justify-between items-center">
            <Label htmlFor={`${id}-q-${index}`} className="text-gray-400">
              Question {index + 1}
            </Label>
            {faqs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
                onClick={() => removeFAQ(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Input
            id={`${id}-q-${index}`}
            value={faq.question}
            onChange={(e) => updateFAQ(index, "question", e.target.value)}
            placeholder="Enter a frequently asked question"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
          <Label htmlFor={`${id}-a-${index}`} className="text-gray-400">
            Answer
          </Label>
          <Textarea
            id={`${id}-a-${index}`}
            value={faq.answer}
            onChange={(e) => updateFAQ(index, "answer", e.target.value)}
            placeholder="Provide a clear and helpful answer"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>
      ))}
    </div>
  )
}

// Contact Information Component
function ContactInfoSection({ id }: { id: string }) {
  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)

  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("1")
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null)

  const [address, setAddress] = useState("")

  const checkEmail = (value: string) => {
    setEmail(value)
    if (value.length > 0) {
      setIsEmailValid(validateEmail(value))
    } else {
      setIsEmailValid(null)
    }
  }

  const checkPhone = (value: string) => {
    setPhone(value)
    if (value.length > 0) {
      // Basic validation - can be enhanced for different country formats
      setIsPhoneValid(/^\d{6,15}$/.test(value.replace(/\D/g, "")))
    } else {
      setIsPhoneValid(null)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="text-gray-300">
        Contact Information
      </Label>

      <div className="space-y-2">
        <Label htmlFor={`${id}-email`} className="text-gray-400 flex items-center gap-2">
          Email
          {isEmailValid === true && <Check className="h-4 w-4 text-green-500" />}
          {isEmailValid === false && <X className="h-4 w-4 text-red-500" />}
        </Label>
        <Input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => checkEmail(e.target.value)}
          placeholder="contact@example.com"
          className={`bg-gray-900 border-gray-700 text-gray-100 ${isEmailValid === false ? "border-red-500" : ""}`}
        />
        {isEmailValid === false && <p className="text-xs text-red-500">Please enter a valid email address</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-phone`} className="text-gray-400 flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          Phone Number
          {isPhoneValid === true && <Check className="h-4 w-4 text-green-500" />}
          {isPhoneValid === false && <X className="h-4 w-4 text-red-500" />}
        </Label>
        <div className="flex gap-2">
          <div className="w-24">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="+1" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-100 max-h-60">
                <SelectItem value="1">+1 (US/CA)</SelectItem>
                <SelectItem value="44">+44 (UK)</SelectItem>
                <SelectItem value="61">+61 (AU)</SelectItem>
                <SelectItem value="33">+33 (FR)</SelectItem>
                <SelectItem value="49">+49 (DE)</SelectItem>
                <SelectItem value="81">+81 (JP)</SelectItem>
                <SelectItem value="86">+86 (CN)</SelectItem>
                <SelectItem value="91">+91 (IN)</SelectItem>
                <SelectItem value="52">+52 (MX)</SelectItem>
                <SelectItem value="55">+55 (BR)</SelectItem>
                <SelectItem value="27">+27 (ZA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            id={`${id}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => checkPhone(e.target.value)}
            placeholder="Phone number"
            className={`bg-gray-900 border-gray-700 text-gray-100 flex-1 ${
              isPhoneValid === false ? "border-red-500" : ""
            }`}
          />
        </div>
        {isPhoneValid === false && <p className="text-xs text-red-500">Please enter a valid phone number</p>}
        {isPhoneValid === true && (
          <p className="text-xs text-gray-400">Formatted: {formatPhoneNumber(phone, countryCode)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-address`} className="text-gray-400">
          Address
        </Label>
        <Textarea
          id={`${id}-address`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Physical address"
          className="bg-gray-900 border-gray-700 text-gray-100"
        />
      </div>
    </div>
  )
}

// E-commerce specific follow-up component
function EcommerceFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">E-commerce Details</h3>
        <p className="text-gray-400">Tell us more about your e-commerce business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">E-commerce Platform</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="woocommerce">WooCommerce</SelectItem>
              <SelectItem value="etsy">Etsy</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="ebay">eBay</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-categories" className="text-gray-300">
              Product Categories
            </Label>
            <Textarea
              id="product-categories"
              placeholder="List your main product categories"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-audience" className="text-gray-300">
              Target Audience
            </Label>
            <Textarea
              id="target-audience"
              placeholder="Describe your target customer demographics"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Order Processing</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="order-tracking"
                className="rounded border-gray-700 bg-gray-900 text-blue-600"
              />
              <Label htmlFor="order-tracking" className="text-gray-300">
                Order Tracking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="returns" className="rounded border-gray-700 bg-gray-900 text-blue-600" />
              <Label htmlFor="returns" className="text-gray-300">
                Returns & Exchanges
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="shipping-options"
                className="rounded border-gray-700 bg-gray-900 text-blue-600"
              />
              <Label htmlFor="shipping-options" className="text-gray-300">
                Shipping Options
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="international-shipping"
                className="rounded border-gray-700 bg-gray-900 text-blue-600"
              />
              <Label htmlFor="international-shipping" className="text-gray-300">
                International Shipping
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customer-support"
                className="rounded border-gray-700 bg-gray-900 text-blue-600"
              />
              <Label htmlFor="customer-support" className="text-gray-300">
                Customer Support
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="loyalty-program"
                className="rounded border-gray-700 bg-gray-900 text-blue-600"
              />
              <Label htmlFor="loyalty-program" className="text-gray-300">
                Loyalty Program
              </Label>
            </div>
          </div>
        </div>

        <ContactInfoSection id="ecommerce-contact" />

        <FAQSection id="ecommerce-faq" />
      </div>
    </div>
  )
}

// Restaurant specific follow-up component
function RestaurantFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Restaurant Details</h3>
        <p className="text-gray-400">Tell us more about your restaurant business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Cuisine Type</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="american">American</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="menu-highlights" className="text-gray-300">
              Menu Highlights
            </Label>
            <Textarea
              id="menu-highlights"
              placeholder="List your signature dishes and specialties"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-ambiance" className="text-gray-300">
              Restaurant Ambiance
            </Label>
            <Textarea
              id="restaurant-ambiance"
              placeholder="Describe the restaurant's atmosphere and decor"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Services Offered</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="dine-in" className="rounded border-gray-700 bg-gray-900 text-yellow-600" />
              <Label htmlFor="dine-in" className="text-gray-300">
                Dine-In
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="takeout" className="rounded border-gray-700 bg-gray-900 text-yellow-600" />
              <Label htmlFor="takeout" className="text-gray-300">
                Takeout
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="delivery" className="rounded border-gray-700 bg-gray-900 text-yellow-600" />
              <Label htmlFor="delivery" className="text-gray-300">
                Delivery
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="catering" className="rounded border-gray-700 bg-gray-900 text-yellow-600" />
              <Label htmlFor="catering" className="text-gray-300">
                Catering
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reservations"
                className="rounded border-gray-700 bg-gray-900 text-yellow-600"
              />
              <Label htmlFor="reservations" className="text-gray-300">
                Reservations
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="online-ordering"
                className="rounded border-gray-700 bg-gray-900 text-yellow-600"
              />
              <Label htmlFor="online-ordering" className="text-gray-300">
                Online Ordering
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            Operating Hours
          </Label>
          <Textarea
            id="restaurant-hours"
            placeholder="Regular business hours and special timings"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="restaurant-contact" />

        <FAQSection id="restaurant-faq" />
      </div>
    </div>
  )
}

// Travel specific follow-up component
function TravelFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Travel & Hospitality Details</h3>
        <p className="text-gray-400">Tell us more about your travel business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Travel Type</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select travel type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="airline">Airline</SelectItem>
              <SelectItem value="agency">Travel Agency</SelectItem>
              <SelectItem value="tour">Tour Operator</SelectItem>
              <SelectItem value="rental">Car Rental</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destination-focus" className="text-gray-300">
              Destination Focus
            </Label>
            <Textarea
              id="destination-focus"
              placeholder="List your main travel destinations"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travel-style" className="text-gray-300">
              Travel Style
            </Label>
            <Textarea
              id="travel-style"
              placeholder="Describe your travel style (e.g., luxury, budget, adventure)"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Services Offered</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="flight-booking" className="rounded border-gray-700 bg-gray-900 text-sky-600" />
              <Label htmlFor="flight-booking" className="text-gray-300">
                Flight Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="hotel-booking" className="rounded border-gray-700 bg-gray-900 text-sky-600" />
              <Label htmlFor="hotel-booking" className="text-gray-300">
                Hotel Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="tour-packages" className="rounded border-gray-700 bg-gray-900 text-sky-600" />
              <Label htmlFor="tour-packages" className="text-gray-300">
                Tour Packages
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="car-rental" className="rounded border-gray-700 bg-gray-900 text-sky-600" />
              <Label htmlFor="car-rental" className="text-gray-300">
                Car Rental
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="travel-insurance"
                className="rounded border-gray-700 bg-gray-900 text-sky-600"
              />
              <Label htmlFor="travel-insurance" className="text-gray-300">
                Travel Insurance
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="visa-assistance"
                className="rounded border-gray-700 bg-gray-900 text-sky-600"
              />
              <Label htmlFor="visa-assistance" className="text-gray-300">
                Visa Assistance
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-400" />
            Booking Hours
          </Label>
          <Textarea
            id="booking-hours"
            placeholder="Availability for booking and support"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="travel-contact" />

        <FAQSection id="travel-faq" />
      </div>
    </div>
  )
}

// Real Estate specific follow-up component
function RealEstateFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Real Estate Details</h3>
        <p className="text-gray-400">Tell us more about your real estate business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Property Type</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="property-location" className="text-gray-300">
              Property Location
            </Label>
            <Textarea
              id="property-location"
              placeholder="List your main areas of operation"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-specialty" className="text-gray-300">
              Property Specialty
            </Label>
            <Textarea
              id="property-specialty"
              placeholder="Describe your property specialty (e.g., luxury homes, condos)"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Services Offered</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="property-sales"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="property-sales" className="text-gray-300">
                Property Sales
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="property-rentals"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="property-rentals" className="text-gray-300">
                Property Rentals
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="property-management"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="property-management" className="text-gray-300">
                Property Management
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="property-valuation"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="property-valuation" className="text-gray-300">
                Property Valuation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="investment-advice"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="investment-advice" className="text-gray-300">
                Investment Advice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="relocation-services"
                className="rounded border-gray-700 bg-gray-900 text-emerald-600"
              />
              <Label htmlFor="relocation-services" className="text-gray-300">
                Relocation Services
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="property-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            Office Hours
          </Label>
          <Textarea
            id="property-hours"
            placeholder="Regular business hours and availability"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="property-contact" />

        <FAQSection id="realestate-faq" />
      </div>
    </div>
  )
}

// Healthcare specific follow-up component
function HealthcareFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Healthcare Details</h3>
        <p className="text-gray-400">Tell us more about your healthcare business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Healthcare Specialty</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="general">General Practice</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              <SelectItem value="dentistry">Dentistry</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="services-offered" className="text-gray-300">
              Services Offered
            </Label>
            <Textarea
              id="services-offered"
              placeholder="List your main medical services"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance-accepted" className="text-gray-300">
              Insurance Accepted
            </Label>
            <Textarea
              id="insurance-accepted"
              placeholder="List accepted insurance providers"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
        <Label htmlFor="appointment-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Appointment OPtions
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="online-booking"
                className="rounded border-gray-700 bg-gray-900 text-cyan-600"
              />
              <Label htmlFor="online-booking" className="text-gray-300">
                Online Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="phone-booking" className="rounded border-gray-700 bg-gray-900 text-cyan-600" />
              <Label htmlFor="phone-booking" className="text-gray-300">
                Phone Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="walk-ins" className="rounded border-gray-700 bg-gray-900 text-cyan-600" />
              <Label htmlFor="walk-ins" className="text-gray-300">
                Walk-ins
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="virtual-consultations"
                className="rounded border-gray-700 bg-gray-900 text-cyan-600"
              />
              <Label htmlFor="virtual-consultations" className="text-gray-300">
                Virtual Consultations
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emergency-services"
                className="rounded border-gray-700 bg-gray-900 text-cyan-600"
              />
              <Label htmlFor="emergency-services" className="text-gray-300">
                Emergency Services
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="home-visits" className="rounded border-gray-700 bg-gray-900 text-cyan-600" />
              <Label htmlFor="home-visits" className="text-gray-300">
                Home Visits
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Appointment Hours
          </Label>
          <Textarea
            id="appointment-hours"
            placeholder="Regular appointment hours and availability"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="healthcare-contact" />

        <FAQSection id="healthcare-faq" />
      </div>
    </div>
  )
}

// Education specific follow-up component
function EducationFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Education Details</h3>
        <p className="text-gray-400">Tell us more about your education business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Education Type</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select education type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="online">Online Course</SelectItem>
              <SelectItem value="tutoring">Tutoring</SelectItem>
              <SelectItem value="training">Training Center</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subjects-taught" className="text-gray-300">
              Subjects Taught
            </Label>
            <Textarea
              id="subjects-taught"
              placeholder="List your main subjects and courses"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-students" className="text-gray-300">
              Target Students
            </Label>
            <Textarea
              id="target-students"
              placeholder="Describe your target student demographics"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Learning Options</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="in-person-classes"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="in-person-classes" className="text-gray-300">
                In-Person Classes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="online-courses"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="online-courses" className="text-gray-300">
                Online Courses
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="group-sessions"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="group-sessions" className="text-gray-300">
                Group Sessions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private-tutoring"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="private-tutoring" className="text-gray-300">
                Private Tutoring
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="workshops" className="rounded border-gray-700 bg-gray-900 text-violet-600" />
              <Label htmlFor="workshops" className="text-gray-300">
                Workshops
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="certification-programs"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="certification-programs" className="text-gray-300">
                Certification Programs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exam-preparation"
                className="rounded border-gray-700 bg-gray-900 text-violet-600"
              />
              <Label htmlFor="exam-preparation" className="text-gray-300">
                Exam Preparation
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-violet-400" />
            Class Hours
          </Label>
          <Textarea
            id="class-hours"
            placeholder="Regular class hours and availability"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="education-contact" />

        <FAQSection id="education-faq" />
      </div>
    </div>
  )
}

// Professional Services specific follow-up component
function ProfessionalServicesFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Professional Services Details</h3>
        <p className="text-gray-400">Tell us more about your professional services business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Service Type</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="legal">Legal Services</SelectItem>
              <SelectItem value="accounting">Accounting Services</SelectItem>
              <SelectItem value="consulting">Consulting Services</SelectItem>
              <SelectItem value="marketing">Marketing Services</SelectItem>
              <SelectItem value="it">IT Services</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="services-provided" className="text-gray-300">
              Services Provided
            </Label>
            <Textarea
              id="services-provided"
              placeholder="List your main professional services"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry-focus" className="text-gray-300">
              Industry Focus
            </Label>
            <Textarea
              id="industry-focus"
              placeholder="Describe your industry focus or specialties"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Service Options</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="on-site-services"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="on-site-services" className="text-gray-300">
                On-Site Services
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remote-services"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="remote-services" className="text-gray-300">
                Remote Services
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consultations"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="consultations" className="text-gray-300">
                Consultations
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="project-based"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="project-based" className="text-gray-300">
                Project-Based
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="retainer-based"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="retainer-based" className="text-gray-300">
                Retainer-Based
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="training-programs"
                className="rounded border-gray-700 bg-gray-900 text-slate-500"
              />
              <Label htmlFor="training-programs" className="text-gray-300">
                Training Programs
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            Service Hours
          </Label>
          <Textarea
            id="service-hours"
            placeholder="Regular service hours and availability"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="professional-contact" />

        <FAQSection id="professional-faq" />
      </div>
    </div>
  )
}

// Beauty & Wellness specific follow-up component
function BeautyWellnessFollowUp() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Beauty & Wellness Details</h3>
        <p className="text-gray-400">Tell us more about your beauty and wellness business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Service Category</Label>
          <Select>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="salon">Salon Services</SelectItem>
              <SelectItem value="spa">Spa Services</SelectItem>
              <SelectItem value="beauty">Beauty Products</SelectItem>
              <SelectItem value="wellness">Wellness Services</SelectItem>
              <SelectItem value="fitness">Fitness Classes</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="services-offered" className="text-gray-300">
              Services Offered
            </Label>
            <Textarea
              id="services-offered"
              placeholder="List your main beauty and wellness services"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-lines" className="text-gray-300">
              Product Lines
            </Label>
            <Textarea
              id="product-lines"
              placeholder="List your main product lines or brands"
              className="bg-gray-900 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Appointment Options</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="online-booking"
                className="rounded border-gray-700 bg-gray-900 text-fuchsia-600"
              />
              <Label htmlFor="online-booking" className="text-gray-300">
                Online Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="phone-booking"
                className="rounded border-gray-700 bg-gray-900 text-fuchsia-600"
              />
              <Label htmlFor="phone-booking" className="text-gray-300">
                Phone Booking
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="walk-ins" className="rounded border-gray-700 bg-gray-900 text-fuchsia-600" />
              <Label htmlFor="walk-ins" className="text-gray-300">
                Walk-ins
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="membership-programs"
                className="rounded border-gray-700 bg-gray-900 text-fuchsia-600"
              />
              <Label htmlFor="membership-programs" className="text-gray-300">
                Membership Programs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="loyalty-programs"
                className="rounded border-gray-700 bg-gray-900 text-fuchsia-600"
              />
              <Label htmlFor="loyalty-programs" className="text-gray-300">
                Loyalty Programs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gift-certificates"
                className="rounded border-gray-700 bg-gray-900 text-fuchsia-600"
              />
              <Label htmlFor="gift-certificates" className="text-gray-300">
                Gift Certificates
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-hours" className="text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-fuchsia-400" />
            Appointment Hours
          </Label>
          <Textarea
            id="appointment-hours"
            placeholder="Regular appointment hours and availability"
            className="bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>

        <ContactInfoSection id="beauty-contact" />

        <FAQSection id="beauty-faq" />
      </div>
    </div>
  )
}

const businessTypes: BusinessType[] = [
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: <BagShopping />,
    description: "Online store",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    followUpComponent: <EcommerceFollowUp />,
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: <ForkKnife />,
    description: "Food service",
    gradient: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
    followUpComponent: <RestaurantFollowUp />,
  },
  {
    id: "travel",
    name: "Travel",
    icon: <Airplane />,
    description: "Travel agency",
    gradient: "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500",
    followUpComponent: <TravelFollowUp />,
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: <House />,
    description: "Property sales",
    gradient: "bg-gradient-to-r from-green-500 via-lime-500 to-emerald-500",
    followUpComponent: <RealEstateFollowUp />,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <Heart />,
    description: "Medical services",
    gradient: "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500",
    followUpComponent: <HealthcareFollowUp />,
  },
  {
    id: "education",
    name: "Education",
    icon: <GraduationCap />,
    description: "Educational services",
    gradient: "bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500",
    followUpComponent: <EducationFollowUp />,
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <Briefcase />,
    description: "Consulting, legal, etc.",
    gradient: "bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500",
    followUpComponent: <ProfessionalServicesFollowUp />,
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: <Flower />,
    description: "Salon, spa, etc.",
    gradient: "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500",
    followUpComponent: <BeautyWellnessFollowUp />,
  },
]

// const BusinessTypeSelector = ({ businessId }: { businessId: string }) => {
  export default function BusinessTypeSelector({ businessId }: { businessId: string }) {

  const [selectedBusinessTypeId, setSelectedBusinessTypeId] = useState<string>("")
  const [businessTypeData, setBusinessTypeData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  const selectedBusinessType = businessTypes.find((type) => type.id === selectedBusinessTypeId)

  const handleDataChange = (data: any) => {
    setBusinessTypeData({
      ...businessTypeData,
      ...data,
    })
  }

  const handleSave = async () => {
    if (!selectedBusinessTypeId) {
      setSaveStatus({
        success: false,
        message: "Please select a business type",
      })
      return
    }

    setIsSaving(true)
    setSaveStatus(null)

    try {
      const dataToSave = {
        businessTypeId: selectedBusinessTypeId,
        businessTypeName: selectedBusinessType?.name || "",
        ...businessTypeData,
      }

      const result = await saveBusinessTypeData(businessId, dataToSave)

      if (result.status === 200) {
        setSaveStatus({
          success: true,
          message: "Business type data saved successfully",
        })
      } else {
        setSaveStatus({
          success: false,
          message: result.data,
        })
      }
    } catch (error) {
      setSaveStatus({
        success: false,
        message: "An error occurred while saving",
      })
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <div className="space-y-6">
      <Label className="text-gray-300">Business Type</Label>
      <Select value={selectedBusinessTypeId} onValueChange={setSelectedBusinessTypeId}>
        <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100 w-full">
          <SelectValue placeholder="Select your business type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
          {businessTypes.map((businessType) => (
            <SelectItem key={businessType.id} value={businessType.id}>
              <div className="flex items-center gap-2">
                {businessType.icon}
                {businessType.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBusinessType && selectedBusinessType.followUpComponent}

      {saveStatus && (
        <div
          className={`p-3 rounded-md ${saveStatus.success ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}
        >
          {saveStatus.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || !selectedBusinessTypeId}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isSaving ? "Saving..." : "Save Business Type Data"}
        </Button>
      </div>
    </div>
  )
}



