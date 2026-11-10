// frontend/src/components/capitalio/sidebar.jsx
import * as React from 'react'
import {
  SidebarChevronIcon,
  SidebarLogoutIcon,
} from './icons'
import { CapitalioLogo } from './logo'
import { DashboardLink, useDashboardNavigation } from './navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { currentUser, sidebarSections } from './data'
import { cn } from '@/lib/utils'

function Brand() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="size-10 flex shrink-0 items-center justify-center rounded-lg border border-primary bg-gradient-to-t from-primary/80 to-primary text-white shadow-xs">
        <CapitalioLogo className="size-6 shrink-0" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-base font-bold tracking-tight text-foreground">
          Smart Traffic AI
        </span>
        <span className="block truncate text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Capitalio Command
        </span>
      </div>
    </div>
  )
}

function NavLinkButton({ item }) {
  const { pathname } = useDashboardNavigation()
  const { isMobile, setOpenMobile } = useSidebar()
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  const Icon = item.icon

  function handleClick() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.name}
        isActive={isActive}
        className={cn(
          'h-auto gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'active-sidebar-item bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        )}
      >
        <DashboardLink href={item.href} onClick={handleClick} aria-current={isActive ? 'page' : undefined}>
          <Icon className="size-4.5 shrink-0" />
          <span className="truncate">{item.name}</span>
        </DashboardLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarSectionMenu({ items }) {
  return (
    <SidebarGroupContent>
      <SidebarMenu className="gap-1">
        {items.map((item) => (
          <NavLinkButton key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  )
}

function CollapsibleNavSection({ section }) {
  const [isOpen, setIsOpen] = React.useState(section.defaultOpen ?? true)

  return (
    <SidebarGroup className="gap-1 p-0 mb-3">
      {section.label ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground transition-colors"
        >
          <span>{section.label}</span>
          <SidebarChevronIcon
            className={cn('size-2.5 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      ) : null}

      {isOpen ? <SidebarSectionMenu items={section.items} /> : null}
    </SidebarGroup>
  )
}

function StaticNavSection({ section }) {
  return (
    <SidebarGroup className="gap-1 p-0 mb-3">
      {section.label ? (
        <div className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {section.label}
        </div>
      ) : null}
      <SidebarSectionMenu items={section.items} />
    </SidebarGroup>
  )
}

function UserProfile() {
  return (
    <div className="flex items-center gap-3 p-1">
      <Avatar className="size-9 rounded-full ring-2 ring-primary/20">
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-foreground">{currentUser.name}</div>
        <div className="truncate text-[11px] text-muted-foreground">{currentUser.role}</div>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Brand />
      </SidebarHeader>

      <SidebarContent>
        {sidebarSections.main.map((section) =>
          section.collapsible ? (
            <CollapsibleNavSection key={section.label} section={section} />
          ) : (
            <StaticNavSection key={section.label} section={section} />
          )
        )}
      </SidebarContent>

      <SidebarFooter>
        <StaticNavSection section={sidebarSections.footer} />
        <div className="pt-2 border-t border-sidebar-divider">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSidebar
