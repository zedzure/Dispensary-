
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { states } from '@/lib/states';

export function StateSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSearch = searchTerm.trim().toLowerCase();
    
    const matchedState = states.find(s => s.name.toLowerCase() === normalizedSearch || s.abbreviation.toLowerCase() === normalizedSearch);

    if (matchedState) {
      router.push(`/state/${encodeURIComponent(matchedState.name)}`);
    } else {
      // In a real app, you might show a toast or a more elegant error.
      // For now, we'll use a simple alert.
      alert('State not found. Please enter a valid US state name or abbreviation.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
        <div className="relative flex-grow">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/80 z-10" />
            <Input
              type="text"
              placeholder="Enter a state to find dispensaries..."
              className="pl-10 h-12 text-lg text-foreground placeholder:text-foreground/60 liquid-glass"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Button type="submit" size="lg" className="h-12 text-lg text-foreground liquid-glass">
            <Search className="mr-2 h-5 w-5" />
            Search
        </Button>
      </form>
    </div>
  );
}
