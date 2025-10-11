
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
  MessageSquareReply,
  X,
  Bold,
  Italic,
  Underline,
  Smile,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  Mic,
  Hash,
  AtSign,
  Plus,
  Trash2,
} from "lucide-react";
import type { Dispensary, ChatUser, ChatMessage as ChatMessageType } from "@/types/pos";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserProfileModal } from "../user-profile-modal";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, limit, serverTimestamp, doc } from "firebase/firestore";

const MAX_MESSAGE_LENGTH = 280;

const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
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

function MessageItem({ msg, onLike, onReply, onAvatarClick, onDelete }: { msg: ChatMessageType; onLike: () => void; onReply: () => void; onAvatarClick: (user: ChatUser) => void; onDelete: () => void; }) {
    const { user: currentUser } = useUser();
    const isCurrentUser = msg.user.id === currentUser?.uid;

  return (
    <div className="w-full group">
        <div className="p-3 rounded-2xl liquid-glass">
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
                {isCurrentUser && (
                   <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={onDelete} aria-label="Delete message">
                        <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}

function MessageList({ messages, onLike, onReply, onAvatarClick, onDelete }: { messages: ChatMessageType[]; onLike: (id: string) => void; onReply: (msg: ChatMessageType) => void; onAvatarClick: (user: ChatUser) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="p-4 space-y-4">
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} onLike={() => onLike(msg.id)} onReply={() => onReply(msg)} onAvatarClick={onAvatarClick} onDelete={() => onDelete(msg.id)} />
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
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessageType | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ChatUser | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const vh = useViewportHeight();

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const messagesQuery = useMemoFirebase(
    () =>
      firestore && dispensary
        ? query(collection(firestore, "dispensaries", dispensary.id, "messages"), orderBy("timestamp", "desc"), limit(50))
        : null,
    [firestore, dispensary]
  );
  
  const { data: messagesData, isLoading } = useCollection<ChatMessageType>(messagesQuery);
  const messages = useMemo(() => messagesData?.slice().reverse() || [], [messagesData]);


  const handleAvatarClick = (user: ChatUser) => {
    setSelectedProfile(user);
    setProfileModalOpen(true);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sheet");
    router.push(pathname + "?" + params.toString());
  };
  
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


  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !user || !firestore || !dispensary) return;
    const messagesCol = collection(firestore, 'dispensaries', dispensary.id, 'messages');

    const messageToSend: Omit<ChatMessageType, 'id'> = {
      user: { id: user.uid, name: user.displayName || 'Anonymous', avatar: user.photoURL || "", isOnline: true },
      text: newMessage,
      timestamp: serverTimestamp() as any,
      likes: 0,
      isLiked: false,
      replyingTo: replyingTo ? { user: replyingTo.user.name, text: replyingTo.text } : undefined,
    };
    addDocumentNonBlocking(messagesCol, messageToSend);
    
    setNewMessage("");
    if (inputRef.current) inputRef.current.innerHTML = '';
    setReplyingTo(null);
    setAutoScroll(true);
  }, [newMessage, replyingTo, user, firestore, dispensary]);

  const handleLike = useCallback((id: string) => {
    // In a real app, this would update Firestore.
    console.log("Liking message:", id);
  }, []);

  const handleDelete = useCallback((id: string) => {
      if (!firestore || !dispensary) return;
      const messageRef = doc(firestore, 'dispensaries', dispensary.id, 'messages', id);
      deleteDocumentNonBlocking(messageRef);
  }, [firestore, dispensary]);

  const handleReply = useCallback((msg: ChatMessageType) => {
    setReplyingTo(msg);
    if (inputRef.current) {
        inputRef.current.focus();
    }
    setNewMessage(`@${msg.user.name} `);
  }, []);

  const charsLeft = MAX_MESSAGE_LENGTH - newMessage.length;
  
  const editingIcons = [
    { icon: Bold, name: 'Bold' },
    { icon: Italic, name: 'Italic' },
    { icon: Underline, name: 'Underline' },
    { icon: Smile, name: 'Emoji' },
    { icon: Camera, name: 'Camera' },
    { icon: ImageIcon, name: 'Image' },
    { icon: LinkIcon, name: 'Link' },
    { icon: Mic, name: 'Mic' },
    { icon: Hash, name: 'Tag' },
    { icon: AtSign, name: 'Mention' },
  ];

  return (
    <>
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent 
        side="left" 
        className="w-full md:max-w-md p-0 flex flex-col bg-background/80 backdrop-blur-xl"
        style={{ height: vh ? `${vh}px` : '100dvh' }}
       >
        <SheetHeader className="p-4 flex-row items-center gap-4 flex-shrink-0 bg-transparent border-b-0">
          <Button variant="ghost" size="icon" onClick={handleClose}><ArrowLeft /></Button>
          <div>
            <SheetTitle>Live Group Chat</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 min-h-0" onScroll={handleScroll} ref={scrollViewportRef}>
            {isLoading && <div className="text-center p-4 text-muted-foreground">Loading messages...</div>}
            {!isLoading && messages.length > 0 && <MessageList messages={messages} onLike={handleLike} onReply={handleReply} onAvatarClick={handleAvatarClick} onDelete={handleDelete} />}
            {!isLoading && messages.length === 0 && <div className="text-center p-8 text-muted-foreground">Be the first to say something!</div>}
        </ScrollArea>
    
        <div className="relative p-2 pt-0">
            {user ? (
            <div className="relative">
                <AnimatePresence>
                    {isToolsOpen && (
                        <motion.div 
                            className="absolute bottom-full left-0 right-0 p-4 bg-muted/80 backdrop-blur-sm rounded-t-2xl mb-2"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                            <div className="grid grid-cols-5 gap-4">
                                {editingIcons.map(({ icon: Icon, name }) => (
                                    <div key={name} className="flex flex-col items-center">
                                        <button className="h-14 w-14 liquid-glass rounded-full flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-blue-500" />
                                        </button>
                                        <span className="text-xs mt-2 text-muted-foreground">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 {replyingTo && (
                    <div className="text-xs p-2 bg-muted/50 rounded-t-md flex justify-between items-center mx-2">
                        <p className="text-muted-foreground truncate">
                        Replying to <strong className="text-primary/90">@{replyingTo.user.name}</strong>
                        </p>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setReplyingTo(null)}>
                        <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
                
                <div className="flex items-center gap-2 bg-muted/80 backdrop-blur-sm rounded-full p-1.5 border border-border/20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 rounded-full bg-background/50 hover:bg-background"
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                    >
                        <Plus className={cn("h-5 w-5 transition-transform", isToolsOpen && "rotate-45")} />
                    </Button>
                    <div 
                        ref={inputRef}
                        contentEditable
                        onInput={(e) => {
                            const target = e.currentTarget as HTMLDivElement;
                            setNewMessage(target.innerText);
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        className="w-full bg-transparent outline-none text-sm px-2 flex-grow min-h-[2.25rem] flex items-center"
                        data-placeholder="Type your message..."
                    />
                    {newMessage.trim() && (
                        <Button size="icon" className="h-9 w-9 rounded-full flex-shrink-0" onClick={handleSendMessage} >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            ) : (
                <p className="text-sm text-center text-muted-foreground p-4">Please log in to participate in the chat.</p>
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
