
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/types/pos';
import { Camera, Music, Video, Receipt, Wallet, MessageSquare, FileText, Bookmark } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import type { ActiveSheet } from '@/app/profile/page';

interface UserProfileCardProps {
  profile: UserProfile;
  setActiveSheet: (sheet: ActiveSheet) => void;
}

export function UserProfileCard({ profile, setActiveSheet }: UserProfileCardProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isMessageActive, setMessageActive] = useState(false);
    const [message, setMessage] = useState('');

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
    
    return (
        <div className="wrapper">
            <div className={cn("profile-card js-profile-card", isMessageActive && "active")}>
                <div className="profile-card__img">
                    <Image src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} width={150} height={150} data-ai-hint="person face" />
                </div>

                <div className="profile-card__cnt js-profile-cnt">
                    <div className="profile-card__name">{profile.firstName} {profile.lastName}</div>
                    <div className="profile-card__txt" dangerouslySetInnerHTML={{ __html: profile.bio || `A cannabis enthusiast from <strong>Earth</strong>` }} />
                    
                    <div className="profile-card-inf">
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.followersCount || 0}</div>
                            <div className="profile-card-inf__txt text-primary">Followers</div>
                        </div>
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.followingCount || 0}</div>
                            <div className="profile-card-inf__txt text-primary">Following</div>
                        </div>
                         <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.reviewsToday || 0}</div>
                            <div className="profile-card-inf__txt text-primary">Reviews</div>
                        </div>
                         <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title text-primary">{profile.receiptsThisWeek || 0}</div>
                            <div className="profile-card-inf__txt text-primary">Receipts</div>
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
