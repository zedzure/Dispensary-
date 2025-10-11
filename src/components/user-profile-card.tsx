

"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/types/pos';
import { Camera, Music, Video, Receipt, Wallet, MessageSquare, FileText, Bookmark, Edit, Save, Loader2, UserPlus } from 'lucide-react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import type { ActiveSheet } from '@/app/profile/[userId]/page';
import { useFileUpload } from '@/hooks/useFileUpload';
import { doc } from 'firebase/firestore';
import { Button } from './ui/button';
import { MessageSheet } from './message-sheet';

interface UserProfileCardProps {
  profile: UserProfile;
  setActiveSheet: (sheet: ActiveSheet) => void;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

export function UserProfileCard({ profile, setActiveSheet, onUpdate }: UserProfileCardProps) {
    const { user } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    const { uploadFile, uploading } = useFileUpload();
    const [isMessageActive, setMessageActive] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bio, setBio] = useState(profile.bio || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const actionLinks = [
        { name: 'Photos', icon: Camera, sheet: 'uploads' },
        { name: 'Music', icon: Music, sheet: null },
        { name: 'Video', icon: Video, sheet: null },
        { name: 'Receipts', icon: Receipt, sheet: 'receipts' },
        { name: 'Wallet', icon: Wallet, sheet: null },
        { name: 'Messages', icon: MessageSquare, sheet: 'notes' },
        { name: 'Notes', icon: FileText, sheet: 'notes' },
        { name: 'Saved', icon: Bookmark, sheet: null },
    ];

    const handleFollow = () => {
        if (!user) {
            toast({ title: 'Please log in to follow users.', variant: 'destructive' });
            return;
        }
        toast({ title: `You are now following ${profile.firstName}. (Mock)`});
    };

    const handleActionClick = (sheet: ActiveSheet) => {
        if(sheet) {
            setActiveSheet(sheet);
        } else {
            toast({ title: 'Coming Soon!', description: 'This feature is not yet implemented.' });
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user && db) {
            try {
                const url = await uploadFile(file);
                const userRef = doc(db, 'users', user.uid);
                setDocumentNonBlocking(userRef, { photoURL: url }, { merge: true }); // Use photoURL for consistency with new User type
                onUpdate({ avatarUrl: url });
                toast({ title: 'Avatar updated!' });
            } catch (error: any) {
                toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
            }
        }
    };
    
    const handleSaveBio = () => {
        if (user && db) {
            const userRef = doc(db, 'users', user.uid);
            setDocumentNonBlocking(userRef, { bio }, { merge: true });
            onUpdate({ bio });
            setIsEditingBio(false);
            toast({ title: 'Bio updated!' });
        }
    };
    
    return (
        <>
            <div className="glass-profile-card">
                <div className="glass-profile-card-header">
                    <div className="glass-profile-card-avatar-wrapper group">
                        <Image src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} width={100} height={100} className="glass-profile-card-avatar" data-ai-hint="person face" />
                         {user?.uid === profile.id && (
                            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                {uploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="glass-profile-card-user-info">
                        <h3 className="glass-profile-card-name">{profile.firstName} {profile.lastName}</h3>
                        <div className="glass-profile-card-bio relative">
                           {isEditingBio && user?.uid === profile.id ? (
                                <div className='space-y-2'>
                                <Textarea 
                                        value={bio} 
                                        onChange={(e) => setBio(e.target.value)} 
                                        className="bg-transparent text-white border-primary/50"
                                    />
                                    <div className='flex gap-2 justify-center'>
                                        <Button size="sm" onClick={handleSaveBio}><Save className="h-4 w-4 mr-2"/>Save</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsEditingBio(false)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span dangerouslySetInnerHTML={{ __html: profile.bio || `A cannabis enthusiast from <strong>Earth</strong>` }} />
                                    {user?.uid === profile.id && (
                                        <button onClick={() => setIsEditingBio(true)} className="absolute -top-1 -right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition">
                                            <Edit className="h-3 w-3" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-profile-card-stats">
                    <div className="glass-profile-card-stat">
                        <div className="glass-profile-card-stat-value">{profile.followersCount || 0}</div>
                        <div className="glass-profile-card-stat-label">Followers</div>
                    </div>
                    <div className="glass-profile-card-stat">
                        <div className="glass-profile-card-stat-value">{profile.followingCount || 0}</div>
                        <div className="glass-profile-card-stat-label">Following</div>
                    </div>
                    <div className="glass-profile-card-stat">
                        <div className="glass-profile-card-stat-value">{profile.reviewsToday || 0}</div>
                        <div className="glass-profile-card-stat-label">Reviews</div>
                    </div>
                     <div className="glass-profile-card-stat">
                        <div className="glass-profile-card-stat-value">{profile.receiptsThisWeek || 0}</div>
                        <div className="glass-profile-card-stat-label">Receipts</div>
                    </div>
                </div>

                <div className="glass-profile-card-actions">
                     {actionLinks.map(link => (
                        <button key={link.name} onClick={() => handleActionClick(link.sheet as ActiveSheet)} className="glass-profile-card-action-btn glass">
                           <link.icon />
                        </button>
                    ))}
                </div>

                <div className="glass-profile-card-footer">
                    <button className="glass-profile-card-button message-btn" onClick={() => setMessageActive(true)}>Message</button>
                    <button className="glass-profile-card-button follow-btn" onClick={handleFollow}>Follow</button>
                </div>
            </div>

            <MessageSheet 
                isOpen={isMessageActive} 
                onClose={() => setMessageActive(false)}
                recipient={profile}
            />
        </>
    );
}
