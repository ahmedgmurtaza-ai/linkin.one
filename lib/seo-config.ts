/**
 * SEO Configuration for linkin.one
 * Centralized SEO metadata, keywords, and structured data
 */

export const SITE_CONFIG = {
  name: "linkin.one",
  title: "linkin.one - One Link for Everything | Professional Link-in-Bio Platform",
  description:
    "Create your professional profile page with all your important links in one place. Share individual platform links like linkin.one/username/linkedin. Track analytics, upload documents, and customize themes. Free link-in-bio tool for creators, professionals, and businesses.",
  url: "https://linkin.one",
  ogImage: "https://linkin.one/og-background.png",
  twitterHandle: "@linkindotone",
  keywords: [
    "link in bio",
    "linkin.one",
    "bio link",
    "social media links",
    "personal profile page",
    "link tree alternative",
    "professional profile",
    "social links",
    "all in one link",
    "digital business card",
    "link aggregator",
    "portfolio links",
    "creator tools",
    "influencer tools",
    "social media marketing",
  ],
};

export const PAGE_SEO = {
  home: {
    title: "linkin.one - One Link for Everything | Professional Link-in-Bio Platform",
    description:
      "Create your professional profile page with all your important links in one place. Share individual platform links like linkin.one/username/linkedin. Track analytics, upload documents, and customize themes. Perfect for creators, professionals, and businesses.",
    keywords: [
      "link in bio",
      "linkin.one",
      "bio link tool",
      "link tree alternative",
      "social media links",
      "professional profile",
      "digital business card",
      "personal landing page",
      "creator links",
      "influencer bio link",
      "all social links",
      "link aggregator",
      "portfolio website",
      "professional networking",
      "social media marketing",
    ],
    canonical: "https://linkin.one",
  },
  login: {
    title: "Login - linkin.one | Access Your Profile Dashboard",
    description:
      "Login to your linkin.one account to manage your profile, links, analytics, and settings. Secure access to your professional link-in-bio dashboard.",
    keywords: [
      "linkin.one login",
      "sign in",
      "account access",
      "profile dashboard",
      "link management",
      "bio link login",
      "user authentication",
    ],
    canonical: "https://linkin.one/login",
  },
  register: {
    title: "Create Your Account - linkin.one | Free Sign Up",
    description:
      "Create your free linkin.one account today. Get your custom profile page, track link analytics, and share all your important links in one place. Sign up in seconds!",
    keywords: [
      "sign up linkin.one",
      "create account",
      "free registration",
      "get started",
      "new profile",
      "join linkin.one",
      "bio link registration",
      "free link in bio",
    ],
    canonical: "https://linkin.one/register",
  },
  admin: {
    title: "Dashboard - linkin.one | Manage Your Profile & Links",
    description:
      "Manage your linkin.one profile, add and edit links, track analytics, customize themes, and upload documents. Complete control over your link-in-bio page.",
    keywords: [
      "profile dashboard",
      "link management",
      "analytics dashboard",
      "edit profile",
      "customize links",
      "bio link editor",
      "profile settings",
      "link analytics",
    ],
    canonical: "https://linkin.one/admin",
  },
  feedback: {
    title: "Feedback - linkin.one | Share Your Thoughts",
    description:
      "Share your feedback, suggestions, and feature requests for linkin.one. Help us improve your link-in-bio experience.",
    keywords: [
      "feedback",
      "user feedback",
      "feature requests",
      "suggestions",
      "support",
      "contact",
    ],
    canonical: "https://linkin.one/feedback",
  },
  changelog: {
    title: "Changelog - linkin.one | Latest Updates & Features",
    description:
      "Stay updated with the latest features, improvements, and bug fixes for linkin.one. See what's new in our link-in-bio platform.",
    keywords: [
      "changelog",
      "updates",
      "new features",
      "release notes",
      "product updates",
      "version history",
    ],
    canonical: "https://linkin.one/changelog",
  },
  privacy: {
    title: "Privacy Policy - linkin.one | Your Data Protection",
    description:
      "Read linkin.one's privacy policy to understand how we collect, use, and protect your personal information and profile data.",
    keywords: [
      "privacy policy",
      "data protection",
      "user privacy",
      "GDPR compliance",
      "data security",
      "terms of service",
    ],
    canonical: "https://linkin.one/privacy",
  },
  terms: {
    title: "Terms of Service - linkin.one | User Agreement",
    description:
      "Read linkin.one's terms of service and user agreement. Understand your rights and responsibilities when using our platform.",
    keywords: [
      "terms of service",
      "user agreement",
      "terms and conditions",
      "legal terms",
      "service terms",
    ],
    canonical: "https://linkin.one/terms",
  },
};

/**
 * Generate SEO metadata for user profiles
 */
export function generateProfileSEO(profile: {
  username: string;
  displayName: string;
  description: string;
  thumbnailUrl?: string;
  links?: Array<{ platform: string; title: string; url: string }>;
}) {
  const profileUrl = `https://linkin.one/${profile.username}`;
  const platforms = profile.links?.map((link) => link.platform.toLowerCase()) || [];
  const platformKeywords = platforms.map((p) => `${profile.username} ${p}`);

  return {
    title: `${profile.displayName} (@${profile.username}) - All Links | linkin.one`,
    description:
      profile.description ||
      `Connect with ${profile.displayName} (@${profile.username}) on all platforms. Access all social media links, professional profiles, and contact information in one place.`,
    keywords: [
      profile.username,
      profile.displayName,
      `${profile.username} links`,
      `${profile.displayName} profile`,
      `${profile.username} social media`,
      `${profile.displayName} contact`,
      ...platformKeywords,
      "social links",
      "profile page",
      "all platforms",
      "contact info",
    ],
    canonical: profileUrl,
    ogImage: "https://linkin.one/og-background.png",
  };
}

/**
 * Generate SEO metadata for platform-specific redirects
 */
export function generatePlatformSEO(
  username: string,
  platform: string,
  displayName?: string,
  linkTitle?: string
) {
  const formattedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
  const name = displayName || username;
  const platformUrl = `https://linkin.one/${username}/${platform}`;

  return {
    title: `${name} on ${formattedPlatform} | linkin.one/${username}/${platform}`,
    description:
      linkTitle ||
      `Connect with ${name} on ${formattedPlatform}. Direct link to ${name}'s ${formattedPlatform} profile. Quick access via linkin.one/${username}/${platform}`,
    keywords: [
      `${username} ${platform}`,
      `${name} ${platform}`,
      `${username} ${platform} profile`,
      `${name} on ${formattedPlatform}`,
      `${platform} link`,
      `${formattedPlatform} profile`,
      "social media link",
      "direct link",
    ],
    canonical: platformUrl,
  };
}

/**
 * Generate JSON-LD structured data for profile pages
 */
export function generateProfileStructuredData(profile: {
  username: string;
  displayName: string;
  description: string;
  thumbnailUrl?: string;
  links?: Array<{ platform: string; url: string; title: string }>;
}) {
  const profileUrl = `https://linkin.one/${profile.username}`;

  // Person schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    alternateName: profile.username,
    description: profile.description,
    url: profileUrl,
    image: profile.thumbnailUrl,
    sameAs: profile.links?.map((link) => link.url).filter(Boolean) || [],
  };

  // ProfilePage schema
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: profile.displayName,
      alternateName: profile.username,
      description: profile.description,
      image: profile.thumbnailUrl,
    },
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://linkin.one",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: profile.displayName,
        item: profileUrl,
      },
    ],
  };

  return {
    personSchema,
    profilePageSchema,
    breadcrumbSchema,
  };
}

/**
 * Generate JSON-LD structured data for home page
 */
export function generateHomeStructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "linkin.one",
    alternateName: "Linkin One",
    url: "https://linkin.one",
    logo: "https://linkin.one/icon.svg",
    description: SITE_CONFIG.description,
    sameAs: [
      // Add your social media profiles here
      // "https://twitter.com/linkindotone",
      // "https://facebook.com/linkindotone",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "linkin.one",
    alternateName: "Linkin One",
    url: "https://linkin.one",
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://linkin.one/{username}",
      },
      "query-input": "required name=username",
    },
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "linkin.one",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: SITE_CONFIG.description,
  };

  return {
    organizationSchema,
    websiteSchema,
    webApplicationSchema,
  };
}

/**
 * Common Open Graph tags
 */
export function generateOpenGraphTags(config: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}) {
  return {
    "og:title": config.title,
    "og:description": config.description,
    "og:url": config.url,
    "og:site_name": SITE_CONFIG.name,
    "og:type": config.type || "website",
    "og:image": config.image || SITE_CONFIG.ogImage,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:locale": "en_US",
  };
}

/**
 * Common Twitter Card tags
 */
export function generateTwitterCardTags(config: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    "twitter:card": "summary_large_image",
    "twitter:site": SITE_CONFIG.twitterHandle,
    "twitter:creator": SITE_CONFIG.twitterHandle,
    "twitter:title": config.title,
    "twitter:description": config.description,
    "twitter:image": config.image || SITE_CONFIG.ogImage,
  };
}
