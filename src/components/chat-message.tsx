import { cn } from '../lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { ChatMessage } from '../hooks/use-realtime-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  const initials = message.user.name
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase()

  return (
    <div className={cn('flex gap-3', isOwnMessage && 'flex-row-reverse')}>
      {showHeader && (
        <Avatar className="size-8 shrink-0">
          {message.user.image && <AvatarImage src={message.user.image} alt={message.user.name} />}
          <AvatarFallback>{initials || '?'}</AvatarFallback>
        </Avatar>
      )}
      {!showHeader && <div className="size-8 shrink-0" />}
      <div className={cn('flex flex-col gap-1', isOwnMessage && 'items-end')}>
        {showHeader && (
          <span className="text-xs text-muted-foreground">{message.user.name}</span>
        )}
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm max-w-[280px] break-words',
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
