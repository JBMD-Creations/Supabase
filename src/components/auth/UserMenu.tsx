import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../contexts/SupabaseDataContext';
import { CurrentUserAvatar } from '../current-user-avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { RefreshCw, LogOut, LogIn, WifiOff, AlertCircle, Check, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UserMenuProps {
  onLoginClick?: () => void;
  onSettingsClick?: () => void;
}

const UserMenu = ({ onLoginClick, onSettingsClick }: UserMenuProps) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { syncStatus, lastSyncTime, syncAll, isOnline } = useSupabaseData();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSync = () => {
    syncAll();
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return lastSyncTime.toLocaleTimeString();
  };

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff className="size-3 text-muted-foreground" />;
    if (syncStatus === 'syncing') return <RefreshCw className="size-3 animate-spin text-blue-500" />;
    if (syncStatus === 'error') return <AlertCircle className="size-3 text-destructive" />;
    if (syncStatus === 'synced') return <Check className="size-3 text-green-500" />;
    return null;
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={onLoginClick} className="gap-2">
        <LogIn className="size-4" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative gap-1.5 pl-1 pr-2 h-10 rounded-full hover:bg-white/20"
        >
          <div className="relative">
            <CurrentUserAvatar />
            {/* Sync status indicator dot */}
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white",
                !isOnline && "bg-gray-400",
                isOnline && syncStatus === 'synced' && "bg-green-500",
                isOnline && syncStatus === 'syncing' && "bg-blue-500 animate-pulse",
                isOnline && syncStatus === 'error' && "bg-red-500"
              )}
            />
          </div>
          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Sync Status Row */}
        <DropdownMenuItem onClick={handleSync} className="cursor-pointer">
          <RefreshCw className={cn("size-4", syncStatus === 'syncing' && "animate-spin")} />
          <span>Sync Now</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            {getSyncIcon()}
            {formatLastSync()}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          <Settings className="size-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
