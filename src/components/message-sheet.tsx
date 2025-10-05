
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Send, Plus, Camera, Mic, Sticker } from 'lucide-react';
import type { UserProfile } from '@/types/pos';
import Image from 'next/image';

interface MessageSheetProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: UserProfile;
}

export function MessageSheet({ isOpen, onClose, recipient }: MessageSheetProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        toast({
            title: 'Message Sent (Mock)',
            description: `To ${recipient.firstName}: ${message}`,
        });

        setMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="message-sheet-overlay" onClick={onClose}>
            <div className="message-sheet-container" onClick={(e) => e.stopPropagation()}>
                <div className="message-sheet-header">
                    <button className="message-sheet-close" onClick={onClose}>
                        &times;
                    </button>
                    <div className="message-sheet-recipient">
                        <Image src={recipient.avatarUrl} alt={recipient.firstName} width={40} height={40} className="rounded-full" />
                        <span className="font-semibold">{recipient.firstName} {recipient.lastName}</span>
                    </div>
                </div>

                <div className="message-sheet-content">
                    {/* Chat history would go here */}
                    <div className="flex-grow" />
                </div>
                
                <form className="message-sheet-input-area" onSubmit={handleSendMessage}>
                    <div className="message-input-wrapper">
                        <button type="button" className="message-input-action-button">
                           <Plus />
                        </button>

                        <div className="message-input-field-wrapper">
                            <input 
                                type="text" 
                                placeholder="Message..." 
                                className="message-input-field"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                autoFocus
                            />
                            <button type="button" className="message-input-sticker-button">
                                <Sticker />
                            </button>
                        </div>
                        
                        {message ? (
                            <button type="submit" className="message-input-send-button">
                                <Send />
                            </button>
                        ) : (
                            <>
                                <button type="button" className="message-input-action-button">
                                    <Camera />
                                </button>
                                <button type="button" className="message-input-action-button">
                                    <Mic />
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
