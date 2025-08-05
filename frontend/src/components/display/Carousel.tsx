import React, { useState, useEffect, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const carouselVariants = cva(
  'relative w-full overflow-hidden rounded-lg',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-border',
        shadowed: 'shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showNavigation?: boolean
  infinite?: boolean
  itemsToShow?: number
  itemsToScroll?: number
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ 
    className, 
    variant,
    autoPlay = false,
    interval = 3000,
    showIndicators = true,
    showNavigation = true,
    infinite = true,
    itemsToShow = 1,
    itemsToScroll = 1,
    children, 
    ...props 
  }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    
    const items = React.Children.toArray(children)
    const totalItems = items.length
    const maxIndex = Math.max(0, totalItems - itemsToShow)

    const goToSlide = useCallback((index: number) => {
      if (infinite) {
        setCurrentIndex(index)
      } else {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
      }
    }, [infinite, maxIndex])

    const nextSlide = useCallback(() => {
      if (infinite) {
        setCurrentIndex((prev) => (prev + itemsToScroll) % totalItems)
      } else {
        setCurrentIndex((prev) => Math.min(prev + itemsToScroll, maxIndex))
      }
    }, [infinite, itemsToScroll, totalItems, maxIndex])

    const prevSlide = useCallback(() => {
      if (infinite) {
        setCurrentIndex((prev) => (prev - itemsToScroll + totalItems) % totalItems)
      } else {
        setCurrentIndex((prev) => Math.max(prev - itemsToScroll, 0))
      }
    }, [infinite, itemsToScroll, totalItems])

    useEffect(() => {
      if (autoPlay && !isHovered) {
        const timer = setInterval(nextSlide, interval)
        return () => clearInterval(timer)
      }
    }, [autoPlay, isHovered, interval, nextSlide])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          prevSlide()
        } else if (e.key === 'ArrowRight') {
          nextSlide()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide])

    const canGoPrev = infinite || currentIndex > 0
    const canGoNext = infinite || currentIndex < maxIndex

    return (
      <div
        ref={ref}
        className={cn(carouselVariants({ variant }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Main Content */}
        <div className="relative h-full">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)`,
              width: `${(totalItems * 100) / itemsToShow}%`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / totalItems}%` }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showNavigation && totalItems > itemsToShow && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm',
                  !canGoPrev && 'opacity-50 cursor-not-allowed'
                )}
                onClick={prevSlide}
                disabled={!canGoPrev}
                aria-label="Previous slide"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm',
                  !canGoNext && 'opacity-50 cursor-not-allowed'
                )}
                onClick={nextSlide}
                disabled={!canGoNext}
                aria-label="Next slide"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </>
          )}
        </div>

        {/* Indicators */}
        {showIndicators && totalItems > itemsToShow && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {Array.from({ length: Math.ceil(totalItems / itemsToShow) }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  Math.floor(currentIndex / itemsToShow) === index
                    ? 'bg-primary w-4'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                onClick={() => goToSlide(index * itemsToShow)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full h-full flex-shrink-0', className)}
      {...props}
    />
  )
)

Carousel.displayName = 'Carousel'
CarouselItem.displayName = 'CarouselItem'

export { Carousel, CarouselItem }