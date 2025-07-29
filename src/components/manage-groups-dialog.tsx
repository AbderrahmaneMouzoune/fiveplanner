'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { PlayerGroup } from '@/types'
import { IconUsers, IconPlus, IconTrash, IconEdit } from '@tabler/icons-react'

const AVAILABLE_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-cyan-500',
]

interface ManageGroupsDialogProps {
  groups: PlayerGroup[]
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

export function ManageGroupsDialog({
  groups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}: ManageGroupsDialogProps) {
  const [open, setOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PlayerGroup | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0])

  const resetForm = () => {
    setName('')
    setSelectedColor(AVAILABLE_COLORS[0])
    setEditingGroup(null)
    setShowAddForm(false)
  }

  const handleEdit = (group: PlayerGroup) => {
    setEditingGroup(group)
    setName(group.name)
    setSelectedColor(group.color)
    setShowAddForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      const groupData = {
        name: name.trim(),
        color: selectedColor,
      }

      if (editingGroup) {
        onUpdateGroup(editingGroup.id, groupData)
      } else {
        onAddGroup(groupData)
      }
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconUsers className="mr-2 h-4 w-4" />
          Gérer les groupes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gérer les groupes de joueurs</DialogTitle>
          <DialogDescription>
            Organisez vos joueurs en groupes pour une meilleure gestion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <IconPlus className="mr-2 h-4 w-4" />
              Ajouter un groupe
            </Button>
          )}

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingGroup ? 'Modifier le groupe' : 'Nouveau groupe'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="group-name">Nom du groupe *</Label>
                    <Input
                      id="group-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom du groupe"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Couleur du groupe</Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full ${color} border-2 ${
                            selectedColor === color
                              ? 'border-gray-800'
                              : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" variant="accent">
                      {editingGroup ? 'Modifier' : 'Ajouter'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h3 className="font-medium">Groupes existants ({groups.length})</h3>
            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full ${group.color}`} />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(group)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveGroup(group.id)}
                      >
                        <IconTrash className="h-4 w-4" />
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
