
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/mockNotifications";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NotificationCardProps {
    notification: Notification;
    onClick: () => void;
}

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

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  return (
    <button
        onClick={onClick}
        className={cn(
            "transition-all w-full text-left rounded-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !notification.read && "bg-primary/5"
        )}
    >
        <Card className="border-transparent shadow-none bg-transparent">
            <CardContent className="p-3 flex items-start gap-3">
                 {notification.userAvatar && (
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={notification.userAvatar} />
                        <AvatarFallback>{notification.userName?.[0]}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1 space-y-1">
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: notification.text }}></p>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(notification.date)}</p>
                </div>
                {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                )}
            </CardContent>
        </Card>
    </button>
  );
}
