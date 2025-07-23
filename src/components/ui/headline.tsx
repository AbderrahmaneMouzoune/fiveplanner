import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@lib/utils'

const headlineVariants = cva('font-title scroll-m-20 text-xl font-semibold', {
  variants: {
    variant: {
      h1: 'text-3xl font-semibold sm:text-4xl md:text-5xl',
      h2: 'text-3xl font-semibold',
      h3: 'text-lg md:text-2xl font-medium',
      h4: 'text-lg md:text-xl font-medium',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
      p: 'text-base font-medium',
    },
  },
  defaultVariants: {
    variant: 'h2',
  },
})

export type HeadlineProps = React.ComponentProps<'h2'> &
  VariantProps<typeof headlineVariants> & {
    as?: React.ElementType
    asChild?: boolean
  }

function Headline({
  className,
  variant,
  as = 'h2',
  asChild = false,
  ...props
}: HeadlineProps) {
  const Comp = (asChild ? Slot : as) ?? 'h2'

  return (
    <Comp
      data-slot="headline"
      className={cn(headlineVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Headline, headlineVariants }
