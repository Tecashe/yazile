import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Sparkles, X } from "lucide-react"
import PricingCard from "@/components/global/landing/pricing-card"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Yazzil</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 radial--gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Simple Pricing
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Choose the Perfect Plan for Your Business
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Start with our free trial and scale as you grow. All plans include our core features with no hidden
                fees.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <PricingCard
                title="Starter"
                price={49}
                description="Perfect for small businesses just getting started with social media automation."
                features={[
                  "1 social media account",
                  "Basic automation features",
                  "5 automated responses per day",
                  "Email support",
                  "Analytics dashboard",
                  "Lead qualification (basic)",
                ]}
                buttonText="Start Free Trial"
                popular={false}
              />
              <PricingCard
                title="Pro"
                price={99}
                description="For growing businesses looking to scale their social media presence."
                features={[
                  "5 social media accounts",
                  "Advanced automation features",
                  "Unlimited automated responses",
                  "Influencer discovery tools",
                  "Advanced lead qualification",
                  "Priority support",
                  "Custom workflows",
                  "CRM integrations",
                ]}
                buttonText="Start Free Trial"
                popular={true}
              />
              <PricingCard
                title="Enterprise"
                price={249}
                description="For large businesses with complex social media and influencer marketing needs."
                features={[
                  "Unlimited social media accounts",
                  "Custom automation workflows",
                  "Advanced influencer management",
                  "Enterprise lead scoring",
                  "Custom integrations",
                  "Dedicated account manager",
                  "White-label options",
                  "Advanced analytics",
                  "API access",
                ]}
                buttonText="Contact Sales"
                popular={false}
              />
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Compare Plans</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See what&apos;s included in each plan to find the perfect fit for your business.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Starter</th>
                    <th className="text-center p-4 font-medium">Pro</th>
                    <th className="text-center p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Social Media Accounts</td>
                    <td className="text-center p-4">1</td>
                    <td className="text-center p-4">5</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Automated Responses</td>
                    <td className="text-center p-4">5/day</td>
                    <td className="text-center p-4">Unlimited</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Influencer Discovery</td>
                    <td className="text-center p-4">
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Lead Qualification</td>
                    <td className="text-center p-4">Basic</td>
                    <td className="text-center p-4">Advanced</td>
                    <td className="text-center p-4">Enterprise</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Custom Workflows</td>
                    <td className="text-center p-4">
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">API Access</td>
                    <td className="text-center p-4">
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Support</td>
                    <td className="text-center p-4">Email</td>
                    <td className="text-center p-4">Priority</td>
                    <td className="text-center p-4">Dedicated Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-semibold">Can I change plans anytime?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we&apos;ll
                    prorate any billing differences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-semibold">Is there a free trial?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we offer a 14-day free trial with full access to all features. No credit card required to
                    start.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-semibold">What payment methods do you accept?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50">
                <CardHeader>
                  <h3 className="font-semibold">Can I cancel anytime?</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Absolutely. You can cancel your subscription at any time with no cancellation fees. Your access
                    continues until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Get Started?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of businesses already using Yazzil to grow their social media presence.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">Start Free Trial</Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
