

"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, Receipt, Music, Video, Wallet, Bookmark, MessageSquare, Loader2, UserPlus, UserMinus } from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";
import type { ActiveSheet } from "@/app/profile/[userId]/page";
import type { UploadItem, Receipt as ReceiptType, Chat, UserProfile } from "@/types/pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { SearchSheet } from "./search-sheet";
import { useMobileViewportFix } from "@/hooks/use-mobile-viewport-fix";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, where, doc, getDoc } from 'firebase/firestore';
import type { User } from "@/types/user";
import { ChatDetailSheet } from "./chat-detail-sheet";
import { mockCustomers } from "@/lib/mockCustomers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageSheet } from "./message-sheet";


const mockReceiptsData: ReceiptType[] = [];

const getRelativeTime = (timestamp: any): string => {
    if (!timestamp) return '...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}

const ReceiptsSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  useMobileViewportFix();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
        <SheetHeader className="p-4 border-b text-red-500">
          <SheetTitle className="flex items-center text-red-500"><Receipt className="mr-2 h-5 w-5"/>My Receipts</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
            {mockReceiptsData.length > 0 ? (
              <ul className="p-4 space-y-3 text-red-500">
                {mockReceiptsData.map(receipt => (
                  <li key={receipt.id} className="p-3 bg-muted/50 rounded-lg flex items-center gap-4">
                    <div className="p-2 rounded-full bg-background">
                    <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                    <p className="font-semibold">Receipt Submitted</p>
                    <p className="text-xs text-muted-foreground">{new Date(receipt.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">${receipt.totalAmount.toFixed(2)}</p>
                        <Badge variant={receipt.status === 'approved' ? 'default' : 'secondary'} className={receipt.status === 'pending' ? 'bg-yellow-500/80 text-white' : ''}>
                        {receipt.status}
                        </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-red-500">
                    <Receipt className="h-12 w-12 mb-4" />
                    <p>No receipts found.</p>
                </div>
            )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const UploadsSheet = ({ uploads, open, onOpenChange }: { uploads: UploadItem[], open: boolean, onOpenChange: (open: boolean) => void }) => {
  useMobileViewportFix();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
        <SheetHeader className="p-4 border-b text-red-500">
          <SheetTitle className="flex items-center text-red-500"><Camera className="mr-2 h-5 w-5"/>My Uploads</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
            {uploads.length > 0 ? (
                <div className="grid grid-cols-3">
                    {uploads.map(upload => (
                        <div key={upload.id} className="relative aspect-square group border border-red-500">
                           <Image src={upload.url} alt={upload.name} fill className="object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-red-500">
                    <p>No uploads yet.</p>
                </div>
            )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const ChatListItem = ({ chat, currentUserId, onClick }: { chat: Chat, currentUserId: string, onClick: () => void }) => {
    const firestore = useFirestore();
    const [recipient, setRecipient] = useState<UserProfile | null>(null);

    useEffect(() => {
        const recipientId = chat.participants.find(p => p !== currentUserId);
        if (recipientId && firestore) {
            // In a real app, you might fetch from a 'users' collection
            const foundUser = mockCustomers.find(c => c.id === recipientId);
            if (foundUser) {
                setRecipient(foundUser);
            } else {
                // Fallback if user not in mocks
                setRecipient({ id: recipientId, firstName: 'Unknown', lastName: 'User', avatarUrl: '', email: '', memberSince: '' });
            }
        }
    }, [chat, currentUserId, firestore]);

    if (!recipient) {
        return (
            <div className="p-4 flex items-center gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                </div>
            </div>
        );
    }
    
    return (
        <button onClick={onClick} className="w-full text-left p-4 flex items-center gap-4 hover:bg-muted/50 rounded-lg transition-colors text-red-500">
            <Avatar className="h-12 w-12 border">
                <AvatarImage src={recipient.avatarUrl} />
                <AvatarFallback>{recipient.firstName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <p className="font-semibold truncate">{recipient.firstName} {recipient.lastName}</p>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(chat.timestamp)}</p>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
        </button>
    );
};

const ChatList = ({ user, onChatClick }: { user: FirebaseUser, onChatClick: (chat: Chat) => void }) => {
    const firestore = useFirestore();
    const userDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userData, isLoading: userLoading } = useDoc<User>(userDocRef);
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatsLoading, setChatsLoading] = useState(true);

    useEffect(() => {
        if (userData && userData.chatIds && firestore) {
            setChatsLoading(true);
            const fetchChats = async () => {
                const chatPromises = userData.chatIds!.map(id => getDoc(doc(firestore, 'chats', id)));
                const chatDocs = await Promise.all(chatPromises);
                const chatData = chatDocs
                    .filter(doc => doc.exists())
                    .map(doc => ({ ...doc.data(), id: doc.id } as Chat));
                setChats(chatData);
                setChatsLoading(false);
            };
            fetchChats();
        } else if (!userLoading) {
            setChatsLoading(false);
        }
    }, [userData, userLoading, firestore]);
    
    if (chatsLoading) {
        return <div className="h-full flex items-center justify-center"> <Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;
    }

    if (chats.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-red-500">
                <MessageSquare className="h-12 w-12 mb-4" />
                <p>No messages yet.</p>
                <p className="text-sm">Start a conversation from a user's profile.</p>
            </div>
        );
    }

    return (
        <div className="p-2 space-y-1">
            {chats.sort((a, b) => ((b.timestamp as any)?.seconds ?? 0) - ((a.timestamp as any)?.seconds ?? 0)).map(chat => (
                <ChatListItem key={chat.id} chat={chat} currentUserId={user.uid} onClick={() => onChatClick(chat)} />
            ))}
        </div>
    );
};


const NotesSheet = ({ user, open, onOpenChange }: { user: FirebaseUser, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [selectedChat, setSelectedChat] = useState<{chatId: string, recipient: UserProfile} | null>(null);
    useMobileViewportFix();

    const handleChatClick = (chat: Chat) => {
        const recipientId = chat.participants.find(p => p !== user.uid);
        if (recipientId) {
            const recipient = mockCustomers.find(c => c.id === recipientId);
            if (recipient) {
                setSelectedChat({ chatId: chat.id, recipient });
            }
        }
    }

    const handleCloseDetail = () => {
        setSelectedChat(null);
    }
    
    return (
        <>
            <Sheet open={open && !selectedChat} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
                <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center text-red-500"><MessageSquare className="mr-2 h-5 w-5"/>Messages</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                    <ChatList user={user} onChatClick={handleChatClick} />
                </ScrollArea>
            </SheetContent>
            </Sheet>
            {selectedChat && (
                <ChatDetailSheet
                    isOpen={!!selectedChat}
                    onClose={handleCloseDetail}
                    chatId={selectedChat.chatId}
                    recipient={selectedChat.recipient}
                />
            )}
        </>
    );
};

const MusicSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    useMobileViewportFix();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
            <SheetHeader className="p-4 border-b text-red-500">
              <SheetTitle className="flex items-center text-red-500"><Music className="mr-2 h-5 w-5"/>My Music</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col items-center justify-center text-red-500">
                <Music className="h-12 w-12 mb-4" />
                <p>Your uploaded music will appear here.</p>
            </div>
          </SheetContent>
        </Sheet>
    );
};

const VideoSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    useMobileViewportFix();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
            <SheetHeader className="p-4 border-b text-red-500">
              <SheetTitle className="flex items-center text-red-500"><Video className="mr-2 h-5 w-5"/>My Videos</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col items-center justify-center text-red-500">
                <Video className="h-12 w-12 mb-4" />
                <p>Your uploaded videos will appear here.</p>
            </div>
          </SheetContent>
        </Sheet>
    );
};

const WalletSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    useMobileViewportFix();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
            <SheetHeader className="p-4 border-b text-red-500">
              <SheetTitle className="flex items-center text-red-500"><Wallet className="mr-2 h-5 w-5"/>My Wallet</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col items-center justify-center text-red-500">
                <Wallet className="h-12 w-12 mb-4" />
                <p>Your loyalty points and rewards will be shown here.</p>
            </div>
          </SheetContent>
        </Sheet>
    );
};

const SavedSheet = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    useMobileViewportFix();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none text-red-500">
            <SheetHeader className="p-4 border-b text-red-500">
              <SheetTitle className="flex items-center text-red-500"><Bookmark className="mr-2 h-5 w-5"/>Saved Items</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col items-center justify-center text-red-500">
                <Bookmark className="h-12 w-12 mb-4" />
                <p>Your saved products and dispensaries will appear here.</p>
            </div>
          </SheetContent>
        </Sheet>
    );
};


const ConnectionsSheet = ({ profile, initialTab, open, onOpenChange }: { profile: UserProfile, initialTab: 'followers' | 'following', open: boolean, onOpenChange: (open: boolean) => void }) => {
    const { toast } = useToast();
    const followers = mockCustomers.slice(0, 15);
    const following = mockCustomers.slice(10, 25);
    useMobileViewportFix();

    const handleFollow = (userId: string, isFollowing: boolean) => {
        toast({
            title: isFollowing ? `Unfollowed user ${userId}` : `Followed user ${userId}`,
            description: "This is a mock action.",
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col bg-background/80 backdrop-blur-xl border-border/20">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>{profile.firstName}'s Connections</SheetTitle>
                </SheetHeader>
                <Tabs defaultValue={initialTab} className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-1">
                        <TabsContent value="followers" className="m-0">
                            <div className="p-4 space-y-4">
                                {followers.map(user => (
                                    <div key={user.id} className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm text-muted-foreground">@{user.email.split('@')[0]}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleFollow(user.id, false)}>
                                            <UserPlus className="h-4 w-4 mr-1" /> Follow
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="following" className="m-0">
                             <div className="p-4 space-y-4">
                                {following.map(user => (
                                    <div key={user.id} className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm text-muted-foreground">@{user.email.split('@')[0]}</p>
                                        </div>
                                        <Button variant="secondary" size="sm" onClick={() => handleFollow(user.id, true)}>
                                            <UserMinus className="h-4 w-4 mr-1" /> Unfollow
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
};


interface UserProfileSheetsProps {
  activeSheet: ActiveSheet;
  setActiveSheet: (sheet: ActiveSheet, subpage?: 'followers' | 'following') => void;
  user: FirebaseUser;
  profile: UserProfile;
  uploads: UploadItem[];
}

export function UserProfileSheets({ activeSheet, setActiveSheet, user, profile, uploads }: UserProfileSheetsProps) {
    const [connectionsInitialTab, setConnectionsInitialTab] = useState<'followers' | 'following'>('followers');
    const [isMessageSheetOpen, setMessageSheetOpen] = useState(false);
    const [messageRecipient, setMessageRecipient] = useState<UserProfile | null>(null);
  
    const handleSetActiveSheet = (sheet: ActiveSheet, subpage?: 'followers' | 'following') => {
        if (sheet === 'connections') {
            setConnectionsInitialTab(subpage || 'followers');
        }
        setActiveSheet(sheet);
    }

  return (
    <>
      <ReceiptsSheet 
        open={activeSheet === 'receipts'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <UploadsSheet 
        uploads={uploads} 
        open={activeSheet === 'uploads'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <NotesSheet 
        user={user} 
        open={activeSheet === 'notes'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
       <MusicSheet 
        open={activeSheet === 'music'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <VideoSheet 
        open={activeSheet === 'video'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <WalletSheet 
        open={activeSheet === 'wallet'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <SavedSheet 
        open={activeSheet === 'saved'} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <SearchSheet
        open={activeSheet === 'search'}
        onOpenChange={(open) => !open && setActiveSheet(null)}
      />
       <ConnectionsSheet
        profile={profile}
        initialTab={connectionsInitialTab}
        open={activeSheet === 'connections'}
        onOpenChange={(open) => !open && setActiveSheet(null)}
      />
      <MessageSheet 
        isOpen={isMessageSheetOpen}
        onClose={() => {
            setMessageSheetOpen(false);
            setMessageRecipient(null);
        }}
        recipient={messageRecipient}
      />
    </>
  );
}
