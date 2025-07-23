'use client'

import type React from 'react'
import { createContext, useContext } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@hooks/use-is-mobile'

interface ResponsiveSheetContextType {
  isMobile: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ResponsiveSheetContext = createContext<
  ResponsiveSheetContextType | undefined
>(undefined)

function useResponsiveSheet() {
  const context = useContext(ResponsiveSheetContext)
  if (!context) {
    throw new Error(
      'ResponsiveSheet components must be used within ResponsiveSheet',
    )
  }
  return context
}

interface ResponsiveSheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResponsiveSheet({
  children,
  open,
  onOpenChange,
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile()

  const contextValue = {
    isMobile,
    open,
    onOpenChange,
  }

  return (
    <ResponsiveSheetContext.Provider value={contextValue}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          {children}
        </Sheet>
      )}
    </ResponsiveSheetContext.Provider>
  )
}

export function ResponsiveSheetTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
  }

  return <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
}

export function ResponsiveSheetContent({
  children,
  side = 'right',
  className,
  ...props
}: {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
} & React.ComponentProps<typeof SheetContent>) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return (
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    )
  }

  return (
    <SheetContent side={side} className={className} {...props}>
      {children}
    </SheetContent>
  )
}

export function ResponsiveSheetHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return (
      <DrawerHeader className={`text-left ${className || ''}`}>
        {children}
      </DrawerHeader>
    )
  }

  return <SheetHeader className={className}>{children}</SheetHeader>
}

export function ResponsiveSheetTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>
  }

  return <SheetTitle className={className}>{children}</SheetTitle>
}

export function ResponsiveSheetDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return (
      <DrawerDescription className={className}>{children}</DrawerDescription>
    )
  }

  return <SheetDescription className={className}>{children}</SheetDescription>
}

export function ResponsiveSheetFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isMobile } = useResponsiveSheet()

  if (isMobile) {
    return (
      <DrawerFooter className={`pt-2 ${className || ''}`}>
        {children}
      </DrawerFooter>
    )
  }

  return <SheetFooter className={className}>{children}</SheetFooter>
}
