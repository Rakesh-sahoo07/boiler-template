import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const footerVariants = cva(
  'w-full border-t border-border bg-background',
  {
    variants: {
      variant: {
        default: '',
        dark: 'bg-muted',
        minimal: 'border-transparent',
      },
      padding: {
        sm: 'py-6',
        md: 'py-8',
        lg: 'py-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {}

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export interface FooterLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string
  external?: boolean
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(footerVariants({ variant, padding }), className)}
      {...props}
    />
  )
)

const FooterContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('container mx-auto max-w-full px-4', className)}
      {...props}
    />
  )
)

const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
  ({ className, title, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {title && (
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
)

const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ className, href, external = false, children, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(
        'block text-sm text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="inline ml-1 h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
)

const FooterDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('border-border', className)}
      {...props}
    />
  )
)

const FooterBottom = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-between space-y-4 text-sm text-muted-foreground md:flex-row md:space-y-0',
        className
      )}
      {...props}
    />
  )
)

const FooterSocial = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex space-x-4', className)}
      {...props}
    />
  )
)

const FooterSocialLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ className, href, children, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent',
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  )
)

Footer.displayName = 'Footer'
FooterContent.displayName = 'FooterContent'
FooterSection.displayName = 'FooterSection'
FooterLink.displayName = 'FooterLink'
FooterDivider.displayName = 'FooterDivider'
FooterBottom.displayName = 'FooterBottom'
FooterSocial.displayName = 'FooterSocial'
FooterSocialLink.displayName = 'FooterSocialLink'

export {
  Footer,
  FooterContent,
  FooterSection,
  FooterLink,
  FooterDivider,
  FooterBottom,
  FooterSocial,
  FooterSocialLink,
}