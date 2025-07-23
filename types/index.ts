export interface Player {
  id: string
  name: string
  email?: string
  phone?: string
  group?: string
}

export interface PlayerGroup {
  id: string
  name: string
  color: string
}

export interface Pitch {
  id: string
  name: string
  address: string
  surfaceType: "synthetic" | "grass" | "indoor" | "concrete"
  isFilmed: boolean
  priceRange?: string
  description?: string
}

export interface Session {
  id: string
  date: string
  time: string
  location: string
  pitch?: Pitch
  sessionType: "indoor" | "outdoor"
  paymentLink?: string
  maxPlayers: number
  responses: PlayerResponse[]
  status: "upcoming" | "completed" | "cancelled"
  createdAt: string
  completedAt?: string
  score?: {
    team1: number
    team2: number
  }
}

export interface PlayerResponse {
  playerId: string
  status: "coming" | "not-coming" | "pending" | "optional"
  respondedAt?: string
}

export type PlayerStatus = "coming" | "not-coming" | "pending" | "optional"

export interface PlayerStats {
  playerId: string
  totalSessions: number
  attendedSessions: number
  attendanceRate: number
}
