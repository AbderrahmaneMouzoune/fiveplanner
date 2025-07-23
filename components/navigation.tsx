"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconHome, IconHistory, IconChartBar, IconUsers } from "@tabler/icons-react"

type View = "current" | "history" | "stats" | "players"

interface NavigationProps {
  currentView: View
  onViewChange: (view: View) => void
  sessionHistoryCount: number
}

export function Navigation({ currentView, onViewChange, sessionHistoryCount }: NavigationProps) {
  const navItems = [
    {
      id: "current" as const,
      label: "Accueil",
      icon: IconHome,
      badge: null,
    },
    {
      id: "players" as const,
      label: "Joueurs",
      icon: IconUsers,
      badge: null,
    },
    {
      id: "history" as const,
      label: "Historique",
      icon: IconHistory,
      badge: sessionHistoryCount > 0 ? sessionHistoryCount : null,
    },
    {
      id: "stats" as const,
      label: "Stats",
      icon: IconChartBar,
      badge: null,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-4 py-2 z-50 shadow-lg">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex justify-around items-center flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                  isActive
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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
