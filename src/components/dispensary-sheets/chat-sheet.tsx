
"use client";

import { useState, useEffect, useRef, useCallback, UIEvent, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import type { Dispensary, ChatUser, ChatMessage as ChatMessageType, UserProfile } from "@/types/pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserProfileModal } from "../user-profile-modal";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { useMobileViewportFix } from '@/hooks/use-mobile-viewport-fix';
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, limit, serverTimestamp, doc } from "firebase/firestore";
import { uploadImage } from "@/lib/image-upload";
import { useToast } from "@/hooks/use-toast";
import { mockCustomers } from "@/lib/mockCustomers";
import { Textarea } from "@/components/ui/textarea";


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
  // Use a safer method to render HTML content
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

function MessageItem({ msg, onLike, onReply, onAvatarClick, onDelete }: { msg: ChatMessageType; onLike: () => void; onReply: () => void; onAvatarClick: (user: ChatUser) => void; onDelete: () => void; }) {
    const { user: currentUser } = useUser();
    const isCurrentUser = msg.user.id === currentUser?.uid;

  return (
    <div className="w-full group flex items-start gap-3">
        <button onClick={() => onAvatarClick(msg.user)} className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={msg.user.avatar} />
                <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {msg.user.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
        </button>

        <div className="flex-1">
            <div className="flex items-baseline gap-2">
                <button onClick={() => onAvatarClick(msg.user)} className="font-semibold text-sm hover:underline">{msg.user.name}</button>
                <p className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</p>
            </div>

            <div className={cn("p-3 rounded-2xl rounded-tl-none mt-1 liquid-glass border-border/20", isCurrentUser && "bg-primary text-primary-foreground")}>
                {msg.replyingTo && (
                    <div className="text-xs text-muted-foreground mb-1">
                        Replying to <strong className="text-primary/90">@{msg.replyingTo.user}</strong>
                    </div>
                )}
                
                <div className="text-sm text-foreground/90 break-words">{parseMessage(msg.text)}</div>

                {msg.imageUrl && (
                    <div className="relative w-full max-w-xs h-48 mt-2 rounded-lg overflow-hidden border">
                        <Image src={msg.imageUrl} alt="Chat image" fill className="object-cover" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs pl-2">
                <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1 hover:text-red-500" onClick={onLike} aria-label="Like message">
                    <Heart className={cn("h-4 w-4", msg.isLiked && "fill-red-500 text-red-500")} /> {msg.likes}
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1 hover:text-primary" onClick={onReply} aria-label="Reply to message">
                    <MessageSquareReply className="h-4 w-4" /> Reply
                </Button>
                {isCurrentUser && (
                   <Button variant="ghost" size="sm" className="p-1 h-auto flex items-center gap-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={onDelete} aria-label="Delete message">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
}

function MessageList({ messages, onLike, onReply, onAvatarClick, onDelete }: { messages: ChatMessageType[]; onLike: (id: string) => void; onReply: (msg: ChatMessageType) => void; onAvatarClick: (user: ChatUser) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="p-4 space-y-6">
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const vh = useViewportHeight();
  useMobileViewportFix();

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const messagesQuery = useMemoFirebase(
    () =>
      firestore && dispensary && user
        ? query(collection(firestore, "dispensaries", dispensary.id, "messages"), orderBy("timestamp", "desc"), limit(50))
        : null,
    [firestore, dispensary, user]
  );
  
  const { data: messagesData, isLoading } = useCollection<ChatMessageType>(messagesQuery);
  const messages = useMemo(() => messagesData?.slice().reverse() || [], [messagesData]);
  const mockMessages = [
    "Just picked up some Blue Dream, it's amazing! 🌿",
    "Has anyone tried the new edibles? I'm curious about the flavor.",
    "The staff here are so friendly and knowledgeable.",
    "What's the best indica for sleep, in your opinion?",
    "I love the loyalty program here, the points add up fast!",
    "This is my favorite dispensary in town, hands down.",
    "Are there any deals on pre-rolls today?",
    "That OG Kush is top-notch. Highly recommend!",
  ];


    useEffect(() => {
        if (!isOpen || !firestore || !dispensary) return;

        const intervalId = setInterval(() => {
            if (Math.random() < 0.2) { // 20% chance to post every 5 seconds
                const randomUser = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
                const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];

                const messageToSend: Omit<ChatMessageType, 'id'> = {
                    user: { id: randomUser.id, name: `${randomUser.firstName} ${randomUser.lastName}`, avatar: randomUser.avatarUrl || "", isOnline: true },
                    text: randomMessage,
                    timestamp: serverTimestamp() as any,
                    likes: 0,
                    isLiked: false,
                };
                 addDocumentNonBlocking(collection(firestore, 'dispensaries', dispensary.id, 'messages'), messageToSend);
            }
        }, 5000); // 5 seconds

        return () => clearInterval(intervalId);
    }, [isOpen, firestore, dispensary, mockMessages]);


  const handleAvatarClick = (user: ChatUser) => {
    setSelectedProfile(user);
    setProfileModalOpen(true);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sheet");
    router.push(pathname + "?" + params.toString(), { scroll: false });
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
  }, [messages, autoScroll, imagePreview]);

  const resetForm = () => {
    setNewMessage("");
    setReplyingTo(null);
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    setAutoScroll(true);
  }

  const handleSendMessage = useCallback(async () => {
    const messageText = newMessage.trim();
    if (!messageText && !imageFile) return;
    if (!user || !firestore || !dispensary) return;

    setIsSubmitting(true);

    try {
        let imageUrl: string | undefined;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile, `chatImages/${dispensary.id}/${Date.now()}-${imageFile.name}`);
        }

        const messagesCol = collection(firestore, 'dispensaries', dispensary.id, 'messages');
        const messageToSend: Omit<ChatMessageType, 'id'> = {
          user: { id: user.uid, name: user.displayName || 'Anonymous', avatar: user.photoURL || "", isOnline: true },
          text: messageText,
          timestamp: serverTimestamp() as any,
          likes: 0,
          isLiked: false,
          replyingTo: replyingTo ? { user: replyingTo.user.name, text: replyingTo.text } : undefined,
          imageUrl: imageUrl,
        };
        addDocumentNonBlocking(messagesCol, messageToSend);
        
        resetForm();
    } catch(e) {
        console.error("Failed to send message:", e);
        toast({ title: 'Error Sending Message', description: 'Could not send message. Please try again.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }, [newMessage, imageFile, replyingTo, user, firestore, dispensary, toast]);

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
    // Focus logic is handled by Textarea's autoFocus in this scenario
  }, []);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
              toast({ title: 'Image too large', description: "Please upload an image smaller than 5MB.", variant: 'destructive'});
              return;
          }
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
          setIsToolsOpen(false);
      }
  }
  
  const editingIcons = [
    { icon: Bold, name: 'Bold' },
    { icon: Italic, name: 'Italic' },
    { icon: Underline, name: 'Underline' },
    { icon: Camera, name: 'Camera', action: () => fileInputRef.current?.click() },
    { icon: ImageIcon, name: 'Image', action: () => fileInputRef.current?.click() },
    { icon: Smile, name: 'Emoji'},
    { icon: LinkIcon, name: 'Link'},
    { icon: Mic, name: 'Mic'},
    { icon: Hash, name: 'Tag'},
    { icon: AtSign, name: 'Mention'},
  ];
  
  const hasContent = newMessage.trim() !== '' || !!imageFile;

  return (
    <>
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent 
        side="right" 
        className="w-full md:max-w-md p-0 flex flex-col bg-background"
        style={{ height: vh ? `${vh}px` : '100dvh' }}
       >
        <SheetHeader className="p-4 flex-row items-center gap-4 flex-shrink-0 bg-background border-b z-10">
          <Button variant="ghost" size="icon" onClick={handleClose}><ArrowLeft /></Button>
          <div>
            <SheetTitle>Live Group Chat</SheetTitle>
            <SheetDescription>{dispensary.name}</SheetDescription>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 min-h-0 bg-muted/20" onScroll={handleScroll} ref={scrollViewportRef}>
             <div className="pb-28">
                {!user ? (
                    <div className="text-center p-8 text-muted-foreground">Please log in to view the chat.</div>
                ) : isLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
                ) : messages.length > 0 ? (
                    <MessageList messages={messages} onLike={handleLike} onReply={handleReply} onAvatarClick={handleAvatarClick} onDelete={handleDelete} />
                ) : (
                    !imagePreview && <div className="text-center p-8 text-muted-foreground">Be the first to say something!</div>
                )}
                {imagePreview && (
                    <div className="p-4">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary mx-auto">
                            <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
    
        <div className="chat-input-bar">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
            {user ? (
            <div className="chat-input-container">
                <AnimatePresence>
                    {isToolsOpen && (
                        <motion.div 
                            className="chat-tools-sheet absolute bottom-full left-0 right-0"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        >
                            <div className="chat-tools-grid">
                                {editingIcons.map(({ icon: Icon, name, action }) => (
                                    <div key={name} className="flex flex-col items-center">
                                        <button className="h-14 w-14 liquid-glass rounded-full flex items-center justify-center" onClick={action || (() => toast({title: 'Coming Soon!'}))}>
                                            <Icon className="h-6 w-6 text-blue-500" />
                                        </button>
                                        <span className="text-xs mt-2 text-muted-foreground">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="chat-input-main">
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
                    <div className="flex items-end gap-2 bg-muted/80 backdrop-blur-sm rounded-2xl p-2 border border-border/20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 flex-shrink-0 rounded-full bg-background/50 hover:bg-background"
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                        >
                            <Plus className={cn("h-5 w-5 transition-transform", isToolsOpen && "rotate-45")} />
                        </Button>
                         <Textarea 
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                            className="chat-input-textarea"
                            rows={1}
                        />
                        {hasContent && (
                            <Button size="icon" className="h-9 w-9 rounded-full flex-shrink-0" onClick={handleSendMessage} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                            </Button>
                        )}
                    </div>
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

