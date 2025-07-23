'use client'

import { useState, useEffect } from 'react'
import type { Player } from '@/types'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const savedPlayers = localStorage.getItem('five-planner-players')
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers))
    }
  }, [])

  const savePlayersToStorage = (newPlayers: Player[]) => {
    localStorage.setItem('five-planner-players', JSON.stringify(newPlayers))
    setPlayers(newPlayers)
  }

  const addPlayer = (player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    }
    const newPlayers = [...players, newPlayer]
    savePlayersToStorage(newPlayers)
  }

  const removePlayer = (playerId: string) => {
    const newPlayers = players.filter((p) => p.id !== playerId)
    savePlayersToStorage(newPlayers)
  }

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    const newPlayers = players.map((p) =>
      p.id === playerId ? { ...p, ...updates } : p,
    )
    savePlayersToStorage(newPlayers)
  }

  return {
    players,
    addPlayer,
    removePlayer,
    updatePlayer,
  }
}
