'use client'

import { BulkAddPlayersDialog } from '@/components/bulk-add-players-dialog'
import { EditPlayerDialog } from '@/components/edit-player-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Player, PlayerGroup, PlayerStatus, Session } from '@/types'
import {
  IconCheck,
  IconClock,
  IconEdit,
  IconFilter,
  IconQuestionMark,
  IconTrash,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'

interface PlayerListProps {
  players: Player[]
  groups: PlayerGroup[]
  session: Session | null
  onUpdateResponse: (playerId: string, status: PlayerStatus) => void
  onRemovePlayer: (playerId: string) => void
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void
  onAddPlayer: (player: Omit<Player, 'id'>) => void
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
  onBulkAddPlayers: (players: Omit<Player, 'id'>[]) => void
}

export function PlayerList({
  players,
  groups,
  session,
  onUpdateResponse,
  onRemovePlayer,
  onUpdatePlayer,
  onAddPlayer,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  onBulkAddPlayers,
}: PlayerListProps) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const getPlayerStatus = (playerId: string): PlayerStatus => {
    if (!session) return 'pending'
    const response = session.responses.find((r) => r.playerId === playerId)
    return response?.status || 'pending'
  }

  const getStatusBadge = (status: PlayerStatus) => {
    switch (status) {
      case 'coming':
        return <Badge variant="success">Confirmé</Badge>
      case 'not-coming':
        return <Badge variant="destructive">Absent</Badge>
      case 'optional':
        return <Badge variant="warning">Optionnel</Badge>
      default:
        return <Badge variant="outline">En attente</Badge>
    }
  }

  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.name || 'Groupe inconnu'
  }

  const getGroupColor = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.color || 'bg-muted'
  }

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players

    if (selectedGroupFilter !== 'all') {
      if (selectedGroupFilter === 'ungrouped') {
        filtered = players.filter((p) => !p.group)
      } else {
        filtered = players.filter((p) => p.group === selectedGroupFilter)
      }
    }

    return filtered.sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
    )
  }, [players, selectedGroupFilter])

  const confirmedPlayers = players.filter(
    (p) => getPlayerStatus(p.id) === 'coming',
  )
  const optionalPlayers = players.filter(
    (p) => getPlayerStatus(p.id) === 'optional',
  )
  const absentPlayers = players.filter(
    (p) => getPlayerStatus(p.id) === 'not-coming',
  )
  const pendingPlayers = players.filter(
    (p) => getPlayerStatus(p.id) === 'pending',
  )

  if (players.length === 0) {
    return (
      <Card key={players.length}>
        <CardContent className="text-muted-foreground p-6 text-center">
          Aucun joueur dans votre liste. Commencez par ajouter des joueurs !
        </CardContent>
        <CardFooter className="flex justify-center">
          <BulkAddPlayersDialog
            groups={groups}
            onAddGroup={onAddGroup}
            onUpdateGroup={onUpdateGroup}
            onRemoveGroup={onRemoveGroup}
            onBulkAddPlayers={onBulkAddPlayers}
          />
        </CardFooter>
      </Card>
    )
  }

  const renderPlayerCard = (player: Player) => {
    const status = getPlayerStatus(player.id)

    return (
      <div
        key={player.id}
        className="border-border bg-card flex items-center justify-between rounded-lg border p-3"
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{player.name}</h3>
              {player.group && (
                <div className="flex items-center gap-1">
                  <div
                    className={`h-3 w-3 rounded-full ${getGroupColor(player.group)}`}
                  />
                  <span className="text-muted-foreground text-xs">
                    {getGroupName(player.group)}
                  </span>
                </div>
              )}
              {getStatusBadge(status)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session && (
            <>
              <Button
                size="sm"
                variant={status === 'coming' ? 'success' : 'outline'}
                onClick={() => onUpdateResponse(player.id, 'coming')}
                title="Confirmé"
              >
                <IconCheck className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={status === 'optional' ? 'warning' : 'outline'}
                onClick={() => onUpdateResponse(player.id, 'optional')}
                title="Optionnel"
              >
                <IconQuestionMark className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={status === 'not-coming' ? 'destructive' : 'outline'}
                onClick={() => onUpdateResponse(player.id, 'not-coming')}
                title="Absent"
              >
                <IconX className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={status === 'pending' ? 'secondary' : 'outline'}
                onClick={() => onUpdateResponse(player.id, 'pending')}
                title="En attente"
              >
                <IconClock className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingPlayer(player)}
            className="text-chart-2 hover:bg-chart-2/10 hover:text-chart-2/80"
            title="Modifier"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemovePlayer(player.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive/80"
            title="Supprimer"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {session && (
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div className="border-success-foreground/20 bg-success rounded-lg border p-4">
            <div className="text-success-foreground text-2xl font-bold">
              {confirmedPlayers.length}
            </div>
            <div className="text-success-foreground text-sm">Confirmés</div>
          </div>
          <div className="border-warning-foreground/20 bg-warning rounded-lg border p-4">
            <div className="text-warning-foreground text-2xl font-bold">
              {optionalPlayers.length}
            </div>
            <div className="text-warning-foreground text-sm">Optionnels</div>
          </div>
          <div className="border-destructive-foreground/20 bg-destructive rounded-lg border p-4">
            <div className="text-destructive-foreground text-2xl font-bold">
              {absentPlayers.length}
            </div>
            <div className="text-destructive-foreground text-sm">Absents</div>
          </div>
          <div className="border-muted-foreground/20 bg-muted rounded-lg border p-4">
            <div className="text-muted-foreground text-2xl font-bold">
              {pendingPlayers.length}
            </div>
            <div className="text-muted-foreground text-sm">En attente</div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                Liste des joueurs ({filteredAndSortedPlayers.length}/
                {players.length})
              </CardTitle>

              <div key={players.length} className="flex items-center gap-2">
                <BulkAddPlayersDialog
                  groups={groups}
                  onAddGroup={onAddGroup}
                  onUpdateGroup={onUpdateGroup}
                  onRemoveGroup={onRemoveGroup}
                  onBulkAddPlayers={onBulkAddPlayers}
                />
                <IconFilter className="text-muted-foreground h-4 w-4" />
                <Select
                  value={selectedGroupFilter}
                  onValueChange={setSelectedGroupFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <IconUsers className="h-4 w-4" />
                        Tous les joueurs
                      </div>
                    </SelectItem>
                    <SelectItem value="ungrouped">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted-foreground h-3 w-3 rounded-full" />
                        Sans groupe ({players.filter((p) => !p.group).length})
                      </div>
                    </SelectItem>
                    {groups.map((group) => {
                      const groupPlayerCount = players.filter(
                        (p) => p.group === group.id,
                      ).length
                      return (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${group.color}`}
                            />
                            {group.name} ({groupPlayerCount})
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredAndSortedPlayers.length > 0 ? (
            filteredAndSortedPlayers.map(renderPlayerCard)
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              {selectedGroupFilter === 'all'
                ? 'Aucun joueur dans votre liste'
                : 'Aucun joueur dans ce groupe'}
            </div>
          )}
        </CardContent>
      </Card>

      {editingPlayer && (
        <EditPlayerDialog
          player={editingPlayer}
          groups={groups}
          onUpdatePlayer={onUpdatePlayer}
          onClose={() => setEditingPlayer(null)}
        />
      )}
    </div>
  )
}
