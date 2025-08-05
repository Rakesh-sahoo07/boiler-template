import React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        default: 'h-6 w-11',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
        default: 'h-5 w-5 data-[state=checked]:translate-x-5',
        lg: 'h-6 w-6 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  label?: string
  description?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, label, description, ...props }, ref) => {
  const switchComponent = (
    <SwitchPrimitive.Root
      className={cn(switchVariants({ size }), className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitive.Root>
  )

  if (label || description) {
    return (
      <div className="flex items-center space-x-2">
        {switchComponent}
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return switchComponent
})

Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }