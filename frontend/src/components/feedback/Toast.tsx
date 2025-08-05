import React, { useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-border p-4 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
        error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  duration?: number
  closable?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    className, 
    variant, 
    id,
    title, 
    description, 
    action, 
    onClose, 
    duration = 5000,
    closable = true,
    children,
    ...props 
  }, ref) => {
    useEffect(() => {
      if (duration && duration > 0 && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    const getIcon = () => {
      switch (variant) {
        case 'success':
          return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        case 'error':
          return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        case 'warning':
          return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        case 'info':
          return (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {variant !== 'default' && (
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className={cn('text-sm', title && 'mt-1')}>
                {description}
              </div>
            )}
            {children && (
              <div className={cn('text-sm', (title || description) && 'mt-1')}>
                {children}
              </div>
            )}
          </div>
        </div>

        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}

        {closable && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export { Toast, toastVariants }