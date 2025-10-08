
"use client";

import { useState, useEffect, useRef, useCallback, UIEvent } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Send,
  Heart,
  UserPlus,
  Paperclip,
  MessageSquareReply,
  X,
  Bold,
  Italic,
  Underline,
  Smile,
  Camera,
  Image as ImageIcon,
  Link,
  Mic,
  Hash,
  AtSign,
} from "lucide-react";
import type { Dispensary, ChatUser, ChatMessage } from "@/types/pos";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { realImageUrls } from "@/lib/products";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserProfileModal } from "../user-profile-modal";
import { useViewportHeight } from "@/hooks/use-viewport-height";

const MAX_MESSAGE_LENGTH = 280;
const MESSAGES_PER_PAGE = 25;

const mockUsers: ChatUser[] = Array.from({ length: 15 }, (_, i) => ({
  id: `user-${i}`,
  name: [
    "Cannabis Connoisseur",
    "Sativa_Steve",
    "Indica_Ivy",
    "Terpene_Terry",
    "VapeQueen",
    "Bud_Buddy",
    "GroovyGrandma",
    "PuffDaddy",
    "KushKween",
    "420Explorer",
    "GanjaGuru",
    "Highlander",
    "MaryJaneFan",
    "DankDave",
    "BlazeMaster",
  ][i % 15],
  avatar: realImageUrls[i % realImageUrls.length],
  isOnline: Math.random() > 0.5,
}));

const initialMockMessages = Array.from({ length: 100 }, (_, i) => {
  const user = mockUsers[i % mockUsers.length];
  const time = new Date(Date.now() - (100 - i) * 5 * 60000); // 5 minutes apart
  return {
    id: `msg-${i}`,
    user,
    text: `This is mock message #${i + 1}. What does everyone think of the new OG Kush batch? #review @Sativa_Steve`,
    timestamp: time.toISOString(),
    likes: Math.floor(Math.random() * 25),
    isLiked: Math.random() > 0.8,
    image: i % 10 === 0 ? realImageUrls[(i + 5) % realImageUrls.length] : undefined,
  };
});

const formatTimestamp = (isoString: string) => {
  const now = new Date();
  const then = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return then.toLocaleDateString();
};

const parseMessage = (text: string) => {
  const parts = text.split(/([@#]\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <strong key={index} className="text-primary cursor-pointer">
          {part}
        </strong>
      );
    }
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-blue-500 cursor-pointer">
          {part}
        </span>
      );
    }
    return part;
  });
};

function MessageItem({ msg, onLike, onReply, onAvatarClick }: { msg: ChatMessage; onLike: () => void; onReply: () => void; onAvatarClick: (user: ChatUser) => void; }) {
    const { user: currentUser } = useUser();
    const isCurrentUser = msg.user.id === currentUser?.uid;

  return (
    <div className="w-full">
        <div className="p-3 rounded-2xl liquid-glass-static bg-blue-900/10">
            <div className="flex items-start gap-3">
                 <button onClick={() => onAvatarClick(msg.user)} className="relative">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={msg.user.avatar} />
                        <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {msg.user.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                </button>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-sm">{msg.user.name}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</p>
                    </div>

                    {msg.replyingTo && (
                        <div className="text-xs text-muted-foreground pl-2 border-l-2 border-border ml-1 mt-1 mb-1">
                            Replying to <strong className="text-primary/90">@{msg.replyingTo.user}</strong>: {msg.replyingTo.text.substring(0, 50)}...
                        </div>
                    )}
                    
                    <p className="text-sm text-foreground/90">{parseMessage(msg.text)}</p>
                </div>
            </div>

            {msg.image && (
                <div className="relative w-full max-w-xs h-48 mt-2 rounded-lg overflow-hidden border ml-13">
                    <Image src={msg.image} alt="Chat image" fill className="object-cover" />
                </div>
            )}

            <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs ml-13">
                <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1" onClick={onLike} aria-label="Like message">
                    <Heart className={cn("h-4 w-4", msg.isLiked && "fill-red-500 text-red-500")} /> {msg.likes}
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1" onClick={onReply} aria-label="Reply to message">
                    <MessageSquareReply className="h-4 w-4" /> Reply
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1">
                    <UserPlus className="h-4 w-4" /> Follow
                </Button>
            </div>
        </div>
    </div>
  );
}

function MessageList({ messages, hasMore, loadMore, onLike, onReply, onAvatarClick }: { messages: ChatMessage[]; hasMore: boolean; loadMore: () => void; onLike: (id: string) => void; onReply: (msg: ChatMessage) => void; onAvatarClick: (user: ChatUser) => void; }) {
  return (
    <div className="p-4 space-y-4">
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={loadMore}>Load More</Button>
        </div>
      )}
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} onLike={() => onLike(msg.id)} onReply={() => onReply(msg)} onAvatarClick={onAvatarClick} />
      ))}
    </div>
  );
}

interface DispensarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispensary: Dispensary;
}

export function DispensaryChatSheet({ isOpen, onOpenChange, dispensary }: DispensarySheetProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ChatUser | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const vh = useViewportHeight();

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleAvatarClick = (user: ChatUser) => {
    setSelectedProfile(user);
    setProfileModalOpen(true);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sheet");
    router.push(pathname + "?" + params.toString());
  };
  
  // Scroll lock effect
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const handleFocus = () => {
      document.body.style.overflow = 'hidden';
    };
    const handleBlur = () => {
       document.body.style.overflow = '';
    };

    textarea.addEventListener('focus', handleFocus);
    textarea.addEventListener('blur', handleBlur);

    return () => {
      textarea.removeEventListener('focus', handleFocus);
      textarea.removeEventListener('blur', handleBlur);
      handleBlur(); // Ensure style is removed on component unmount
    }
  }, [isOpen]); // Re-attach listeners if the sheet re-opens

  useEffect(() => {
    if (isOpen) {
      setMessages(initialMockMessages.slice(0, MESSAGES_PER_PAGE).reverse());
      setPage(1);
      setHasMore(initialMockMessages.length > MESSAGES_PER_PAGE);
      setAutoScroll(true);
    }
  }, [isOpen]);

  const loadMoreMessages = useCallback(() => {
    setAutoScroll(false);
    const nextPage = page + 1;
    const newMessages = initialMockMessages.slice(0, nextPage * MESSAGES_PER_PAGE);
    setMessages(newMessages.reverse());
    setPage(nextPage);
    if (newMessages.length >= initialMockMessages.length) setHasMore(false);
  }, [page]);
  
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const atBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    setAutoScroll(atBottom);
  };
  
  useEffect(() => {
    if (autoScroll && scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);


  useEffect(() => {
    if (!isTyping) return;
    const typingTimer = setTimeout(() => setIsTyping(false), 2000);
    return () => clearTimeout(typingTimer);
  }, [isTyping, newMessage]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !user) return;
    const messageToSend: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: { id: user.uid, name: user.displayName || 'Anonymous', avatar: user.photoURL || "", isOnline: true },
      text: newMessage,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replyingTo: replyingTo ? { user: replyingTo.user.name, text: replyingTo.text } : undefined,
    };
    setMessages((prev) => [...prev, messageToSend]);
    setNewMessage("");
    setReplyingTo(null);
    setAutoScroll(true);
  }, [newMessage, replyingTo, user]);

  const handleLike = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((msg) => msg.id === id ? { ...msg, isLiked: !msg.isLiked, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1 } : msg)
    );
  }, []);

  const handleReply = useCallback((msg: ChatMessage) => {
    setReplyingTo(msg);
    if (textAreaRef.current) {
        textAreaRef.current.focus();
    }
    setNewMessage(`@${msg.user.name} `);
  }, []);

  const charsLeft = MAX_MESSAGE_LENGTH - newMessage.length;
  
  const editingIcons = [Bold, Italic, Underline, Smile, Camera, ImageIcon, Link, Mic, Hash, AtSign];

  return (
    <>
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent 
        side="left" 
        className="w-full md:max-w-md p-0 flex flex-col bg-background backdrop-blur-xl border-border/20"
        style={{ height: vh ? `${vh}px` : '100dvh' }}
       >
        <SheetHeader className="p-4 border-b border-border/20 flex flex-row items-center gap-4 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={handleClose}><ArrowLeft /></Button>
          <div>
            <SheetTitle>Live Group Chat</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 min-h-0" onScroll={handleScroll} ref={scrollViewportRef}>
            <MessageList messages={messages} hasMore={hasMore} loadMore={loadMoreMessages} onLike={handleLike} onReply={handleReply} onAvatarClick={handleAvatarClick} />
        </ScrollArea>
    
        {isTyping && <p className="text-xs text-muted-foreground px-4 py-1 italic flex-shrink-0">A user is typing...</p>}

        <div className="p-2 border-t border-border/20 bg-transparent flex-shrink-0">
        {user ? (
            <div className="chat-input-container">
            <Avatar className="chat-input-avatar">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="chat-input-main">
                {replyingTo && (
                <div className="text-xs p-2 bg-muted/50 rounded-md flex justify-between items-center">
                    <p className="text-muted-foreground truncate">
                    Replying to <strong className="text-primary/90">@{replyingTo.user.name}</strong>
                    </p>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setReplyingTo(null)}>
                    <X className="h-3 w-3" />
                    </Button>
                </div>
                )}
                <Textarea 
                    ref={textAreaRef}
                    placeholder="Type your message..." 
                    className="chat-input-textarea bg-muted/30"
                    value={newMessage}
                    maxLength={MAX_MESSAGE_LENGTH}
                    onChange={(e) => { setNewMessage(e.target.value); setIsTyping(true); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />
                <div className="chat-input-actions">
                <div className="flex items-center gap-1">
                    {editingIcons.map((Icon, i) => (
                        <Button key={i} variant="ghost" size="icon" className="h-8 w-8">
                            <Icon className="text-muted-foreground w-4 h-4" />
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs", charsLeft < 20 ? "text-destructive" : "text-muted-foreground")}>{charsLeft}</span>
                    <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" /> Send
                    </Button>
                </div>
                </div>
            </div>
            </div>
        ) : (
            <p className="text-sm text-center text-muted-foreground">Please log in to participate in the chat.</p>
        )}
        </div>
      </SheetContent>
    </Sheet>
    <UserProfileModal
        user={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
    />
    </>
  );
}
