"use client";

import { useState, useEffect, useRef, useCallback, UIEvent } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import type { UserProfile, ChatMessage as ChatMessageType } from "@/types/pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { cn } from "@/lib/utils";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { useMobileViewportFix } from '@/hooks/use-mobile-viewport-fix';
import { collection, query, orderBy, limit, serverTimestamp, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

function MessageItem({ msg, sender, isCurrentUser }: { msg: ChatMessageType; sender: UserProfile | null; isCurrentUser: boolean }) {
    if (!sender && !isCurrentUser) return null;
    
    return (
        <div className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
            {!isCurrentUser && sender && (
                 <Avatar className="h-8 w-8 border">
                    <AvatarImage src={sender.avatarUrl} />
                    <AvatarFallback>{sender.firstName[0]}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2 liquid-glass",
                isCurrentUser 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "rounded-bl-none border-border/20"
            )}>
                <p className="text-sm">{msg.message}</p>
                 <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>{formatTimestamp(msg.timestamp)}</p>
            </div>
        </div>
    );
}

interface ChatDetailSheetProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: string;
    recipient: UserProfile;
}

export function ChatDetailSheet({ isOpen, onClose, chatId, recipient }: ChatDetailSheetProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const vh = useViewportHeight();
  useMobileViewportFix();

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(
    () => firestore && chatId
        ? query(collection(firestore, "chats", chatId, "messages"), orderBy("timestamp", "asc"))
        : null,
    [firestore, chatId]
  );
  
  const { data: messages, isLoading } = useCollection<ChatMessageType>(messagesQuery);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    if (!currentUser || !firestore || !chatId) return;

    setIsSubmitting(true);

    try {
        const messagesCol = collection(firestore, 'chats', chatId, 'messages');
        const messageToSend: Omit<ChatMessageType, 'id' | 'user' > = {
          senderID: currentUser.uid,
          message: newMessage,
          timestamp: serverTimestamp(),
          type: 'text', // Assuming text type
          replies: [],
          reposts: [],
        };
        await addDocumentNonBlocking(messagesCol, messageToSend);
        
        const chatRef = doc(firestore, 'chats', chatId);
        setDocumentNonBlocking(chatRef, {
            lastMessage: newMessage,
            timestamp: serverTimestamp()
        }, { merge: true });

        setNewMessage("");

    } catch(e) {
        console.error("Failed to send message:", e);
        toast({ title: 'Error Sending Message', description: 'Could not send message. Please try again.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }, [newMessage, currentUser, firestore, chatId, toast]);
  

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="w-full h-full p-0 flex flex-col bg-background"
        style={{ height: vh ? `${vh}px` : '100dvh' }}
       >
        <SheetHeader className="p-4 flex-row items-center gap-4 flex-shrink-0 bg-background border-b z-10">
          <Button variant="ghost" size="icon" onClick={onClose}><ArrowLeft /></Button>
          <Avatar className="h-10 w-10 border">
              <AvatarImage src={recipient.avatarUrl} />
              <AvatarFallback>{recipient.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle>{recipient.firstName} {recipient.lastName}</SheetTitle>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 min-h-0 bg-muted/20" ref={scrollViewportRef}>
            <div className="p-4 space-y-4 pb-[7rem]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
                ) : (
                    messages?.map(msg => (
                        <MessageItem 
                            key={msg.id} 
                            msg={msg as any}
                            sender={msg.senderID === currentUser?.uid ? null : recipient}
                            isCurrentUser={msg.senderID === currentUser?.uid}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
    
        <div className="chat-input-bar">
            <div className="chat-input-container">
                <Textarea 
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                    className="chat-input-textarea"
                    rows={1}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isSubmitting || !newMessage.trim()} className="rounded-full h-10 w-10">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
