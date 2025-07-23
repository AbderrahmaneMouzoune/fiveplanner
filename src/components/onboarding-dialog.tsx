'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  IconBallFootball,
  IconUsers,
  IconCalendarPlus,
  IconChartBar,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
} from '@tabler/icons-react'

interface OnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const onboardingSteps = [
  {
    title: 'Bienvenue sur Five Planner ! ⚽',
    description:
      "L'application qui simplifie l'organisation de vos sessions de football 5v5",
    icon: IconBallFootball,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <IconBallFootball className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Five Planner vous aide à organiser vos matchs, gérer vos joueurs et
            suivre vos statistiques en toute simplicité.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Créez vos sessions',
    description: 'Planifiez facilement vos matchs avec tous les détails',
    icon: IconCalendarPlus,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <IconCalendarPlus className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                1
              </span>
            </div>
            <div>
              <h4 className="font-medium">Nouvelle session</h4>
              <p className="text-sm text-muted-foreground">
                Cliquez sur "Nouvelle session" pour créer un match
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                2
              </span>
            </div>
            <div>
              <h4 className="font-medium">Détails du match</h4>
              <p className="text-sm text-muted-foreground">
                Renseignez la date, l'heure, le lieu et le type de session
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                3
              </span>
            </div>
            <div>
              <h4 className="font-medium">Import depuis email</h4>
              <p className="text-sm text-muted-foreground">
                Ou collez votre email de réservation pour créer automatiquement
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Gérez vos joueurs',
    description: 'Organisez votre équipe et suivez les réponses',
    icon: IconUsers,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <IconUsers className="h-8 w-8 text-success" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-success">
              <span className="text-xs font-bold text-success-foreground">
                1
              </span>
            </div>
            <div>
              <h4 className="font-medium">Ajouter des joueurs</h4>
              <p className="text-sm text-muted-foreground">
                Créez votre base de données de joueurs avec leurs contacts
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-success">
              <span className="text-xs font-bold text-success-foreground">
                2
              </span>
            </div>
            <div>
              <h4 className="font-medium">Organiser en groupes</h4>
              <p className="text-sm text-muted-foreground">
                Créez des groupes (Réguliers, Occasionnels, etc.)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-success">
              <span className="text-xs font-bold text-success-foreground">
                3
              </span>
            </div>
            <div>
              <h4 className="font-medium">Suivre les réponses</h4>
              <p className="text-sm text-muted-foreground">
                Confirmé, Optionnel, Absent ou En attente
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Partagez et analysez',
    description: 'Partagez vos sessions et consultez vos statistiques',
    icon: IconChartBar,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/10">
            <IconChartBar className="h-8 w-8 text-chart-2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-chart-2">
              <span className="text-chart-2-foreground text-xs font-bold">
                1
              </span>
            </div>
            <div>
              <h4 className="font-medium">Partage intelligent</h4>
              <p className="text-sm text-muted-foreground">
                Partagez les détails avec lien agenda automatique
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-chart-2">
              <span className="text-chart-2-foreground text-xs font-bold">
                2
              </span>
            </div>
            <div>
              <h4 className="font-medium">Historique complet</h4>
              <p className="text-sm text-muted-foreground">
                Consultez toutes vos sessions passées
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-chart-2">
              <span className="text-chart-2-foreground text-xs font-bold">
                3
              </span>
            </div>
            <div>
              <h4 className="font-medium">Statistiques détaillées</h4>
              <p className="text-sm text-muted-foreground">
                Taux de participation, performances des joueurs
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function OnboardingDialog({
  open,
  onOpenChange,
}: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    // Marquer l'onboarding comme terminé
    localStorage.setItem('five-planner-onboarding-completed', 'true')
    onOpenChange(false)
  }

  const handleSkip = () => {
    localStorage.setItem('five-planner-onboarding-completed', 'true')
    onOpenChange(false)
  }

  const currentStepData = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {currentStepData.title}
            </DialogTitle>
            <div className="flex items-center gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary'
                      : index < currentStep
                        ? 'bg-primary/60'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">{currentStepData.content}</div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Passer
            </Button>
            {isLastStep ? (
              <Button variant="accent" onClick={handleFinish}>
                <IconCheck className="mr-2 h-4 w-4" />
                Commencer !
              </Button>
            ) : (
              <Button variant="accent" onClick={handleNext}>
                Suivant
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
