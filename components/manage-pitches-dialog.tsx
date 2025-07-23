"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PitchCard } from "@/components/pitch-card"
import type { Pitch } from "@/types"
import { IconSettings, IconPlus, IconTrash, IconEdit } from "@tabler/icons-react"

interface ManagePitchesDialogProps {
  pitches: Pitch[]
  onAddPitch: (pitch: Omit<Pitch, "id">) => void
  onUpdatePitch: (pitchId: string, updates: Partial<Pitch>) => void
  onRemovePitch: (pitchId: string) => void
}

export function ManagePitchesDialog({ pitches, onAddPitch, onUpdatePitch, onRemovePitch }: ManagePitchesDialogProps) {
  const [open, setOpen] = useState(false)
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [surfaceType, setSurfaceType] = useState<Pitch["surfaceType"]>("synthetic")
  const [isFilmed, setIsFilmed] = useState(false)
  const [priceRange, setPriceRange] = useState("")
  const [description, setDescription] = useState("")

  const resetForm = () => {
    setName("")
    setAddress("")
    setSurfaceType("synthetic")
    setIsFilmed(false)
    setPriceRange("")
    setDescription("")
    setEditingPitch(null)
    setShowAddForm(false)
  }

  const handleEdit = (pitch: Pitch) => {
    setEditingPitch(pitch)
    setName(pitch.name)
    setAddress(pitch.address)
    setSurfaceType(pitch.surfaceType)
    setIsFilmed(pitch.isFilmed)
    setPriceRange(pitch.priceRange || "")
    setDescription(pitch.description || "")
    setShowAddForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && address.trim()) {
      const pitchData = {
        name: name.trim(),
        address: address.trim(),
        surfaceType,
        isFilmed,
        priceRange: priceRange.trim() || undefined,
        description: description.trim() || undefined,
      }

      if (editingPitch) {
        onUpdatePitch(editingPitch.id, pitchData)
      } else {
        onAddPitch(pitchData)
      }
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconSettings className="w-4 h-4 mr-2" />
          Gérer les terrains
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer les terrains</DialogTitle>
          <DialogDescription>Ajoutez, modifiez ou supprimez vos terrains favoris.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full" variant="accent">
              <IconPlus className="w-4 h-4 mr-2" />
              Ajouter un terrain
            </Button>
          )}

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{editingPitch ? "Modifier le terrain" : "Nouveau terrain"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pitch-name">Nom du terrain *</Label>
                    <Input
                      id="pitch-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom du terrain"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pitch-address">Adresse *</Label>
                    <Input
                      id="pitch-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Adresse complète"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pitch-surface">Type de surface</Label>
                    <Select value={surfaceType} onValueChange={(value: Pitch["surfaceType"]) => setSurfaceType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="synthetic">Synthétique</SelectItem>
                        <SelectItem value="grass">Herbe naturelle</SelectItem>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="concrete">Béton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="pitch-filmed" checked={isFilmed} onCheckedChange={setIsFilmed} />
                    <Label htmlFor="pitch-filmed">Terrain filmé</Label>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pitch-price">Gamme de prix</Label>
                    <Input
                      id="pitch-price"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="€, €€, €€€ ou Gratuit"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pitch-description">Description</Label>
                    <Textarea
                      id="pitch-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description du terrain..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingPitch ? "Modifier" : "Ajouter"}</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h3 className="font-medium">Terrains existants ({pitches.length})</h3>
            {pitches.map((pitch) => (
              <Card key={pitch.id}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <PitchCard pitch={pitch} compact />
                    </div>
                    <div className="flex gap-1 ml-3">
                      <Button variant="success" size="sm" onClick={() => handleEdit(pitch)}>
                        <IconEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemovePitch(pitch.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
