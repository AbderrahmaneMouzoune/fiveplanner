"use client"

import { useState, useEffect } from "react"
import type { Pitch } from "@/types"
import { DEFAULT_PITCHES } from "@/data/pitches"

export function usePitches() {
  const [pitches, setPitches] = useState<Pitch[]>([])

  useEffect(() => {
    const savedPitches = localStorage.getItem("five-planner-pitches")
    if (savedPitches) {
      setPitches(JSON.parse(savedPitches))
    } else {
      // Initialiser avec les terrains par défaut
      setPitches(DEFAULT_PITCHES)
      localStorage.setItem("five-planner-pitches", JSON.stringify(DEFAULT_PITCHES))
    }
  }, [])

  const savePitchesToStorage = (newPitches: Pitch[]) => {
    localStorage.setItem("five-planner-pitches", JSON.stringify(newPitches))
    setPitches(newPitches)
  }

  const addPitch = (pitch: Omit<Pitch, "id">) => {
    const newPitch: Pitch = {
      ...pitch,
      id: Date.now().toString(),
    }
    const newPitches = [...pitches, newPitch]
    savePitchesToStorage(newPitches)
  }

  const updatePitch = (pitchId: string, updates: Partial<Pitch>) => {
    const newPitches = pitches.map((p) => (p.id === pitchId ? { ...p, ...updates } : p))
    savePitchesToStorage(newPitches)
  }

  const removePitch = (pitchId: string) => {
    const newPitches = pitches.filter((p) => p.id !== pitchId)
    savePitchesToStorage(newPitches)
  }

  return {
    pitches,
    addPitch,
    updatePitch,
    removePitch,
  }
}
