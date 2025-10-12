
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, getDocs, serverTimestamp, doc, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/pos';
import { ChatDetailSheet } from './chat-detail-sheet';
import { Loader2 } from 'lucide-react';

interface MessageSheetProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: UserProfile;
}

export function MessageSheet({ isOpen, onClose, recipient }: MessageSheetProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [chatId, setChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        if (!isOpen || !user || !firestore) return;

        // Prevent user from starting a chat with themselves
        if (user.uid === recipient.id) {
            onClose();
            return;
        }

        const findOrCreateChat = async () => {
            setIsLoading(true);
            const participants = [user.uid, recipient.id].sort();
            
            try {
                // Check for existing chat
                const chatsRef = collection(firestore, 'chats');
                const q = query(chatsRef, where('participants', '==', participants));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Chat exists
                    const chatDoc = querySnapshot.docs[0];
                    setChatId(chatDoc.id);
                } else {
                    // Create new chat
                    const newChatData = {
                        participants,
                        lastMessage: 'Chat started',
                        timestamp: serverTimestamp(),
                    };
                    const newChatRef = await addDocumentNonBlocking(collection(firestore, 'chats'), newChatData);

                    if (newChatRef) {
                        setChatId(newChatRef.id);
                        // Update both users' documents with the new chatId
                        const currentUserRef = doc(firestore, 'users', user.uid);
                        const recipientUserRef = doc(firestore, 'users', recipient.id);
                        
                        setDocumentNonBlocking(currentUserRef, { chatIds: arrayUnion(newChatRef.id) }, { merge: true });
                        setDocumentNonBlocking(recipientUserRef, { chatIds: arrayUnion(newChatRef.id) }, { merge: true });

                    } else {
                        throw new Error("Failed to create chat reference.");
                    }
                }
            } catch(error) {
                console.error("Error finding or creating chat:", error);
                toast({ title: "Failed to start chat", variant: "destructive" });
                onClose();
            } finally {
                setIsLoading(false);
                setIsSheetOpen(true);
            }
        };

        findOrCreateChat();

    }, [isOpen, user, firestore, recipient, toast, onClose]);


    const handleSheetClose = () => {
        setIsSheetOpen(false);
        // Delay closing to allow for animation
        setTimeout(() => {
            setChatId(null);
            onClose();
        }, 300);
    }

    if (!isOpen) {
        return null;
    }

    if (isLoading) {
        return (
             <div className="message-sheet-overlay">
                <div className="message-sheet-container items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (chatId) {
        return (
            <ChatDetailSheet
                isOpen={isSheetOpen}
                onClose={handleSheetClose}
                chatId={chatId}
                recipient={recipient}
            />
        )
    }

    return null; // Fallback
}
