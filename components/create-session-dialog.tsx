"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PitchCard } from "@/components/pitch-card"
import { PitchCombobox } from "@/components/pitch-combobox"
import { ManagePitchesDialog } from "@/components/manage-pitches-dialog"
import type { Pitch } from "@/types"
import { IconCalendarPlus, IconHome, IconSun } from "@tabler/icons-react"

interface CreateSessionDialogProps {
  pitches: Pitch[]
  onCreateSession: (session: {
    date: string
    time: string
    location: string
    pitch?: Pitch
    sessionType: "indoor" | "outdoor"
    paymentLink?: string
    maxPlayers: number
  }) => void
  onAddPitch: (pitch: Omit<Pitch, "id">) => void
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
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [selectedPitchId, setSelectedPitchId] = useState<string>("")
  const [customLocation, setCustomLocation] = useState("")
  const [sessionType, setSessionType] = useState<"indoor" | "outdoor">("outdoor")
  const [paymentLink, setPaymentLink] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [useCustomLocation, setUseCustomLocation] = useState(false)

  const selectedPitch = pitches.find((p) => p.id === selectedPitchId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && time && (selectedPitch || customLocation.trim())) {
      onCreateSession({
        date,
        time,
        location: useCustomLocation ? customLocation.trim() : selectedPitch?.name || "",
        pitch: useCustomLocation ? undefined : selectedPitch,
        sessionType,
        paymentLink: paymentLink.trim() || undefined,
        maxPlayers,
      })
      setDate("")
      setTime("")
      setSelectedPitchId("")
      setCustomLocation("")
      setSessionType("outdoor")
      setPaymentLink("")
      setMaxPlayers(10)
      setUseCustomLocation(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <IconCalendarPlus className="w-4 h-4 mr-2" />
          Nouvelle session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
          <DialogDescription>Planifiez votre prochaine session de football 5v5.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Heure *</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label>Type de session *</Label>
              <Select value={sessionType} onValueChange={(value: "indoor" | "outdoor") => setSessionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdoor">
                    <div className="flex items-center gap-2">
                      <IconSun className="w-4 h-4" />
                      Extérieur
                    </div>
                  </SelectItem>
                  <SelectItem value="indoor">
                    <div className="flex items-center gap-2">
                      <IconHome className="w-4 h-4" />
                      Intérieur
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={!useCustomLocation ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseCustomLocation(false)}
                >
                  Terrain prédéfini
                </Button>
                <Button
                  type="button"
                  variant={useCustomLocation ? "default" : "outline"}
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
