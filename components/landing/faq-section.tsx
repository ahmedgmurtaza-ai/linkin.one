"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs?: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const defaultFAQs: FAQ[] = [
    {
      question: "What is Linkin.one and how does it work?",
      answer:
        "Linkin.one is a platform that allows you to consolidate all your social media profiles, portfolio, resume, and important links into one beautiful, customizable profile page. Simply create an account, add your links, customize your theme, and share your unique linkin.one/username URL with the world.",
    },
    {
      question: "Is Linkin.one free to use?",
      answer:
        "Yes! We offer a free plan that includes all essential features like unlimited links, basic analytics, QR code generation, and multiple theme options. You can upgrade to Pro for advanced features like custom domains, enhanced analytics, and priority support.",
    },
    {
      question: "Can I use my own custom domain?",
      answer:
        "Yes, with our Pro plan you can connect your own custom domain (e.g., links.yourname.com) instead of using linkin.one/username. This gives you complete brand control and a professional appearance.",
    },
    {
      question: "How do the individual platform URLs work?",
      answer:
        "Every profile gets dedicated URLs for each platform you add. For example, if your username is 'john', people can access your LinkedIn at linkin.one/john/linkedin, your GitHub at linkin.one/john/github, and so on. This makes sharing specific profiles incredibly easy.",
    },
    {
      question: "Can I track who visits my profile?",
      answer:
        "Yes! Our analytics dashboard shows you total visits, unique visitors, click-through rates for each link, geographic data, device types, and more. Pro users get access to advanced analytics including time-based insights and export capabilities.",
    },
    {
      question: "How do I upload my resume or documents?",
      answer:
        "In your admin dashboard, you can upload documents (PDF, DOCX, etc.) which will be hosted securely. You'll get a shareable link that you can add to your profile or share directly. You can also track how many times your resume has been downloaded.",
    },
    {
      question: "Can I change my username later?",
      answer:
        "Yes, you can change your username at any time from your account settings. However, keep in mind that this will change all your profile URLs, so we recommend choosing carefully and updating any places where you've shared your old links.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Absolutely. We take security seriously. All data is encrypted, we never share your information with third parties, and you have full control over what's visible on your profile. You can make your profile private or public at any time.",
    },
    {
      question: "What themes and layouts are available?",
      answer:
        "We offer multiple pre-designed themes (Light, Dark, Violet, Blue, Rose, Slate, etc.) and three layout styles (Classic, Grid, and Split). Free users can choose from all themes, while Pro users can customize colors to perfectly match their brand.",
    },
    {
      question: "Can I use Linkin.one for my business or team?",
      answer:
        "Yes! Many businesses use Linkin.one for their team members, creating consistent branded profiles. We're also working on team and enterprise plans with additional features like centralized management, team analytics, and white-label options.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes! Free users have access to email support and our help center. Pro users get priority support with faster response times. We're here to help you succeed and make the most of your profile.",
    },
    {
      question: "How is Linkin.one different from other link-in-bio tools?",
      answer:
        "Unlike other tools, we offer individual URLs for each platform (linkin.one/username/platform), advanced analytics, document hosting, multiple layout options, and a focus on professional use cases. We're built specifically for freelancers, creators, and professionals who want more than just a list of links.",
    },
  ]

  const displayFAQs = faqs || defaultFAQs

  return (
    <div className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Linkin.one
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {displayFAQs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:support@linkin.one"
            className="text-primary hover:underline font-medium"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  )
}
