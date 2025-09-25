
'use client';

import type { FC } from 'react';
import type { Notification } from '@/lib/mockNotifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Heart, UserPlus, MessageSquare, Award, Receipt, Shield, UserMinus } from 'lucide-react';

const iconMap = {
  like: Heart,
  follow: UserPlus,
  unfollow: UserMinus,
  reply: MessageSquare,
  milestone: Award,
  receipt: Receipt,
  admin: Shield,
};

interface NotificationDetailModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDetailModal: FC<NotificationDetailModalProps> = ({ notification, isOpen, onClose }) => {
  if (!notification) return null;

  const Icon = iconMap[notification.type];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-destructive" />
                </div>
                 {notification.userAvatar && (
                    <Avatar className="absolute -bottom-2 -right-2 h-10 w-10 border-4 border-background">
                        <AvatarImage src={notification.userAvatar} />
                        <AvatarFallback>{notification.userName?.[0]}</AvatarFallback>
                    </Avatar>
                )}
            </div>
          <DialogTitle className="text-xl">Notification Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
            <p 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: notification.text }} 
            />
            <p className="text-xs text-muted-foreground/80 mt-2">
                {new Date(notification.date).toLocaleString()}
            </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
