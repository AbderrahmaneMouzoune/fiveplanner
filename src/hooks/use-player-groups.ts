'use client'

import { useState, useEffect } from 'react'
import type { PlayerGroup } from '@/types'

const DEFAULT_GROUPS: PlayerGroup[] = [
  { id: '1', name: 'Réguliers', color: 'bg-blue-500' },
  { id: '2', name: 'Occasionnels', color: 'bg-green-500' },
  { id: '3', name: 'Nouveaux', color: 'bg-purple-500' },
  { id: '4', name: 'Remplaçants', color: 'bg-orange-500' },
]

export function usePlayerGroups() {
  const [groups, setGroups] = useState<PlayerGroup[]>([])

  useEffect(() => {
    const savedGroups = localStorage.getItem('five-planner-groups')
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    } else {
      setGroups(DEFAULT_GROUPS)
      localStorage.setItem(
        'five-planner-groups',
        JSON.stringify(DEFAULT_GROUPS),
      )
    }
  }, [])

  const saveGroupsToStorage = (newGroups: PlayerGroup[]) => {
    localStorage.setItem('five-planner-groups', JSON.stringify(newGroups))
    setGroups(newGroups)
  }

  const addGroup = (group: Omit<PlayerGroup, 'id'>) => {
    const newGroup: PlayerGroup = {
      ...group,
      id: Date.now().toString(),
    }
    const newGroups = [...groups, newGroup]
    saveGroupsToStorage(newGroups)
  }

  const updateGroup = (groupId: string, updates: Partial<PlayerGroup>) => {
    const newGroups = groups.map((g) =>
      g.id === groupId ? { ...g, ...updates } : g,
    )
    saveGroupsToStorage(newGroups)
  }

  const removeGroup = (groupId: string) => {
    const newGroups = groups.filter((g) => g.id !== groupId)
    saveGroupsToStorage(newGroups)
  }

  return {
    groups,
    addGroup,
    updateGroup,
    removeGroup,
  }
}
