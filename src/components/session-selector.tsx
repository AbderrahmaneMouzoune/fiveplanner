import { Session } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IconCalendar } from '@tabler/icons-react'

interface Props {
  sessions: Session[]
  selectedSessionId: string | null
  onSessionChange: (sessionId: string | null) => void
}

export function SessionSelector({
  sessions,
  selectedSessionId,
  onSessionChange,
}: Props) {
  if (sessions.length <= 1) return null

  const formatSessionLabel = (session: Session) => {
    const date = new Date(session.date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    return `${date} — ${session.time}`
  }

  const handleSessionSelect = (value: string) => {
    if (value === 'all') {
      onSessionChange(null)
    } else {
      onSessionChange(value)
    }
  }

  const getDisplayValue = () => {
    if (!selectedSessionId) return 'Toutes les sessions'
    const session = sessions.find((s) => s.id === selectedSessionId)
    return session ? formatSessionLabel(session) : 'Toutes les sessions'
  }

  return (
    <Select
      onValueChange={handleSessionSelect}
      value={selectedSessionId || 'all'}
    >
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Sélectionner une session">
          {getDisplayValue()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="font-medium">
          Toutes les sessions
        </SelectItem>
        <SelectItem value="separator" disabled className="h-4" />
        {sessions.map((session) => (
          <SelectItem
            key={session.id}
            value={session.id}
            className="flex items-center gap-2"
          >
            <IconCalendar className="h-3 w-3" />
            <span>{formatSessionLabel(session)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
