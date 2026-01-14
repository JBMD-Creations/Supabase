import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../contexts/SupabaseDataContext';
import { CurrentUserAvatar } from '../current-user-avatar';
import './AuthModal.css';

const UserMenu = ({ onLoginClick }) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { syncStatus, lastSyncTime, syncAll, isOnline } = useSupabaseData();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleSync = () => {
    syncAll();
    setIsOpen(false);
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const now = new Date();
    const diff = now - lastSyncTime;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return lastSyncTime.toLocaleTimeString();
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <button className="user-menu-trigger" onClick={onLoginClick}>
        <span className="user-avatar">?</span>
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CurrentUserAvatar />
        <SyncStatusBadge status={syncStatus} isOnline={isOnline} />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-email">{user?.email}</div>

          <button className="user-menu-item" onClick={handleSync}>
            Sync Now
            <span style={{ float: 'right', opacity: 0.6 }}>
              {formatLastSync()}
            </span>
          </button>

          <div className="user-menu-divider" />

          <button className="user-menu-item" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

const SyncStatusBadge = ({ status, isOnline }) => {
  if (!isOnline) {
    return <span className="sync-indicator offline">Offline</span>;
  }

  switch (status) {
    case 'syncing':
      return <span className="sync-indicator syncing">Syncing...</span>;
    case 'synced':
      return <span className="sync-indicator synced">Synced</span>;
    case 'error':
      return <span className="sync-indicator error">Sync Error</span>;
    default:
      return null;
  }
};

export default UserMenu;
