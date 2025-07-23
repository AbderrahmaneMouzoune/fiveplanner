"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem("five-planner-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const updateResolvedTheme = () => {
      let newResolvedTheme: "light" | "dark"

      if (theme === "system") {
        newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        newResolvedTheme = theme
      }

      setResolvedTheme(newResolvedTheme)

      // Appliquer le thème au document
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(newResolvedTheme)
    }

    updateResolvedTheme()

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        updateResolvedTheme()
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const setThemeAndSave = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("five-planner-theme", newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeAndSave,
  }
}
