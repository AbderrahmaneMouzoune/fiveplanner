'use client'

import { useState } from 'react'
import { usePlayers } from '@/hooks/use-players'
import { useSession } from '@/hooks/use-session'
import { usePitches } from '@/hooks/use-pitches'
import { usePlayerGroups } from '@/hooks/use-player-groups'
import { usePlayerStats } from '@/hooks/use-player-stats'
import { useOnboarding } from '@/hooks/use-onboarding'
import { useAnalytics } from '@/hooks/use-analytics'
import { Navigation } from '@/components/navigation'
import { CurrentSessionView } from '@/components/views/current-session-view'
import { PlayersView } from '@/components/views/players-view'
import { HistoryView } from '@/components/views/history-view'
import { StatsView } from '@/components/views/stats-view'
import { OnboardingDialog } from '@/components/onboarding-dialog'
import { CookieBanner } from '@/components/cookie-banner'
import { FALLBACK_SEO } from '@/config/seo.config'
import { Metadata, Viewport } from 'next'
import { APP_CONFIG } from '@/config/app.config'

type View = 'current' | 'history' | 'stats' | 'players'

export const metadata: Metadata = {
  ...FALLBACK_SEO,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Five Planner',
  },
  keywords: [
    'FivePlanner, foot 5, football 5v5, organiser match, gestion joueurs, session football, réservation terrain, app foot, calendrier foot, application PWA foot, Five LeFive, foot entre amis',
  ],
  alternates: {
    canonical: APP_CONFIG.website,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#16a34a' },
  ],
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('current')
  const { players, addPlayer, removePlayer, onBulkAddPlayers, updatePlayer } =
    usePlayers()
  const { pitches, addPitch, updatePitch, removePitch } = usePitches()
  const { groups, addGroup, updateGroup, removeGroup } = usePlayerGroups()
  const {
    currentSession,
    sessionHistory,
    createSession,
    updatePlayerResponse,
    completeSession,
    cancelSession,
    clearSession,
    deleteHistorySession,
  } = useSession()
  const playerStats = usePlayerStats(players, sessionHistory)
  const { showOnboarding, setShowOnboarding } = useOnboarding()
  const { enableAnalytics, disableAnalytics, trackEvent } = useAnalytics()

  const handleCookieAccept = () => {
    enableAnalytics()
    trackEvent('cookie_consent_accepted')
  }

  const handleCookieDecline = () => {
    disableAnalytics()
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'current':
        return (
          <CurrentSessionView
            currentSession={currentSession}
            players={players}
            pitches={pitches}
            groups={groups}
            onCreateSession={createSession}
            onCompleteSession={completeSession}
            onCancelSession={cancelSession}
            onClearSession={clearSession}
            onUpdatePlayerResponse={updatePlayerResponse}
            onAddPlayer={addPlayer}
            onAddPitch={addPitch}
            onUpdatePitch={updatePitch}
            onRemovePitch={removePitch}
            onAddGroup={addGroup}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
          />
        )
      case 'players':
        return (
          <PlayersView
            players={players}
            groups={groups}
            session={currentSession}
            onUpdateResponse={updatePlayerResponse}
            onRemovePlayer={removePlayer}
            onUpdatePlayer={updatePlayer}
            onAddPlayer={addPlayer}
            onAddGroup={addGroup}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
            onBulkAddPlayers={onBulkAddPlayers}
          />
        )
      case 'history':
        return (
          <HistoryView
            sessions={sessionHistory}
            players={players}
            onDeleteSession={deleteHistorySession}
          />
        )
      case 'stats':
        return (
          <StatsView
            players={players}
            stats={playerStats}
            sessionHistory={sessionHistory}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20 transition-colors">
      <div className="app-core container mx-auto max-w-4xl px-4 py-8">
        {renderCurrentView()}
      </div>
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        sessionHistoryCount={sessionHistory.length}
      />

      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
      <CookieBanner
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </div>
  )
}
