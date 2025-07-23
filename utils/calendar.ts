import type { Session, Player } from "@/types"

export function generateCalendarEvent(session: Session, players: Player[]): string {
  const formatDate = (dateString: string, timeString: string) => {
    try {
      // Créer la date en combinant la date et l'heure
      const dateTime = new Date(`${dateString}T${timeString}:00`)

      // Vérifier si la date est valide
      if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid date")
      }

      // Retourner au format ISO pour Google Calendar
      return dateTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error)
      // Fallback: utiliser la date actuelle + 1 heure
      const fallbackDate = new Date()
      fallbackDate.setHours(fallbackDate.getHours() + 1)
      return fallbackDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || "Joueur inconnu"
  }

  const confirmedPlayers = session.responses.filter((r) => r.status === "coming")
  const optionalPlayers = session.responses.filter((r) => r.status === "optional")

  // Calculer l'heure de fin (ajouter 1h30 par défaut)
  const calculateEndTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number)

      // Vérifier que les heures et minutes sont valides
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Invalid time format")
      }

      let endHours = hours + 1
      let endMinutes = minutes + 30

      // Gérer le dépassement des minutes
      if (endMinutes >= 60) {
        endMinutes -= 60
        endHours += 1
      }

      // Gérer le dépassement des heures (minuit)
      if (endHours >= 24) {
        endHours -= 24
      }

      return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`
    } catch (error) {
      console.error("Erreur lors du calcul de l'heure de fin:", error)
      // Fallback: ajouter simplement 2 heures
      const [hours] = timeString.split(":").map(Number)
      const endHours = (hours + 2) % 24
      return `${String(endHours).padStart(2, "0")}:00`
    }
  }

  const endTime = calculateEndTime(session.time)
  const startDateTime = formatDate(session.date, session.time)
  const endDateTime = formatDate(session.date, endTime)

  let description = `Session de football 5v5\\n\\n`
  description += `📍 Lieu: ${session.location}\\n`
  description += `🏟️ Type: ${session.sessionType === "indoor" ? "Intérieur" : "Extérieur"}\\n`
  description += `👥 Places: ${confirmedPlayers.length}/${session.maxPlayers}\\n\\n`

  if (confirmedPlayers.length > 0) {
    description += `✅ JOUEURS CONFIRMÉS (${confirmedPlayers.length}):\\n`
    confirmedPlayers.forEach((response) => {
      description += `• ${getPlayerName(response.playerId)}\\n`
    })
    description += `\\n`
  }

  if (optionalPlayers.length > 0) {
    description += `❓ JOUEURS OPTIONNELS (${optionalPlayers.length}):\\n`
    optionalPlayers.forEach((response) => {
      description += `• ${getPlayerName(response.playerId)}\\n`
    })
    description += `\\n`
  }

  if (session.paymentLink) {
    description += `💳 Paiement: ${session.paymentLink}\\n\\n`
  }

  description += `📱 Organisé avec Five Planner`

  // Créer le titre avec une date formatée de manière sûre
  const getFormattedDateForTitle = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Date à définir"
      }
      return date.toLocaleDateString("fr-FR")
    } catch (error) {
      return "Date à définir"
    }
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Football 5v5 - ${getFormattedDateForTitle(session.date)}`,
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: session.location,
    trp: "false",
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function addToCalendar(session: Session, players: Player[]): void {
  try {
    const calendarUrl = generateCalendarEvent(session, players)
    window.open(calendarUrl, "_blank")
  } catch (error) {
    console.error("Erreur lors de l'ajout au calendrier:", error)
    alert("Erreur lors de l'ajout au calendrier. Veuillez vérifier les informations de la session.")
  }
}
