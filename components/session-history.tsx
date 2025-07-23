'use client'

import type { Session, Player } from '@/types'
import { useState } from 'react'
import { useId } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { PlayerAvatar } from '@/components/player-avatar'
import { PitchCard } from '@/components/pitch-card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  IconMapPin,
  IconUsers,
  IconTrash,
  IconCheck,
  IconX,
  IconQuestionMark,
  IconCurrencyEuro,
  IconExternalLink,
  IconTrophy,
  IconCalendar,
  IconClock,
  IconHome,
  IconSun,
  IconChevronDown,
  IconChevronRight,
  IconFilter,
  IconMail,
  IconPhone,
} from '@tabler/icons-react'

interface SessionHistoryProps {
  sessions: Session[]
  players: Player[]
  onDeleteSession: (sessionId: string) => void
}

export function SessionHistory({
  sessions,
  players,
  onDeleteSession,
}: SessionHistoryProps) {
  const [showAllPlayers, setShowAllPlayers] = useState(false)
  const [showConfirmed, setShowConfirmed] = useState(true)
  const [showOptional, setShowOptional] = useState(true)
  const [showPending, setShowPending] = useState(true)
  const [showAbsent, setShowAbsent] = useState(false)

  const confirmedId = useId()
  const optionalId = useId()
  const pendingId = useId()
  const absentId = useId()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || 'Joueur inconnu'
  }

  const getPlayerStatus = (session: Session, playerId: string) => {
    const response = session.responses.find((r) => r.playerId === playerId)
    return response?.status || 'pending'
  }

  // Obtenir tous les noms des joueurs pour le système de couleurs uniques
  const allPlayerNames = players.map((p) => p.name)

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="border-success/20 bg-success/10 text-success">
            Terminée
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="border-destructive/20 bg-destructive/10 text-destructive">
            Annulée
          </Badge>
        )
      default:
        return (
          <Badge className="border-chart-2/20 bg-chart-2/10 text-chart-2">
            À venir
          </Badge>
        )
    }
  }

  const getSessionTypeBadge = (sessionType: 'indoor' | 'outdoor') => {
    return sessionType === 'indoor' ? (
      <Badge variant="secondary">
        <IconHome className="mr-1 h-3 w-3" />
        Intérieur
      </Badge>
    ) : (
      <Badge variant="default">
        <IconSun className="mr-1 h-3 w-3" />
        Extérieur
      </Badge>
    )
  }

  const getScoreDisplay = (score?: { team1: number; team2: number }) => {
    if (!score) return null

    const isTeam1Winner = score.team1 > score.team2
    const isTeam2Winner = score.team2 > score.team1
    const isDraw = score.team1 === score.team2

    return (
      <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/10 p-3">
        <IconTrophy className="h-4 w-4 text-warning" />
        <span className="text-sm font-medium text-warning">Score final :</span>
        <div className="flex items-center gap-2 font-bold">
          <span className={isTeam1Winner ? 'text-success' : 'text-foreground'}>
            Équipe 1: {score.team1}
          </span>
          <span className="text-muted-foreground">-</span>
          <span className={isTeam2Winner ? 'text-success' : 'text-foreground'}>
            Équipe 2: {score.team2}
          </span>
        </div>
        {isDraw && (
          <Badge variant="outline" className="ml-2">
            Match nul
          </Badge>
        )}
        {isTeam1Winner && (
          <Badge variant="success" className="ml-2">
            Victoire Équipe 1
          </Badge>
        )}
        {isTeam2Winner && (
          <Badge variant="success" className="ml-2">
            Victoire Équipe 2
          </Badge>
        )}
      </div>
    )
  }

  const getPlayerBadge = (status: string) => {
    switch (status) {
      case 'coming':
        return (
          <Badge variant="success" className="flex-shrink-0 text-xs">
            Confirmé
          </Badge>
        )
      case 'optional':
        return (
          <Badge variant="warning" className="flex-shrink-0 text-xs">
            Optionnel
          </Badge>
        )
      case 'not-coming':
        return (
          <Badge variant="destructive" className="flex-shrink-0 text-xs">
            Absent
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex-shrink-0 text-xs">
            En attente
          </Badge>
        )
    }
  }

  const getPlayerCardBackground = (status: string) => {
    switch (status) {
      case 'coming':
        return 'bg-success/20 border-success-foreground/10'
      case 'optional':
        return 'bg-warning/20 border-warning-foreground/20'
      case 'not-coming':
        return 'bg-destructive/20 border-destructive-foreground/10'
      default:
        return 'bg-muted/20 border-muted-foreground/10'
    }
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucune session dans l'historique pour le moment.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const confirmedPlayers = session.responses.filter(
          (r) => r.status === 'coming',
        )
        const optionalPlayers = session.responses.filter(
          (r) => r.status === 'optional',
        )
        const absentPlayers = session.responses.filter(
          (r) => r.status === 'not-coming',
        )
        const pendingPlayers = session.responses.filter(
          (r) => r.status === 'pending',
        )

        const totalPlayersCount = session.responses.length
        const confirmedCount = confirmedPlayers.length

        // Filtrer les joueurs selon les checkboxes
        const getFilteredPlayers = () => {
          const allPlayersWithStatus = [
            ...confirmedPlayers.map((r) => ({ ...r, type: 'coming' as const })),
            ...optionalPlayers.map((r) => ({
              ...r,
              type: 'optional' as const,
            })),
            ...pendingPlayers.map((r) => ({ ...r, type: 'pending' as const })),
            ...absentPlayers.map((r) => ({
              ...r,
              type: 'not-coming' as const,
            })),
          ]

          return allPlayersWithStatus.filter((player) => {
            if (player.type === 'coming' && !showConfirmed) return false
            if (player.type === 'optional' && !showOptional) return false
            if (player.type === 'pending' && !showPending) return false
            if (player.type === 'not-coming' && !showAbsent) return false
            return true
          })
        }

        const filteredPlayers = getFilteredPlayers()

        return (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">
                    Session du {formatDate(session.date)}
                  </CardTitle>
                  {getSessionTypeBadge(session.sessionType)}
                  {getStatusBadge(session.status)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteSession(session.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre de progression */}
              <div className="relative h-2 w-full rounded-full bg-muted">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-warning-foreground transition-all duration-300"
                  style={{
                    width: `${Math.min(((confirmedCount + optionalPlayers.length) / session.maxPlayers) * 100, 100)}%`,
                  }}
                />
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-success transition-all duration-300"
                  style={{
                    width: `${Math.min((confirmedCount / session.maxPlayers) * 100, 100)}%`,
                  }}
                />
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(session.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{session.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{session.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {confirmedCount}/{session.maxPlayers} joueurs
                  </span>
                </div>
              </div>

              {/* Légende de la barre de progression */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-3 rounded-sm bg-success"></div>
                  <span>Confirmés ({confirmedCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-3 rounded-sm bg-warning-foreground"></div>
                  <span>
                    Total avec optionnels (
                    {confirmedCount + optionalPlayers.length})
                  </span>
                </div>
              </div>

              {session.score && getScoreDisplay(session.score)}

              {session.pitch && (
                <Card className="border-border bg-muted">
                  <CardContent className="p-3">
                    <PitchCard pitch={session.pitch} compact />
                  </CardContent>
                </Card>
              )}

              {/* Section joueurs */}
              {totalPlayersCount > 0 && (
                <div className="space-y-3">
                  <Collapsible
                    open={showAllPlayers}
                    onOpenChange={setShowAllPlayers}
                  >
                    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3 transition-colors hover:bg-primary/20">
                      {showAllPlayers ? (
                        <IconChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <IconChevronRight className="h-4 w-4 text-primary" />
                      )}
                      <IconUsers className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">
                        Tous les joueurs ({totalPlayersCount})
                      </span>
                      <Badge variant="default" className="ml-auto">
                        {filteredPlayers.length}
                      </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      {/* Filtres */}
                      <div className="mb-4 rounded-lg border border-border bg-muted/50 p-3">
                        <div className="mb-3 flex items-center gap-2">
                          <IconFilter className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            Filtrer par statut :
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {/* Filtre Confirmés */}
                          <Badge
                            className={`has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] relative outline-none ${
                              showConfirmed
                                ? 'bg-success text-success-foreground'
                                : 'has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground bg-muted text-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              id={confirmedId}
                              className="peer sr-only after:absolute after:inset-0"
                              checked={showConfirmed}
                              onCheckedChange={setShowConfirmed}
                            />
                            <IconCheck
                              size={12}
                              className={`mr-1 ${showConfirmed ? 'block' : 'hidden'}`}
                              aria-hidden="true"
                            />
                            <label
                              htmlFor={confirmedId}
                              className="cursor-pointer select-none after:absolute after:inset-0"
                            >
                              Confirmés ({confirmedPlayers.length})
                            </label>
                          </Badge>

                          {/* Filtre Optionnels */}
                          <Badge
                            className={`has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] relative outline-none ${
                              showOptional
                                ? 'bg-warning text-warning-foreground'
                                : 'has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground bg-muted text-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              id={optionalId}
                              className="peer sr-only after:absolute after:inset-0"
                              checked={showOptional}
                              onCheckedChange={setShowOptional}
                            />
                            <IconQuestionMark
                              size={12}
                              className={`mr-1 ${showOptional ? 'block' : 'hidden'}`}
                              aria-hidden="true"
                            />
                            <label
                              htmlFor={optionalId}
                              className="cursor-pointer select-none after:absolute after:inset-0"
                            >
                              Optionnels ({optionalPlayers.length})
                            </label>
                          </Badge>

                          {/* Filtre En attente */}
                          <Badge
                            className={`has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] relative outline-none ${
                              showPending
                                ? 'bg-secondary text-secondary-foreground'
                                : 'has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground bg-muted text-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              id={pendingId}
                              className="peer sr-only after:absolute after:inset-0"
                              checked={showPending}
                              onCheckedChange={setShowPending}
                            />
                            <IconClock
                              size={12}
                              className={`mr-1 ${showPending ? 'block' : 'hidden'}`}
                              aria-hidden="true"
                            />
                            <label
                              htmlFor={pendingId}
                              className="cursor-pointer select-none after:absolute after:inset-0"
                            >
                              En attente ({pendingPlayers.length})
                            </label>
                          </Badge>

                          {/* Filtre Absents */}
                          <Badge
                            className={`has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] relative outline-none ${
                              showAbsent
                                ? 'bg-destructive text-destructive-foreground'
                                : 'has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground bg-muted text-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              id={absentId}
                              className="peer sr-only after:absolute after:inset-0"
                              checked={showAbsent}
                              onCheckedChange={setShowAbsent}
                            />
                            <IconX
                              size={12}
                              className={`mr-1 ${showAbsent ? 'block' : 'hidden'}`}
                              aria-hidden="true"
                            />
                            <label
                              htmlFor={absentId}
                              className="cursor-pointer select-none after:absolute after:inset-0"
                            >
                              Absents ({absentPlayers.length})
                            </label>
                          </Badge>
                        </div>
                      </div>

                      {/* Liste des joueurs filtrés */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {filteredPlayers.length > 0 ? (
                          filteredPlayers.map((playerResponse) => {
                            const playerName = getPlayerName(
                              playerResponse.playerId,
                            )
                            const player = players.find(
                              (p) => p.id === playerResponse.playerId,
                            )
                            const playerStatus = getPlayerStatus(
                              session,
                              playerResponse.playerId,
                            )

                            return (
                              <div
                                key={playerResponse.playerId}
                                className={`flex items-center gap-2 rounded-lg border p-2 ${getPlayerCardBackground(playerResponse.type)}`}
                              >
                                <PlayerAvatar
                                  name={playerName}
                                  status={playerStatus}
                                  size="sm"
                                  existingPlayers={allPlayerNames}
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium">
                                    {playerName}
                                  </span>
                                  {player && (player.email || player.phone) && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      {player.email && (
                                        <span className="flex items-center gap-1 truncate">
                                          <IconMail className="h-3 w-3 flex-shrink-0" />
                                          <span className="truncate">
                                            {player.email}
                                          </span>
                                        </span>
                                      )}
                                      {player.phone && (
                                        <span className="flex items-center gap-1">
                                          <IconPhone className="h-3 w-3 flex-shrink-0" />
                                          {player.phone}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {getPlayerBadge(playerResponse.type)}
                              </div>
                            )
                          })
                        ) : (
                          <div className="col-span-2 py-4 text-center text-muted-foreground">
                            Aucun joueur ne correspond aux filtres sélectionnés
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Section paiement */}
              {session.paymentLink && (
                <div className="flex items-center gap-2 rounded-lg border border-chart-2/20 bg-chart-2/10 p-3">
                  <IconCurrencyEuro className="h-4 w-4 text-chart-2" />
                  <span className="text-sm font-medium text-chart-2">
                    Paiement :
                  </span>
                  <a
                    href={session.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-chart-2 underline hover:text-chart-2/80"
                  >
                    Lien de paiement
                    <IconExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
