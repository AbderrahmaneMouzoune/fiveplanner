"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function useAnalytics() {
  useEffect(() => {
    // Vérifier si PostHog est déjà initialisé
    if (typeof window !== "undefined" && !posthog.__loaded) {
      // Vérifier le consentement des cookies
      const cookieConsent = localStorage.getItem("five-planner-cookie-consent")

      if (cookieConsent === "accepted") {
        initializePostHog()
      }
    }
  }, [])

  const initializePostHog = () => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.debug()
          }
        },
      })
    }
  }

  const enableAnalytics = () => {
    initializePostHog()
  }

  const disableAnalytics = () => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.opt_out_capturing()
    }
  }

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture(eventName, properties)
    }
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.identify(userId, properties)
    }
  }

  return {
    enableAnalytics,
    disableAnalytics,
    trackEvent,
    identifyUser,
  }
}
