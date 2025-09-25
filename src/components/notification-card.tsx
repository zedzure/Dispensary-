
'use client';

import type { FC } from 'react';
import type { Notification } from '@/lib/mockNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, UserPlus, MessageSquare, Award, Receipt, Shield, UserMinus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

const iconMap = {
  like: Heart,
  follow: UserPlus,
  unfollow: UserMinus,
  reply: MessageSquare,
  milestone: Award,
  receipt: Receipt,
  admin: Shield,
};

const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}

interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
}

export const NotificationCard: FC<NotificationCardProps> = ({ notification, onClick }) => {
  const Icon = iconMap[notification.type];
  const relativeTime = getRelativeTime(notification.date);

  return (
    <Card 
        as="button"
        onClick={onClick}
        className={cn(
            "transition-all w-full text-left",
            notification.read ? "bg-card opacity-70 hover:opacity-100" : "bg-card shadow-md hover:bg-muted/50"
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="relative">
          <Icon className="h-6 w-6 text-destructive mt-1" />
          {notification.userAvatar && (
            <Avatar className="absolute top-4 left-4 h-6 w-6 border-2 border-background">
              <AvatarImage src={notification.userAvatar} />
              <AvatarFallback>{notification.userName?.[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <p className="text-sm text-foreground pr-4" dangerouslySetInnerHTML={{ __html: notification.text }} />
            {!notification.read && <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-label="Unread"></div>}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{relativeTime}</p>
        </div>
      </CardContent>
    </Card>
  );
};
