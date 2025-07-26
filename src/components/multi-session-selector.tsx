import { Session } from '@/types'
import { Badge } from '@/components/ui/badge'

interface Props {
  sessions: Session[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MultiSessionSelector({
  sessions,
  selectedId,
  onSelect,
}: Props) {
  if (sessions.length <= 1) return null

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      {sessions.map((s) => (
        <Badge
          key={s.id}
          variant={s.id === selectedId ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => onSelect(s.id)}
        >
          📅 {new Date(s.createdAt).toLocaleDateString()} — {s.status}
        </Badge>
      ))}
    </div>
  )
}
