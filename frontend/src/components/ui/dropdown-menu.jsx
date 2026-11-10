// frontend/src/components/ui/dropdown-menu.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const DropdownContext = React.createContext({
  open: false,
  setOpen: () => {},
})

export function DropdownMenu({ children }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef(null)

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children, className, ...props }) {
  const { open, setOpen } = React.useContext(DropdownContext)

  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      'aria-expanded': open,
      className: cn(className, children.props.className),
      ...props,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  align = 'end',
  className,
  children,
  ...props
}) {
  const { open } = React.useContext(DropdownContext)

  if (!open) return null

  const alignmentClass = align === 'end' ? 'right-0' : 'left-0'

  return (
    <div
      data-slot="dropdown-menu-content"
      className={cn(
        'absolute z-50 mt-1.5 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80',
        alignmentClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}) {
  const { setOpen } = React.useContext(DropdownContext)

  const handleClick = (e) => {
    onClick?.(e)
    setOpen(false)
  }

  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      onClick={handleClick}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2.5 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
