'use client'

import { useState, useEffect } from 'react'
import type { Session, PlayerStatus } from '@/types'

export function useSession() {
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  )
  const [sessionHistory, setSessionHistory] = useState<Session[]>([])

  useEffect(() => {
    const savedSessions = localStorage.getItem('five-planner-active-sessions')
    const savedSelected = localStorage.getItem(
      'five-planner-selected-session-id',
    )
    const savedHistory = localStorage.getItem('five-planner-session-history')

    if (savedSessions) setActiveSessions(JSON.parse(savedSessions))
    if (savedSelected) setSelectedSessionId(savedSelected)
    if (savedHistory) setSessionHistory(JSON.parse(savedHistory))
  }, [])

  const persistSessions = (sessions: Session[]) => {
    setActiveSessions(sessions)
    localStorage.setItem(
      'five-planner-active-sessions',
      JSON.stringify(sessions),
    )
  }

  const persistSelectedId = (id: string | null) => {
    setSelectedSessionId(id)
    if (id) localStorage.setItem('five-planner-selected-session-id', id)
    else localStorage.removeItem('five-planner-selected-session-id')
  }

  const currentSession =
    activeSessions.find((s) => s.id === selectedSessionId) || null

  const saveHistoryToStorage = (history: Session[]) => {
    setSessionHistory(history)
    localStorage.setItem(
      'five-planner-session-history',
      JSON.stringify(history),
    )
  }

  const createSession = (
    data: Omit<Session, 'id' | 'responses' | 'status' | 'createdAt'>,
  ) => {
    const newSession: Session = {
      ...data,
      id: Date.now().toString(),
      responses: [],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    }
    const updated = [newSession, ...activeSessions]
    persistSessions(updated)
    persistSelectedId(newSession.id)
  }

  const updatePlayerResponse = (playerId: string, status: PlayerStatus) => {
    if (!currentSession) return

    const newResponses = [...currentSession.responses]
    const index = newResponses.findIndex((r) => r.playerId === playerId)

    if (index >= 0) {
      newResponses[index] = {
        ...newResponses[index],
        status,
        respondedAt: new Date().toISOString(),
      }
    } else {
      newResponses.push({
        playerId,
        status,
        respondedAt: new Date().toISOString(),
      })
    }

    const updated = activeSessions.map((s) =>
      s.id === currentSession.id ? { ...s, responses: newResponses } : s,
    )
    persistSessions(updated)
  }

  const completeSession = (score?: { team1: number; team2: number }) => {
    if (!currentSession) return

    const completedSession: Session = {
      ...currentSession,
      status: 'completed',
      completedAt: new Date().toISOString(),
      score,
    }

    persistSessions(activeSessions.filter((s) => s.id !== completedSession.id))
    saveHistoryToStorage([completedSession, ...sessionHistory])
    persistSelectedId(null)
  }

  const cancelSession = () => {
    if (!currentSession) return

    const cancelledSession: Session = {
      ...currentSession,
      status: 'cancelled',
      completedAt: new Date().toISOString(),
    }

    persistSessions(activeSessions.filter((s) => s.id !== cancelledSession.id))
    saveHistoryToStorage([cancelledSession, ...sessionHistory])
    persistSelectedId(null)
  }

  const clearSession = () => {
    if (!currentSession) return
    persistSessions(activeSessions.filter((s) => s.id !== currentSession.id))
    persistSelectedId(null)
  }

  const deleteHistorySession = (sessionId: string) => {
    const newHistory = sessionHistory.filter((s) => s.id !== sessionId)
    saveHistoryToStorage(newHistory)
  }

  return {
    activeSessions,
    selectedSessionId,
    setSelectedSessionId,
    currentSession,
    sessionHistory,
    createSession,
    updatePlayerResponse,
    completeSession,
    cancelSession,
    clearSession,
    deleteHistorySession,
  }
}
