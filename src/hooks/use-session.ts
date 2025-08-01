'use client'

import { useState, useEffect } from 'react'
import type { Session, PlayerStatus } from '@/types'
import { generateUniqueId } from '@/lib/generator'

const STORAGE_KEYS = {
  ACTIVE_SESSIONS: 'five-planner-active-sessions',
  SELECTED_SESSION_ID: 'five-planner-selected-session-id',
  SESSION_HISTORY: 'five-planner-session-history',
}

export function useSession() {
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  )
  const [sessionHistory, setSessionHistory] = useState<Session[]>([])

  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS)
    const savedSelected = localStorage.getItem(STORAGE_KEYS.SELECTED_SESSION_ID)
    const savedHistory = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY)

    if (savedSessions) setActiveSessions(JSON.parse(savedSessions))
    if (savedSelected) setSelectedSessionId(savedSelected)
    if (savedHistory) setSessionHistory(JSON.parse(savedHistory))
  }, [])

  const persistSessions = (sessions: Session[]) => {
    setActiveSessions(sessions)
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(sessions))
  }

  const persistSelectedId = (id: string | null) => {
    setSelectedSessionId(id)
    if (id) localStorage.setItem(STORAGE_KEYS.SELECTED_SESSION_ID, id)
    else localStorage.removeItem(STORAGE_KEYS.SELECTED_SESSION_ID)
  }

  const currentSession =
    activeSessions.find((s) => s.id === selectedSessionId) || null

  const saveHistoryToStorage = (history: Session[]) => {
    setSessionHistory(history)
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history))
  }

  const createSession = (
    data: Omit<Session, 'id' | 'responses' | 'status' | 'createdAt'>,
  ) => {
    const newSession: Session = {
      ...data,
      id: generateUniqueId(),
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

  const clearSession = (sessionId: string) => {
    persistSessions(activeSessions.filter((s) => s.id !== sessionId))
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
