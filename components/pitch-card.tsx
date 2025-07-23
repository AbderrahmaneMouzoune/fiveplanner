"use client"

import type { Pitch } from "@/types"
import { Badge } from "@/components/ui/badge"
import { getSurfaceTypeLabel, getSurfaceTypeColor } from "@/data/pitches"
import { IconMapPin, IconCurrencyEuro, IconVideo, IconVideoOff } from "@tabler/icons-react"

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
            <h4 className="font-medium text-sm">{pitch.name}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconMapPin className="w-3 h-3" />
              <span>{pitch.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`text-xs ${getSurfaceTypeColor(pitch.surfaceType)}`}>
              {getSurfaceTypeLabel(pitch.surfaceType)}
            </Badge>
            {pitch.isFilmed ? (
              <IconVideo className="w-3 h-3 text-destructive" title="Terrain filmé" />
            ) : (
              <IconVideoOff className="w-3 h-3 text-muted-foreground" title="Non filmé" />
            )}
          </div>
        </div>
        {pitch.description && <p className="text-xs text-muted-foreground line-clamp-2">{pitch.description}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{pitch.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <IconMapPin className="w-4 h-4" />
            <span>{pitch.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getSurfaceTypeColor(pitch.surfaceType)}>{getSurfaceTypeLabel(pitch.surfaceType)}</Badge>
          {pitch.priceRange && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <IconCurrencyEuro className="w-4 h-4" />
              <span>{pitch.priceRange}</span>
            </div>
          )}
          {pitch.isFilmed ? (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <IconVideo className="w-4 h-4" />
              <span>Filmé</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <IconVideoOff className="w-4 h-4" />
              <span>Non filmé</span>
            </div>
          )}
        </div>
      </div>

      {pitch.description && <p className="text-sm text-muted-foreground">{pitch.description}</p>}
    </div>
  )
}
