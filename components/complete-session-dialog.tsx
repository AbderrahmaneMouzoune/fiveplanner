"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconCheck, IconTrophy } from "@tabler/icons-react"

interface CompleteSessionDialogProps {
  onCompleteSession: (score?: { team1: number; team2: number }) => void
  children: React.ReactNode
}

export function CompleteSessionDialog({ onCompleteSession, children }: CompleteSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [team1Score, setTeam1Score] = useState<string>("")
  const [team2Score, setTeam2Score] = useState<string>("")
  const [skipScore, setSkipScore] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (skipScore) {
      onCompleteSession()
    } else {
      const score1 = Number.parseInt(team1Score)
      const score2 = Number.parseInt(team2Score)

      if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
        alert("Veuillez saisir des scores valides (nombres positifs)")
        return
      }

      onCompleteSession({ team1: score1, team2: score2 })
    }

    // Reset form
    setTeam1Score("")
    setTeam2Score("")
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
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] w-full sm:w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <IconTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            Terminer la session
          </DialogTitle>
          <DialogDescription className="text-sm">
            Saisissez le score final du match pour terminer la session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <h3 className="font-medium text-base sm:text-lg mb-4">Score final</h3>

              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <div className="text-center flex-1">
                  <Label htmlFor="team1" className="text-xs sm:text-sm font-medium">
                    Équipe 1
                  </Label>
                  <Input
                    id="team1"
                    type="number"
                    min="0"
                    max="99"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    className="w-full text-center text-xl sm:text-2xl font-bold mt-2 h-12 sm:h-14"
                    placeholder="0"
                    disabled={skipScore}
                  />
                </div>

                <div className="text-xl sm:text-2xl font-bold text-muted-foreground mt-6 px-2">-</div>

                <div className="text-center flex-1">
                  <Label htmlFor="team2" className="text-xs sm:text-sm font-medium">
                    Équipe 2
                  </Label>
                  <Input
                    id="team2"
                    type="number"
                    min="0"
                    max="99"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    className="w-full text-center text-xl sm:text-2xl font-bold mt-2 h-12 sm:h-14"
                    placeholder="0"
                    disabled={skipScore}
                  />
                </div>
              </div>
            </div>

            {!skipScore && team1Score && team2Score && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Résultat</div>
                <div className="font-bold text-sm sm:text-lg">
                  {Number.parseInt(team1Score) > Number.parseInt(team2Score)
                    ? "Victoire Équipe 1"
                    : Number.parseInt(team2Score) > Number.parseInt(team1Score)
                      ? "Victoire Équipe 2"
                      : "Match nul"}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
            <Button
              type="submit"
              variant="success"
              disabled={!skipScore && (!team1Score || !team2Score)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <IconCheck className="w-4 h-4 mr-2" />
              Terminer la session
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSkipScore}
              className="w-full sm:w-auto bg-transparent order-1 sm:order-2"
            >
              Terminer sans score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
