"use client"

import { useState, useEffect } from "react"

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Vérifier si l'onboarding a déjà été complété
    const onboardingCompleted = localStorage.getItem("five-planner-onboarding-completed")

    if (!onboardingCompleted) {
      // Petit délai pour laisser l'app se charger
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("five-planner-onboarding-completed", "true")
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem("five-planner-onboarding-completed")
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    resetOnboarding,
  }
}
