import React, { useEffect, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      overlay: {
        default: 'bg-black/50 backdrop-blur-sm',
        dark: 'bg-black/70',
        light: 'bg-white/50',
        none: '',
      },
    },
    defaultVariants: {
      overlay: 'default',
    },
  }
)

const modalContentVariants = cva(
  'relative bg-background border border-border rounded-lg shadow-lg max-h-[90vh] overflow-auto',
  {
    variants: {
      size: {
        sm: 'max-w-sm w-full',
        md: 'max-w-md w-full',
        lg: 'max-w-lg w-full',
        xl: 'max-w-xl w-full',
        '2xl': 'max-w-2xl w-full',
        '4xl': 'max-w-4xl w-full',
        full: 'max-w-full w-full h-full m-0 rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants>,
    VariantProps<typeof modalContentVariants> {
  open?: boolean
  onClose?: () => void
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className, 
    overlay, 
    size, 
    open = false, 
    onClose, 
    closeOnOverlayClick = true, 
    closeOnEscape = true,
    showCloseButton = true,
    children, 
    ...props 
  }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (open && closeOnEscape) {
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose?.()
          }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [open, closeOnEscape, onClose])

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = ''
        }
      }
    }, [open])

    if (!open) return null

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose?.()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(modalVariants({ overlay }), className)}
        onClick={handleOverlayClick}
        {...props}
      >
        <div
          ref={contentRef}
          className={cn(modalContentVariants({ size }))}
          role="dialog"
          aria-modal="true"
        >
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          )}
          {children}
        </div>
      </div>
    )
  }
)

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
))

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0', className)}
    {...props}
  />
))

Modal.displayName = 'Modal'
ModalHeader.displayName = 'ModalHeader'
ModalTitle.displayName = 'ModalTitle'
ModalDescription.displayName = 'ModalDescription'
ModalContent.displayName = 'ModalContent'
ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter }