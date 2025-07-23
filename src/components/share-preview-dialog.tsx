'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { generateSessionSummary } from '@/utils/share'
import type { Session, Player } from '@/types'
import { IconShare, IconCopy, IconCheck } from '@tabler/icons-react'

interface SharePreviewDialogProps {
  session: Session
  players: Player[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmShare: () => void
}

export function SharePreviewDialog({
  session,
  players,
  open,
  onOpenChange,
  onConfirmShare,
}: SharePreviewDialogProps) {
  const [copied, setCopied] = useState(false)
  const summary = generateSessionSummary(session, players)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  const handleShare = () => {
    onConfirmShare()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShare className="h-5 w-5" />
            Prévisualisation du partage
          </DialogTitle>
          <DialogDescription>
            Voici le message qui sera partagé. Vous pouvez le copier ou le
            partager directement.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Textarea
            value={summary}
            readOnly
            className="bg-muted/50 min-h-[300px] resize-none font-mono text-sm"
            placeholder="Génération du résumé..."
          />
          <p className="text-muted-foreground mt-2 text-xs italic">
            Note : La signature &quot;📱 Organisé avec Five Planner&quot; sera
            automatiquement ajoutée
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full bg-transparent sm:w-auto"
          >
            {copied ? (
              <>
                <IconCheck className="mr-2 h-4 w-4" />
                Copié !
              </>
            ) : (
              <>
                <IconCopy className="mr-2 h-4 w-4" />
                Copier le texte
              </>
            )}
          </Button>
          <Button
            variant="accent"
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            <IconShare className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
