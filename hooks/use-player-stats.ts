'use client'

import { useMemo } from 'react'
import type { Player, Session, PlayerStats } from '@/types'

export function usePlayerStats(players: Player[], sessionHistory: Session[]) {
  const playerStats = useMemo(() => {
    const stats: PlayerStats[] = players.map((player) => {
      const completedSessions = sessionHistory.filter(
        (session) => session.status === 'completed',
      )

      const playerSessions = completedSessions.filter((session) =>
        session.responses.some((response) => response.playerId === player.id),
      )

      const attendedSessions = completedSessions.filter((session) =>
        session.responses.some(
          (response) =>
            response.playerId === player.id && response.status === 'coming',
        ),
      )

      return {
        playerId: player.id,
        totalSessions: playerSessions.length,
        attendedSessions: attendedSessions.length,
        attendanceRate:
          playerSessions.length > 0
            ? (attendedSessions.length / playerSessions.length) * 100
            : 0,
      }
    })

    return stats.sort((a, b) => b.attendanceRate - a.attendanceRate)
  }, [players, sessionHistory])

  return playerStats
}
