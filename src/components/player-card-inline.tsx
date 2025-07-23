import { Player, PlayerStatus, Session } from '@/types'
import {
  IconArrowBackUp,
  IconBellRinging,
  IconCheck,
  IconClock,
  IconHistory,
  IconQuestionMark,
  IconRewindBackward5,
  IconRotateClockwise,
  IconShare,
  IconX,
} from '@tabler/icons-react'
import React from 'react'
import { PlayerAvatar } from './player-avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type PlayerCardInlineProps = {
  player: Player
  status: PlayerStatus
  allPlayer: Array<Player>
  groupName: string | undefined
  groupColor: string | undefined
  session?: Session // Ajout des informations de session
  handleStatusUpdate: (
    playerId: string,
    status: PlayerStatus,
    e: React.MouseEvent,
  ) => void
}

function PlayerCardInline({
  status,
  player,
  allPlayer,
  groupName,
  groupColor,
  session,
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
        return 'bg-warning/20 border-warning-foreground/20'
      case 'pending':
        return 'bg-muted/20 border-muted-foreground/10'
      case 'not-coming':
        return 'bg-destructive/20 border-destructive-foreground/10'
      default:
        return 'bg-card border-border'
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      console.warn('Aucune session fournie pour le partage')
      return
    }

    // Formatage de la date
    const sessionDate = new Date(session.date)
    const formattedDate = sessionDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const confirmedPlayers = session.responses.filter(
      (r) => r.status === 'coming',
    )
    // Création du message de partage
    const shareData = {
      title: `${session.pitch ? session.pitch.name : 'Session de foot'} - ${formattedDate} (${session.time})`,
      text: `Salut ${player.name} ! 🏈

  Es-tu disponible pour la session de foot ?

  📅 Date : ${formattedDate}
  ⏰ Heure : ${session.time}
  📍 Lieu : ${session.location}
  ⏱️ Durée : ${session.duration} minutes
  ${session.pitch ? `🏟️ Terrain : ${session.pitch.name}` : ''}
  ${session.maxPlayers ? `👥 Joueurs : ${confirmedPlayers.length}/${session.maxPlayers}` : ''}
  Joueurs déjà présents : ${confirmedPlayers
    .filter((r) => r.playerId !== player.id)
    .map((r) => {
      const playerObj = allPlayer.find((p) => p.id === r.playerId)
      return playerObj ? playerObj.name : ''
    })
    .join(', ')}

  Merci de confirmer ta présence ! ⚽`,
    }

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData)
      } else {
        // Fallback : copier le texte dans le presse-papiers
        await navigator.clipboard.writeText(shareData.text)
        // Ici vous pourriez ajouter une notification toast
        console.log('Message copié dans le presse-papiers')
      }
    } catch (error) {
      console.error('Erreur lors du partage :', error)
      // Fallback : copier le texte dans le presse-papiers
      try {
        await navigator.clipboard.writeText(shareData.text)
        console.log('Message copié dans le presse-papiers (fallback)')
      } catch (clipboardError) {
        console.error('Erreur lors de la copie :', clipboardError)
      }
    }
  }

  return (
    <div
      key={player.id}
      className={`border-border bg-card flex flex-wrap items-center gap-3 rounded-lg border p-2 transition-colors ${getPlayerCardBackground(status)}`}
    >
      <PlayerAvatar
        name={player.name}
        status={status}
        existingPlayers={allPlayer.map((p) => p.name)}
      />

      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">{player.name}</span>
          {player.group && (
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${groupColor}`} />
              <span className="text-muted-foreground text-xs">{groupName}</span>
            </div>
          )}
        </div>
        {/* Badge de statut déplacé sous le nom */}
        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          {session && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
              title="Partager l'invitation"
            >
              <IconBellRinging className="mr-1 h-3 w-3" />
              Relance
            </Button>
          )}
        </div>
      </div>

      {/* Groupe de boutons de statut plus compact */}
      <div className="border-border ml-auto flex overflow-hidden rounded-md border">
        <Button
          size="sm"
          variant={status === 'coming' ? 'success' : 'ghost'}
          onClick={(e) => handleStatusUpdate(player.id, 'coming', e)}
          className="border-border size-7 rounded-none border-r p-0"
          title="Confirmé"
        >
          <IconCheck className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant={status === 'optional' ? 'warning' : 'ghost'}
          onClick={(e) => handleStatusUpdate(player.id, 'optional', e)}
          className="border-border size-7 rounded-none border-r p-0"
          title="Optionnel"
        >
          <IconQuestionMark className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant={status === 'not-coming' ? 'destructive' : 'ghost'}
          onClick={(e) => handleStatusUpdate(player.id, 'not-coming', e)}
          className="border-border size-7 rounded-none border-r p-0"
          title="Absent"
        >
          <IconX className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant={status === 'pending' ? 'secondary' : 'ghost'}
          onClick={(e) => handleStatusUpdate(player.id, 'pending', e)}
          className="size-7 rounded-none p-0"
          title="En attente"
        >
          <IconClock className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export { PlayerCardInline }
