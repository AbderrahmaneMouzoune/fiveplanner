"use client"

import type { Player, Session, PlayerStatus, PlayerGroup } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditPlayerDialog } from "@/components/edit-player-dialog"
import { BulkAddPlayersDialog } from "@/components/bulk-add-players-dialog"
import {
  IconCheck,
  IconX,
  IconClock,
  IconTrash,
  IconMail,
  IconPhone,
  IconQuestionMark,
  IconFilter,
  IconUsers,
  IconEdit,
} from "@tabler/icons-react"
import { useState, useMemo } from "react"

interface PlayerListProps {
  players: Player[]
  groups: PlayerGroup[]
  session: Session | null
  onUpdateResponse: (playerId: string, status: PlayerStatus) => void
  onRemovePlayer: (playerId: string) => void
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void
  onAddPlayer: (player: { name: string; email?: string; phone?: string; group?: string }) => void
  onAddGroup: (group: Omit<PlayerGroup, "id">) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
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
}: PlayerListProps) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all")
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const getPlayerStatus = (playerId: string): PlayerStatus => {
    if (!session) return "pending"
    const response = session.responses.find((r) => r.playerId === playerId)
    return response?.status || "pending"
  }

  const getStatusBadge = (status: PlayerStatus) => {
    switch (status) {
      case "coming":
        return <Badge variant="success">Confirmé</Badge>
      case "not-coming":
        return <Badge variant="destructive">Absent</Badge>
      case "optional":
        return <Badge variant="warning">Optionnel</Badge>
      default:
        return <Badge variant="outline">En attente</Badge>
    }
  }

  const getGroupName = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.name || "Groupe inconnu"
  }

  const getGroupColor = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    return group?.color || "bg-muted"
  }

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players

    if (selectedGroupFilter !== "all") {
      if (selectedGroupFilter === "ungrouped") {
        filtered = players.filter((p) => !p.group)
      } else {
        filtered = players.filter((p) => p.group === selectedGroupFilter)
      }
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }))
  }, [players, selectedGroupFilter])

  const confirmedPlayers = players.filter((p) => getPlayerStatus(p.id) === "coming")
  const optionalPlayers = players.filter((p) => getPlayerStatus(p.id) === "optional")
  const absentPlayers = players.filter((p) => getPlayerStatus(p.id) === "not-coming")
  const pendingPlayers = players.filter((p) => getPlayerStatus(p.id) === "pending")

  if (players.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucun joueur dans votre liste. Commencez par ajouter des joueurs !
        </CardContent>
      </Card>
    )
  }

  const renderPlayerCard = (player: Player) => {
    const status = getPlayerStatus(player.id)

    return (
      <div key={player.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{player.name}</h3>
              {player.group && (
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${getGroupColor(player.group)}`} />
                  <span className="text-xs text-muted-foreground">{getGroupName(player.group)}</span>
                </div>
              )}
              {getStatusBadge(status)}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              {player.email && (
                <div className="flex items-center gap-1">
                  <IconMail className="w-3 h-3" />
                  {player.email}
                </div>
              )}
              {player.phone && (
                <div className="flex items-center gap-1">
                  <IconPhone className="w-3 h-3" />
                  {player.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session && (
            <>
              <Button
                size="sm"
                variant={status === "coming" ? "success" : "outline"}
                onClick={() => onUpdateResponse(player.id, "coming")}
                title="Confirmé"
              >
                <IconCheck className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={status === "optional" ? "warning" : "outline"}
                onClick={() => onUpdateResponse(player.id, "optional")}
                title="Optionnel"
              >
                <IconQuestionMark className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={status === "not-coming" ? "destructive" : "outline"}
                onClick={() => onUpdateResponse(player.id, "not-coming")}
                title="Absent"
              >
                <IconX className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={status === "pending" ? "secondary" : "outline"}
                onClick={() => onUpdateResponse(player.id, "pending")}
                title="En attente"
              >
                <IconClock className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingPlayer(player)}
            className="text-chart-2 hover:text-chart-2/80 hover:bg-chart-2/10"
            title="Modifier"
          >
            <IconEdit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemovePlayer(player.id)}
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            title="Supprimer"
          >
            <IconTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {session && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-success p-4 rounded-lg border border-success-foreground/20">
            <div className="text-2xl font-bold text-success-foreground">{confirmedPlayers.length}</div>
            <div className="text-sm text-success-foreground">Confirmés</div>
          </div>
          <div className="bg-warning p-4 rounded-lg border border-warning-foreground/20">
            <div className="text-2xl font-bold text-warning-foreground">{optionalPlayers.length}</div>
            <div className="text-sm text-warning-foreground">Optionnels</div>
          </div>
          <div className="bg-destructive p-4 rounded-lg border border-destructive-foreground/20">
            <div className="text-2xl font-bold text-destructive-foreground">{absentPlayers.length}</div>
            <div className="text-sm text-destructive-foreground">Absents</div>
          </div>
          <div className="bg-muted p-4 rounded-lg border border-muted-foreground/20">
            <div className="text-2xl font-bold text-muted-foreground">{pendingPlayers.length}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="w-5 h-5" />
                Liste des joueurs ({filteredAndSortedPlayers.length}/{players.length})
              </CardTitle>

              <div className="flex items-center gap-2">
                <BulkAddPlayersDialog
                  groups={groups}
                  onAddPlayer={onAddPlayer}
                  onAddGroup={onAddGroup}
                  onUpdateGroup={onUpdateGroup}
                  onRemoveGroup={onRemoveGroup}
                />
                <IconFilter className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedGroupFilter} onValueChange={setSelectedGroupFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <IconUsers className="w-4 h-4" />
                        Tous les joueurs
                      </div>
                    </SelectItem>
                    <SelectItem value="ungrouped">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        Sans groupe ({players.filter((p) => !p.group).length})
                      </div>
                    </SelectItem>
                    {groups.map((group) => {
                      const groupPlayerCount = players.filter((p) => p.group === group.id).length
                      return (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${group.color}`} />
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
            <div className="text-center text-muted-foreground py-8">
              {selectedGroupFilter === "all" ? "Aucun joueur dans votre liste" : "Aucun joueur dans ce groupe"}
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
