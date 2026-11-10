// frontend/src/components/ui/avatar.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt = '', className, ...props }) {
  const [hasError, setHasError] = React.useState(false)

  if (!src || hasError) return null

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
