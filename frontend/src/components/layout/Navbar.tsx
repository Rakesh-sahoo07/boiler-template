import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const navbarVariants = cva(
  'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  {
    variants: {
      variant: {
        default: '',
        transparent: 'bg-transparent border-transparent',
        solid: 'bg-background border-border',
      },
      size: {
        sm: 'h-12',
        md: 'h-16',
        lg: 'h-20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode
  actions?: React.ReactNode
  mobileMenuButton?: boolean
}

export interface NavItemProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  active?: boolean
  disabled?: boolean
}

export interface NavMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Array<{
    label: string
    href: string
    active?: boolean
    disabled?: boolean
  }>
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, variant, size, logo, actions, mobileMenuButton = true, children, ...props }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
      <nav
        ref={ref}
        className={cn(navbarVariants({ variant, size }), className)}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {logo}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {children}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {actions}
              
              {/* Mobile Menu Button */}
              {mobileMenuButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t border-border py-4 md:hidden">
              <div className="flex flex-col space-y-2">
                {children}
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }
)

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, href, active, disabled = false, children, ...props }, ref) => {
    const location = useLocation()
    const isActive = active !== undefined ? active : location.pathname === href
    
    return (
      <Link
        ref={ref as any}
        to={href}
        className={cn(
          'block px-3 py-2 text-sm font-medium transition-colors rounded-md',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

const NavMenu = React.forwardRef<HTMLDivElement, NavMenuProps>(
  ({ className, items = [], ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0', className)}
      {...props}
    >
      {items.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          active={item.active}
          disabled={item.disabled}
        >
          {item.label}
        </NavItem>
      ))}
    </div>
  )
)

const NavLogo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center space-x-2 font-bold text-lg', className)}
      {...props}
    >
      {children}
    </div>
  )
)

Navbar.displayName = 'Navbar'
NavItem.displayName = 'NavItem'
NavMenu.displayName = 'NavMenu'
NavLogo.displayName = 'NavLogo'

export { Navbar, NavItem, NavMenu, NavLogo }