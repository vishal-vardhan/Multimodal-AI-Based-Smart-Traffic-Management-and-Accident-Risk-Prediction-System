// src/components/navigation/DropdownAvatar.jsx
//
// Untitled UI DropdownAvatar Component
// Interactive user profile button with status indicator and dropdown menu.

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ShieldIcon, LogOutIcon, Settings01Icon, Bell01Icon } from './Icons.jsx';

export function DropdownAvatar({ user, isAdmin, onLogout, onOpenSettings, onOpenNotifs, onSwitchDemo }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || (isAdmin ? 'System Administrator' : 'Control Room Operator');
  const userEmail = user?.email || (isAdmin ? 'admin@traffic.ai' : 'operator@traffic.ai');
  const userRole = user?.role || (isAdmin ? 'admin' : 'operator');

  // Compute initials
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SA';

  return (
    <div className="dropdown-avatar-wrap" ref={dropdownRef}>
      <button
        type="button"
        className="avatar-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${userName} (${userRole.toUpperCase()})`}
      >
        <div className="avatar-circle">
          <span className="avatar-initials">{initials}</span>
          <span className="avatar-online-dot" />
        </div>
        <ChevronDownIcon size={14} className={`avatar-chevron ${isOpen ? 'avatar-chevron--open' : ''}`} />
      </button>

      {isOpen && (
        <div className="avatar-dropdown-menu" role="menu">
          {/* Header section with user info */}
          <div className="dropdown-user-header">
            <div className="dropdown-user-name">{userName}</div>
            <div className="dropdown-user-email">{userEmail}</div>
            <div className="dropdown-role-badge-row">
              <span className={`role-badge role-badge--${userRole}`}>
                {isAdmin ? '👑 ADMIN PRIVILEGES' : '🖥️ OPERATOR VIEW'}
              </span>
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Quick links */}
          <div className="dropdown-items-group">
            {onOpenSettings && (
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
              >
                <Settings01Icon size={16} />
                <span>System Settings</span>
              </button>
            )}

            {onOpenNotifs && (
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  onOpenNotifs();
                }}
              >
                <Bell01Icon size={16} />
                <span>Alerts &amp; Webhooks</span>
              </button>
            )}

            <Link
              to="/accident-risk"
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              <ShieldIcon size={16} />
              <span>Accident Risk Engine</span>
            </Link>
          </div>

          {/* Demo account switcher */}
          {onSwitchDemo && (
            <>
              <div className="dropdown-divider" />
              <div className="dropdown-section-title">Quick Role Switch (Demo)</div>
              <div className="dropdown-items-group">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsOpen(false);
                    onSwitchDemo('admin');
                  }}
                >
                  <span style={{ fontSize: '14px' }}>👑</span>
                  <span>Switch to Admin</span>
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsOpen(false);
                    onSwitchDemo('operator');
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🖥️</span>
                  <span>Switch to Operator</span>
                </button>
              </div>
            </>
          )}

          <div className="dropdown-divider" />

          {/* Logout */}
          <button
            type="button"
            className="dropdown-item dropdown-item--danger"
            onClick={() => {
              setIsOpen(false);
              if (onLogout) onLogout();
            }}
          >
            <LogOutIcon size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
