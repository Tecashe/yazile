import type { Metadata } from "next"
import HeroSection from "@/components/global/landing/hero-section"
import FeaturesSection from "@/components/global/landing/features-section"
import WorkflowSection from "@/components/global/landing/workflow-section"
import PricingSection from "@/components/global/landing/pricing-section"
import TestimonialsSection from "@/components/global/landing/testimonials-section"
import FaqSection from "@/components/global/landing/faq-section"
import CtaSection from "@/components/global/landing/cta-section"
import Footer from "@/components/global/landing/footer"
import Navbar from "@/components/global/landing/navbar"
import StatsTicker from "@/components/global/landing/stats-ticker"
import IntegrationLogos from "@/components/global/landing/integration-logos"
import AiChatDemo from "@/components/global/landing/ai-chat-demo"
import ContentFeatures from "@/components/global/landing/content-features"


export const metadata: Metadata = {
  title: "Yazil - Instagram DM Automation Platform",
  description:
    "Automate your Instagram DMs, increase engagement, and grow your business with our powerful AI-driven platform.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <Navbar />
      {/* <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn> */}

      <main className="relative">
        <HeroSection />
        <StatsTicker />
        <FeaturesSection />
        <div className="py-16 container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                Experience Our AI-Powered <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Instagram DM Assistant
                </span>
              </h2>
              <p className="text-slate-300 mb-6">
                Try our interactive demo to see how our AI handles common customer inquiries in real-time. Ask about
                shipping, returns, or product information to see the magic happen!
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300">Natural, human-like responses</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300">Instant replies to common questions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300">Personalized customer interactions</span>
                </li>
              </ul>
            </div>
            <AiChatDemo />
          </div>
        </div>
        <ContentFeatures />
        <WorkflowSection />
        <IntegrationLogos />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  )
}

