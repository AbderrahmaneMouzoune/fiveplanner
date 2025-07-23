'use client'

import { ManageGroupsDialog } from '@/components/manage-groups-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Player, PlayerGroup } from '@/types'
import { IconPlus, IconTrash, IconUsersPlus } from '@tabler/icons-react'
import type React from 'react'
import { useState } from 'react'

interface BulkAddPlayersDialogProps {
  groups: PlayerGroup[]
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
  onBulkAddPlayers: (players: Omit<Player, 'id'>[]) => void
}

type PlayerToAdd = Player

export function BulkAddPlayersDialog({
  groups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  onBulkAddPlayers,
}: BulkAddPlayersDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('none')
  const [playersToAdd, setPlayersToAdd] = useState<Player[]>([
    { id: '1', name: '' },
  ])
  const [bulkText, setBulkText] = useState('')
  const [mode, setMode] = useState<'form' | 'text'>('form')

  const addPlayerRow = () => {
    const newId = (
      Math.max(...playersToAdd.map((p) => Number.parseInt(p.id))) + 1
    ).toString()
    setPlayersToAdd([...playersToAdd, { id: newId, name: '' }])
  }

  const removePlayerRow = (id: string) => {
    if (playersToAdd.length > 1) {
      setPlayersToAdd(playersToAdd.filter((p) => p.id !== id))
    }
  }

  const updatePlayer = (
    id: string,
    field: keyof PlayerToAdd,
    value: string,
  ) => {
    setPlayersToAdd(
      playersToAdd.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    )
  }

  const parseBulkText = () => {
    const lines = bulkText.split('\n').filter((line) => line.trim())
    const parsed: PlayerToAdd[] = []

    lines.forEach((line, index) => {
      const parts = line.split(',').map((part) => part.trim())
      parsed.push({
        id: (index + 1).toString(),
        name: parts[0] || '',
      })
    })

    setPlayersToAdd(parsed.length > 0 ? parsed : [{ id: '1', name: '' }])
    setMode('form')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validPlayers = playersToAdd.filter((p) => p.name.trim())

    if (validPlayers.length === 0) {
      alert('Veuillez saisir au moins un nom de joueur')
      return
    }

    onBulkAddPlayers(
      validPlayers.map((player) => ({
        name: player.name.trim(),
        group: selectedGroup === 'none' ? undefined : selectedGroup,
      })),
    )

    // Reset
    setPlayersToAdd([{ id: '1', name: '' }])
    setSelectedGroup('none')
    setBulkText('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconUsersPlus className="mr-2 h-4 w-4" />
          Ajouter plusieurs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Ajouter plusieurs joueurs</DialogTitle>
          <DialogDescription>
            Ajoutez plusieurs joueurs en même temps et assignez-les à un groupe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection du mode */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'form' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('form')}
            >
              Formulaire
            </Button>
            <Button
              type="button"
              variant={mode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('text')}
            >
              Texte en lot
            </Button>
          </div>

          {mode === 'text' ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bulk-text">
                  Liste des joueurs (un par ligne, format: Nom)
                </Label>
                <Textarea
                  id="bulk-text"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`Jean Dupont
Marie Martin
Pierre Durand`}
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
                  <Select
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un groupe (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun groupe</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${group.color}`}
                            />
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
                      <IconPlus className="mr-1 h-4 w-4" />
                      Ajouter une ligne
                    </Button>
                  </div>

                  {playersToAdd.map((player, index) => (
                    <Card key={player.id}>
                      <CardContent className="p-3">
                        <div className="flex items-end gap-3">
                          <div className="flex flex-1 flex-col gap-1">
                            <Label className="text-xs">Nom *</Label>
                            <Input
                              value={player.name}
                              onChange={(e) =>
                                updatePlayer(player.id, 'name', e.target.value)
                              }
                              placeholder="Nom du joueur"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removePlayerRow(player.id)}
                            disabled={playersToAdd.length === 1}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="success">
                  Ajouter {playersToAdd.filter((p) => p.name.trim()).length}{' '}
                  joueur(s)
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
