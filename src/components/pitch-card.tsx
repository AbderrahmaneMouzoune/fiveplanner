'use client'

import type { Pitch } from '@/types'
import { Badge } from '@/components/ui/badge'
import { getSurfaceTypeLabel, getSurfaceTypeColor } from '@/data/pitches'
import {
  IconMapPin,
  IconCurrencyEuro,
  IconVideo,
  IconVideoOff,
} from '@tabler/icons-react'

interface PitchCardProps {
  pitch: Pitch
  compact?: boolean
}

export function PitchCard({ pitch, compact = false }: PitchCardProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium">{pitch.name}</h4>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <IconMapPin className="h-3 w-3" />
              <span>{pitch.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              className={`text-xs ${getSurfaceTypeColor(pitch.surfaceType)}`}
            >
              {getSurfaceTypeLabel(pitch.surfaceType)}
            </Badge>
            {pitch.isFilmed ? (
              <IconVideo
                className="text-destructive h-3 w-3"
                title="Terrain filmé"
              />
            ) : (
              <IconVideoOff
                className="text-muted-foreground h-3 w-3"
                title="Non filmé"
              />
            )}
          </div>
        </div>
        {pitch.description && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {pitch.description}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{pitch.name}</h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
            <IconMapPin className="h-4 w-4" />
            <span>{pitch.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getSurfaceTypeColor(pitch.surfaceType)}>
            {getSurfaceTypeLabel(pitch.surfaceType)}
          </Badge>
          {pitch.priceRange && (
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <IconCurrencyEuro className="h-4 w-4" />
              <span>{pitch.priceRange}</span>
            </div>
          )}
          {pitch.isFilmed ? (
            <div className="text-destructive flex items-center gap-1 text-sm">
              <IconVideo className="h-4 w-4" />
              <span>Filmé</span>
            </div>
          ) : (
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <IconVideoOff className="h-4 w-4" />
              <span>Non filmé</span>
            </div>
          )}
        </div>
      </div>

      {pitch.description && (
        <p className="text-muted-foreground text-sm">{pitch.description}</p>
      )}
    </div>
  )
}
