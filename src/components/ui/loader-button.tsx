import type { ButtonProps } from '@components/ui/button'
import { Button } from '@components/ui/button'
import { cn } from '@lib/utils'
import { IconLoader2 } from '@tabler/icons-react'
import React from 'react'

type LoaderButtonProps = ButtonProps & {
  isLoading: boolean
}

export const LoaderButton = React.forwardRef<
  HTMLButtonElement,
  LoaderButtonProps
>(({ children, isLoading, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      disabled={isLoading}
      type="submit"
      {...props}
      className={cn('flex justify-center gap-2 px-3', className)}
    >
      {isLoading && <IconLoader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  )
})

LoaderButton.displayName = 'LoaderButton'
