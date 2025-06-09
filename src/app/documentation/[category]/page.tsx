'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Sparkles, ChevronRight, Book, Clock, ArrowRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { notFound } from "next/navigation"

const documentationCategories = {
  "getting-started": {
    title: "Getting Started",
    description: "Everything you need to know to get up and running with Yazzil",
    articles: [
      {
        slug: "quick-start-guide",
        title: "Quick Start Guide",
        description: "Get up and running with Yazzil in under 10 minutes",
        readTime: "5 min",
        difficulty: "Beginner",
        content: `
# Quick Start Guide

Welcome to Yazzil! This guide will help you get started with social media automation in just a few minutes.

## Step 1: Create Your Account

1. Visit [yazzil.com](https://yazzil.com) and click "Get Started"
2. Enter your email address and create a secure password
3. Verify your email address
4. Complete your profile setup

## Step 2: Connect Your Social Media Accounts

### Connecting Instagram
1. Go to **Settings** > **Connected Accounts**
2. Click **Connect Instagram**
3. Log in with your Instagram credentials
4. Grant the necessary permissions

### Connecting Twitter/X
1. Click **Connect Twitter** in the same section
2. Authorize Yazzil to access your Twitter account
3. Select the accounts you want to manage

### Connecting LinkedIn
1. Click **Connect LinkedIn**
2. Sign in to your LinkedIn account
3. Allow Yazzil to manage your LinkedIn presence

## Step 3: Set Up Your First Automation

### Creating a Welcome Message Automation
1. Navigate to **Automations** > **Create New**
2. Choose **New Follower** as your trigger
3. Select **Send Direct Message** as your action
4. Customize your welcome message:

\`\`\`
Hi {first_name}! 👋 

Thanks for following us! We&apos;re excited to have you in our community. 

Feel free to reach out if you have any questions about social media automation!

Best regards,
The Yazzil Team
\`\`\`

5. Click **Save & Activate**

## Step 4: Add Personalization
Use dynamic variables to personalize messages:

- \`{first_name}\`: User&apos;s first name
- \`{username}\`: Their social media handle
- \`{company}\`: Your company name
- \`{website}\`: Your website URL
- \`{follower_count}\`: Their follower count

## Step 5: Set Timing
Configure when the automation runs:

**Immediate**: Send message right away
**Delayed**: Wait 5 minutes to avoid appearing robotic
**Scheduled**: Send during business hours only

**Business Hours**:
- Monday-Friday: 9 AM - 6 PM
- Time Zone: Your local time zone
- Exclude weekends and holidays

## Best Practices for Getting Started

### Do&apos;s
- Start with simple automations
- Test your responses before going live
- Monitor performance regularly
- Keep your brand voice consistent

### Don&apos;ts
- Don&apos;t automate everything immediately
- Avoid generic, robotic responses
- Don&apos;t ignore manual review opportunities
- Don&apos;t forget to update your templates regularly

## Next Steps

Now that you&apos;re set up, consider:
1. **Creating more advanced automations** - Learn about conditional logic and multi-step workflows
2. **Setting up lead qualification** - Automatically identify and score potential customers
3. **Exploring influencer tools** - Discover and manage influencer partnerships
4. **Integrating with your CRM** - Connect Yazzil to your existing business tools

## Getting Help

If you need assistance:
- Check our [comprehensive documentation](/documentation)
- Join our [community forum](https://community.yazzil.com)
- Contact support at support@yazzil.com
- Schedule a demo with our team

Welcome to the future of social media automation! 🚀
        `,
      },
      {
        slug: "account-setup",
        title: "Account Setup",
        description: "Complete guide to setting up your Yazzil account and preferences",
        readTime: "3 min",
        difficulty: "Beginner",
        content: `
# Account Setup

Setting up your Yazzil account properly is crucial for getting the most out of our platform. This guide covers everything from basic profile setup to advanced configuration options.

## Profile Configuration

### Basic Information
1. **Company Name**: Enter your business or brand name
2. **Industry**: Select your industry for tailored recommendations
3. **Company Size**: Choose your team size for appropriate features
4. **Time Zone**: Set your primary time zone for scheduling
5. **Website**: Add your website URL for link integration

### Brand Voice Settings
Configure how Yazzil represents your brand:

**Tone**: Choose from:
- Professional
- Friendly
- Casual
- Authoritative
- Playful

**Language Style**:
- Formal
- Conversational
- Technical
- Simple

**Brand Keywords**: Add 5-10 keywords that represent your brand

### Contact Preferences
Set up how you want to receive notifications:
- Email notifications
- SMS alerts (premium feature)
- In-app notifications
- Slack integration

## Team Management

### Adding Team Members
1. Go to **Settings** > **Team**
2. Click **Invite Member**
3. Enter email address and select role:
   - **Admin**: Full access to all features
   - **Manager**: Can create and edit automations
   - **Viewer**: Read-only access to analytics
   - **Editor**: Can manage content and responses

### Role Permissions

| Feature | Admin | Manager | Editor | Viewer |
|---------|-------|---------|--------|--------|
| Account Settings | ✅ | ❌ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ❌ |
| Create Automations | ✅ | ✅ | ❌ | ❌ |
| Edit Content | ✅ | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ |
| Manage Integrations | ✅ | ✅ | ❌ | ❌ |

## Security Settings

### Two-Factor Authentication
1. Navigate to **Security** settings
2. Click **Enable 2FA**
3. Scan QR code with your authenticator app
4. Enter verification code
5. Save backup codes in a secure location

### API Access
For developers and advanced integrations:
1. Go to **Developer** > **API Keys**
2. Click **Generate New Key**
3. Set permissions and expiration
4. Store your API key securely

### Session Management
- View active sessions
- Revoke access from specific devices
- Set session timeout preferences

## Billing and Subscription

### Plan Selection
Choose the plan that fits your needs:
- **Starter**: Perfect for small businesses
- **Professional**: For growing companies
- **Enterprise**: Advanced features for large organizations

### Payment Methods
Add and manage payment methods:
1. Credit/Debit cards
2. PayPal
3. Bank transfer (Enterprise only)

### Billing History
Access invoices and payment history in the billing section.

## Integration Setup

### CRM Integration
Connect your existing CRM:
- Salesforce
- HubSpot
- Pipedrive
- Zoho CRM

### Email Marketing
Sync with email platforms:
- Mailchimp
- Constant Contact
- SendGrid
- Campaign Monitor

### Analytics Tools
Connect analytics platforms:
- Google Analytics
- Facebook Pixel
- LinkedIn Insight Tag

## Compliance Settings

### GDPR Compliance
- Enable data processing consent
- Set data retention periods
- Configure right-to-be-forgotten requests

### Industry Regulations
Configure settings for:
- HIPAA (Healthcare)
- FINRA (Financial Services)
- SOX (Public Companies)

## Backup and Export

### Data Backup
- Automatic daily backups
- Manual backup creation
- Backup restoration options

### Data Export
Export your data in various formats:
- CSV for analytics data
- JSON for automation rules
- PDF for reports

## Account Verification

### Business Verification
For enhanced features:
1. Upload business registration documents
2. Verify business address
3. Confirm business phone number

### Social Media Verification
Verify ownership of social accounts:
1. Add verification meta tags
2. Upload verification files
3. Complete platform-specific verification

## Troubleshooting Common Setup Issues

### Connection Problems
- Check internet connectivity
- Verify social media credentials
- Review platform permissions

### Notification Issues
- Check spam/junk folders
- Verify email addresses
- Test notification settings

### Performance Optimization
- Optimize automation rules
- Review response templates
- Monitor API rate limits

Your account setup is now complete! You&apos;re ready to start automating your social media presence.
        `,
      },
    ],
  },
  "automation": {
    title: "Automation",
    description: "Learn how to create and manage automated social media workflows",
    articles: [
      {
        slug: "creating-first-automation",
        title: "Creating Your First Automation",
        description: "Step-by-step guide to building your first automated workflow",
        readTime: "12 min",
        difficulty: "Beginner",
        content: `
# Creating Your First Automation

Automation is the heart of Yazzil. This comprehensive guide will walk you through creating your first automation from start to finish.

## Understanding Automation Basics

### What is Social Media Automation?
Social media automation uses rules and triggers to automatically respond to interactions, engage with your audience, and manage your social presence without manual intervention.

### Key Components
Every automation consists of:
1. **Trigger**: What starts the automation
2. **Conditions**: Rules that must be met
3. **Actions**: What happens when triggered
4. **Filters**: Additional criteria to refine targeting

## Types of Triggers

### Engagement Triggers
- **New Follower**: When someone follows your account
- **Comment Received**: When someone comments on your posts
- **Direct Message**: When you receive a DM
- **Mention**: When someone mentions your account
- **Like**: When someone likes your content

### Time-Based Triggers
- **Scheduled**: Run at specific times
- **Recurring**: Repeat at intervals
- **Date-Based**: Trigger on specific dates

### Behavioral Triggers
- **Profile Visit**: When someone views your profile
- **Link Click**: When someone clicks your links
- **Story View**: When someone views your stories

## Building Your First Automation

### Step 1: Choose Your Trigger
Let&apos;s create a welcome message automation:

1. Go to **Automations** > **Create New**
2. Select **New Follower** as your trigger
3. Choose which social accounts to monitor

### Step 2: Set Conditions
Add conditions to refine when the automation runs:

**Account Type**: 
- Individual accounts only
- Business accounts only
- All account types

**Follower Count**:
- Minimum: 10 followers
- Maximum: 100,000 followers

**Location**:
- Specific countries or regions
- Language preferences

### Step 3: Create Your Action
Design what happens when triggered:

**Action Type**: Send Direct Message

**Message Template**:
\`\`\`
Hi {first_name}! 👋

Welcome to our community! We&apos;re thrilled to have you join us.

Here&apos;s what you can expect:
✨ Daily tips on social media automation
📈 Industry insights and trends
🎯 Exclusive content for our followers

Feel free to DM us anytime with questions!

Best,
The Yazzil Team
\`\`\`

### Step 5: Set Timing
Configure when the automation runs:

**Immediate**: Send message right away
**Delayed**: Wait 5 minutes to avoid appearing robotic
**Scheduled**: Send during business hours only

**Business Hours**:
- Monday-Friday: 9 AM - 6 PM
- Time Zone: Your local time zone
- Exclude weekends and holidays

## Advanced Automation Features

### Conditional Logic
Create complex workflows with if/then logic:

\`\`\`
IF follower_count > 1000 AND account_type = "business"
THEN send_business_welcome_message
ELSE send_standard_welcome_message
\`\`\`

### Multi-Step Sequences
Create follow-up sequences:

1. **Day 1**: Welcome message
2. **Day 3**: Share helpful resource
3. **Day 7**: Ask for feedback
4. **Day 14**: Promote your product/service

### A/B Testing
Test different message variations:
- **Version A**: Formal tone
- **Version B**: Casual tone
- **Version C**: Emoji-heavy

Track which performs better and optimize accordingly.

## Content Templates

### Welcome Messages
\`\`\`
Template 1 (Professional):
"Thank you for following {company}! We share insights on {industry} and look forward to connecting with you."

Template 2 (Friendly):
"Hey {first_name}! 🎉 Thanks for the follow! We can&apos;t wait to share amazing {industry} content with you!"

Template 3 (Value-First):
"Welcome {first_name}! As a thank you for following, here&apos;s our free guide: {resource_link}"
\`\`\`

### FAQ Responses
\`\`\`
Q: "What are your hours?"
A: "We&apos;re available Monday-Friday, 9 AM-6 PM EST. For urgent matters, please email support@{company}.com"

Q: "Do you offer free trials?"
A: "Yes! We offer a 14-day free trial with full access to all features. Sign up at {website}/trial"

Q: "How much does it cost?"
A: "Our plans start at $29/month. View all pricing options at {website}/pricing"
\`\`\`

## Testing Your Automation

### Test Mode
Before going live:
1. Enable **Test Mode**
2. Use test accounts to trigger automation
3. Review all messages and timing
4. Check personalization variables

### Quality Checklist
- [ ] Message sounds natural and on-brand
- [ ] All variables populate correctly
- [ ] Timing feels appropriate
- [ ] Conditions work as expected
- [ ] No spelling or grammar errors

## Monitoring and Optimization

### Key Metrics to Track
- **Response Rate**: How many people respond to automated messages
- **Engagement Rate**: Likes, comments, shares on automated content
- **Conversion Rate**: How many leads convert to customers
- **Unfollow Rate**: Monitor if automation causes unfollows

### Optimization Tips
1. **Personalize More**: Use additional data points
2. **Improve Timing**: Test different send times
3. **Refine Targeting**: Adjust conditions based on performance
4. **Update Content**: Refresh messages regularly

## Common Mistakes to Avoid

### Over-Automation
Don&apos;t automate everything. Keep some human interaction for:
- Complex customer service issues
- Sensitive topics
- High-value prospect conversations

### Generic Messages
Avoid messages that sound robotic:
❌ "Thank you for following our account."
✅ "Hey Sarah! Thanks for joining our community of marketing enthusiasts!"

### Ignoring Context
Consider the context of interactions:
- Don&apos;t send promotional messages to complaint comments
- Adjust tone based on the original message sentiment
- Respect cultural and time zone differences

## Scaling Your Automations

### Creating Automation Libraries
Build reusable templates for:
- Different industries
- Various campaign types
- Seasonal content
- Product launches

### Team Collaboration
- Assign automations to team members
- Set up approval workflows
- Create shared template libraries
- Establish brand voice guidelines

### Integration with Other Tools
Connect automations to:
- CRM systems for lead tracking
- Email marketing for follow-up sequences
- Analytics tools for performance monitoring
- Customer support platforms

## Advanced Automation Strategies

### Lead Scoring Integration
Automatically score leads based on:
- Engagement level
- Profile information
- Interaction history
- Website behavior

### Cross-Platform Coordination
Coordinate automations across platforms:
- Instagram comment → LinkedIn connection request
- Twitter mention → Email follow-up
- Facebook message → CRM lead creation

### Seasonal Automation
Create time-sensitive automations for:
- Holiday campaigns
- Product launches
- Industry events
- Seasonal promotions

Your first automation is now ready! Start with simple workflows and gradually add complexity as you become more comfortable with the platform.

Remember: Great automation feels personal and helpful, not robotic and pushy.
        `,
      },
    ],
  },
}

export default function DocumentationCategory({ params }: { params: { category: string } }) {
  const category = documentationCategories[params.category as keyof typeof documentationCategories]

  if (!category) {
    notFound()
  }

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
            <Link
              href="/documentation"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documentation
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border/50">
          <div className="container px-4 md:px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/documentation" className="hover:text-foreground">
                Documentation
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{category.title}</span>
            </div>
          </div>
        </section>

        {/* Category Header */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                {category.title}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">{category.title}</h1>
              <p className="text-xl text-muted-foreground max-w-3xl">{category.description}</p>
            </div>
          </div>
        </section>

        {/* Articles List */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.articles.map((article, i) => (
                <Card key={i} className="border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/documentation/${params.category}/${article.slug}`}>
                      <Button className="w-full">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Card className="border-primary/20 bg-primary/5 p-8 text-center">
              <Book className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button>Contact Support</Button>
                <Button variant="outline">Join Community</Button>
              </div>
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
