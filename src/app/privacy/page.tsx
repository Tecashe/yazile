'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Shield, Eye, Users, Globe, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img src="/yazzil-logos.png" alt="Yazzil logo" className="h-16 w-16" />
              </div>
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
                Privacy Policy
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Privacy Matters to Us
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We&apos;re committed to protecting your privacy and being transparent about how we collect, use, and protect
                your information.
              </p>
              <p className="text-sm text-muted-foreground">Last updated: December 15, 2024</p>
            </div>
          </div>
        </section>

        {/* Privacy Overview */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-green-500" />
                  <h3 className="font-bold mb-2">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security for all your data</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Eye className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-bold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">Clear information about data usage</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-bold mb-2">User Control</h3>
                  <p className="text-sm text-muted-foreground">You control your data and privacy settings</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 text-center">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-bold mb-2">Global Compliance</h3>
                  <p className="text-sm text-muted-foreground">GDPR, CCPA, and other privacy laws</p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <p className="text-muted-foreground">
                      When you create an account, we collect basic information such as your name, email address, and
                      company information. This helps us provide personalized service and communicate with you about
                      your account.
                    </p>

                    <h3 className="text-lg font-semibold">Social Media Data</h3>
                    <p className="text-muted-foreground">
                      With your explicit permission, we access your connected social media accounts to provide
                      automation services. This includes posts, comments, messages, and engagement metrics. We only
                      access data necessary for the services you&apos;ve requested.
                    </p>

                    <h3 className="text-lg font-semibold">Usage Information</h3>
                    <p className="text-muted-foreground">
                      We collect information about how you use our platform, including features accessed, time spent,
                      and interaction patterns. This helps us improve our service and provide better user experiences.
                    </p>

                    <h3 className="text-lg font-semibold">Technical Information</h3>
                    <p className="text-muted-foreground">
                      We automatically collect technical information such as IP addresses, browser types, device
                      information, and operating systems. This information is used for security, analytics, and service
                      optimization.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Provision</h3>
                    <p className="text-muted-foreground">
                      We use your information to provide, maintain, and improve our social media automation services.
                      This includes processing your automations, managing your campaigns, and providing analytics.
                    </p>

                    <h3 className="text-lg font-semibold">Communication</h3>
                    <p className="text-muted-foreground">
                      We may use your contact information to send you service updates, security alerts, and support
                      messages. You can opt out of marketing communications at any time.
                    </p>

                    <h3 className="text-lg font-semibold">Security and Fraud Prevention</h3>
                    <p className="text-muted-foreground">
                      We use your information to protect our platform and users from fraud, abuse, and security threats.
                      This includes monitoring for suspicious activity and implementing security measures.
                    </p>

                    <h3 className="text-lg font-semibold">Legal Compliance</h3>
                    <p className="text-muted-foreground">
                      We may use your information to comply with legal obligations, respond to legal requests, and
                      protect our rights and the rights of others.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Providers</h3>
                    <p className="text-muted-foreground">
                      We work with trusted third-party service providers who help us operate our platform. These
                      providers are contractually bound to protect your information and use it only for specified
                      purposes.
                    </p>

                    <h3 className="text-lg font-semibold">Social Media Platforms</h3>
                    <p className="text-muted-foreground">
                      When you connect your social media accounts, we share necessary information with those platforms
                      to provide automation services. This sharing is governed by the platforms&apos; own privacy policies.
                    </p>

                    <h3 className="text-lg font-semibold">Legal Requirements</h3>
                    <p className="text-muted-foreground">
                      We may disclose your information if required by law, court order, or government request, or to
                      protect the safety and security of our users and platform.
                    </p>

                    <h3 className="text-lg font-semibold">Business Transfers</h3>
                    <p className="text-muted-foreground">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred to
                      the new entity. We will notify you of any such transfer and any changes to this privacy policy.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Encryption</h3>
                    <p className="text-muted-foreground">
                      All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We use
                      industry-standard security protocols to protect your information from unauthorized access.
                    </p>

                    <h3 className="text-lg font-semibold">Access Controls</h3>
                    <p className="text-muted-foreground">
                      We implement strict access controls and authentication measures. Only authorized personnel have
                      access to your data, and all access is logged and monitored.
                    </p>

                    <h3 className="text-lg font-semibold">Regular Audits</h3>
                    <p className="text-muted-foreground">
                      We conduct regular security audits and penetration testing to identify and address potential
                      vulnerabilities. Our security practices are reviewed by independent third parties.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Access and Portability</h3>
                    <p className="text-muted-foreground">
                      You have the right to access your personal information and request a copy of your data in a
                      portable format. You can download your data through your account settings or by contacting us.
                    </p>

                    <h3 className="text-lg font-semibold">Correction and Updates</h3>
                    <p className="text-muted-foreground">
                      You can update your account information at any time through your account settings. If you notice
                      any inaccuracies in your data, please let us know so we can correct them.
                    </p>

                    <h3 className="text-lg font-semibold">Deletion</h3>
                    <p className="text-muted-foreground">
                      You can request deletion of your account and associated data at any time. Some information may be
                      retained for legal or business purposes as outlined in our data retention policy.
                    </p>

                    <h3 className="text-lg font-semibold">Opt-Out</h3>
                    <p className="text-muted-foreground">
                      You can opt out of marketing communications and certain data processing activities. However,
                      opting out of essential communications may affect your ability to use our services.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                  <p className="text-muted-foreground">
                    We retain your information for as long as necessary to provide our services and comply with legal
                    obligations. Account information is retained while your account is active and for a reasonable
                    period after account closure. Social media data is processed in real-time and stored only as long as
                    necessary for service provision.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">7. International Transfers</h2>
                  <p className="text-muted-foreground">
                    Your information may be transferred to and processed in countries other than your own. We ensure
                    that such transfers comply with applicable privacy laws and provide adequate protection for your
                    information through appropriate safeguards.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
                  <p className="text-muted-foreground">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect
                    personal information from children under 13. If we become aware that we have collected such
                    information, we will take steps to delete it promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time to reflect changes in our practices or legal
                    requirements. We will notify you of any material changes by email or through our platform. Your
                    continued use of our services after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy or our privacy practices, please contact us:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> privacy@yazzil.com
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Address:</strong> 00100 Nairobi, Kenya
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Data Protection Officer:</strong> dpo@yazzil.com
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our privacy team is here to help. Contact us with any questions or concerns about your data.
              </p>
              <Button size="lg">Contact Privacy Team</Button>
            </Card>
          </div>
        </section>
      </main>
      {/* Footer */}
            <footer className="border-t border-border/50 bg-background py-12">
              <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <img src="/yazzil-logos.png" alt="Yazzil logo" className="h-16 w-16" />
                    </div>
      
                    <p className="text-sm text-muted-foreground">
                      The all-in-one platform for social media automation, influencer marketing, and lead qualification.
                    </p>
                    <div className="flex gap-4">
                      <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Instagram className="h-5 w-5" style={{ color: "#E4405F" }} />
                        <span className="sr-only">Instagram</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Facebook className="h-5 w-5" style={{ color: "#1877F2" }} />
                        <span className="sr-only">Facebook</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-5 w-5" style={{ color: "#1DA1F2" }} />
                        <span className="sr-only">Twitter</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-5 w-5" style={{ color: "#0A66C2" }} />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#features" className="text-muted-foreground hover:text-foreground">
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link href="#solutions" className="text-muted-foreground hover:text-foreground">
                          Solutions
                        </Link>
                      </li>
                      <li>
                        <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link href="/integrations" className="text-muted-foreground hover:text-foreground">
                          Integrations
                        </Link>
                      </li>
                      <li>
                        <Link href="/roadmap" className="text-muted-foreground hover:text-foreground">
                          Roadmap
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link href="/documentation" className="text-muted-foreground hover:text-foreground">
                          Documentation
                        </Link>
                      </li>
                      <li>
                        <Link href="/guides" className="text-muted-foreground hover:text-foreground">
                          Guides
                        </Link>
                      </li>
                      <li>
                        <Link href="/case-studies" className="text-muted-foreground hover:text-foreground">
                          Case Studies
                        </Link>
                      </li>
                      <li>
                        <Link href="/help" className="text-muted-foreground hover:text-foreground">
                          Help Center
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/about" className="text-muted-foreground hover:text-foreground">
                          About
                        </Link>
                      </li>
                      <li>
                        <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                          Careers
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
                  <p>© {new Date().getFullYear()} Yazzil. All rights reserved.</p>
                </div>
              </div>
            </footer>
    </div>
  )
}
