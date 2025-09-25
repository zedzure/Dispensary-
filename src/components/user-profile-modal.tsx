
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserProfileCard } from "./user-profile-card";
import type { ChatUser } from "@/types/pos";
import { useEffect, useState } from "react";
import { mockCustomers } from "@/lib/mockCustomers";
import type { UserProfile } from "@/types/pos";

interface UserProfileModalProps {
  user: ChatUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      const foundUser = mockCustomers.find(c => c.id === user.id || c.email.split('@')[0].toLowerCase() === user.name.toLowerCase());
      
      if (foundUser) {
        setProfile(foundUser);
      } else {
        // Fallback for users not in mockCustomers
        const fallbackProfile: UserProfile = {
            id: user.id,
            firstName: user.name,
            lastName: '', // Important to have a default
            email: `${user.name.toLowerCase()}@example.com`,
            memberSince: new Date().toISOString(),
            avatarUrl: user.avatar,
        };
        setProfile(fallbackProfile);
      }
    }
  }, [user, isOpen, onClose]);

  if (!profile || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-0 shadow-none w-full max-w-lg">
        <UserProfileCard profile={profile} />
      </DialogContent>
    </Dialog>
  );
}
