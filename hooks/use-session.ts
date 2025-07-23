"use client"

import { useState, useEffect } from "react"
import type { Session, PlayerResponse, PlayerStatus } from "@/types"

export function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [sessionHistory, setSessionHistory] = useState<Session[]>([])

  useEffect(() => {
    const savedSession = localStorage.getItem("five-planner-current-session")
    if (savedSession) {
      setCurrentSession(JSON.parse(savedSession))
    }

    const savedHistory = localStorage.getItem("five-planner-session-history")
    if (savedHistory) {
      setSessionHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveSessionToStorage = (session: Session | null) => {
    if (session) {
      localStorage.setItem("five-planner-current-session", JSON.stringify(session))
    } else {
      localStorage.removeItem("five-planner-current-session")
    }
    setCurrentSession(session)
  }

  const saveHistoryToStorage = (history: Session[]) => {
    localStorage.setItem("five-planner-session-history", JSON.stringify(history))
    setSessionHistory(history)
  }

  const createSession = (sessionData: Omit<Session, "id" | "responses" | "status" | "createdAt">) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString(),
      responses: [],
      status: "upcoming",
      createdAt: new Date().toISOString(),
    }
    saveSessionToStorage(newSession)
  }

  const updatePlayerResponse = (playerId: string, status: PlayerStatus) => {
    if (!currentSession) return

    const existingResponseIndex = currentSession.responses.findIndex((r) => r.playerId === playerId)

    let newResponses: PlayerResponse[]

    if (existingResponseIndex >= 0) {
      newResponses = currentSession.responses.map((response, index) =>
        index === existingResponseIndex ? { ...response, status, respondedAt: new Date().toISOString() } : response,
      )
    } else {
      newResponses = [
        ...currentSession.responses,
        {
          playerId,
          status,
          respondedAt: new Date().toISOString(),
        },
      ]
    }

    const updatedSession = {
      ...currentSession,
      responses: newResponses,
    }

    saveSessionToStorage(updatedSession)
  }

  const completeSession = (score?: { team1: number; team2: number }) => {
    if (!currentSession) return

    const completedSession: Session = {
      ...currentSession,
      status: "completed",
      completedAt: new Date().toISOString(),
      score,
    }

    const newHistory = [completedSession, ...sessionHistory]
    saveHistoryToStorage(newHistory)
    saveSessionToStorage(null)
  }

  const cancelSession = () => {
    if (!currentSession) return

    const cancelledSession: Session = {
      ...currentSession,
      status: "cancelled",
      completedAt: new Date().toISOString(),
    }

    const newHistory = [cancelledSession, ...sessionHistory]
    saveHistoryToStorage(newHistory)
    saveSessionToStorage(null)
  }

  const clearSession = () => {
    saveSessionToStorage(null)
  }

  const deleteHistorySession = (sessionId: string) => {
    const newHistory = sessionHistory.filter((s) => s.id !== sessionId)
    saveHistoryToStorage(newHistory)
  }

  return {
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
