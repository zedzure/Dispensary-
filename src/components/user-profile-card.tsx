
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/types/pos';
import { Github, Twitter, Facebook, Instagram, Codepen, Link as LinkIcon, MapPin, Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface UserProfileCardProps {
  profile: UserProfile;
}

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/firebase/genkit' },
    { name: 'Codepen', icon: Codepen, href: '#' },
    { name: 'Website', icon: LinkIcon, href: '#' },
];

export function UserProfileCard({ profile }: UserProfileCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isMessageActive, setMessageActive] = useState(false);
    const [message, setMessage] = useState('');

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

    return (
        <div className="profile-card-wrapper">
            <div className={cn("profile-card", isMessageActive && "active")}>
                <div className="profile-card__img">
                    <Image src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} width={150} height={150} data-ai-hint="person face" />
                </div>

                <div className="profile-card__cnt">
                    <div className="profile-card__name">{profile.firstName} {profile.lastName}</div>
                    <div className="profile-card__txt" dangerouslySetInnerHTML={{ __html: profile.bio || `A cannabis enthusiast from <strong>Earth</strong>` }} />
                    <div className="profile-card-loc">
                        <span className="profile-card-loc__icon"><MapPin /></span>
                        <span className="profile-card-loc__txt">Planet Earth</span>
                    </div>

                    <div className="profile-card-inf">
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title">{profile.followers?.length || 0}</div>
                            <div className="profile-card-inf__txt">Followers</div>
                        </div>
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title">{profile.following?.length || 0}</div>
                            <div className="profile-card-inf__txt">Following</div>
                        </div>
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title">{profile.reviewsToday || 0}</div>
                            <div className="profile-card-inf__txt">Reviews</div>
                        </div>
                        <div className="profile-card-inf__item">
                            <div className="profile-card-inf__title">{profile.points || 0}</div>
                            <div className="profile-card-inf__txt">Points</div>
                        </div>
                    </div>

                    <div className="profile-card-social">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} className={`profile-card-social__item ${link.name.toLowerCase()}`} target="_blank" rel="noreferrer">
                                <span className="icon-font"><link.icon /></span>
                            </a>
                        ))}
                    </div>

                    <div className="profile-card-ctr">
                        <button className="profile-card__button button--blue" onClick={() => setMessageActive(true)}>Message</button>
                        <button className="profile-card__button button--orange" onClick={handleFollow}>Follow</button>
                    </div>
                </div>

                 <div 
                    className={cn("profile-card-message", isMessageActive && "active")}
                    aria-hidden={!isMessageActive}
                 >
                    <form className="profile-card-form" onSubmit={handleSendMessage}>
                        <div className="profile-card-form__container">
                            <Textarea 
                                placeholder="Say something..." 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="profile-card-form__bottom">
                           <Button type="submit" className="profile-card__button button--blue">
                                <Send className="mr-2 h-4 w-4" /> Send
                            </Button>
                            <Button type="button" className="profile-card__button button--gray" onClick={() => setMessageActive(false)}>Cancel</Button>
                        </div>
                    </form>
                    <div className="profile-card__overlay" onClick={() => setMessageActive(false)}></div>
                </div>
            </div>
        </div>
    );
}
