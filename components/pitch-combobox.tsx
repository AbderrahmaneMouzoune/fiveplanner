"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getSurfaceTypeLabel, getSurfaceTypeColor } from "@/data/pitches"
import type { Pitch } from "@/types"
import { IconCheck, IconChevronDown, IconVideo, IconVideoOff } from "@tabler/icons-react"

interface PitchComboboxProps {
  pitches: Pitch[]
  value?: string
  onValueChange: (pitchId: string) => void
  placeholder?: string
}

export function PitchCombobox({
  pitches,
  value,
  onValueChange,
  placeholder = "Sélectionnez un terrain...",
}: PitchComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedPitch = pitches.find((pitch) => pitch.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedPitch ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedPitch.name}</span>
              <Badge className={`text-xs ${getSurfaceTypeColor(selectedPitch.surfaceType)}`}>
                {getSurfaceTypeLabel(selectedPitch.surfaceType)}
              </Badge>
              {selectedPitch.isFilmed ? (
                <IconVideo className="w-3 h-3 text-red-500" />
              ) : (
                <IconVideoOff className="w-3 h-3 text-gray-400" />
              )}
            </div>
          ) : (
            placeholder
          )}
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un terrain..." />
          <CommandList>
            <CommandEmpty>Aucun terrain trouvé.</CommandEmpty>
            <CommandGroup>
              {pitches.map((pitch) => (
                <CommandItem
                  key={pitch.id}
                  value={`${pitch.name} ${pitch.address} ${getSurfaceTypeLabel(pitch.surfaceType)}`}
                  onSelect={() => {
                    onValueChange(pitch.id)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{pitch.name}</div>
                      <div className="text-sm text-gray-500 truncate">{pitch.address}</div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge className={`text-xs ${getSurfaceTypeColor(pitch.surfaceType)}`}>
                        {getSurfaceTypeLabel(pitch.surfaceType)}
                      </Badge>
                      {pitch.isFilmed ? (
                        <IconVideo className="w-3 h-3 text-red-500" />
                      ) : (
                        <IconVideoOff className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <IconCheck className={`ml-2 h-4 w-4 ${value === pitch.id ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
