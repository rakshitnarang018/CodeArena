import { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'About Us | Company Name',
  description: 'Learn about our mission, values, and the passionate team behind our innovative digital solutions. Discover our journey and what drives us to create extraordinary experiences.',
  keywords: 'about us, company, team, mission, values, innovation, digital solutions',
  authors: [{ name: 'Company Name' }],
  creator: 'Company Name',
  publisher: 'Company Name',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourcompany.com/about',
    siteName: 'Company Name',
    title: 'About Us | Company Name',
    description: 'Learn about our mission, values, and the passionate team behind our innovative digital solutions.',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Company Name',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Company Name',
    description: 'Learn about our mission, values, and the passionate team behind our innovative digital solutions.',
    creator: '@yourcompany',
    images: ['/og-about.jpg'],
  },
  alternates: {
    canonical: 'https://yourcompany.com/about',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en" 
      className={`${inter.variable} ${poppins.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" content="#0f0f23" media="(prefers-color-scheme: dark)" />
        
        {/* Viewport optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Company Name",
              "url": "https://yourcompany.com",
              "logo": "https://yourcompany.com/logo.png",
              "description": "Innovative digital solutions company specializing in transforming ideas into extraordinary digital experiences.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Business Street",
                "addressLocality": "City",
                "addressRegion": "State",
                "postalCode": "12345",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-123-4567",
                "contactType": "customer service",
                "availableLanguage": "en"
              },
              "sameAs": [
                "https://twitter.com/yourcompany",
                "https://linkedin.com/company/yourcompany",
                "https://github.com/yourcompany"
              ],
              "foundingDate": "2020",
              "founder": {
                "@type": "Person",
                "name": "Sarah Johnson"
              },
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "50+"
              },
              "industry": "Technology",
              "keywords": "digital solutions, web development, mobile apps, UI/UX design, digital transformation"
            })
          }}
        />
      </head>
      <body 
        className={`
          font-sans antialiased 
          bg-background text-foreground
          scroll-smooth
          dashboard-content
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        {/* Skip to content for accessibility */}
        <a 
          href="#main-content" 
          className="
            sr-only focus:not-sr-only 
            absolute top-4 left-4 z-50 
            bg-primary text-primary-foreground 
            px-4 py-2 rounded-md 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-ring
          "
        >
          Skip to content
        </a>

        {/* Main content wrapper */}
        <main 
          id="main-content" 
          className="
            min-h-screen
            scroll-container
            focus:outline-none
          "
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Performance and accessibility scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimize scrolling performance
              if ('scrollBehavior' in document.documentElement.style) {
                document.documentElement.style.scrollBehavior = 'smooth';
              }
              
              // Reduce motion for users who prefer it
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.scrollBehavior = 'auto';
                document.documentElement.classList.add('reduce-motion');
              }
              
              // Theme detection and application
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  console.warn('Could not access localStorage for theme');
                }
              })();
              
              // Intersection Observer for animations
              if ('IntersectionObserver' in window) {
                const observerOptions = {
                  threshold: 0.1,
                  rootMargin: '0px 0px -50px 0px'
                };
                
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('animate-in');
                    }
                  });
                }, observerOptions);
                
                // Observe animation elements when DOM is ready
                document.addEventListener('DOMContentLoaded', () => {
                  document.querySelectorAll('[class*="fade-in"], [class*="slide-in"], [class*="bounce-in"]')
                    .forEach(el => observer.observe(el));
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}