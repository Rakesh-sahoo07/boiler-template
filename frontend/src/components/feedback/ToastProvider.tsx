import React, { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { Toast, type ToastProps } from './Toast'

export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'

export interface ToastData extends Omit<ToastProps, 'onClose'> {
  id: string
}

export interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
  className?: string
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
  className 
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastData = { ...toast, id }
    
    setToasts((prevToasts) => {
      const updatedToasts = [newToast, ...prevToasts]
      return updatedToasts.slice(0, maxToasts)
    })
    
    return id
  }, [maxToasts])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const getPositionClasses = (position: ToastPosition) => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0'
      case 'top-center':
        return 'top-0 left-1/2 -translate-x-1/2'
      case 'top-right':
        return 'top-0 right-0'
      case 'bottom-left':
        return 'bottom-0 left-0'
      case 'bottom-center':
        return 'bottom-0 left-1/2 -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-0 right-0'
      default:
        return 'top-0 right-0'
    }
  }

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div
          className={cn(
            'fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px] pointer-events-none',
            getPositionClasses(position),
            className
          )}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'mb-2 animate-in slide-in-from-right-full pointer-events-auto',
                position.includes('left') && 'slide-in-from-left-full',
                position.includes('top') && 'slide-in-from-top-full',
                position.includes('bottom') && 'slide-in-from-bottom-full'
              )}
            >
              <Toast
                {...toast}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Convenience hooks for different toast types
export const useToastActions = () => {
  const { addToast } = useToast()

  return {
    toast: (props: Omit<ToastData, 'id'>) => addToast(props),
    success: (title: string, description?: string) => addToast({ 
      variant: 'success', 
      title, 
      description 
    }),
    error: (title: string, description?: string) => addToast({ 
      variant: 'error', 
      title, 
      description 
    }),
    warning: (title: string, description?: string) => addToast({ 
      variant: 'warning', 
      title, 
      description 
    }),
    info: (title: string, description?: string) => addToast({ 
      variant: 'info', 
      title, 
      description 
    }),
  }
}