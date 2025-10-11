
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, FileText, Camera, Receipt, Send } from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";
import type { ActiveSheet } from "@/app/profile/[userId]/page";
import type { UploadItem, Receipt as ReceiptType } from "@/types/pos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { SearchSheet } from "./search-sheet";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  userId: string;
  type: string;
  text: string;
  userName?: string;
  userAvatar?: string;
  date: Date;
  read: boolean;
}

const mockReceiptsData: ReceiptType[] = [];
const mockNotifications: Notification[] = [];


const getRelativeTime = (date: Date): string => {
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 bg-transparent border-0 shadow-none">
        <SheetHeader className="p-4 border-b text-red-500">
          <SheetTitle className="flex items-center"><Receipt className="mr-2 h-5 w-5"/>My Receipts</SheetTitle>
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center"><Camera className="mr-2 h-5 w-5"/>My Uploads</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
            {uploads.length > 0 ? (
                <div className="p-2 grid grid-cols-3 gap-2">
                    {uploads.map(upload => (
                        <div key={upload.id} className="relative aspect-square rounded-md overflow-hidden group">
                           <Image src={upload.url} alt={upload.name} fill className="object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>No uploads yet.</p>
                </div>
            )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const NotesSheet = ({ user, open, onOpenChange }: { user: FirebaseUser, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [messages, setMessages] = useState<Notification[]>([]);
    const [replyingTo, setReplyingTo] = useState<Notification | null>(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if(open) {
            // In a real app, this would be a fetch.
            setMessages(mockNotifications.filter(n => n.userId === user.uid).sort((a,b) => a.date.getTime() - b.date.getTime()));
        }
    }, [open, user.uid]);

    const handleReply = useCallback((notification: Notification) => {
        setReplyingTo(notification);
        setNewMessage(`@${notification.userName} `);
    }, []);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        // Mock sending message
        console.log("Sending message:", newMessage);
        setNewMessage('');
        setReplyingTo(null);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90%] flex flex-col p-0">
            <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center"><FileText className="mr-2 h-5 w-5"/>Notes & Messages</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
                {messages.length > 0 ? (
                    <div className="p-4 space-y-5">
                        {messages.map(note => (
                            <div key={note.id} className="flex gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={note.userAvatar} />
                                    <AvatarFallback>{note.userName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: note.text }} />
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                                        <span>{getRelativeTime(note.date)}</span>
                                        <button className="font-semibold hover:underline">Read</button>
                                        <button className="font-semibold hover:underline" onClick={() => handleReply(note)}>Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4" />
                        <p>No messages or notes yet.</p>
                    </div>
                )}
            </ScrollArea>
            <SheetFooter className="p-2 border-t bg-background">
                <div className="w-full space-y-2">
                    {replyingTo && (
                        <div className="text-xs p-2 bg-muted rounded-md flex justify-between items-center">
                            <p className="text-muted-foreground truncate">
                                Replying to <strong className="text-primary/90">@{replyingTo.userName}</strong>
                            </p>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setReplyingTo(null)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                    <div className="flex items-start gap-2">
                        <Textarea 
                            placeholder="Type your reply..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="min-h-[40px] max-h-28"
                            rows={1}
                        />
                        <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SheetFooter>
        </SheetContent>
        </Sheet>
    );
};

interface UserProfileSheetsProps {
  activeSheet: ActiveSheet;
  setActiveSheet: (sheet: ActiveSheet) => void;
  user: FirebaseUser;
  uploads: UploadItem[];
}

export function UserProfileSheets({ activeSheet, setActiveSheet, user, uploads }: UserProfileSheetsProps) {
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
      <SearchSheet
        open={activeSheet === 'search'}
        onOpenChange={(open) => !open && setActiveSheet(null)}
      />
    </>
  );
}
