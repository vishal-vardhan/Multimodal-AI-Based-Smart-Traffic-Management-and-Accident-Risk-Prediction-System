// frontend/src/components/ui/button.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Button = React.forwardRef(function Button(
  {
    className = '',
    variant = 'default',
    size = 'default',
    asChild = false,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer'

  const variants = {
    default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
    outline: 'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    secondary: 'border border-border bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizes = {
    default: 'h-9 px-4 py-2 text-sm',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8 text-sm',
    icon: 'size-9',
  }

  const variantClass = variants[variant] || variants.default
  const sizeClass = sizes[size] || sizes.default

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClasses, variantClass, sizeClass, className, children.props.className),
      ref,
      ...props,
    })
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
