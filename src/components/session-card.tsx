'use client'

import type { Session, Player, PlayerStatus } from '@/types'
import { useState, useId } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { PlayerAvatar } from '@/components/player-avatar'
import { ManageSessionPlayersDialog } from '@/components/manage-session-players-dialog'
import { CompleteSessionDialog } from '@/components/complete-session-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SharePreviewDialog } from '@/components/share-preview-dialog'
import { shareSession } from '@/utils/share'
import { addToCalendar } from '@/utils/calendar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconTrash,
  IconCheck,
  IconX,
  IconHome,
  IconSun,
  IconShare,
  IconCurrencyEuro,
  IconExternalLink,
  IconChevronDown,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconCalendarPlus,
  IconFilter,
  IconQuestionMark,
} from '@tabler/icons-react'
import { AddPlayerDialog } from '@/components/add-player-dialog'
import type { PlayerGroup } from '@/types'
import { PlayerCardInline } from './player-card-inline'

interface SessionCardProps {
  session: Session
  players: Player[]
  groups: PlayerGroup[]
  onCompleteSession: (score?: { team1: number; team2: number }) => void
  onCancelSession: () => void
  onClearSession: () => void
  onUpdatePlayerResponse: (
    playerId: string,
    status: 'coming' | 'not-coming' | 'pending' | 'optional',
  ) => void
  onAddPlayer: (player: {
    name: string
    email?: string
    phone?: string
    group?: string
  }) => void
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

export function SessionCard({
  session,
  players,
  groups,
  onCompleteSession,
  onCancelSession,
  onClearSession,
  onUpdatePlayerResponse,
  onAddPlayer,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}: SessionCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false)
  const [showAllPlayers, setShowAllPlayers] = useState(true)
  const [showSharePreview, setShowSharePreview] = useState(false)

  // Filtres pour les types de joueurs
  const [showConfirmed, setShowConfirmed] = useState(true)
  const [showOptional, setShowOptional] = useState(true)
  const [showPending, setShowPending] = useState(true)
  const [showAbsent, setShowAbsent] = useState(false)

  // IDs pour les checkboxes
  const confirmedId = useId()
  const optionalId = useId()
  const pendingId = useId()
  const absentId = useId()

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Date invalide'
      }
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error)
      return 'Date invalide'
    }
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || 'Joueur inconnu'
  }

  const getPlayerStatus = (playerId: string) => {
    const response = session.responses.find((r) => r.playerId === playerId)
    return response?.status || 'pending'
  }

  const confirmedPlayers = session.responses.filter(
    (r) => r.status === 'coming',
  )
  const optionalPlayers = session.responses.filter(
    (r) => r.status === 'optional',
  )
  const absentPlayers = session.responses.filter(
    (r) => r.status === 'not-coming',
  )
  const pendingPlayers = session.responses.filter((r) => r.status === 'pending')

  const playersWithoutResponse = players.filter(
    (player) =>
      !session.responses.some((response) => response.playerId === player.id),
  )

  const allPendingPlayers = [
    ...pendingPlayers,
    ...playersWithoutResponse.map((player) => ({
      playerId: player.id,
      status: 'pending' as const,
      respondedAt: undefined,
    })),
  ]

  const confirmedCount = confirmedPlayers.length

  // Obtenir tous les noms des joueurs pour le système de couleurs uniques
  const allPlayerNames = players.map((p) => p.name)

  // Filtrer les joueurs selon les checkboxes
  const getFilteredPlayers = () => {
    const allPlayersWithStatus = [
      ...confirmedPlayers.map((r) => ({ ...r, type: 'confirmed' as const })),
      ...optionalPlayers.map((r) => ({ ...r, type: 'optional' as const })),
      ...allPendingPlayers.map((r) => ({ ...r, type: 'pending' as const })),
      ...absentPlayers.map((r) => ({ ...r, type: 'absent' as const })),
    ]

    const playerNameByPlayerId = (playerId: string) =>
      players.find((p) => p.id === playerId)?.name || 'Joueur inconnu'

    return allPlayersWithStatus
      .filter((player) => {
        if (player.type === 'confirmed' && !showConfirmed) return false
        if (player.type === 'optional' && !showOptional) return false
        if (player.type === 'pending' && !showPending) return false
        if (player.type === 'absent' && !showAbsent) return false
        return true
      })
      .sort((a, b) =>
        playerNameByPlayerId(a.playerId).localeCompare(
          playerNameByPlayerId(b.playerId),
        ),
      )
  }

  const filteredPlayers = getFilteredPlayers()

  const getSessionTypeBadge = () => {
    return session.sessionType === 'indoor' ? (
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

  const handleSharePreview = () => {
    setShowSharePreview(true)
  }

  const handleConfirmShare = async () => {
    setIsSharing(true)
    try {
      const success = await shareSession(session, players)
      if (success && !navigator.share) {
        alert('Récapitulatif copié dans le presse-papiers !')
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
      alert('Erreur lors du partage')
    } finally {
      setIsSharing(false)
    }
  }

  const handleAddToCalendar = async () => {
    setIsAddingToCalendar(true)
    try {
      if (!session.date || !session.time) {
        throw new Error('Données de session incomplètes')
      }

      const dateTest = new Date(session.date)
      if (isNaN(dateTest.getTime())) {
        throw new Error('Format de date invalide')
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(session.time)) {
        throw new Error("Format d'heure invalide")
      }

      addToCalendar(session, players)
    } catch (error) {
      console.error("Erreur lors de l'ajout au calendrier:", error)
      alert(
        "Impossible d'ajouter l'événement au calendrier. Veuillez vérifier les informations de la session.",
      )
    } finally {
      setIsAddingToCalendar(false)
    }
  }

  const getPlayerBadge = (type: string) => {
    switch (type) {
      case 'confirmed':
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
      case 'pending':
        return (
          <Badge variant="outline" className="flex-shrink-0 text-xs">
            En attente
          </Badge>
        )
      case 'absent':
        return (
          <Badge variant="destructive" className="flex-shrink-0 text-xs">
            Absent
          </Badge>
        )
      default:
        return null
    }
  }

  const getPlayerCardBackground = (type: string) => {
    switch (type) {
      case 'confirmed':
        return 'bg-success/20 border-success-foreground/10'
      case 'optional':
        return 'bg-warning/20 border-warning-foreground120'
      case 'pending':
        return 'bg-muted/20 border-muted-foreground/10'
      case 'absent':
        return 'bg-destructive/20 border-destructive-foreground/10'
      default:
        return 'bg-card border-border'
    }
  }

  const totalPlayersCount =
    confirmedPlayers.length +
    optionalPlayers.length +
    allPendingPlayers.length +
    absentPlayers.length

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Prochaine session</CardTitle>
              {getSessionTypeBadge()}
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={handleAddToCalendar}
              disabled={isAddingToCalendar}
              className="flex-shrink-0"
            >
              <IconCalendarPlus className="mr-1 h-4 w-4" />
              {isAddingToCalendar ? 'Ajout...' : 'Agenda'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted relative -mt-2 mb-4 h-2 w-full rounded-full">
            <div
              className="bg-warning-foreground absolute top-0 left-0 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((confirmedCount + optionalPlayers.length) / session.maxPlayers) * 100, 100)}%`,
              }}
            />
            <div
              className="bg-success absolute top-0 left-0 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((confirmedCount / session.maxPlayers) * 100, 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <IconCalendar className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{session.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconMapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{session.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                {confirmedCount}/{session.maxPlayers} joueurs
              </span>
            </div>
          </div>

          {totalPlayersCount > 0 && (
            <div className="space-y-3">
              <Collapsible
                open={showAllPlayers}
                onOpenChange={setShowAllPlayers}
              >
                <CollapsibleTrigger className="border-primary/20 bg-primary/10 hover:bg-primary/20 flex w-full items-center gap-2 rounded-lg border p-3 transition-colors">
                  {showAllPlayers ? (
                    <IconChevronDown className="text-primary h-4 w-4" />
                  ) : (
                    <IconChevronRight className="text-primary h-4 w-4" />
                  )}
                  <IconUsers className="text-primary h-4 w-4" />
                  <span className="text-primary font-medium">
                    Tous les joueurs ({totalPlayersCount})
                  </span>

                  <div className="ml-auto space-x-2">
                    <Badge variant={'destructive'}>
                      {absentPlayers.length}
                    </Badge>
                    <Badge variant="muted">{pendingPlayers.length}</Badge>
                    <Badge variant="warning">{optionalPlayers.length}</Badge>
                    <Badge variant="default">{confirmedCount}</Badge>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  {/* Filtres avec checkboxes simples */}
                  <div className="border-border bg-muted/50 mb-4 rounded-lg border p-3">
                    <div className="mb-3 flex items-center gap-2">
                      <IconFilter className="text-muted-foreground h-4 w-4" />
                      <span className="text-foreground text-sm font-medium">
                        Filtrer par statut :
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={confirmedId}
                          checked={showConfirmed}
                          onCheckedChange={(value: boolean) =>
                            setShowConfirmed(value)
                          }
                        />
                        <Label
                          htmlFor={confirmedId}
                          className="cursor-pointer text-sm font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <IconCheck className="text-success h-3 w-3" />
                            Confirmés ({confirmedPlayers.length})
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={optionalId}
                          checked={showOptional}
                          onCheckedChange={(value: boolean) =>
                            setShowOptional(value)
                          }
                        />
                        <Label
                          htmlFor={optionalId}
                          className="cursor-pointer text-sm font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <IconQuestionMark className="text-warning h-3 w-3" />
                            Optionnels ({optionalPlayers.length})
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={pendingId}
                          checked={showPending}
                          onCheckedChange={(value: boolean) =>
                            setShowPending(value)
                          }
                        />
                        <Label
                          htmlFor={pendingId}
                          className="cursor-pointer text-sm font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <IconClock className="text-muted-foreground h-3 w-3" />
                            En attente ({allPendingPlayers.length})
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={absentId}
                          checked={showAbsent}
                          onCheckedChange={(value: boolean) =>
                            setShowAbsent(value)
                          }
                        />
                        <Label
                          htmlFor={absentId}
                          className="cursor-pointer text-sm font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <IconX className="text-destructive h-3 w-3" />
                            Absents ({absentPlayers.length})
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Liste des joueurs filtrés */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(filteredPlayers ?? []).map((player) => (
                      <PlayerCardInline
                        key={player.playerId}
                        player={players.find((p) => p.id === player.playerId)!}
                        status={getPlayerStatus(player.playerId)}
                        allPlayerNames={players.map((p) => p.name)}
                        groupName={undefined}
                        groupColor={undefined}
                        handleStatusUpdate={(
                          playerId: string,
                          status: PlayerStatus,
                          e: React.MouseEvent,
                        ): void => {
                          e.stopPropagation()
                          onUpdatePlayerResponse(playerId, status)
                        }}
                      />
                    ))}
                    {filteredPlayers.length === 0 && (
                      <div className="text-muted-foreground col-span-2 py-4 text-center">
                        Aucun joueur ne correspond aux filtres sélectionnés
                      </div>
                    )}
                  </div>

                  {/* Actions rapides */}
                  <div className="bg-muted mt-4 rounded-lg p-3">
                    <p className="text-muted-foreground mb-2 text-xs">
                      Actions rapides :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <AddPlayerDialog
                        groups={groups}
                        onAddPlayer={onAddPlayer}
                        onAddGroup={onAddGroup}
                        onUpdateGroup={onUpdateGroup}
                        onRemoveGroup={onRemoveGroup}
                      />
                      <ManageSessionPlayersDialog
                        session={session}
                        players={players}
                        groups={groups}
                        onAddPlayer={onAddPlayer}
                        onUpdatePlayerResponse={onUpdatePlayerResponse}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {session.paymentLink && (
            <div className="border-chart-2/20 bg-chart-2/10 flex items-center gap-2 rounded-lg border p-3">
              <IconCurrencyEuro className="text-chart-2 h-4 w-4" />
              <span className="text-chart-2 text-sm font-medium">
                Paiement :
              </span>
              <a
                href={session.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chart-2 hover:text-chart-2/80 flex items-center gap-1 text-sm underline"
              >
                Cliquez ici pour payer
                <IconExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="border-border flex flex-col gap-2 border-t pt-4 sm:flex-row sm:gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={handleSharePreview}
              className="w-full sm:w-auto"
            >
              <IconShare className="mr-1 h-4 w-4" />
              Partager
            </Button>
            <ManageSessionPlayersDialog
              session={session}
              players={players}
              groups={groups}
              onUpdatePlayerResponse={onUpdatePlayerResponse}
              onAddPlayer={onAddPlayer}
            />
            <CompleteSessionDialog onCompleteSession={onCompleteSession}>
              <Button variant="success" size="sm" className="w-full sm:w-auto">
                <IconCheck className="mr-1 h-4 w-4" />
                Terminer
              </Button>
            </CompleteSessionDialog>
            <ConfirmDialog
              title="Annuler la session"
              description="Êtes-vous sûr de vouloir annuler cette session ? Cette action ne peut pas être annulée."
              confirmText="Annuler la session"
              onConfirm={onCancelSession}
            >
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto"
              >
                <IconX className="mr-1 h-4 w-4" />
                Annuler
              </Button>
            </ConfirmDialog>
            <ConfirmDialog
              title="Supprimer la session"
              description="Êtes-vous sûr de vouloir supprimer définitivement cette session ? Toutes les données seront perdues."
              confirmText="Supprimer"
              onConfirm={onClearSession}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive w-full sm:w-auto"
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </ConfirmDialog>
          </div>
        </CardContent>
      </Card>

      <SharePreviewDialog
        session={session}
        players={players}
        open={showSharePreview}
        onOpenChange={setShowSharePreview}
        onConfirmShare={handleConfirmShare}
      />
    </>
  )
}
