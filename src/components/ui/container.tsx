import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@lib/utils'

const containerVariants = cva('', {
  variants: {
    variant: {
      default: 'container',
      xs: 'container max-w-sm',
      sm: 'container max-w-md',
      md: 'container max-w-lg',
      lg: 'container max-w-xl',
      xl: 'container max-w-2xl',
      '2xl': 'container max-w-4xl',
      '6xl': 'container max-w-6xl',
      '7xl': 'container max-w-7xl',
      fluid: 'w-full',
    },
  },
  defaultVariants: {
    variant: '7xl',
  },
})

export interface ContainerProps
  extends React.ComponentProps<'section'>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
  asChild?: boolean
}

const Container = ({
  className,
  variant,
  as = 'section',
  asChild = false,
  ...props
}: ContainerProps) => {
  const Comp = asChild ? Slot : as

  return (
    <Comp
      data-slot="container"
      className={cn(containerVariants({ variant, className }))}
      {...props}
    />
  )
}
export { Container, containerVariants }
