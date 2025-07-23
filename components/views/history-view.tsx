'use client'

import type { Session, Player } from '@/types'
import { SessionHistory } from '@/components/session-history'
import { Card, CardContent } from '@/components/ui/card'
import { IconHistory, IconCalendarOff } from '@tabler/icons-react'

interface HistoryViewProps {
  sessions: Session[]
  players: Player[]
  onDeleteSession: (sessionId: string) => void
}

export function HistoryView({
  sessions,
  players,
  onDeleteSession,
}: HistoryViewProps) {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <IconHistory className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Historique des sessions
          </h1>
        </div>
        <p className="text-muted-foreground">
          Consultez vos sessions passées et leurs résultats
        </p>
      </header>

      {sessions.length > 0 ? (
        <SessionHistory
          sessions={sessions}
          players={players}
          onDeleteSession={onDeleteSession}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <IconCalendarOff className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Aucune session dans l'historique
            </h3>
            <p className="text-muted-foreground">
              Vos sessions terminées ou annulées apparaîtront ici pour que vous
              puissiez consulter leur historique
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
