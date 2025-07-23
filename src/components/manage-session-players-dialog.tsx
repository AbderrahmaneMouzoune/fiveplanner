'use client'

import type React from 'react'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Player, Session, PlayerStatus, PlayerGroup } from '@/types'
import {
  IconUsers,
  IconSearch,
  IconX,
  IconCheck,
  IconQuestionMark,
  IconClock,
} from '@tabler/icons-react'
import { getUniqueAvatarColor } from '@/utils/avatar-colors'

interface ManageSessionPlayersDialogProps {
  session: Session
  players: Player[]
  groups: PlayerGroup[]
  onUpdatePlayerResponse: (playerId: string, status: PlayerStatus) => void
}

export function ManageSessionPlayersDialog({
  session,
  players,
  groups,
  onUpdatePlayerResponse,
}: ManageSessionPlayersDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getPlayerStatus = (playerId: string): PlayerStatus => {
    const response = session.responses.find((r) => r.playerId === playerId)
    return response?.status || 'pending'
  }

  const getPlayerInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Obtenir tous les noms des joueurs pour le système de couleurs uniques
  const allPlayerNames = players.map((p) => p.name)

  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.name || ''
  }

  const getGroupColor = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.color || 'bg-muted'
  }

  const getStatusBadge = (status: PlayerStatus) => {
    switch (status) {
      case 'coming':
        return (
          <Badge variant="success" className="text-xs">
            Confirmé
          </Badge>
        )
      case 'not-coming':
        return (
          <Badge variant="destructive" className="text-xs">
            Absent
          </Badge>
        )
      case 'optional':
        return (
          <Badge variant="warning" className="text-xs">
            Optionnel
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            En attente
          </Badge>
        )
    }
  }

  // Filtrer les joueurs par recherche
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return []

    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [players, searchTerm])

  // Grouper les joueurs par groupe (seulement si pas de recherche)
  const playersByGroup = useMemo(() => {
    if (searchTerm.trim()) return new Map()

    const grouped = new Map<string, Player[]>()

    // Ajouter un groupe "Sans groupe" pour les joueurs sans groupe
    grouped.set(
      'ungrouped',
      players.filter((p) => !p.group),
    )

    // Ajouter les groupes existants
    groups.forEach((group) => {
      const groupPlayers = players.filter((p) => p.group === group.id)
      if (groupPlayers.length > 0) {
        grouped.set(group.id, groupPlayers)
      }
    })

    return grouped
  }, [players, groups, searchTerm])

  const handleStatusUpdate = (
    playerId: string,
    status: PlayerStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    onUpdatePlayerResponse(playerId, status)
  }

  const getTabLabel = (groupId: string, groupPlayers: Player[]) => {
    if (groupId === 'ungrouped') {
      return `Sans groupe (${groupPlayers.length})`
    }

    const group = groups.find((g) => g.id === groupId)
    return `${group?.name || 'Groupe'} (${groupPlayers.length})`
  }

  const renderPlayerCard = (player: Player) => {
    const status = getPlayerStatus(player.id)
    const avatarColor = getUniqueAvatarColor(player.name, allPlayerNames)

    return (
      <div
        key={player.id}
        className="border-border bg-card hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className={`${avatarColor} text-sm font-medium text-white`}
          >
            {getPlayerInitials(player.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium">{player.name}</span>
            {player.group && (
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${getGroupColor(player.group)}`}
                />
                <span className="text-muted-foreground text-xs">
                  {getGroupName(player.group)}
                </span>
              </div>
            )}
          </div>
          {player.email && (
            <div className="text-muted-foreground truncate text-xs">
              {player.email}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={status === 'coming' ? 'success' : 'outline'}
              onClick={(e) => handleStatusUpdate(player.id, 'coming', e)}
              className="h-7 w-7 p-0"
              title="Confirmé"
            >
              <IconCheck className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={status === 'optional' ? 'warning' : 'outline'}
              onClick={(e) => handleStatusUpdate(player.id, 'optional', e)}
              className="h-7 w-7 p-0"
              title="Optionnel"
            >
              <IconQuestionMark className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={status === 'not-coming' ? 'destructive' : 'outline'}
              onClick={(e) => handleStatusUpdate(player.id, 'not-coming', e)}
              className="h-7 w-7 p-0"
              title="Absent"
            >
              <IconX className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={status === 'pending' ? 'secondary' : 'outline'}
              onClick={(e) => handleStatusUpdate(player.id, 'pending', e)}
              className="h-7 w-7 p-0"
              title="En attente"
            >
              <IconClock className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent text-xs">
          <IconUsers className="mr-1 h-3 w-3" />
          Gérer les joueurs
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Gérer les joueurs de la session
          </DialogTitle>
          <DialogDescription>
            Modifiez le statut des joueurs pour cette session.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Barre de recherche */}
          <div className="relative mb-4">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Rechercher un joueur par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Affichage conditionnel : recherche ou tabs */}
          {searchTerm.trim() ? (
            // Mode recherche : affichage direct des résultats
            <div className="flex-1 overflow-y-auto rounded-lg">
              <div className="space-y-1">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map(renderPlayerCard)
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    Aucun joueur trouvé pour "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Mode normal : tabs par groupe
            <Tabs
              defaultValue={Array.from(playersByGroup.keys())[0]}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <TabsList className="mb-4 grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from(playersByGroup.entries()).map(
                  ([groupId, groupPlayers]) => (
                    <TabsTrigger
                      key={groupId}
                      value={groupId}
                      className="text-xs"
                    >
                      {getTabLabel(groupId, groupPlayers)}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>

              {Array.from(playersByGroup.entries()).map(
                ([groupId, groupPlayers]) => (
                  <TabsContent
                    key={groupId}
                    value={groupId}
                    className="flex-1 overflow-y-auto rounded-lg"
                  >
                    <div className="space-y-1">
                      {groupPlayers.length > 0 ? (
                        groupPlayers.map(renderPlayerCard)
                      ) : (
                        <div className="text-muted-foreground py-8 text-center">
                          Aucun joueur dans ce groupe
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ),
              )}
            </Tabs>
          )}

          {/* Statistiques rapides */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div className="border-success bg-success rounded-lg border p-2">
              <div className="text-success-foreground text-sm font-bold">
                {
                  players.filter((p) => getPlayerStatus(p.id) === 'coming')
                    .length
                }
              </div>
              <div className="text-success-foreground text-xs">Confirmés</div>
            </div>
            <div className="border-warning bg-warning rounded-lg border p-2">
              <div className="text-warning-foreground text-sm font-bold">
                {
                  players.filter((p) => getPlayerStatus(p.id) === 'optional')
                    .length
                }
              </div>
              <div className="text-warning-foreground text-xs">Optionnels</div>
            </div>
            <div className="border-destructive bg-destructive rounded-lg border p-2">
              <div className="text-destructive-foreground text-sm font-bold">
                {
                  players.filter((p) => getPlayerStatus(p.id) === 'not-coming')
                    .length
                }
              </div>
              <div className="text-destructive-foreground text-xs">Absents</div>
            </div>
            <div className="border-border bg-muted rounded-lg border p-2">
              <div className="text-muted-foreground text-sm font-bold">
                {
                  players.filter((p) => getPlayerStatus(p.id) === 'pending')
                    .length
                }
              </div>
              <div className="text-muted-foreground text-xs">En attente</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
