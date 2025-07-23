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

  const calculateEndTime = (
    timeString: string,
    durationMinutes: number,
  ): string => {
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

      // Calculer l'heure de fin en ajoutant la durée
      let totalMinutes = hours * 60 + minutes + durationMinutes
      const endHours = Math.floor(totalMinutes / 60) % 24
      const endMinutes = totalMinutes % 60

      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
    } catch (error) {
      console.error("Erreur lors du calcul de l'heure de fin:", error)
      // Fallback: ajouter la durée ou 2h par défaut
      const [hours] = timeString.split(':').map(Number)
      const fallbackDuration = durationMinutes || 120
      const endHours = (hours + Math.floor(fallbackDuration / 60)) % 24
      return `${String(endHours).padStart(2, '0')}:00`
    }
  }

  const endTime = calculateEndTime(session.time, session.duration)
  const startDateTime = formatDate(session.date, session.time)
  const endDateTime = formatDate(session.date, endTime)

  // Description simple et robuste sans caractères spéciaux
  const confirmedCount = confirmedPlayers.length
  const optionalCount = optionalPlayers.length

  let description = `${session.sessionType === 'indoor' ? 'Indoor' : 'Outdoor'} - ${confirmedCount}/${session.maxPlayers} joueurs`

  // Ajouter les noms de façon simple
  if (confirmedCount > 0) {
    const names = confirmedPlayers
      .map((r) => getPlayerName(r.playerId))
      .slice(0, 5) // Limiter à 5 noms pour éviter une description trop longue
      .join(', ')
    description += `. Confirmés: ${names}`
    if (confirmedCount > 5) {
      description += ` et ${confirmedCount - 5} autres`
    }
  }

  if (optionalCount > 0) {
    description += `. Optionnels: ${optionalCount}`
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
    text: `Foot ${getShortDate(session.date)}`,
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: session.location,
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

  // Utiliser session.duration au lieu d'une durée fixe
  const [hours, minutes] = session.time.split(':').map(Number)
  let totalMinutes = hours * 60 + minutes + session.duration
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60

  const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
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
