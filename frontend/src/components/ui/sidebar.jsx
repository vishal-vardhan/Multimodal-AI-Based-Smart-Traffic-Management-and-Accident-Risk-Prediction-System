// frontend/src/components/ui/sidebar.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext({
  open: true,
  setOpen: () => {},
  isMobile: false,
  openMobile: false,
  setOpenMobile: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export function SidebarProvider({
  defaultOpen = true,
  className = '',
  style = {},
  children,
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, isMobile, openMobile, setOpenMobile }}
    >
      <div
        className={cn('flex min-h-screen w-full', className)}
        style={style}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger({ className, ...props }) {
  const { isMobile, openMobile, setOpenMobile, open, setOpen } = useSidebar()

  const handleToggle = () => {
    if (isMobile) {
      setOpenMobile(!openMobile)
    } else {
      setOpen(!open)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-background p-1.5 text-foreground shadow-xs hover:bg-accent transition-colors',
        className
      )}
      {...props}
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </button>
  )
}

export function Sidebar({ className, children, ...props }) {
  const { open, isMobile, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    if (!openMobile) return null
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          onClick={() => setOpenMobile(false)}
        />
        <aside
          data-slot="sidebar"
          data-mobile="true"
          className={cn(
            'relative z-50 flex h-full w-[17rem] flex-col border-r border-sidebar-border bg-sidebar p-4 shadow-xl text-sidebar-foreground',
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </div>
    )
  }

  return (
    <aside
      data-slot="sidebar"
      style={{ width: open ? 'var(--sidebar-width, 15.625rem)' : '4rem' }}
      className={cn(
        'flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out text-sidebar-foreground overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-4 border-b border-sidebar-divider', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarContent({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 no-scrollbar', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-3 border-t border-sidebar-divider', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children, ...props }) {
  return (
    <div className={cn('relative flex w-full min-w-0 flex-col p-1', className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-7 shrink-0 items-center px-2 text-xs font-semibold text-sidebar-muted tracking-wider uppercase',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children, ...props }) {
  return (
    <div className={cn('w-full text-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children, ...props }) {
  return (
    <ul className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({ className, children, ...props }) {
  return (
    <li className={cn('relative list-none', className)} {...props}>
      {children}
    </li>
  )
}

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  className,
  children,
  tooltip,
  ...props
}) {
  const baseClasses =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none select-none'

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(
        baseClasses,
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold active-sidebar-item'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
        className,
        children.props.className
      ),
      'data-active': isActive ? 'true' : undefined,
      title: tooltip,
      ...props,
    })
  }

  return (
    <button
      type="button"
      className={cn(
        baseClasses,
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold active-sidebar-item'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
        className
      )}
      data-active={isActive ? 'true' : undefined}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  )
}
