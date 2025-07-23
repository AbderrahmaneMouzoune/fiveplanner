import { APP_CONFIG } from '@/config/app.config'
import { FALLBACK_SEO } from '@/config/seo.config'
import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Outfit } from 'next/font/google'
import type React from 'react'

const geist = Outfit({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  ...FALLBACK_SEO,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FivePlanner',
  },
  keywords: [
    'FivePlanner, foot 5, football 5v5, organiser match, gestion joueurs, session football, réservation terrain, app foot, calendrier foot, application PWA foot, Five LeFive, foot entre amis',
  ],
  alternates: {
    canonical: APP_CONFIG.website,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#16a34a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content={APP_CONFIG.name} />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('five-planner-theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const resolvedTheme = theme === 'system' ? systemTheme : theme;
                document.documentElement.classList.add(resolvedTheme);
              })();
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Five Planner",
  "url": "https://fiveplanner.fr",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "All",
  "description": "Application web pour organiser facilement vos sessions de football à 5, gérer vos joueurs, réserver des terrains et consulter les statistiques.",
  "creator": {
    "@type": "Person",
    "name": "Abderrahmane Mouzoune"
  },
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "EUR"
  }
}`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
