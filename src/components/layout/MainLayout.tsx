import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTeamChat } from '../../contexts/TeamChatContext';
import SettingsModal from '../settings/SettingsModal';
import UserMenu from '../auth/UserMenu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginClick?: () => void;
  children: React.ReactNode;
}

const tabs = [
  { id: 'charting', label: 'Charting' },
  { id: 'operations', label: 'Operations' },
  { id: 'reports', label: 'Reports' },
  { id: 'analytics', label: 'Analytics' },
];

const MainLayout = ({ activeTab, onTabChange, onLoginClick, children }: MainLayoutProps) => {
  const { theme } = useTheme();
  const { toggleChatPanel, unreadCount } = useTeamChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen p-4" data-theme={theme}>
      {/* Top Navigation */}
      <nav className="flex items-center justify-between gap-4 mb-4">
        {/* Left: Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "transition-all",
                activeTab === tab.id
                  ? "shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Chat Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleChatPanel}
            className="relative gap-2 bg-white/80 backdrop-blur"
          >
            <MessageCircle className="size-4" />
            Chat
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 size-5 p-0 flex items-center justify-center text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Menu (contains Settings, Sync, Sign Out) */}
          <UserMenu
            onLoginClick={onLoginClick}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
