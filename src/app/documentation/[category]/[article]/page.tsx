'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Sparkles, ChevronRight, Clock, User, CheckCircle, BookOpen, ArrowRight } from 'lucide-react'
import { notFound } from "next/navigation"
import type { DocumentationData, DocumentationArticle } from "@/types/documentation"

// This would typically come from a CMS or database
const documentationData: DocumentationData = {
  "getting-started": {
    title: "Getting Started",
    articles: {
      "quick-start-guide": {
        title: "Quick Start Guide",
        description: "Get up and running with Yazzil in under 10 minutes",
        readTime: "5 min",
        difficulty: "Beginner",
        lastUpdated: "Dec 15, 2024",
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
Hi {name}! 👋 

Thanks for following us! We&apos;re excited to have you in our community. 

Feel free to reach out if you have any questions about social media automation!

Best regards,
The {company} Team
\`\`\`

5. Click **Save & Activate**

## Step 4: Configure Response Templates

### Setting Up FAQ Responses
1. Go to **Templates** > **Create Template**
2. Add common questions and responses:

**Question**: "What are your pricing plans?"
**Response**: "Great question! You can view all our pricing plans at {website}/pricing. We offer flexible options for businesses of all sizes."

**Question**: "How does automation work?"
**Response**: "Our AI-powered automation responds to comments and messages based on the rules you set up. It&apos;s like having a 24/7 social media assistant!"

## Step 5: Monitor Your Performance

### Accessing Analytics
1. Visit the **Analytics** dashboard
2. Review key metrics:
   - Response rate
   - Engagement growth
   - Lead generation
   - Time saved

### Setting Up Alerts
1. Go to **Settings** > **Notifications**
2. Enable alerts for:
   - High-priority messages
   - Automation failures
   - Weekly performance reports

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
        tableOfContents: [
          { title: "Create Your Account", anchor: "step-1-create-your-account" },
          { title: "Connect Social Media Accounts", anchor: "step-2-connect-your-social-media-accounts" },
          { title: "Set Up First Automation", anchor: "step-3-set-up-your-first-automation" },
          { title: "Configure Response Templates", anchor: "step-4-configure-response-templates" },
          { title: "Monitor Performance", anchor: "step-5-monitor-your-performance" },
          { title: "Best Practices", anchor: "best-practices-for-getting-started" },
          { title: "Next Steps", anchor: "next-steps" },
          { title: "Getting Help", anchor: "getting-help" },
        ],
      },
      "account-setup": {
        title: "Account Setup",
        description: "Complete guide to setting up your Yazzil account and preferences",
        readTime: "3 min",
        difficulty: "Beginner",
        lastUpdated: "Dec 14, 2024",
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

Your account setup is now complete! You&apos;re ready to start automating your social media presence.
        `,
        tableOfContents: [
          { title: "Profile Configuration", anchor: "profile-configuration" },
          { title: "Team Management", anchor: "team-management" },
          { title: "Security Settings", anchor: "security-settings" },
          { title: "Billing and Subscription", anchor: "billing-and-subscription" },
        ],
      },
      "connecting-social-accounts": {
        title: "Connecting Social Accounts",
        description: "Step-by-step guide to connecting all your social media platforms",
        readTime: "7 min",
        difficulty: "Beginner",
        lastUpdated: "Dec 13, 2024",
        content: `
# Connecting Social Accounts

Connecting your social media accounts is the foundation of using Yazzil effectively. This guide covers how to securely connect and manage all supported platforms.

## Supported Platforms

Yazzil currently supports:
- **Instagram** (Personal & Business accounts)
- **Twitter/X** (Personal & Business accounts)
- **LinkedIn** (Personal & Company pages)
- **Facebook** (Personal & Business pages)
- **TikTok** (Personal & Business accounts)
- **YouTube** (Channels)

## Before You Start

### Prerequisites
- Admin access to your social media accounts
- Business verification (for some platforms)
- Two-factor authentication enabled on your accounts

### Permissions Required
Yazzil needs the following permissions:
- Read messages and comments
- Send direct messages
- Post content (optional)
- Access basic profile information
- View analytics data

## Connecting Instagram

### Personal Instagram Account
1. Go to **Settings** > **Connected Accounts**
2. Click **Connect Instagram**
3. Enter your Instagram username and password
4. Complete two-factor authentication if enabled
5. Review and accept permissions
6. Click **Authorize**

### Instagram Business Account
1. Ensure your Instagram account is converted to Business
2. Connect your Facebook Business Page first
3. Follow the same steps as personal account
4. Additional business features will be automatically enabled

### Troubleshooting Instagram Connection
**Common Issues:**
- **"Account not found"**: Verify your username is correct
- **"Permission denied"**: Check if your account is public or business
- **"Connection timeout"**: Try again in a few minutes

## Connecting Twitter/X

### Standard Connection
1. Click **Connect Twitter** in Connected Accounts
2. You&apos;ll be redirected to Twitter&apos;s authorization page
3. Log in with your Twitter credentials
4. Review the permissions Yazzil is requesting
5. Click **Authorize app**
6. You&apos;ll be redirected back to Yazzil

### Twitter Blue/Premium Features
If you have Twitter Blue or Premium:
- Enhanced analytics access
- Longer message capabilities
- Priority support features

### Managing Multiple Twitter Accounts
1. Connect your primary account first
2. Use **Add Another Account** to connect additional accounts
3. Set which account is your default for automations

## Connecting LinkedIn

### Personal LinkedIn Profile
1. Click **Connect LinkedIn**
2. Sign in to your LinkedIn account
3. Review permissions for:
   - Profile information access
   - Connection management
   - Message sending capabilities
4. Click **Allow**

### LinkedIn Company Pages
1. Ensure you&apos;re an admin of the company page
2. Connect your personal profile first
3. Select **Add Company Page**
4. Choose the company page from the dropdown
5. Confirm admin permissions

### LinkedIn API Limitations
**Important Notes:**
- LinkedIn has strict API limits
- Some features require LinkedIn Partner status
- Message automation is limited to connections

## Connecting Facebook

### Personal Facebook Account
1. Click **Connect Facebook**
2. Log in to Facebook
3. Review app permissions
4. Select which data to share
5. Click **Continue**

### Facebook Business Pages
1. Connect personal account first
2. Select **Manage Pages** permission
3. Choose which pages to connect
4. Set up page-specific automations

### Facebook Messenger Integration
- Automatic message responses
- Lead qualification through Messenger
- Integration with Facebook Ads

## Connecting TikTok

### TikTok for Business
1. Ensure you have a TikTok Business account
2. Click **Connect TikTok**
3. Log in with your TikTok credentials
4. Accept business API permissions
5. Configure content posting preferences

### TikTok Limitations
- Limited automation features
- Focus on analytics and scheduling
- Comment management capabilities

## Connecting YouTube

### YouTube Channel Connection
1. Click **Connect YouTube**
2. Sign in with your Google account
3. Select the YouTube channel to connect
4. Grant permissions for:
   - Channel management
   - Comment moderation
   - Analytics access

### YouTube Studio Integration
- Automated comment responses
- Community post management
- Analytics tracking

## Managing Connected Accounts

### Account Dashboard
View all connected accounts in one place:
- Connection status
- Last sync time
- Permission levels
- Account health

### Refreshing Connections
If an account shows as disconnected:
1. Click **Refresh Connection**
2. Re-authenticate if prompted
3. Update any changed permissions

### Disconnecting Accounts
To remove an account:
1. Go to the account in your dashboard
2. Click **Disconnect**
3. Confirm the action
4. All associated automations will be paused

## Security Best Practices

### Account Security
- Use strong, unique passwords
- Enable two-factor authentication
- Regularly review connected apps
- Monitor account activity

### Permission Management
- Only grant necessary permissions
- Review permissions quarterly
- Revoke access for unused features
- Keep business and personal accounts separate

### Data Protection
- Understand what data is shared
- Review privacy settings regularly
- Use business accounts for business purposes
- Comply with platform terms of service

## Troubleshooting Common Issues

### Connection Failures
**"Authorization Error"**:
- Clear browser cache and cookies
- Try connecting in incognito mode
- Check if the platform is experiencing issues

**"Invalid Credentials"**:
- Verify username and password
- Check for typos
- Ensure account isn&apos;t locked

**"Permission Denied"**:
- Review account type requirements
- Check if you have admin access
- Verify account is in good standing

### Sync Issues
**"Data Not Updating"**:
- Check connection status
- Refresh the connection
- Contact support if issues persist

**"Missing Features"**:
- Verify account type supports the feature
- Check permission settings
- Update account if necessary

## Platform-Specific Tips

### Instagram Tips
- Use business accounts for better features
- Connect Facebook page for enhanced capabilities
- Regularly update bio and profile information

### Twitter Tips
- Verify your account for better reach
- Use Twitter Lists for better organization
- Monitor trending hashtags in your industry

### LinkedIn Tips
- Keep your profile updated and professional
- Engage with your network regularly
- Share valuable industry content

### Facebook Tips
- Optimize your business page
- Use Facebook Insights for analytics
- Engage with your community regularly

Your social accounts are now connected and ready for automation! Next, learn how to create your first automation workflow.
        `,
        tableOfContents: [
          { title: "Supported Platforms", anchor: "supported-platforms" },
          { title: "Before You Start", anchor: "before-you-start" },
          { title: "Connecting Instagram", anchor: "connecting-instagram" },
          { title: "Connecting Twitter/X", anchor: "connecting-twitterx" },
          { title: "Connecting LinkedIn", anchor: "connecting-linkedin" },
          { title: "Connecting Facebook", anchor: "connecting-facebook" },
          { title: "Connecting TikTok", anchor: "connecting-tiktok" },
          { title: "Connecting YouTube", anchor: "connecting-youtube" },
          { title: "Managing Connected Accounts", anchor: "managing-connected-accounts" },
          { title: "Security Best Practices", anchor: "security-best-practices" },
          { title: "Troubleshooting", anchor: "troubleshooting-common-issues" },
        ],
      },
    },
  },
  "automation": {
    title: "Automation",
    articles: {
      "creating-first-automation": {
        title: "Creating Your First Automation",
        description: "Step-by-step guide to building your first automated workflow",
        readTime: "12 min",
        difficulty: "Beginner",
        lastUpdated: "Dec 13, 2024",
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

## Advanced Automation Features

### Multi-Step Workflows
Create sequences of actions:
1. Send welcome message
2. Wait 2 days
3. Send follow-up content
4. Wait for response
5. Tag based on engagement

### Conditional Logic
Add if/then rules to your automations:
- If user has >1000 followers, send influencer message
- If user mentions "pricing", send pricing information
- If user is from specific region, customize language

### A/B Testing
Test different automation approaches:
- Create two versions of a message
- Randomly assign to different users
- Track which performs better
- Automatically use the winning version

## Testing Your Automation

### Test Mode
Before going live:
1. Enable **Test Mode** in your automation
2. Run simulations with sample data
3. Review the results
4. Make adjustments as needed

### Monitoring Performance
Once live, track:
- Response rates
- Engagement metrics
- Conversion data
- Error reports

### Optimization Tips
- Start simple and add complexity gradually
- Review automation logs weekly
- Update templates based on feedback
- A/B test different approaches

Your first automation is now ready! Start with simple workflows and gradually add complexity as you become more comfortable with the platform.

Remember: Great automation feels personal and helpful, not robotic and pushy.
        `,
        tableOfContents: [
          { title: "Understanding Automation Basics", anchor: "understanding-automation-basics" },
          { title: "Types of Triggers", anchor: "types-of-triggers" },
          { title: "Building Your First Automation", anchor: "building-your-first-automation" },
          { title: "Advanced Features", anchor: "advanced-automation-features" },
          { title: "Testing and Optimization", anchor: "testing-your-automation" },
        ],
      },
      "response-templates": {
        title: "Response Templates",
        description: "Create and manage automated response templates for common interactions",
        readTime: "6 min",
        difficulty: "Beginner",
        lastUpdated: "Dec 12, 2024",
        content: `
# Response Templates

Response templates are pre-written messages that Yazzil uses to automatically respond to common questions and interactions. This guide will help you create effective templates that sound natural and helpful.

## Understanding Response Templates

### What are Response Templates?
Response templates are pre-written messages that automatically respond to specific keywords, phrases, or types of interactions on your social media accounts.

### Benefits of Using Templates
- **Consistency**: Maintain your brand voice across all interactions
- **Efficiency**: Respond to common questions instantly
- **Scalability**: Handle hundreds of interactions without manual effort
- **24/7 Availability**: Provide support even when you&apos;re offline

## Types of Response Templates

### FAQ Templates
Answer frequently asked questions:
- Pricing information
- Business hours
- Product details
- Contact information

### Welcome Templates
Greet new followers and customers:
- Thank you messages
- Introduction to your brand
- Next steps guidance

### Support Templates
Handle customer service inquiries:
- Troubleshooting steps
- Escalation procedures
- Resource links

### Promotional Templates
Share offers and updates:
- New product announcements
- Special discounts
- Event invitations

## Creating Your First Template

### Step 1: Identify Common Questions
Review your social media interactions to find:
- Most frequently asked questions
- Common complaints or issues
- Repeated requests for information

### Step 2: Write Your Template
1. Go to **Templates** > **Create New Template**
2. Choose a template type
3. Write your response
4. Add personalization variables
5. Test the template

### Example Template Creation

**Template Name**: Pricing Inquiry
**Trigger Keywords**: "price", "cost", "how much", "pricing"
**Response**:
\`\`\`
Hi {first_name}! 👋

Thanks for your interest in Yazzil! Our pricing starts at $29/month for our Starter plan, which includes:

✅ Up to 3 social accounts
✅ 100 automated responses/month
✅ Basic analytics
✅ Email support

You can view all our plans and start a free 14-day trial at: {website}/pricing

Have any specific questions? Feel free to ask! 😊

Best,
The Yazzil Team
\`\`\`

## Template Best Practices

### Writing Effective Templates

**Do&apos;s:**
- Use a friendly, conversational tone
- Include personalization variables
- Provide specific, helpful information
- Add clear next steps
- Keep responses concise but complete

**Don&apos;ts:**
- Sound robotic or generic
- Use overly formal language
- Provide outdated information
- Make responses too long
- Forget to include contact options

### Personalization Variables

Use these variables to make templates feel personal:
- \`{first_name}\`: User&apos;s first name
- \`{username}\`: Their social media handle
- \`{company}\`: Your company name
- \`{website}\`: Your website URL
- \`{support_email}\`: Your support email
- \`{phone}\`: Your phone number

### Template Structure

**Effective Template Structure:**
1. **Greeting**: Personal welcome
2. **Acknowledgment**: Recognize their question/comment
3. **Information**: Provide helpful details
4. **Action**: Clear next steps
5. **Closing**: Friendly sign-off

## Managing Templates

### Template Categories
Organize templates by:
- **Platform**: Instagram, Twitter, LinkedIn
- **Type**: FAQ, Welcome, Support
- **Department**: Sales, Support, Marketing
- **Language**: English, Spanish, French

### Template Versioning
- Keep track of template changes
- A/B test different versions
- Update based on performance
- Archive outdated templates

### Team Collaboration
- Share templates across team members
- Set approval workflows for new templates
- Assign template ownership
- Create template guidelines

## Advanced Template Features

### Conditional Logic
Create smart templates that adapt based on context:

\`\`\`
IF user_type = "business" THEN
  "Thanks for your interest! Our Business plan might be perfect for you..."
ELSE
  "Thanks for your interest! Our Starter plan is great for individuals..."
\`\`\`

### Multi-Step Templates
Create follow-up sequences:
1. **Initial Response**: Answer the question
2. **Follow-up (24 hours)**: Check if they need more help
3. **Final Follow-up (1 week)**: Share additional resources

### Template Analytics
Track template performance:
- Response rates
- Engagement metrics
- Conversion rates
- User satisfaction scores

## Common Template Examples

### Business Hours Template
**Triggers**: "hours", "open", "closed", "when"
**Response**:
\`\`\`
Hi {first_name}!

Our business hours are:
🕘 Monday-Friday: 9 AM - 6 PM EST
🕘 Saturday: 10 AM - 4 PM EST
🕘 Sunday: Closed

For urgent matters outside these hours, please email us at {support_email} and we&apos;ll get back to you first thing!

Thanks! 😊
\`\`\`

### Product Demo Template
**Triggers**: "demo", "trial", "test", "try"
**Response**:
\`\`\`
Hi {first_name}! 

I&apos;d love to show you how Yazzil can help automate your social media!

🎯 Book a free 15-minute demo: {website}/demo
🆓 Or start your free 14-day trial: {website}/trial

During the demo, we&apos;ll:
✅ Set up your first automation
✅ Connect your social accounts
✅ Show you our analytics dashboard

What works better for your schedule?

Best,
{your_name}
\`\`\`

### Complaint Handling Template
**Triggers**: "problem", "issue", "not working", "bug"
**Response**:
\`\`\`
Hi {first_name},

I&apos;m sorry to hear you&apos;re experiencing an issue! 😔

To help resolve this quickly:
1️⃣ Please DM us with details about the problem
2️⃣ Include any error messages you&apos;re seeing
3️⃣ Let us know which device/browser you&apos;re using

Our support team will get back to you within 2 hours during business hours.

For immediate assistance: {support_email}

Thanks for your patience!

{your_name}
\`\`\`

## Testing and Optimization

### Template Testing
Before going live:
1. **Spell Check**: Review for typos and grammar
2. **Link Testing**: Verify all links work
3. **Variable Testing**: Ensure personalization works
4. **Tone Testing**: Check if it matches your brand voice

### Performance Monitoring
Track these metrics:
- **Response Rate**: How many people respond to your template
- **Engagement Rate**: Likes, shares, comments on template responses
- **Conversion Rate**: How many template interactions lead to sales
- **Satisfaction Score**: User feedback on template helpfulness

### Continuous Improvement
- Review template performance monthly
- Update based on new products/services
- Refresh language to stay current
- Remove underperforming templates

Your response templates are now ready to provide excellent automated customer service! Next, learn about setting up conditional logic for more advanced automations.
        `,
        tableOfContents: [
          { title: "Understanding Response Templates", anchor: "understanding-response-templates" },
          { title: "Types of Response Templates", anchor: "types-of-response-templates" },
          { title: "Creating Your First Template", anchor: "creating-your-first-template" },
          { title: "Template Best Practices", anchor: "template-best-practices" },
          { title: "Managing Templates", anchor: "managing-templates" },
          { title: "Advanced Template Features", anchor: "advanced-template-features" },
          { title: "Common Template Examples", anchor: "common-template-examples" },
          { title: "Testing and Optimization", anchor: "testing-and-optimization" },
        ],
      },
    },
  },
}

interface PageProps {
  params: {
    category: string;
    article: string;
  }
}

function YazzilDocumentationArticle({ params }: PageProps) {
  const categoryData = documentationData[params.category];

  if (!categoryData) {
    notFound();
  }

  const article = categoryData.articles[params.article];

  if (!article) {
    notFound();
  }

  const relatedArticles = Object.entries(categoryData.articles)
    .filter(([slug]) => slug !== params.article)
    .slice(0, 2);

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
              href={`/documentation/${params.category}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {categoryData.title}
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-64 border-r border-border/50 bg-muted/30">
          <div className="sticky top-16 p-6">
            <h3 className="font-semibold mb-4">On This Page</h3>
            <nav className="space-y-2">
              {article.tableOfContents.map((item, i) => (
                <Link
                  key={i}
                  href={`#${item.anchor}`}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          {/* Breadcrumb */}
          <section className="py-6 border-b border-border/50">
            <div className="container px-4 md:px-6 max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/documentation" className="hover:text-foreground">
                  Documentation
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/documentation/${params.category}`} className="hover:text-foreground">
                  {categoryData.title}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{article.title}</span>
              </div>
            </div>
          </section>

          {/* Article Header */}
          <section className="py-12 md:py-20">
            <div className="container px-4 md:px-6 max-w-4xl">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{article.difficulty}</Badge>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Last updated: {article.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">{article.title}</h1>

                <p className="text-xl text-muted-foreground">{article.description}</p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="py-8">
            <div className="container px-4 md:px-6 max-w-4xl">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .replace(/\n/g, "<br />")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/`(.*?)`/g, "<code>$1</code>"),
                  }}
                />
              </div>
            </div>
          </section>

          {/* Article Footer */}
          <section className="py-12 border-t border-border/50">
            <div className="container px-4 md:px-6 max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Was this article helpful?</span>
                <Button variant="outline" size="sm">
                  Yes
                </Button>
                <Button variant="outline" size="sm">
                  No
                </Button>
              </div>

              <Card className="border-border/50 bg-background/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Need more help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team for personalized assistance.
                    </p>
                  </div>
                  <Button>Contact Support</Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="container px-4 md:px-6 max-w-4xl">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedArticles.map(([slug, relatedArticle]) => (
                    <Card
                      key={slug}
                      className="border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {relatedArticle.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </div>
                        <h3 className="font-bold mb-2">{relatedArticle.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{relatedArticle.description}</p>
                        <Link href={`/documentation/${params.category}/${slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Read Article
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Newsletter CTA */}
          <section className="py-12">
            <div className="container px-4 md:px-6 max-w-4xl">
              <Card className="border-primary/20 bg-primary/5 p-8 text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get notified when we publish new documentation and guides.
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                  <Button>Subscribe</Button>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default YazzilDocumentationArticle;
