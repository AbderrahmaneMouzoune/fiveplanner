import { APP_CONFIG } from '@/config/app.config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${APP_CONFIG.website}/sitemap.xml`,
  }
}
