'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Pitch } from '@/types'
import {
  IconMail,
  IconCalendarPlus,
  IconCheck,
  IconX,
} from '@tabler/icons-react'

interface CreateSessionFromEmailDialogProps {
  pitches: Pitch[]
  onCreateSession: (session: {
    date: string
    time: string
    location: string
    pitch?: Pitch
    sessionType: 'indoor' | 'outdoor'
    paymentLink?: string
    maxPlayers: number
  }) => void
  onAddPitch: (pitch: Omit<Pitch, 'id'>) => void
}

interface ParsedEmailData {
  date: string
  time: string
  endTime: string
  location: string
  paymentLink?: string
  success: boolean
  error?: string
}

export function CreateSessionFromEmailDialog({
  pitches,
  onCreateSession,
  onAddPitch,
}: CreateSessionFromEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [emailContent, setEmailContent] = useState('')
  const [parsedData, setParsedData] = useState<ParsedEmailData | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const parseEmailContent = (content: string): ParsedEmailData => {
    try {
      // Nettoyer le contenu
      const cleanContent = content.replace(/\s+/g, ' ').trim()

      // Extraire la date - chercher des patterns comme "samedi 26 juillet 2025", "le 26/07/2025", etc.
      const datePatterns = [
        // Format: "samedi 26 juillet 2025"
        /(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
        // Format: "26 juillet 2025"
        /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
        // Format: "26/07/2025" ou "26-07-2025"
        /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/,
        // Format: "2025-07-26"
        /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/,
      ]

      let dateMatch: RegExpMatchArray | null = null
      let dateFormat = ''

      for (const pattern of datePatterns) {
        dateMatch = cleanContent.match(pattern)
        if (dateMatch) {
          if (pattern === datePatterns[0] || pattern === datePatterns[1]) {
            dateFormat = 'french'
          } else if (pattern === datePatterns[2]) {
            dateFormat = 'dmy'
          } else {
            dateFormat = 'ymd'
          }
          break
        }
      }

      if (!dateMatch) {
        throw new Error("Impossible de trouver la date dans l'email")
      }

      // Convertir la date au format ISO
      let isoDate = ''
      if (dateFormat === 'french') {
        const monthNames = {
          janvier: '01',
          février: '02',
          mars: '03',
          avril: '04',
          mai: '05',
          juin: '06',
          juillet: '07',
          août: '08',
          septembre: '09',
          octobre: '10',
          novembre: '11',
          décembre: '12',
        }
        const day = dateMatch[1].padStart(2, '0')
        const month =
          monthNames[dateMatch[2].toLowerCase() as keyof typeof monthNames]
        const year = dateMatch[3]
        isoDate = `${year}-${month}-${day}`
      } else if (dateFormat === 'dmy') {
        const day = dateMatch[1].padStart(2, '0')
        const month = dateMatch[2].padStart(2, '0')
        const year = dateMatch[3]
        isoDate = `${year}-${month}-${day}`
      } else {
        const year = dateMatch[1]
        const month = dateMatch[2].padStart(2, '0')
        const day = dateMatch[3].padStart(2, '0')
        isoDate = `${year}-${month}-${day}`
      }

      // Extraire l'heure - chercher des patterns comme "19:30 et 21:00", "de 19h30 à 21h00", etc.
      const timePatterns = [
        // Format: "entre 19:30 et 21:00"
        /entre\s+(\d{1,2}):(\d{2})\s+et\s+(\d{1,2}):(\d{2})/i,
        // Format: "de 19:30 à 21:00"
        /de\s+(\d{1,2}):(\d{2})\s+à\s+(\d{1,2}):(\d{2})/i,
        // Format: "19:30-21:00"
        /(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/,
        // Format: "19h30 à 21h00"
        /(\d{1,2})h(\d{2})\s+à\s+(\d{1,2})h(\d{2})/i,
        // Format: "à 19:30"
        /à\s+(\d{1,2}):(\d{2})/i,
      ]

      let timeMatch: RegExpMatchArray | null = null
      for (const pattern of timePatterns) {
        timeMatch = cleanContent.match(pattern)
        if (timeMatch) break
      }

      if (!timeMatch) {
        throw new Error("Impossible de trouver l'heure dans l'email")
      }

      const startTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2].padStart(2, '0')}`
      const endTime =
        timeMatch[3] && timeMatch[4]
          ? `${timeMatch[3].padStart(2, '0')}:${timeMatch[4].padStart(2, '0')}`
          : ''

      // Extraire le lieu - chercher des patterns comme "LE FIVE Paris 18", "centre LE FIVE", etc.
      const locationPatterns = [
        // Format: "dans le centre LE FIVE Paris 18"
        /dans le centre\s+(.+?)(?:\.|$)/i,
        // Format: "LE FIVE Paris 18"
        /(LE FIVE[^.]*)/i,
        // Format: "centre [nom]"
        /centre\s+([^.]+)/i,
        // Format générique: après "lieu" ou "à"
        /(?:lieu|à)\s+([^.]+)/i,
      ]

      let locationMatch: RegExpMatchArray | null = null
      for (const pattern of locationPatterns) {
        locationMatch = cleanContent.match(pattern)
        if (locationMatch) break
      }

      const location = locationMatch
        ? locationMatch[1].trim()
        : 'Lieu non spécifié'

      // Extraire le lien de paiement
      const paymentLinkMatch = content.match(/(https?:\/\/[^\s]+)/i)
      const paymentLink = paymentLinkMatch ? paymentLinkMatch[1] : undefined

      return {
        date: isoDate,
        time: startTime,
        endTime,
        location,
        paymentLink,
        success: true,
      }
    } catch (error) {
      return {
        date: '',
        time: '',
        endTime: '',
        location: '',
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'analyse de l'email",
      }
    }
  }

  const handleParseEmail = () => {
    if (!emailContent.trim()) {
      alert("Veuillez coller le contenu de l'email")
      return
    }

    const parsed = parseEmailContent(emailContent)
    setParsedData(parsed)
  }

  const handleCreateSession = () => {
    if (!parsedData || !parsedData.success) return

    setIsCreating(true)

    // Chercher un terrain existant qui correspond
    const matchingPitch = pitches.find(
      (pitch) =>
        pitch.name.toLowerCase().includes(parsedData.location.toLowerCase()) ||
        parsedData.location.toLowerCase().includes(pitch.name.toLowerCase()),
    )

    // Si aucun terrain ne correspond, créer un nouveau terrain
    const pitchToUse = matchingPitch
    if (!matchingPitch && parsedData.location !== 'Lieu non spécifié') {
      const newPitch = {
        name: parsedData.location,
        address: parsedData.location,
        surfaceType: 'synthetic' as const,
        isFilmed: false,
        priceRange: '€€€',
        description: 'Terrain ajouté automatiquement depuis un email',
      }
      onAddPitch(newPitch)
      // Note: Dans un vrai cas, on récupérerait l'ID du terrain créé
    }

    onCreateSession({
      date: parsedData.date,
      time: parsedData.time,
      location: parsedData.location,
      pitch: pitchToUse,
      sessionType: 'indoor', // Par défaut indoor pour les centres comme LE FIVE
      paymentLink: parsedData.paymentLink,
      maxPlayers: 10, // Valeur par défaut
    })

    setIsCreating(false)
    setEmailContent('')
    setParsedData(null)
    setOpen(false)
  }

  const resetForm = () => {
    setEmailContent('')
    setParsedData(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconMail className="mr-2 h-4 w-4" />
          Créer depuis email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconMail className="h-5 w-5" />
            Créer une session depuis un email
          </DialogTitle>
          <DialogDescription>
            Collez le contenu de votre email de confirmation de réservation pour
            créer automatiquement une session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email-content">
              Contenu de l'email de confirmation
            </Label>
            <Textarea
              id="email-content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Collez ici le contenu complet de votre email de confirmation..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {!parsedData && (
            <Button
              variant="accent"
              onClick={handleParseEmail}
              disabled={!emailContent.trim()}
            >
              <IconCalendarPlus className="mr-2 h-4 w-4" />
              Analyser l'email
            </Button>
          )}

          {parsedData && (
            <Card>
              <CardContent className="p-4">
                {parsedData.success ? (
                  <div className="space-y-3">
                    <div className="text-primary flex items-center gap-2">
                      <IconCheck className="h-4 w-4" />
                      <span className="font-medium">
                        Email analysé avec succès !
                      </span>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Date :</span>
                        <span>
                          {new Date(parsedData.date).toLocaleDateString(
                            'fr-FR',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Heure :</span>
                        <span>
                          {parsedData.time}
                          {parsedData.endTime && ` - ${parsedData.endTime}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Lieu :</span>
                        <span>{parsedData.location}</span>
                      </div>
                      {parsedData.paymentLink && (
                        <div className="flex justify-between">
                          <span className="font-medium">Paiement :</span>
                          <span
                            className="text-chart-2 max-w-48 truncate"
                            title={parsedData.paymentLink}
                          >
                            {parsedData.paymentLink}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-destructive flex items-center gap-2">
                      <IconX className="h-4 w-4" />
                      <span className="font-medium">
                        Erreur lors de l'analyse
                      </span>
                    </div>
                    <Alert>
                      <AlertDescription>{parsedData.error}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {parsedData && !parsedData.success && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                L'email n'a pas pu être analysé automatiquement. Vérifiez que le
                contenu contient :
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Une date (ex: "samedi 26 juillet 2025" ou "26/07/2025")</li>
                <li>Une heure (ex: "entre 19:30 et 21:00" ou "à 19:30")</li>
                <li>Un lieu (ex: "LE FIVE Paris 18")</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetForm}>
            Réinitialiser
          </Button>
          {parsedData && parsedData.success && (
            <Button
              variant="accent"
              onClick={handleCreateSession}
              disabled={isCreating}
            >
              {isCreating ? 'Création...' : 'Créer la session'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
