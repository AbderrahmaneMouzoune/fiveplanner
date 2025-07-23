'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  IconHome,
  IconHistory,
  IconChartBar,
  IconUsers,
} from '@tabler/icons-react'

type View = 'current' | 'history' | 'stats' | 'players'

interface NavigationProps {
  currentView: View
  onViewChange: (view: View) => void
  sessionHistoryCount: number
}

export function Navigation({
  currentView,
  onViewChange,
  sessionHistoryCount,
}: NavigationProps) {
  const navItems = [
    {
      id: 'current' as const,
      label: 'Accueil',
      icon: IconHome,
      badge: null,
    },
    {
      id: 'players' as const,
      label: 'Joueurs',
      icon: IconUsers,
      badge: null,
    },
    {
      id: 'history' as const,
      label: 'Historique',
      icon: IconHistory,
      badge: sessionHistoryCount > 0 ? sessionHistoryCount : null,
    },
    {
      id: 'stats' as const,
      label: 'Stats',
      icon: IconChartBar,
      badge: null,
    },
  ]

  return (
    <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-50 border-t px-4 py-2 shadow-lg backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div className="flex flex-1 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`relative flex h-auto flex-col items-center gap-1 px-3 py-2 ${
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  {item.badge && (
                    <span className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {item.label}
                </span>
              </Button>
            )
          })}
        </div>

        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
