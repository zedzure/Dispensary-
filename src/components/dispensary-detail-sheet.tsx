
"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import Image from 'next/image';
import type { Dispensary, Review, ChatUser } from '@/types/pos';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, MapPin, MessageSquare, Navigation, Ticket, Package, Gift, Sparkles, UserPlus, Users, Upload, Camera, Loader2, ImagePlus, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useViewportHeight } from '@/hooks/use-viewport-height';
import { useMobileViewportFix } from '@/hooks/use-mobile-viewport-fix';


import { DispensaryPromotionsSheet } from './dispensary-sheets/promotions-sheet';
import { DispensaryProductsSheet } from './dispensary-sheets/products-sheet';
import { DispensaryChatSheet } from './dispensary-sheets/chat-sheet';
import { DispensaryDealsSheet } from './dispensary-sheets/deals-sheet';
import { DispensaryMapSheet } from './dispensary-sheets/map-sheet';
import { uploadImage } from '@/lib/image-upload';
import type { Timestamp } from 'firebase/firestore';
import { UserProfileModal } from './user-profile-modal';
import { mockCustomers } from '@/lib/mockCustomers';


function ReviewForm({ dispensaryId, onAddReview }: { dispensaryId: string, onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void }) {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
              toast({ title: "File too large", description: "Please upload an image smaller than 2MB.", variant: "destructive"});
              return;
          }
          setPhoto(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ 
          title: 'Authentication Required', 
          description: 'Please log in to leave a review.', 
          variant: 'destructive',
          action: <Button onClick={() => router.push('/login')}>Login</Button>
      });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Please select a star rating.', variant: 'destructive' });
      return;
    }
    if (!comment.trim()) {
      toast({ title: 'Please write a comment.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    let photoUrl: string | undefined;

    try {
        if (photo) {
            // Upload the image to a specific path for reviews
            photoUrl = await uploadImage(photo, `reviewImages/${dispensaryId}/${user.uid}-${Date.now()}`);
        }

        const newReview: Omit<Review, 'id' | 'createdAt'> = {
            userId: user.uid,
            targetId: dispensaryId,
            targetType: 'dispensary',
            rating: rating,
            text: comment,
            photos: photoUrl ? [photoUrl] : [],
            user: { name: user.displayName || 'Anonymous', avatar: user.photoURL || '' },
            likesCount: 0,
            commentsCount: 0,
            updatedAt: new Date().toISOString()
        };
        
        onAddReview(newReview);

        // Reset form after successful submission
        setRating(0);
        setComment('');
        setPhoto(null);
        setPreviewUrl(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });

    } catch (error) {
        console.error("Failed to submit review:", error);
        toast({ title: 'Submission Failed', description: 'Could not submit your review. Please try again.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <div id="review-form" className="space-y-4 pt-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>
      {!user ? (
         <div className="text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
            You must be <Link href="/login" className="text-primary underline">logged in</Link> to leave a review.
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                  <Star 
                    className={cn(
                      "w-6 h-6 cursor-pointer transition-colors",
                      star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your experience..."/>
          </div>
          <div className="space-y-2">
                <Label htmlFor="photo">Add a Photo (Optional)</Label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="photo-upload" />
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                    <Camera className="mr-2 h-4 w-4" /> Choose Image
                </Button>
                {previewUrl && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-primary/50">
                        <Image src={previewUrl} alt="Review preview" layout="fill" objectFit="cover" />
                    </div>
                )}
            </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Submit Review
          </Button>
        </>
      )}
    </div>
  )
}

type SheetName = 'promotions' | 'products' | 'chat' | 'deals' | 'map';

interface DispensaryDetailSheetProps {
  dispensary: Dispensary | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DispensaryDetailSheet({ dispensary, isOpen, onOpenChange }: DispensaryDetailSheetProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const vh = useViewportHeight();
  useMobileViewportFix();
  
  const [reviews, setReviews] = useState<Review[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSheet = searchParams.get('sheet') as SheetName | null;

  const [selectedProfile, setSelectedProfile] = useState<ChatUser | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (dispensary) {
        setReviews(dispensary.reviews || []);
    }
  }, [dispensary]);

  const handleAvatarClick = (user: ChatUser) => {
    setSelectedProfile(user);
    setProfileModalOpen(true);
  };

  const handleSetSheet = (sheetName: SheetName | null) => {
    const dispensaryId = searchParams.get('dispensary');
    const newParams = new URLSearchParams();
    if (dispensaryId) {
        newParams.set('dispensary', dispensaryId);
    }
    if (sheetName) {
      newParams.set('sheet', sheetName);
    }
    router.push(pathname + '?' + newParams.toString(), { scroll: false });
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      handleSetSheet(null);
    }
  };


  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableViewport) {
            scrollableViewport.scrollTop = 0;
        }
    }
  }, [dispensary, isOpen]);

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
     if (!user) {
        toast({ title: 'Please log in to add a review.', variant: 'destructive' });
        return;
     };
    const newReview: Review = {
        ...reviewData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString() as string | Timestamp,
        user: { name: user.displayName || 'Anonymous', avatar: user.photoURL || '' },
    }
    setReviews(prev => [newReview, ...prev]);
  }

  const handleFollow = (userIdToFollow: string) => {
    if (!user) {
        toast({ title: 'Please log in to follow users.', variant: 'destructive'});
        return;
    }
    toast({
        title: 'Follow action (mock)',
        description: `You toggled follow for user ${userIdToFollow}.`
    });
  };

  const handleLeaveReviewClick = () => {
    const reviewForm = document.getElementById('review-form');
    reviewForm?.scrollIntoView({ behavior: 'smooth' });
  }
  
  const ActionButton = ({ sheetName, icon: Icon, label }: { sheetName: SheetName, icon: React.ElementType, label: string }) => (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleSetSheet(sheetName)} 
        className="h-16 w-16 rounded-2xl bg-muted/50 hover:bg-muted group"
      >
        <Icon className="w-7 h-7 text-primary group-hover:text-blue-500" />
      </Button>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );

  if (!dispensary) {
    return null;
  }
  
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dispensary.lat},${dispensary.lng}`;

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        className="p-0 w-full md:max-w-md flex flex-col bg-blue-900/10 backdrop-blur-xl border-border/20"
        style={{ height: vh ? `${vh}px` : '100dvh' }}
        >
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <SheetHeader className="p-0 relative h-48">
            <Image
              src={dispensary.logo}
              alt={dispensary.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
              data-ai-hint={dispensary.hint}
            />
          </SheetHeader>
          <div className="p-6 space-y-4">
             <Link href={`/menu/${dispensary.id}`}>
              <SheetTitle className="text-3xl font-bold font-cursive hover:underline">{dispensary.name}</SheetTitle>
            </Link>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                    <span className="font-medium text-foreground">{dispensary.rating}</span>
                    <span className="text-xs">({reviews.length} reviews)</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4"/>
                    Delivery: {dispensary.deliveryTime} min
                </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <SheetDescription>{dispensary.address}</SheetDescription>
            </div>
            
            <Separator />

            <div className="py-2 grid grid-cols-5 gap-3 text-center">
              <ActionButton sheetName="promotions" icon={Ticket} label="Promos" />
              <ActionButton sheetName="products" icon={Package} label="Products" />
              <ActionButton sheetName="chat" icon={MessageSquare} label="Chat" />
              <ActionButton sheetName="deals" icon={Zap} label="New" />
              <ActionButton sheetName="map" icon={MapPin} label="Map" />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Reviews</h3>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="flex gap-3">
                    <button onClick={() => handleAvatarClick({ id: review.userId, name: review.user.name, avatar: review.user.avatar, isOnline: true })}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
                          <AvatarFallback>{review.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className='flex items-center gap-2 flex-wrap'>
                           <p className="font-semibold">{review.user?.name}</p>
                           <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    <Users className="h-3 w-3" />
                                    <span>{review.followers || 0}</span>
                                </div>
                                {user && user.uid !== review.userId && (
                                  <Button
                                    size="sm"
                                    variant={"secondary"}
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleFollow(review.userId)}
                                  >
                                    <UserPlus className="mr-1 h-3 w-3" />
                                    Follow
                                  </Button>
                                )}
                           </div>
                        </div>
                         <div className="flex items-center gap-1 shrink-0">
                            <span className="text-sm">{review.rating.toFixed(1)}</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                       {review.photos && review.photos.length > 0 && (
                          <div className="mt-2">
                            <Image src={review.photos[0]} alt="Review image" width={100} height={100} className="rounded-md object-cover"/>
                          </div>
                       )}
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
            
            <Separator />

            <ReviewForm dispensaryId={dispensary.id} onAddReview={handleAddReview} />

          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t bg-transparent grid grid-cols-2 gap-3">
            <Button
              onClick={handleLeaveReviewClick}
              variant="outline"
              className="h-12 w-full flex items-center justify-center text-sm font-medium rounded-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Leave Review
            </Button>
            <Button
              asChild
              className="h-12 w-full flex items-center justify-center text-sm font-medium rounded-full"
            >
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Directions
              </a>
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

    <UserProfileModal
        user={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
    />

    <DispensaryPromotionsSheet isOpen={activeSheet === 'promotions'} onOpenChange={(open) => handleSheetOpenChange(!open)} dispensary={dispensary} />
    <DispensaryProductsSheet isOpen={activeSheet === 'products'} onOpenChange={(open) => handleSheetOpenChange(!open)} dispensary={dispensary} />
    <DispensaryChatSheet isOpen={activeSheet === 'chat'} onOpenChange={(open) => handleSheetOpenChange(!open)} dispensary={dispensary} />
    <DispensaryDealsSheet isOpen={activeSheet === 'deals'} onOpenChange={(open) => handleSheetOpenChange(!open)} dispensary={dispensary} />
    <DispensaryMapSheet isOpen={activeSheet === 'map'} onOpenChange={(open) => handleSheetOpenChange(!open)} dispensary={dispensary} />
    </>
  );
}
