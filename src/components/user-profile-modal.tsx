
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserProfileCard } from "./user-profile-card";
import type { ChatUser } from "@/types/pos";
import { useEffect, useState } from "react";
import { mockCustomers } from "@/lib/mockCustomers";
import type { UserProfile } from "@/types/pos";
import type { ActiveSheet } from "@/app/profile/page";

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
  }, [user, isOpen]);

  const handleSetActiveSheet = (sheet: ActiveSheet) => {
    // This modal is read-only, so we don't need to do anything here.
    // This function is required by UserProfileCard's props.
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    // This modal is read-only, so we don't need to do anything here.
    // This function is required by UserProfileCard's props.
  };

  if (!profile || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-0 shadow-none w-full max-w-lg">
        <UserProfileCard
          profile={profile}
          setActiveSheet={handleSetActiveSheet}
          onUpdate={handleProfileUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}
