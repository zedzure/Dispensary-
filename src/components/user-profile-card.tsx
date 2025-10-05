

"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/types/pos';
import { Camera, Music, Video, Receipt, Wallet, MessageSquare, FileText, Bookmark, Edit, Save, Loader2 } from 'lucide-react';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import type { ActiveSheet } from '@/app/profile/page';
import { useFileUpload } from '@/hooks/useFileUpload';
import { doc } from 'firebase/firestore';
import { Button } from './ui/button';

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
    const [message, setMessage] = useState('');
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

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast({ title: "Message can't be empty", variant: "destructive" });
            return;
        }
        toast({ title: "Message Sent (Mock)", description: `To ${profile.firstName}: ${message}` });
        setMessage('');
        setMessageActive(false);
    }

    const handleActionClick = (sheet: ActiveSheet) => {
        if(sheet) {
            setActiveSheet(sheet);
        } else {
            toast({ title: 'Coming Soon!', description: 'This feature is not yet implemented.' });
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            try {
                const { url } = await uploadFile(file);
                const userRef = doc(db, 'users', user.uid);
                setDocumentNonBlocking(userRef, { avatarUrl: url }, { merge: true });
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
        <div className="wrapper">
            <div className={cn("profile-card js-profile-card", isMessageActive && "active")}>
                <div className="profile-card__img group">
                    <Image src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} width={150} height={150} data-ai-hint="person face" />
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

                <div className="profile-card__cnt js-profile-cnt">
                    <div className="profile-card__name">{profile.firstName} {profile.lastName}</div>
                    
                    <div className="profile-card__txt relative">
                        {isEditingBio && user?.uid === profile.id ? (
                            <div className='space-y-2'>
                               <Textarea 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)} 
                                    className="bg-transparent text-foreground border-primary/50"
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
                                    <button onClick={() => setIsEditingBio(true)} className="absolute -top-2 -right-2 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className="profile-card-inf">
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.followersCount || 0}</div>
                            <div className="profile-card-inf__txt">Followers</div>
                        </div>
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.followingCount || 0}</div>
                            <div className="profile-card-inf__txt">Following</div>
                        </div>
                         <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.reviewsToday || 0}</div>
                            <div className="profile-card-inf__txt">Reviews</div>
                        </div>
                         <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.receiptsThisWeek || 0}</div>
                            <div className="profile-card-inf__txt">Receipts</div>
                        </div>
                    </div>

                    <div className="profile-card-social">
                         {actionLinks.map(link => (
                            <button key={link.name} onClick={() => handleActionClick(link.sheet as ActiveSheet)} className={`profile-card-social__item ${link.name.toLowerCase()}`}>
                                <span className="icon-font">
                                    <link.icon />
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="profile-card-ctr">
                        <button className="profile-card__button button--blue js-message-btn" onClick={() => setMessageActive(true)}>Message</button>
                        <button className="profile-card__button button--orange" onClick={handleFollow}>Follow</button>
                    </div>
                </div>

                <div className={cn("profile-card-message js-message", isMessageActive && "active")}>
                    <form className="profile-card-form" onSubmit={handleSendMessage}>
                        <div className="profile-card-form__container">
                            <Textarea 
                                placeholder="Say something..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="profile-card-form__bottom">
                            <button type="submit" className="profile-card__button button--blue js-message-close">
                                Send
                            </button>
                            <button type="button" className="profile-card__button button--gray js-message-close" onClick={() => setMessageActive(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                    <div className="profile-card__overlay js-message-close" onClick={() => setMessageActive(false)}></div>
                </div>
            </div>
        </div>
    );
}
