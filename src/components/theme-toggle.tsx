'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? (
        <IconSun className="h-4 w-4" />
      ) : (
        <IconMoon className="h-4 w-4" />
      )}
      <span className="sr-only">Changer le thème</span>
    </Button>
  )
}
