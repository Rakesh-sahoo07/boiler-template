import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const bentoGridVariants = cva(
  'grid gap-4 w-full',
  {
    variants: {
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        auto: 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
      },
      gap: {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
    },
    defaultVariants: {
      columns: 3,
      gap: 'md',
    },
  }
)

const bentoItemVariants = cva(
  'rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'row-span-1',
        md: 'row-span-2',
        lg: 'row-span-3',
        xl: 'row-span-4',
        auto: '',
      },
      width: {
        sm: 'col-span-1',
        md: 'col-span-2',
        lg: 'col-span-3',
        full: 'col-span-full',
        auto: '',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-lg hover:-translate-y-1',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-lg hover:shadow-primary/20',
      },
    },
    defaultVariants: {
      size: 'auto',
      width: 'auto',
      hover: 'lift',
    },
  }
)

export interface BentoGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridVariants> {
  autoRows?: string
}

export interface BentoItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoItemVariants> {}

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, columns, gap, autoRows = 'minmax(200px, auto)', style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(bentoGridVariants({ columns, gap }), className)}
      style={{
        gridAutoRows: autoRows,
        ...style,
      }}
      {...props}
    />
  )
)

const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(
  ({ className, size, width, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(bentoItemVariants({ size, width, hover }), className)}
      {...props}
    />
  )
)

const BentoHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
))

const BentoTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))

const BentoDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

const BentoContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))

const BentoFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))

BentoGrid.displayName = 'BentoGrid'
BentoItem.displayName = 'BentoItem'
BentoHeader.displayName = 'BentoHeader'
BentoTitle.displayName = 'BentoTitle'
BentoDescription.displayName = 'BentoDescription'
BentoContent.displayName = 'BentoContent'
BentoFooter.displayName = 'BentoFooter'

export {
  BentoGrid,
  BentoItem,
  BentoHeader,
  BentoTitle,
  BentoDescription,
  BentoContent,
  BentoFooter,
}