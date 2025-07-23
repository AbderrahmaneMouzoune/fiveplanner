'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getUniqueAvatarColor } from '@/utils/avatar-colors'

interface PlayerAvatarProps {
  name: string
  status: 'coming' | 'optional' | 'not-coming' | 'pending'
  size?: 'sm' | 'md' | 'lg'
  existingPlayers?: string[]
}

export function PlayerAvatar({
  name,
  status,
  size = 'md',
  existingPlayers = [],
}: PlayerAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const avatarColor = getUniqueAvatarColor(name, existingPlayers)

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'coming':
        return 'bg-success'
      case 'optional':
        return 'bg-warning-foreground'
      case 'not-coming':
        return 'bg-destructive'
      case 'pending':
        return 'bg-muted-foreground'
      default:
        return 'bg-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'coming':
        return 'Confirmé'
      case 'optional':
        return 'Optionnel'
      case 'not-coming':
        return 'Absent'
      case 'pending':
        return 'En attente'
      default:
        return 'En attente'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Avatar className={sizeClasses[size]}>
              <AvatarFallback
                className={`${avatarColor} font-medium text-white`}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute -bottom-0.5 -start-0.5 size-3 rounded-full border-2 border-background ${getStatusColor(status)}`}
            >
              <span className="sr-only">{getStatusLabel(status)}</span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {name} - {getStatusLabel(status)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
