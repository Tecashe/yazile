import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 lg:py-16 border-t border-border bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange w-10 h-10 rounded-xl flex items-center justify-center">
                <Instagram className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">yazzil</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The most powerful Instagram DM automation platform. Scale your engagement, boost sales, and never miss a
              customer.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-orange/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-orange/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-orange/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted hover:bg-orange/20 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Demo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-instagram-purple transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 yazzil. All rights reserved. Built for Instagram businesses who want to scale.</p>
        </div>
      </div>
    </footer>
  )
}
