'use client'

import { useEffect, useState } from 'react'
import type { Session, Player, Pitch, PlayerGroup } from '@/types'
import { AddPlayerDialog } from '@/components/add-player-dialog'
import { CreateSessionDialog } from '@/components/create-session-dialog'
import { CreateSessionFromEmailDialog } from '@/components/create-session-from-email-dialog'
import { SessionCard } from '@/components/session-card'
import { SessionSelector } from '@/components/session-selector'
import { Card, CardContent } from '@/components/ui/card'
import {
  IconCalendarPlus,
  IconBallFootball,
  IconUsers,
} from '@tabler/icons-react'
import { APP_CONFIG } from '@/config/app.config'

interface CurrentSessionViewProps {
  activeSessions: Session[]
  selectedSessionId: Session['id'] | null
  setSelectedSessionId: (id: Session['id'] | null) => void
  currentSession: Session | null
  players: Player[]
  pitches: Pitch[]
  groups: PlayerGroup[]
  onCreateSession: (
    session: Omit<Session, 'id' | 'responses' | 'status' | 'createdAt'>,
  ) => void
  onCompleteSession: () => void
  onCancelSession: () => void
  onClearSession: () => void
  onUpdatePlayerResponse: (
    playerId: string,
    status: 'coming' | 'not-coming' | 'pending' | 'optional',
  ) => void
  onAddPlayer: (player: Omit<Player, 'id'>) => void
  onAddPitch: (pitch: Omit<Pitch, 'id'>) => void
  onUpdatePitch: (pitchId: string, updates: Partial<Pitch>) => void
  onRemovePitch: (pitchId: string) => void
  onAddGroup: (group: Omit<PlayerGroup, 'id'>) => void
  onUpdateGroup: (groupId: string, updates: Partial<PlayerGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

export function CurrentSessionView({
  activeSessions,
  players,
  pitches,
  groups,
  onCreateSession,
  onCompleteSession,
  onCancelSession,
  onClearSession,
  onUpdatePlayerResponse,
  onAddPlayer,
  onAddPitch,
  onUpdatePitch,
  onRemovePitch,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
}: CurrentSessionViewProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  )

  const handleSessionChange = (sessionId: string | null) => {
    setSelectedSessionId(sessionId)
  }

  const filteredSessions = selectedSessionId
    ? activeSessions.filter((session) => session.id === selectedSessionId)
    : activeSessions

  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <IconBallFootball className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-3xl font-bold">
            {APP_CONFIG.name} - Organisez vos five
          </h1>
        </div>
        <p className="text-muted-foreground">
          Gérez facilement vos sessions de football 5v5
        </p>
      </header>

      {activeSessions.length > 0 && (
        <div className="flex items-center justify-center lg:justify-between">
          <div className="hidden items-center gap-2 lg:flex">
            <IconUsers className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Sessions actives ({activeSessions.length})
            </span>
          </div>

          <SessionSelector
            sessions={activeSessions}
            selectedSessionId={selectedSessionId}
            onSessionChange={handleSessionChange}
          />
        </div>
      )}

      {filteredSessions.length > 0 ? (
        <div className="space-y-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              players={players}
              groups={groups}
              onCompleteSession={onCompleteSession}
              onCancelSession={onCancelSession}
              onClearSession={onClearSession}
              onUpdatePlayerResponse={onUpdatePlayerResponse}
              onAddPlayer={onAddPlayer}
              onAddGroup={onAddGroup}
              onUpdateGroup={onUpdateGroup}
              onRemoveGroup={onRemoveGroup}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <IconCalendarPlus className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Aucune session en cours
            </h3>
            <p className="text-muted-foreground mb-6">
              Créez une nouvelle session pour commencer à organiser votre match
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CreateSessionDialog
                pitches={pitches}
                onCreateSession={onCreateSession}
                onAddPitch={onAddPitch}
                onUpdatePitch={onUpdatePitch}
                onRemovePitch={onRemovePitch}
              />
              <CreateSessionFromEmailDialog
                pitches={pitches}
                onCreateSession={onCreateSession}
                onAddPitch={onAddPitch}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <AddPlayerDialog
          groups={groups}
          onAddPlayer={onAddPlayer}
          onAddGroup={onAddGroup}
          onUpdateGroup={onUpdateGroup}
          onRemoveGroup={onRemoveGroup}
        />

        <>
          <CreateSessionDialog
            pitches={pitches}
            onCreateSession={onCreateSession}
            onAddPitch={onAddPitch}
            onUpdatePitch={onUpdatePitch}
            onRemovePitch={onRemovePitch}
          />
          <CreateSessionFromEmailDialog
            pitches={pitches}
            onCreateSession={onCreateSession}
            onAddPitch={onAddPitch}
          />
        </>
      </div>
    </div>
  )
}
