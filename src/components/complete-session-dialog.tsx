'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IconCheck, IconTrophy } from '@tabler/icons-react'

interface CompleteSessionDialogProps {
  onCompleteSession: (score?: { team1: number; team2: number }) => void
  children: React.ReactNode
}

export function CompleteSessionDialog({
  onCompleteSession,
  children,
}: CompleteSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [team1Score, setTeam1Score] = useState<string>('')
  const [team2Score, setTeam2Score] = useState<string>('')
  const [skipScore, setSkipScore] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (skipScore) {
      onCompleteSession()
    } else {
      const score1 = Number.parseInt(team1Score)
      const score2 = Number.parseInt(team2Score)

      if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
        alert('Veuillez saisir des scores valides (nombres positifs)')
        return
      }

      onCompleteSession({ team1: score1, team2: score2 })
    }

    // Reset form
    setTeam1Score('')
    setTeam2Score('')
    setSkipScore(false)
    setOpen(false)
  }

  const handleSkipScore = () => {
    setSkipScore(true)
    onCompleteSession()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <IconTrophy className="text-warning h-4 w-4 sm:h-5 sm:w-5" />
            Terminer la session
          </DialogTitle>
          <DialogDescription className="text-sm">
            Saisissez le score final du match pour terminer la session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <h3 className="mb-4 text-base font-medium sm:text-lg">
                Score final
              </h3>

              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <div className="flex-1 text-center">
                  <Label
                    htmlFor="team1"
                    className="text-xs font-medium sm:text-sm"
                  >
                    Équipe 1
                  </Label>
                  <Input
                    id="team1"
                    type="number"
                    min="0"
                    max="99"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    className="mt-2 h-12 w-full text-center text-xl font-bold sm:h-14 sm:text-2xl"
                    placeholder="0"
                    disabled={skipScore}
                  />
                </div>

                <div className="text-muted-foreground mt-6 px-2 text-xl font-bold sm:text-2xl">
                  -
                </div>

                <div className="flex-1 text-center">
                  <Label
                    htmlFor="team2"
                    className="text-xs font-medium sm:text-sm"
                  >
                    Équipe 2
                  </Label>
                  <Input
                    id="team2"
                    type="number"
                    min="0"
                    max="99"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    className="mt-2 h-12 w-full text-center text-xl font-bold sm:h-14 sm:text-2xl"
                    placeholder="0"
                    disabled={skipScore}
                  />
                </div>
              </div>
            </div>

            {!skipScore && team1Score && team2Score && (
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-muted-foreground mb-1 text-xs sm:text-sm">
                  Résultat
                </div>
                <div className="text-sm font-bold sm:text-lg">
                  {Number.parseInt(team1Score) > Number.parseInt(team2Score)
                    ? 'Victoire Équipe 1'
                    : Number.parseInt(team2Score) > Number.parseInt(team1Score)
                      ? 'Victoire Équipe 2'
                      : 'Match nul'}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
            <Button
              type="submit"
              variant="success"
              disabled={!skipScore && (!team1Score || !team2Score)}
              className="order-2 w-full sm:order-1 sm:w-auto"
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Terminer la session
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSkipScore}
              className="order-1 w-full bg-transparent sm:order-2 sm:w-auto"
            >
              Terminer sans score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
