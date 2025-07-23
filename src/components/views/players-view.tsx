'use client'

import type { Player, Session, PlayerStatus, PlayerGroup } from '@/types'
import { PlayerList } from '@/components/player-list'
import { IconUsers } from '@tabler/icons-react'

interface PlayersViewProps {
  players: Player[]
  groups: PlayerGroup[]
  session: Session | null
  onUpdateResponse: (playerId: string, status: PlayerStatus) => void
  onRemovePlayer: (playerId: string) => void
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void
  onAddPlayer: (player: Player) => void
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
  onBulkAddPlayers: (players: Omit<Player, 'id'>[]) => void
}

export function PlayersView({
  players,
  groups,
  session,
  onUpdateResponse,
  onRemovePlayer,
  onUpdatePlayer,
  onAddPlayer,
  onAddGroup,
  onBulkAddPlayers,
  onUpdateGroup,
  onRemoveGroup,
}: PlayersViewProps) {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <IconUsers className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-3xl font-bold">
            Gestion des joueurs
          </h1>
        </div>
        <p className="text-muted-foreground">
          Gérez votre liste de joueurs et leurs groupes
        </p>
      </header>

      <PlayerList
        players={players}
        groups={groups}
        session={session}
        onUpdateResponse={onUpdateResponse}
        onRemovePlayer={onRemovePlayer}
        onUpdatePlayer={onUpdatePlayer}
        onAddPlayer={onAddPlayer}
        onAddGroup={onAddGroup}
        onUpdateGroup={onUpdateGroup}
        onRemoveGroup={onRemoveGroup}
        onBulkAddPlayers={onBulkAddPlayers}
      />
    </div>
  )
}
