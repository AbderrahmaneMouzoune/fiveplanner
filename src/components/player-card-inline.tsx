import { Player, PlayerStatus } from '@/types'
import { getUniqueAvatarColor } from '@/utils/avatar-colors'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  IconCheck,
  IconQuestionMark,
  IconX,
  IconClock,
} from '@tabler/icons-react'
import { PlayerAvatar } from './player-avatar'

type PlayerCardInlineProps = {
  player: Player
  status: PlayerStatus
  allPlayerNames: Array<Player['name']>
  groupName: string | undefined
  groupColor: string | undefined
  handleStatusUpdate: (
    playerId: string,
    status: PlayerStatus,
    e: React.MouseEvent,
  ) => void
}
function PlayerCardInline({
  status,
  player,
  allPlayerNames,
  groupName,
  groupColor,
  handleStatusUpdate,
}: PlayerCardInlineProps) {
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

  const getPlayerCardBackground = (status: PlayerStatus) => {
    switch (status) {
      case 'coming':
        return 'bg-success/20 border-success-foreground/10'
      case 'optional':
        return 'bg-warning/20 border-warning-foreground120'
      case 'pending':
        return 'bg-muted/20 border-muted-foreground/10'
      case 'not-coming':
        return 'bg-destructive/20 border-destructive-foreground/10'
      default:
        return 'bg-card border-border'
    }
  }

  return (
    <div
      key={player.id}
      className={`border-border bg-card flex items-center gap-3 rounded-lg border p-2 transition-colors ${getPlayerCardBackground(status)}`}
    >
      <PlayerAvatar
        name={player.name}
        status={status}
        existingPlayers={allPlayerNames}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">{player.name}</span>
          {player.group && (
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${groupColor}`} />
              <span className="text-muted-foreground text-xs">{groupName}</span>
            </div>
          )}
        </div>
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

export { PlayerCardInline }
