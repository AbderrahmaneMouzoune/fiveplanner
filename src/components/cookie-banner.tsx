'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconCookie, IconX, IconExternalLink } from '@tabler/icons-react'

interface CookieBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('five-planner-cookie-consent')
    if (!cookieConsent) {
      // Délai pour laisser l'app se charger
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('five-planner-cookie-consent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('five-planner-cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  const handleClose = () => {
    localStorage.setItem('five-planner-cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-4 bottom-4 left-4 mx-auto max-w-md sm:right-6 sm:left-6 sm:max-w-lg">
        <Card className="border-border bg-card shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <IconCookie className="text-primary h-5 w-5" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    Nous utilisons des cookies
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience
                    et analyser l'utilisation de notre site. En continuant, vous
                    acceptez notre utilisation des cookies.
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <a
                    href="/privacy"
                    className="hover:text-primary inline-flex items-center gap-1 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Politique de confidentialité
                    <IconExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <Button onClick={handleAccept} size="sm" className="flex-1">
                    Accepter
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    Refuser
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0 p-0"
              >
                <IconX className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
