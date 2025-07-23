'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Player, PlayerGroup } from '@/types'
import { IconEdit } from '@tabler/icons-react'

interface EditPlayerDialogProps {
  player: Player
  groups: PlayerGroup[]
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void
  onClose: () => void
}

export function EditPlayerDialog({
  player,
  groups,
  onUpdatePlayer,
  onClose,
}: EditPlayerDialogProps) {
  const [name, setName] = useState(player.name)
  const [selectedGroup, setSelectedGroup] = useState(player.group || 'no-group')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onUpdatePlayer(player.id, {
        name: name.trim(),
        group: selectedGroup === 'no-group' ? undefined : selectedGroup,
      })
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Modifier le joueur
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de {player.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du joueur"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-group">Groupe</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un groupe (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-group">Aucun groupe</SelectItem>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="success">
              Sauvegarder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
