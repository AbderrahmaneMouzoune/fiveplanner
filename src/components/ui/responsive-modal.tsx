'use client'

import type React from 'react'
import { createContext, useContext } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/ui/drawer'
import { useIsMobile } from '@hooks/use-is-mobile'
import { cn } from '@lib/utils'

interface ResponsiveModalContextType {
  isMobile: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ResponsiveModalContext = createContext<
  ResponsiveModalContextType | undefined
>(undefined)

function useResponsiveModal() {
  const context = useContext(ResponsiveModalContext)
  if (!context) {
    throw new Error(
      'ResponsiveModal components must be used within ResponsiveModal',
    )
  }
  return context
}

interface ResponsiveModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResponsiveModal({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()

  const contextValue = {
    isMobile,
    open,
    onOpenChange,
  }

  return (
    <ResponsiveModalContext.Provider value={contextValue}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      )}
    </ResponsiveModalContext.Provider>
  )
}

export function ResponsiveModalTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
  }

  return <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
}

export function ResponsiveModalContent({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ComponentProps<typeof DialogContent>) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return (
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    )
  }

  return (
    <DialogContent className={cn('sm:max-w-[425px]', className)} {...props}>
      {children}
    </DialogContent>
  )
}

export function ResponsiveModalHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return (
      <DrawerHeader className={`text-left ${className || ''}`}>
        {children}
      </DrawerHeader>
    )
  }

  return <DialogHeader className={className}>{children}</DialogHeader>
}

export function ResponsiveModalTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>
  }

  return <DialogTitle className={className}>{children}</DialogTitle>
}

export function ResponsiveModalDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return (
      <DrawerDescription className={className}>{children}</DrawerDescription>
    )
  }

  return <DialogDescription className={className}>{children}</DialogDescription>
}

export function ResponsiveModalFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveModal()

  if (isMobile) {
    return (
      <DrawerFooter className={`pt-2 ${className || ''}`}>
        {children}
      </DrawerFooter>
    )
  }

  return <DialogFooter className={className}>{children}</DialogFooter>
}
