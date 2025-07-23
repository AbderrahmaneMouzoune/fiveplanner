"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IconCookie, IconX, IconExternalLink } from "@tabler/icons-react"

interface CookieBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieBanner({ onAccept, onDecline }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem("five-planner-cookie-consent")
    if (!cookieConsent) {
      // Délai pour laisser l'app se charger
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("five-planner-cookie-consent", "accepted")
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem("five-planner-cookie-consent", "declined")
    setIsVisible(false)
    onDecline()
  }

  const handleClose = () => {
    localStorage.setItem("five-planner-cookie-consent", "declined")
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-md mx-auto sm:max-w-lg">
        <Card className="border-border bg-card shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconCookie className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Nous utilisons des cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience et analyser l'utilisation de notre site.
                    En continuant, vous acceptez notre utilisation des cookies.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <a
                    href="/privacy"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Politique de confidentialité
                    <IconExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button onClick={handleAccept} size="sm" className="flex-1">
                    Accepter
                  </Button>
                  <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1 bg-transparent">
                    Refuser
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex-shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <IconX className="w-4 h-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
