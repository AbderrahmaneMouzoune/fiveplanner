'use client'

import type React from 'react'

import { ManagePitchesDialog } from '@/components/manage-pitches-dialog'
import { PitchCard } from '@/components/pitch-card'
import { PitchCombobox } from '@/components/pitch-combobox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Pitch, Session } from '@/types'
import { IconCalendarPlus, IconHome, IconSun } from '@tabler/icons-react'
import { useId, useState } from 'react'

interface CreateSessionDialogProps {
  pitches: Pitch[]
  onCreateSession: (
    session: Omit<Session, 'id' | 'responses' | 'status' | 'createdAt'>,
  ) => void
  onAddPitch: (pitch: Omit<Pitch, 'id'>) => void
  onUpdatePitch: (pitchId: string, updates: Partial<Pitch>) => void
  onRemovePitch: (pitchId: string) => void
}

export function CreateSessionDialog({
  pitches,
  onCreateSession,
  onAddPitch,
  onUpdatePitch,
  onRemovePitch,
}: CreateSessionDialogProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('90')
  const [selectedPitchId, setSelectedPitchId] = useState<string>('')
  const [customLocation, setCustomLocation] = useState('')
  const [sessionType, setSessionType] = useState<'indoor' | 'outdoor'>(
    'outdoor',
  )
  const [paymentLink, setPaymentLink] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [useCustomLocation, setUseCustomLocation] = useState(false)

  const selectedPitch = pitches.find((p) => p.id === selectedPitchId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && time && (selectedPitch || customLocation.trim())) {
      onCreateSession({
        date,
        time,
        location: useCustomLocation
          ? customLocation.trim()
          : selectedPitch?.name || '',
        pitch: useCustomLocation ? undefined : selectedPitch,
        sessionType,
        paymentLink: paymentLink.trim() || undefined,
        maxPlayers,
        duration: Number(duration),
      })
      setDate('')
      setTime('')
      setDuration('90')
      setSelectedPitchId('')
      setCustomLocation('')
      setSessionType('outdoor')
      setPaymentLink('')
      setMaxPlayers(10)
      setUseCustomLocation(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <IconCalendarPlus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
          <DialogDescription>
            Planifiez votre prochaine session de football 5v5.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Heure *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-foreground text-sm leading-none font-medium">
                Durée *
              </legend>
              <RadioGroup
                className="grid grid-cols-3 gap-2"
                value={duration}
                onValueChange={setDuration}
              >
                {[
                  { value: '60', label: '60 min' },
                  { value: '90', label: '90 min' },
                  { value: '120', label: '120 min' },
                ].map((item) => (
                  <label
                    key={`${id}-${item.value}`}
                    className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                  >
                    <RadioGroupItem
                      id={`${id}-${item.value}`}
                      value={item.value}
                      className="sr-only after:absolute after:inset-0"
                    />
                    <p className="text-foreground text-sm leading-none font-medium">
                      {item.label}
                    </p>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-foreground text-sm leading-none font-medium">
                Type de session *
              </legend>
              <RadioGroup
                className="grid grid-cols-2 gap-2"
                value={sessionType}
                onValueChange={(value: 'indoor' | 'outdoor') =>
                  setSessionType(value)
                }
              >
                {[
                  { value: 'outdoor', label: 'Extérieur', icon: IconSun },
                  { value: 'indoor', label: 'Intérieur', icon: IconHome },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <label
                      key={`${id}-${item.value}`}
                      className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                    >
                      <RadioGroupItem
                        id={`${id}-${item.value}`}
                        value={item.value}
                        className="sr-only after:absolute after:inset-0"
                      />
                      <Icon className="h-4 w-4" />
                      <p className="text-foreground text-sm leading-none font-medium">
                        {item.label}
                      </p>
                    </label>
                  )
                })}
              </RadioGroup>
            </fieldset>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Lieu *</Label>
                <ManagePitchesDialog
                  pitches={pitches}
                  onAddPitch={onAddPitch}
                  onUpdatePitch={onUpdatePitch}
                  onRemovePitch={onRemovePitch}
                />
              </div>
              <div className="mb-2 flex gap-2">
                <Button
                  type="button"
                  variant={!useCustomLocation ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseCustomLocation(false)}
                >
                  Terrain prédéfini
                </Button>
                <Button
                  type="button"
                  variant={useCustomLocation ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseCustomLocation(true)}
                >
                  Lieu personnalisé
                </Button>
              </div>

              {useCustomLocation ? (
                <Input
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Entrez l'adresse du terrain"
                  required
                />
              ) : (
                <div className="space-y-3">
                  <PitchCombobox
                    pitches={pitches}
                    value={selectedPitchId}
                    onValueChange={setSelectedPitchId}
                    placeholder="Rechercher un terrain..."
                  />

                  {selectedPitch && (
                    <Card className="p-3">
                      <PitchCard pitch={selectedPitch} />
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentLink">Lien de paiement (optionnel)</Label>
              <Input
                id="paymentLink"
                type="url"
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="https://paypal.me/... ou autre lien de paiement"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxPlayers">Nombre max de joueurs</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="6"
                max="20"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="accent">
              Créer la session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
