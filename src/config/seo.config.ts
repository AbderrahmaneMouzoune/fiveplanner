import { Metadata } from 'next'
import { APP_CONFIG } from './app.config'

export const FALLBACK_SEO: Metadata = {
  metadataBase: new URL(APP_CONFIG.website),
  authors: [...APP_CONFIG.authors],
  creator: APP_CONFIG.creator,
  title: `${APP_CONFIG.name} ⚽ | Organisez vos matchs de foot 5 à 5 facilement`,
  description: `${APP_CONFIG.name} - Organisez vos matchs de foot 5v5 facilement : sessions, joueurs, terrains et stats. Interface moderne et rapide.`,
  alternates: {
    canonical: new URL(APP_CONFIG.website),
  },
  openGraph: {
    title: `${APP_CONFIG.name} ⚽ | Organisez vos matchs de foot 5 à 5 facilement`,
    url: new URL(APP_CONFIG.website),
    siteName: APP_CONFIG.name,
    images: [
      {
        url: APP_CONFIG.website + '/logo/opengraph-fiveplanner.png',
        width: 1920,
        height: 1080,
        alt: `${APP_CONFIG.name}`,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
    description: `Application web moderne pour organiser vos matchs de foot 5v5, gérer vos joueurs, réserver des terrains et suivre les stats.`,
  },
  twitter: {
    card: 'summary_large_image',
    site: APP_CONFIG.website,
    title: `${APP_CONFIG.name} ⚽ | Organisez vos matchs de foot 5 à 5 facilement`,
    description: `Gérez facilement vos sessions de foot avec Five Planner : joueurs, terrains, stats, calendriers et plus.`,
    images: [
      {
        url: APP_CONFIG.website + '/logo/opengraph-fiveplanner.png',
        width: 1920,
        height: 1080,
        alt: `${APP_CONFIG.name}`,
      },
    ],
  },
}
