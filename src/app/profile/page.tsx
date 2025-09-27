
'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import {
  Leaf, LogOut, Upload, Receipt, Loader2,
  Camera, FileText, Store, Search, Github
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Card, CardContent, CardHeader, CardFooter,
  CardTitle, CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useFileUpload } from '@/hooks/useFileUpload';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import type { UploadItem } from '@/types/pos';
import { UserProfileSheets } from '@/components/user-profile-sheets';

function ReceiptUploadCard() {
  const { uploadFile, uploading, error: uploadError } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadFile(selectedFile);
      toast({
        title: 'Upload Successful!',
        description:
          'Your receipt has been submitted for review. Points will be awarded upon approval.',
      });
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="mr-2 h-5 w-5 text-primary" />
          Upload Receipt for Points
        </CardTitle>
        <CardDescription>
          Submit a photo of your receipt (images or PDF, max 10MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id="receipt-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {previewUrl && selectedFile?.type.startsWith('image/') && (
          <div className="mt-4 p-2 border border-dashed rounded-md">
            <Image
              src={previewUrl}
              alt="Receipt preview"
              width={400}
              height={400}
              className="rounded-md max-h-60 w-auto mx-auto object-contain"
            />
          </div>
        )}
        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full"
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Submit Receipt'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export type ActiveSheet = 'receipts' | 'uploads' | 'notes' | 'search' | null;

function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [spaceUsed, setSpaceUsed] = useState(0);
  const { deleteFile } = useFileUpload();
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubUploads = onSnapshot(
      collection(db, 'users', user.uid, 'uploads'),
      (snap) => {
        const files = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UploadItem[];
        setUploads(files);
      }
    );

    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      setSpaceUsed(docSnap.data()?.usedStorage || 0);
    });

    return () => {
      unsubUploads();
      unsubUser();
    };
  }, [user]);

  const handleDelete = async (file: UploadItem) => {
    if (!user) return;
    const path = `user_uploads/${user.uid}/${file.name}`;
    try {
      await deleteFile(user.uid, file.id, path, file.size);
      toast({
        title: 'File Deleted',
        description: `${file.name} has been removed.`,
      });
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: 'Could not delete the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // While authentication is resolving, show a loading screen.
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-4">
            <Leaf className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading Profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // After loading, if there's still no user, the useEffect will redirect.
  // Render nothing or a minimal message while redirecting.
  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Redirecting to login...</p>
            </main>
            <Footer />
        </div>
    );
  }


  const profileUser = {
    name: user.name || 'Anonymous',
    avatarUrl: user.avatarUrl || `https://avatar.vercel.sh/${user.uid}`,
    bio: user.bio || 'Cannabis Enthusiast from Earth',
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
    points: user.points ?? 0,
    uid: user.uid,
  };

  const iconLinks = [
    { name: 'Marketplace', icon: Store, action: () => router.push('/') },
    { name: 'Receipts', icon: Receipt, action: () => setActiveSheet('receipts') },
    { name: 'Uploads', icon: Camera, action: () => setActiveSheet('uploads') },
    { name: 'Notes', icon: FileText, action: () => setActiveSheet('notes') },
    { name: 'Search', icon: Search, action: () => setActiveSheet('search') },
    { name: 'Github', icon: Github, action: () => window.open('https://github.com/firebase/genkit', '_blank') },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
                <AvatarImage
                  src={profileUser.avatarUrl}
                  alt={profileUser.name}
                />
                <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{profileUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-6">
              <p className="text-muted-foreground">{profileUser.bio}</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {iconLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-lg h-12 w-12 hover:scale-110 transition-transform"
                    onClick={link.action}
                  >
                    <link.icon className="h-6 w-6 text-primary" />
                  </Button>
                ))}
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-bold text-lg">{profileUser.followersCount}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{profileUser.followingCount}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{profileUser.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 grid grid-cols-1 gap-4">
              <Button variant="outline" size="lg" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </CardFooter>
          </Card>

          <ReceiptUploadCard />
        </main>
        <Footer />
      </div>
      <UserProfileSheets
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        user={user}
        uploads={uploads}
      />
    </>
  );
}

export default ProfilePage;
