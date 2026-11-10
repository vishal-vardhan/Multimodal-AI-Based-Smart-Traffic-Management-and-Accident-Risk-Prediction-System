// frontend/src/components/capitalio/navigation.jsx
import * as React from 'react'
import { defaultDashboardPeriod } from './data'

const DashboardNavigationContext = React.createContext(null)

export function DashboardNavigationProvider({
  children,
  initialPath = '/',
  initialTheme = 'light',
}) {
  const [pathname, setPathname] = React.useState(initialPath)
  const [period, setPeriod] = React.useState(defaultDashboardPeriod)
  const [theme, setTheme] = React.useState(initialTheme)

  const value = React.useMemo(
    () => ({
      pathname,
      navigate: setPathname,
      period,
      setPeriod,
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [pathname, period, theme]
  )

  return (
    <DashboardNavigationContext.Provider value={value}>
      {children}
    </DashboardNavigationContext.Provider>
  )
}

export function useDashboardNavigation() {
  const context = React.useContext(DashboardNavigationContext)

  if (!context) {
    throw new Error('useDashboardNavigation must be used within DashboardNavigationProvider')
  }

  return context
}

export function DashboardLink({ href, onClick, children, ...props }) {
  const { navigate } = useDashboardNavigation()

  function handleClick(event) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
