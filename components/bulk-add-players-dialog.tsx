"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ManageGroupsDialog } from "@/components/manage-groups-dialog"
import type { PlayerGroup } from "@/types"
import { IconUsersPlus, IconTrash, IconPlus } from "@tabler/icons-react"

interface BulkAddPlayersDialogProps {
  groups: PlayerGroup[]
  onAddPlayer: (player: { name: string; email?: string; phone?: string; group?: string }) => void
  onAddGroup: (group: Omit<PlayerGroup, "id">) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

interface PlayerToAdd {
  id: string
  name: string
  email: string
  phone: string
}

export function BulkAddPlayersDialog({
  groups,
  onAddPlayer,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}: BulkAddPlayersDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>("none")
  const [playersToAdd, setPlayersToAdd] = useState<PlayerToAdd[]>([{ id: "1", name: "", email: "", phone: "" }])
  const [bulkText, setBulkText] = useState("")
  const [mode, setMode] = useState<"form" | "text">("form")

  const addPlayerRow = () => {
    const newId = (Math.max(...playersToAdd.map((p) => Number.parseInt(p.id))) + 1).toString()
    setPlayersToAdd([...playersToAdd, { id: newId, name: "", email: "", phone: "" }])
  }

  const removePlayerRow = (id: string) => {
    if (playersToAdd.length > 1) {
      setPlayersToAdd(playersToAdd.filter((p) => p.id !== id))
    }
  }

  const updatePlayer = (id: string, field: keyof PlayerToAdd, value: string) => {
    setPlayersToAdd(playersToAdd.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const parseBulkText = () => {
    const lines = bulkText.split("\n").filter((line) => line.trim())
    const parsed: PlayerToAdd[] = []

    lines.forEach((line, index) => {
      const parts = line.split(",").map((part) => part.trim())
      parsed.push({
        id: (index + 1).toString(),
        name: parts[0] || "",
        email: parts[1] || "",
        phone: parts[2] || "",
      })
    })

    setPlayersToAdd(parsed.length > 0 ? parsed : [{ id: "1", name: "", email: "", phone: "" }])
    setMode("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validPlayers = playersToAdd.filter((p) => p.name.trim())

    if (validPlayers.length === 0) {
      alert("Veuillez saisir au moins un nom de joueur")
      return
    }

    validPlayers.forEach((player) => {
      onAddPlayer({
        name: player.name.trim(),
        email: player.email.trim() || undefined,
        phone: player.phone.trim() || undefined,
        group: selectedGroup === "none" ? undefined : selectedGroup,
      })
    })

    // Reset
    setPlayersToAdd([{ id: "1", name: "", email: "", phone: "" }])
    setSelectedGroup("none")
    setBulkText("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconUsersPlus className="w-4 h-4 mr-2" />
          Ajouter plusieurs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter plusieurs joueurs</DialogTitle>
          <DialogDescription>Ajoutez plusieurs joueurs en même temps et assignez-les à un groupe.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection du mode */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "form" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("form")}
            >
              Formulaire
            </Button>
            <Button
              type="button"
              variant={mode === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("text")}
            >
              Texte en lot
            </Button>
          </div>

          {mode === "text" ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bulk-text">Liste des joueurs (un par ligne, format: Nom, Email, Téléphone)</Label>
                <Textarea
                  id="bulk-text"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`Jean Dupont, jean@email.com, 06 12 34 56 78
Marie Martin, marie@email.com, 06 98 76 54 32
Pierre Durand, , 06 11 22 33 44`}
                  rows={8}
                />
              </div>
              <Button type="button" onClick={parseBulkText}>
                Analyser le texte
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Sélection du groupe */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Groupe pour tous les joueurs</Label>
                    <ManageGroupsDialog
                      groups={groups}
                      onAddGroup={onAddGroup}
                      onUpdateGroup={onUpdateGroup}
                      onRemoveGroup={onRemoveGroup}
                    />
                  </div>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un groupe (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun groupe</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${group.color}`} />
                            {group.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des joueurs à ajouter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Joueurs à ajouter</Label>
                    <Button type="button" size="sm" onClick={addPlayerRow}>
                      <IconPlus className="w-4 h-4 mr-1" />
                      Ajouter une ligne
                    </Button>
                  </div>

                  {playersToAdd.map((player, index) => (
                    <Card key={player.id}>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                          <div className="grid gap-1">
                            <Label className="text-xs">Nom *</Label>
                            <Input
                              value={player.name}
                              onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
                              placeholder="Nom du joueur"
                              size="sm"
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              value={player.email}
                              onChange={(e) => updatePlayer(player.id, "email", e.target.value)}
                              placeholder="email@exemple.com"
                              size="sm"
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label className="text-xs">Téléphone</Label>
                            <Input
                              type="tel"
                              value={player.phone}
                              onChange={(e) => updatePlayer(player.id, "phone", e.target.value)}
                              placeholder="06 12 34 56 78"
                              size="sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePlayerRow(player.id)}
                            disabled={playersToAdd.length === 1}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="accent">
                  Ajouter {playersToAdd.filter((p) => p.name.trim()).length} joueur(s)
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
