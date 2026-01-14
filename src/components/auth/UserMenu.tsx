import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseData } from '../../contexts/SupabaseDataContext';
import { CurrentUserAvatar } from '../current-user-avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { RefreshCw, LogOut, LogIn, Wifi, WifiOff, AlertCircle, Check } from 'lucide-react';

interface UserMenuProps {
  onLoginClick?: () => void;
}

const UserMenu = ({ onLoginClick }: UserMenuProps) => {
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
        <Button variant="ghost" className="gap-2 px-2">
          <CurrentUserAvatar />
          <SyncStatusBadge status={syncStatus} isOnline={isOnline} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSync} className="cursor-pointer">
          <RefreshCw className="size-4" />
          <span>Sync Now</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatLastSync()}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SyncStatusBadgeProps {
  status: string;
  isOnline: boolean;
}

const SyncStatusBadge = ({ status, isOnline }: SyncStatusBadgeProps) => {
  if (!isOnline) {
    return (
      <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground">
        <WifiOff className="size-3" />
        Offline
      </Badge>
    );
  }

  switch (status) {
    case 'syncing':
      return (
        <Badge variant="secondary" className="gap-1">
          <RefreshCw className="size-3 animate-spin" />
          Syncing
        </Badge>
      );
    case 'synced':
      return (
        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
          <Check className="size-3" />
          Synced
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="size-3" />
          Error
        </Badge>
      );
    default:
      return null;
  }
};

export default UserMenu;
