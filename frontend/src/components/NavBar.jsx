// src/components/NavBar.jsx
//
// Untitled UI Dual-Tier Header Navigation (HeaderNavigationDualTier)
// Recreates the exact Untitled UI navigation architecture:
//   • Top Tier: Brand, primary navigation links, Zap quick action button,
//               Settings NavButton, Notification NavButton with badge counter,
//               and DropdownAvatar profile menu.
//   • Secondary Tier: Sub-navigation bar with Overview, Live Feeds, Corridors,
//                     Congestion Trends, Signal Performance, and Throughput tabs.

import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ZapIcon, Settings01Icon, Bell01Icon, TrafficLightIcon } from './navigation/Icons.jsx';
import { NavButton } from './navigation/NavButton.jsx';
import { DropdownAvatar } from './navigation/DropdownAvatar.jsx';
import NotificationSettingsModal from './NotificationSettingsModal.jsx';
import SimulationPanel from './SimulationPanel.jsx';
import { fetchIncidents } from '../services/api.js';
import useTrafficSocket from '../hooks/useTrafficSocket.js';
import '../styles/untitledNav.css';

// Primary Navigation Items
const PRIMARY_ITEMS = [
  { label: 'Dashboard',      href: '/',              end: true },
  { label: 'Video Analysis', href: '/cameras'                  },
  { label: 'Accident Risk',  href: '/accident-risk'            },
  { label: 'Live Map',       href: '/live-map'                 },
  { label: 'Incidents',      href: '/incidents'                },
  { label: 'Analytics',      href: '/analytics'                },
];

// Secondary Sub-Items (Dual-Tier Sub-Bar)
const SUB_ITEMS_DASHBOARD = [
  { label: 'Overview',            href: '/',                  end: true },
  { label: 'Live CCTV Feeds',     href: '/cameras'                      },
  { label: 'Corridors & Speeds',  href: '/#corridors'                   },
  { label: 'Congestion Trends',   href: '/#trends'                      },
  { label: 'Response Times',      href: '/#response'                    },
  { label: 'Signal Performance',  href: '/#signals'                     },
  { label: 'Roadway Throughput',  href: '/#throughput'                  },
];

const SUB_ITEMS_ACCIDENT = [
  { label: 'Mode B Risk Engine',  href: '/accident-risk',     end: true },
  { label: 'Weather Telemetry',   href: '/accident-risk#weather'        },
  { label: 'Traffic Speeds',      href: '/accident-risk#traffic'        },
  { label: 'Police Crash Log',    href: '/accident-risk#crashes'        },
];

const SUB_ITEMS_INCIDENTS = [
  { label: 'All Incidents',       href: '/incidents',         end: true },
  { label: 'Active Bottlenecks',  href: '/incidents#active'             },
  { label: 'Field Dispatched',    href: '/incidents#dispatched'         },
  { label: 'Resolved History',    href: '/incidents#resolved'           },
];

export default function NavBar() {
  const { user, isAdmin, logout, demoLogin } = useAuth();
  const location = useLocation();
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [simPanelOpen, setSimPanelOpen] = useState(false);
  const [activeAlertsCount, setActiveAlertsCount] = useState(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time synchronization
  const { socketData, socketConnected } = useTrafficSocket();

  useEffect(() => {
    fetchIncidents()
      .then(res => {
        if (res && res.incidents) {
          const count = res.incidents.filter(i => (i.status || 'Active').toLowerCase() === 'active').length;
          setActiveAlertsCount(count > 0 ? count : 5);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (socketData?.active_incidents) {
      const count = socketData.active_incidents.filter(i => (i.status || 'Active').toLowerCase() === 'active').length;
      if (count > 0) setActiveAlertsCount(count);
    }
  }, [socketData]);

  // Determine which sub-items tier to show based on active route
  let currentSubItems = SUB_ITEMS_DASHBOARD;
  if (location.pathname === '/accident-risk') {
    currentSubItems = SUB_ITEMS_ACCIDENT;
  } else if (location.pathname === '/incidents') {
    currentSubItems = SUB_ITEMS_INCIDENTS;
  }

  return (
    <>
      <header className="unt-header-dual-tier">
        {/* ─── TIER 1: Primary Header Navigation ──────────────────────────────── */}
        <div className="unt-tier-primary">
          <div className="unt-tier-container">
            {/* Left Brand Logo & Title */}
            <div className="unt-brand-wrap">
              <Link to="/" className="unt-brand-link">
                <div className="unt-logo-box">
                  <TrafficLightIcon size={20} />
                </div>
                <div className="unt-brand-text-col">
                  <span className="unt-brand-title">Smart Traffic AI</span>
                  <span className="unt-brand-badge">
                    <span className="unt-brand-dot" />
                    {socketConnected ? 'ONLINE' : 'FALLBACK'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="unt-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="unt-hamburger-line" />
              <span className="unt-hamburger-line" />
              <span className="unt-hamburger-line" />
            </button>

            {/* Primary Navigation Links */}
            <nav className={`unt-primary-nav ${mobileMenuOpen ? 'unt-primary-nav--open' : ''}`} aria-label="Main navigation">
              <ul className="unt-nav-list">
                {PRIMARY_ITEMS.map((item) => (
                  <li key={item.href} className="unt-nav-item">
                    <NavLink
                      to={item.href}
                      end={item.end}
                      className={({ isActive }) =>
                        isActive ? 'unt-nav-link unt-nav-link--active' : 'unt-nav-link'
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                      {item.label === 'Incidents' && activeAlertsCount > 0 && (
                        <span className="unt-badge-count">{activeAlertsCount}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Actions Bar (Matching Untitled UI sample) */}
            <div className="unt-actions-bar">
              {/* Secondary Action Button with Zap Icon */}
              <button
                type="button"
                className="unt-btn-secondary"
                onClick={() => setSimPanelOpen(!simPanelOpen)}
                title="Open Emergency Scenarios & Simulation Control Panel"
              >
                <ZapIcon size={16} className="unt-btn-zap-icon" />
                <span>Simulate</span>
              </button>

              {/* Action NavButtons: Settings & Notifications */}
              <div className="unt-action-icons-wrap">
                <NavButton
                  icon={Settings01Icon}
                  label="Settings"
                  onClick={() => setNotifModalOpen(true)}
                  title="Configure alert triggers & webhook dispatch channels"
                />

                <div className="unt-notif-btn-relative">
                  <NavButton
                    icon={Bell01Icon}
                    label="Notifications"
                    badge={activeAlertsCount}
                    onClick={() => setNotifModalOpen(true)}
                    title={`${activeAlertsCount} active alerts`}
                  />
                </div>
              </div>

              {/* User Profile Dropdown Avatar */}
              <DropdownAvatar
                user={user}
                isAdmin={isAdmin}
                onLogout={logout}
                onOpenSettings={() => setNotifModalOpen(true)}
                onOpenNotifs={() => setNotifModalOpen(true)}
                onSwitchDemo={(role) => demoLogin(role)}
              />
            </div>
          </div>
        </div>

        {/* ─── TIER 2: Secondary Navigation Bar (Sub-Items Row) ──────────────── */}
        <div className="unt-tier-secondary">
          <div className="unt-tier-container">
            <nav className="unt-secondary-nav" aria-label="Secondary navigation">
              <ul className="unt-subnav-list">
                {currentSubItems.map((sub) => {
                  const isHash = sub.href.includes('#');
                  if (isHash) {
                    return (
                      <li key={sub.label} className="unt-subnav-item">
                        <a
                          href={sub.href}
                          className="unt-subnav-link"
                          onClick={() => {
                            const hash = sub.href.split('#')[1];
                            const el = document.getElementById(hash);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {sub.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={sub.label} className="unt-subnav-item">
                      <NavLink
                        to={sub.href}
                        end={sub.end}
                        className={({ isActive }) =>
                          isActive ? 'unt-subnav-link unt-subnav-link--active' : 'unt-subnav-link'
                        }
                      >
                        {sub.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Persistent Notification & Webhook Modal */}
      <NotificationSettingsModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
      />

      {/* Quick Scenario & Simulation Drawer */}
      {simPanelOpen && (
        <div className="unt-sim-modal-overlay" onClick={() => setSimPanelOpen(false)}>
          <div className="unt-sim-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="unt-sim-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ZapIcon size={18} style={{ color: '#2563eb' }} />
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Emergency Scenario Simulator</strong>
              </div>
              <button
                type="button"
                className="unt-sim-close-btn"
                onClick={() => setSimPanelOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="unt-sim-modal-body">
              <SimulationPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
