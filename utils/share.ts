import type { Session, Player } from "@/types"
import { generateCalendarEvent } from "@/utils/calendar"

export function generateSessionSummary(session: Session, players: Player[]): string {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || "Joueur inconnu"
  }

  const confirmedPlayers = session.responses.filter((r) => r.status === "coming")
  const optionalPlayers = session.responses.filter((r) => r.status === "optional")
  const pendingPlayers = session.responses.filter((r) => r.status === "pending")

  const sessionTypeText = session.sessionType === "indoor" ? "Intérieur" : "Extérieur"
  const locationText = session.pitch ? `${session.pitch.name}\n📍 ${session.pitch.address}` : `📍 ${session.location}`

  let summary = `⚽ SESSION DE FOOTBALL 5v5\n\n`
  summary += `📅 ${formatDate(session.date)}\n`
  summary += `🕐 ${session.time}\n`
  summary += `🏟️ ${sessionTypeText}\n`
  summary += `${locationText}\n\n`

  if (confirmedPlayers.length > 0) {
    summary += `✅ JOUEURS CONFIRMÉS (${confirmedPlayers.length}):\n`
    confirmedPlayers.forEach((response) => {
      summary += `• ${getPlayerName(response.playerId)}\n`
    })
    summary += `\n`
  }

  if (optionalPlayers.length > 0) {
    summary += `❓ JOUEURS OPTIONNELS (${optionalPlayers.length}):\n`
    optionalPlayers.forEach((response) => {
      summary += `• ${getPlayerName(response.playerId)}\n`
    })
    summary += `\n`
  }

  if (pendingPlayers.length > 0) {
    summary += `⏳ EN ATTENTE DE RÉPONSE (${pendingPlayers.length}):\n`
    pendingPlayers.forEach((response) => {
      summary += `• ${getPlayerName(response.playerId)}\n`
    })
    summary += `\n`
  }

  summary += `👥 Places: ${confirmedPlayers.length}/${session.maxPlayers}\n`

  // Ajouter le lien de paiement s'il existe
  if (session.paymentLink) {
    summary += `💳 Paiement: ${session.paymentLink}\n`
  }

  // Ajouter le lien pour ajouter au calendrier
  try {
    const calendarUrl = generateCalendarEvent(session, players)
    summary += `\n📅 Ajouter à votre agenda: ${calendarUrl}\n`
  } catch (error) {
    console.error("Erreur lors de la génération du lien calendrier:", error)
  }

  summary += `\n📱 Organisé avec Five Planner - https://fiveplanner.fr`

  return summary
}

export async function shareSession(session: Session, players: Player[]): Promise<boolean> {
  const summary = generateSessionSummary(session, players)
  const title = `Session Football 5v5 - ${new Date(session.date).toLocaleDateString("fr-FR")}`

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: summary,
      })
      return true
    } catch (error) {
      console.error("Erreur lors du partage:", error)
      return false
    }
  } else {
    // Fallback: copier dans le presse-papiers
    try {
      await navigator.clipboard.writeText(summary)
      return true
    } catch (error) {
      console.error("Erreur lors de la copie:", error)
      return false
    }
  }
}
