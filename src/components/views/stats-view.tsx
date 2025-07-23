'use client'

import type { Player, Session, PlayerStats } from '@/types'
import { PlayerStatsComponent } from '@/components/player-stats'
import { Card, CardContent } from '@/components/ui/card'
import { IconChartBar, IconChartPie } from '@tabler/icons-react'

interface StatsViewProps {
  players: Player[]
  stats: PlayerStats[]
  sessionHistory: Session[]
}

export function StatsView({ players, stats, sessionHistory }: StatsViewProps) {
  const totalSessions = sessionHistory.filter(
    (s) => s.status === 'completed',
  ).length
  const totalPlayers = players.length
  const averageAttendance =
    stats.length > 0
      ? stats.reduce((acc, stat) => acc + stat.attendanceRate, 0) / stats.length
      : 0

  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <IconChartBar className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-3xl font-bold">Statistiques</h1>
        </div>
        <p className="text-muted-foreground">
          Analysez les performances et la participation de vos joueurs
        </p>
      </header>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-success mb-2 text-3xl font-bold">
              {totalSessions}
            </div>
            <div className="text-muted-foreground text-sm">
              Sessions terminées
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-chart-2 mb-2 text-3xl font-bold">
              {totalPlayers}
            </div>
            <div className="text-muted-foreground text-sm">
              Joueurs enregistrés
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-warning mb-2 text-3xl font-bold">
              {Math.round(averageAttendance)}%
            </div>
            <div className="text-muted-foreground text-sm">
              Taux de participation moyen
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.length > 0 ? (
        <PlayerStatsComponent players={players} stats={stats} />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <IconChartPie className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Aucune statistique disponible
            </h3>
            <p className="text-muted-foreground">
              Complétez quelques sessions pour voir apparaître les statistiques
              de participation de vos joueurs
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
