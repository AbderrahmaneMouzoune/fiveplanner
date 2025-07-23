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
  DialogTrigger,
} from '@/components/ui/dialog'
import { ManageGroupsDialog } from '@/components/manage-groups-dialog'
import type { Player, PlayerGroup } from '@/types'
import { IconPlus } from '@tabler/icons-react'

interface AddPlayerDialogProps {
  groups: PlayerGroup[]
  onAddPlayer: (player: Omit<Player, 'id'>) => void
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

export function AddPlayerDialog({
  groups,
  onAddPlayer,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}: AddPlayerDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const [selectedGroup, setSelectedGroup] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddPlayer({
        name: name.trim(),
        group: selectedGroup || undefined,
      })
      setName('')

      setSelectedGroup('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent">
          <IconPlus className="mr-2 h-4 w-4" />
          Ajouter un joueur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau joueur</DialogTitle>
          <DialogDescription>
            Ajoutez un joueur à votre liste pour les futures sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du joueur"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="group">Groupe</Label>
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
            <Button type="submit" variant="accent">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
