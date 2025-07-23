'use client'

import type { Player, PlayerStats } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface PlayerStatsProps {
  players: Player[]
  stats: PlayerStats[]
}

export function PlayerStatsComponent({ players, stats }: PlayerStatsProps) {
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || 'Joueur inconnu'
  }

  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-center">
          Aucune statistique disponible. Complétez quelques sessions pour voir
          les stats !
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des joueurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.playerId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {getPlayerName(stat.playerId)}
                </span>
                <span className="text-muted-foreground text-sm">
                  {stat.attendedSessions}/{stat.totalSessions} sessions (
                  {Math.round(stat.attendanceRate)}%)
                </span>
              </div>
              <Progress value={stat.attendanceRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
