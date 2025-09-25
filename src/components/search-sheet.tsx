
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Package, Store, ArrowRight } from 'lucide-react';
import { allProductsFlat } from '@/lib/products';
import { dispensariesByState } from '@/lib/dispensaries';
import { cn } from '@/lib/utils';

type SearchResult = 
    | { type: 'product'; data: import('@/types/product').Product }
    | { type: 'dispensary'; data: import('@/types/pos').Dispensary };

const allDispensaries = dispensariesByState.flatMap(s => s.dispensaries);

const ITEMS_PER_PAGE = 10;

interface SearchSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchSheet({ open, onOpenChange }: SearchSheetProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const searchResults = useMemo((): SearchResult[] => {
        if (searchTerm.length < 2) return [];

        const lowercasedTerm = searchTerm.toLowerCase();

        const productResults: SearchResult[] = allProductsFlat
            .filter(p => p.name.toLowerCase().includes(lowercasedTerm) || p.category.toLowerCase().includes(lowercasedTerm))
            .map(p => ({ type: 'product', data: p }));

        const dispensaryResults: SearchResult[] = allDispensaries
            .filter(d => d.name.toLowerCase().includes(lowercasedTerm) || d.address.toLowerCase().includes(lowercasedTerm))
            .map(d => ({ type: 'dispensary', data: d }));
        
        return [...productResults, ...dispensaryResults];

    }, [searchTerm]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const paginatedResults = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [searchResults, currentPage]);

    const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[90%] flex flex-col p-0 shadow-2xl shadow-blue-500/20">
                <SheetHeader className="p-4 border-b flex-shrink-0">
                    <SheetTitle className="flex items-center"><Search className="mr-2 h-5 w-5" />Search Products & Stores</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {paginatedResults.length > 0 ? (
                            paginatedResults.map((result, index) => (
                                <SearchResultCard key={`${result.type}-${result.data.id}-${index}`} result={result} onLinkClick={() => onOpenChange(false)} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>{searchTerm.length < 2 ? 'Enter at least 2 characters to search' : 'No results found.'}</p>
                            </div>
                        )}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-4">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <SheetFooter className="p-4 border-t bg-background">
                     <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Type to search..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

const SearchResultCard = ({ result, onLinkClick }: { result: SearchResult, onLinkClick: () => void }) => {
    if (result.type === 'product') {
        const { data: product } = result;
        return (
            <Card className="overflow-hidden shadow-sm">
                <CardContent className="p-3 flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.hint} />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Package className="h-3 w-3" />PRODUCT</p>
                        <h4 className="font-semibold text-sm truncate" title={product.name}>{product.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                    </div>
                    <Button asChild size="icon" variant="ghost" className="text-muted-foreground" onClick={onLinkClick}>
                        <Link href={`/?product=${product.id}`}>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (result.type === 'dispensary') {
        const { data: dispensary } = result;
        return (
            <Card className="overflow-hidden shadow-sm">
                <CardContent className="p-3 flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image src={dispensary.logo} alt={dispensary.name} fill className="object-cover" data-ai-hint={dispensary.hint} />
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Store className="h-3 w-3" />DISPENSARY</p>
                        <h4 className="font-semibold text-sm truncate" title={dispensary.name}>{dispensary.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{dispensary.address}</p>
                        <p className="text-xs text-muted-foreground">{dispensary.rating} ★ | {dispensary.deliveryTime} min delivery</p>
                    </div>
                     <Button asChild size="icon" variant="ghost" className="text-muted-foreground" onClick={onLinkClick}>
                        <Link href={`/?dispensary=${dispensary.id}`}>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return null;
};
