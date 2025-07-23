import type { Session, Player } from '@/types'

export function generateCalendarEvent(
  session: Session,
  players: Player[],
): string {
  const formatDate = (dateString: string, timeString: string) => {
    try {
      const dateTime = new Date(`${dateString}T${timeString}:00`)
      if (isNaN(dateTime.getTime())) throw new Error('Invalid date')
      return dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error)
      const fallbackDate = new Date()
      fallbackDate.setHours(fallbackDate.getHours() + 1)
      return fallbackDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    return player?.name || 'Joueur inconnu'
  }

  const confirmedPlayers = session.responses.filter(
    (r) => r.status === 'coming',
  )
  const optionalPlayers = session.responses.filter(
    (r) => r.status === 'optional',
  )

  const calculateEndTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number)
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        throw new Error('Invalid time format')
      }
      let endHours = hours + 1
      let endMinutes = minutes + 30
      if (endMinutes >= 60) {
        endMinutes -= 60
        endHours += 1
      }
      if (endHours >= 24) endHours -= 24
      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
    } catch (error) {
      console.error("Erreur lors du calcul de l'heure de fin:", error)
      const [hours] = timeString.split(':').map(Number)
      const endHours = (hours + 2) % 24
      return `${String(endHours).padStart(2, '0')}:00`
    }
  }

  const endTime = calculateEndTime(session.time)
  const startDateTime = formatDate(session.date, session.time)
  const endDateTime = formatDate(session.date, endTime)

  // Description plus concise
  let description = `⚽ ${session.sessionType === 'indoor' ? 'Indoor' : 'Outdoor'}\\n`
  description += `👥 ${confirmedPlayers.length}/${session.maxPlayers}\\n`

  // Lister seulement les joueurs confirmés, de manière plus compacte
  if (confirmedPlayers.length > 0) {
    const names = confirmedPlayers
      .map((r) => getPlayerName(r.playerId))
      .join(', ')
    description += `✅ ${names}\\n`
  }

  // Optionnels en format compact aussi
  if (optionalPlayers.length > 0) {
    const optionalNames = optionalPlayers
      .map((r) => getPlayerName(r.playerId))
      .join(', ')
    description += `❓ ${optionalNames}\\n`
  }

  // Paiement seulement si présent
  if (session.paymentLink) {
    description += `💳 ${session.paymentLink}`
  }

  // Titre plus court
  const getShortDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      })
    } catch (error) {
      return ''
    }
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Foot ${getShortDate(session.date)}`, // Titre beaucoup plus court
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: session.location,
    // Supprimer trp: 'false' car c'est la valeur par défaut
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Version alternative avec URL encore plus courte
export function generateCalendarEventMinimal(
  session: Session,
  players: Player[],
): string {
  const formatDate = (dateString: string, timeString: string) => {
    try {
      const dateTime = new Date(`${dateString}T${timeString}:00`)
      if (isNaN(dateTime.getTime())) throw new Error('Invalid date')
      return dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    } catch (error) {
      const fallbackDate = new Date()
      fallbackDate.setHours(fallbackDate.getHours() + 1)
      return fallbackDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
  }

  const confirmedCount = session.responses.filter(
    (r) => r.status === 'coming',
  ).length
  const endTime = session.time.split(':').map(Number)
  endTime[1] += 90 // Ajouter 90 minutes
  if (endTime[1] >= 60) {
    endTime[1] -= 60
    endTime[0] += 1
  }
  if (endTime[0] >= 24) endTime[0] -= 24

  const endTimeStr = `${String(endTime[0]).padStart(2, '0')}:${String(endTime[1]).padStart(2, '0')}`
  const startDateTime = formatDate(session.date, session.time)
  const endDateTime = formatDate(session.date, endTimeStr)

  // Description ultra-minimaliste
  const description = `⚽ ${confirmedCount}/${session.maxPlayers}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Football',
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: session.location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function addToCalendar(session: Session, players: Player[]): void {
  try {
    const calendarUrl = generateCalendarEvent(session, players)
    window.open(calendarUrl, '_blank')
  } catch (error) {
    console.error("Erreur lors de l'ajout au calendrier:", error)
    alert(
      "Erreur lors de l'ajout au calendrier. Veuillez vérifier les informations de la session.",
    )
  }
}
