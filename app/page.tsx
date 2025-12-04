import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { FeatureSection } from "@/components/landing/feature-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel"
import { ProfileShowcase } from "@/components/landing/profile-showcase"
import { LiveExamplesSection } from "@/components/landing/live-examples-section"
import { PricingPreviewSection } from "@/components/landing/pricing-preview-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { PAGE_SEO, generateHomeStructuredData } from "@/lib/seo-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: PAGE_SEO.home.keywords,
  alternates: {
    canonical: PAGE_SEO.home.canonical,
  },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: PAGE_SEO.home.canonical,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  },
};

export default function HomePage() {
  const structuredData = generateHomeStructuredData();
  // Feature data
  const features = [
    {
      title: "Single URL for All Platforms",
      description:
        "Share one link that gives access to all your social media profiles. Each platform gets its own dedicated URL for easy sharing.",
      features: [
        "Individual URLs like linkin.one/username/linkedin",
        "Direct access to linkin.one/username/github, /twitter, /youtube",
        "Easy to share in email signatures and business cards",
        "Perfect for professionals, creators, and freelancers",
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      imageSide: "right" as const,
    },
    {
      title: "Advanced Analytics & Insights",
      description:
        "Track your performance with detailed analytics. Know exactly how your audience interacts with your profile.",
      features: [
        "Real-time click tracking for each link",
        "Total profile visits and unique visitors",
        "Download analytics for resume and documents downloads",
        "Geographic and device insights",
        "Export data for deeper analysis",
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      imageSide: "left" as const,
    },
    {
      title: "Resume & Documents as Links",
      description:
        "Upload your resume, portfolio, or any document and share it as a clean link. No more email attachments.",
      features: [
        "Upload PDF, DOCX, and other document formats",
        "Share resume with a simple link",
        "Track how many times it's downloaded",
        "Update documents anytime without changing the link",
        "Professional presentation for recruiters",
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      imageSide: "right" as const,
    },
    {
      title: "Customizable Themes & Layouts",
      description:
        "Make your profile truly yours with multiple themes and layout options. Stand out with beautiful design.",
      features: [
        "Multiple pre-designed themes (Light, Dark, Colorful)",
        "Three layout styles: Classic, Grid, and Split",
        "Customize colors to match your brand",
        "Mobile-responsive designs",
        "Preview changes in real-time",
      ],
      icon: (
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      imageSide: "left" as const,
    },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Designer",
      content:
        "Linkin.one has simplified my online presence. Instead of sharing multiple links, I now share just one and everyone can find what they need. The analytics feature is amazing!",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "As a developer, I love how clean and professional my profile looks. The individual URLs for each platform are perfect for my GitHub, LinkedIn, and portfolio.",
    },
    {
      name: "Emma Rodriguez",
      role: "Freelance Writer",
      content:
        "The ability to upload my resume as a link has been a game-changer. Clients can easily access my work samples and portfolio without any hassle.",
    },
    {
      name: "David Park",
      role: "Marketing Consultant",
      content:
        "The customization options are fantastic. I was able to match my profile to my personal brand perfectly. My engagement has increased significantly!",
    },
    {
      name: "Lisa Thompson",
      role: "Content Creator",
      content:
        "I can track which of my social media platforms get the most clicks. This data helps me focus my content strategy. Highly recommend!",
    },
    {
      name: "James Wilson",
      role: "UX Researcher",
      content:
        "Clean, professional, and incredibly easy to set up. My profile was ready in less than 5 minutes. The mobile experience is flawless.",
    },
  ]

  // Example user profiles
  const userProfiles = [
    {
      username: "sarahdesigns",
      name: "Sarah J.",
      bio: "Product designer crafting delightful digital experiences",
      theme: "Violet",
      layout: "Grid",
    },
    {
      username: "michaeldev",
      name: "Michael C.",
      bio: "Full-stack developer | Open source contributor",
      theme: "Dark",
      layout: "Classic",
    },
    {
      username: "emmawriter",
      name: "Emma R.",
      bio: "Freelance writer specializing in tech and lifestyle",
      theme: "Light",
      layout: "Split",
    },
    {
      username: "davidmarketing",
      name: "David P.",
      bio: "Helping brands grow through strategic marketing",
      theme: "Blue",
      layout: "Grid",
    },
    {
      username: "lisacreates",
      name: "Lisa T.",
      bio: "Content creator | Photographer | Storyteller",
      theme: "Rose",
      layout: "Classic",
    },
    {
      username: "jamesux",
      name: "James W.",
      bio: "UX researcher passionate about user-centered design",
      theme: "Slate",
      layout: "Split",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />


      {/* FAQ Section */}
      <FAQSection />


     
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.webApplicationSchema),
        }}
      />
    </div>
  )
}
