
"use client";

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PrinterIcon, XCircle, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { TransactionItem, Order as AppOrder, TransactionStatus, OrderStatus as AppOrderStatus, OrderItem } from '@/types/pos';
import { generateInitialMockOrders } from '@/lib/mockOrderData'; 

// Mock transaction data - in a real app, you'd fetch this or have it available
const mockTransactionsData: Array<{
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  items: TransactionItem[]; 
}> = [
  { id: 'TRX731', customer: 'Aisha Khan', date: '2024-07-28', amount: '$75.50', status: 'Completed', items: [{id: 'item-1', name: 'Flower Product A', qty: 1, price: 30.00}, {id: 'item-2', name: 'Edible Product B', qty: 2, price: 22.75}] },
  { id: 'TRX732', customer: 'Ben Carter', date: '2024-07-28', amount: '$120.00', status: 'Completed', items: [{id: 'item-3', name: 'Vape Cartridge X', qty: 2, price: 60.00}] },
];

interface DisplayableRecord {
  id: string;
  recordType: 'Transaction' | 'Order';
  customerName: string;
  date: string; 
  status: TransactionStatus | AppOrderStatus;
  items: OrderItem[] | TransactionItem[]; 
  totalAmountDisplay: string;
  identifierLabel: string;
}

function PrintableReceiptContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const recordId = params.id as string;
  const recordTypeParam = searchParams.get('type') as 'transaction' | 'order' | null;

  const [record, setRecord] = useState<DisplayableRecord | null | undefined>(undefined);

  useEffect(() => {
    if (recordId && recordTypeParam) {
      let foundRecord: DisplayableRecord | null = null;
      if (recordTypeParam === 'transaction') {
        const transaction = mockTransactionsData.find(t => t.id === recordId);
        if (transaction) {
          foundRecord = {
            id: transaction.id,
            recordType: 'Transaction',
            customerName: transaction.customer,
            date: new Date(transaction.date).toISOString(),
            status: transaction.status,
            items: transaction.items, 
            totalAmountDisplay: transaction.amount,
            identifierLabel: 'Transaction ID'
          };
        }
      } else if (recordTypeParam === 'order') {
        const allMockOrders = generateInitialMockOrders(); 
        const order = allMockOrders.find(o => o.id === recordId); 
        if (order) {
          foundRecord = {
            id: order.id,
            recordType: 'Order',
            customerName: order.customerName,
            date: order.orderDate, 
            status: order.status,
            items: order.items, 
            totalAmountDisplay: `$${order.totalAmount.toFixed(2)}`,
            identifierLabel: 'Order ID'
          };
        }
      }
      setRecord(foundRecord);
    }
  }, [recordId, recordTypeParam]);

  useEffect(() => {
    if (record) { 
      const timer = setTimeout(() => {
        if (!(window as any).isPrinting) {
          (window as any).isPrinting = true;
          window.print();
          (window as any).isPrinting = false; 
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [record]);

  const handlePrint = () => {
    if (!(window as any).isPrinting) {
        (window as any).isPrinting = true;
        window.print();
        (window as any).isPrinting = false; 
    }
  };
  const handleClose = () => window.opener ? window.close() : router.push('/admin/orders');

  if (record === undefined) {
    return (
      <div className="min-h-screen bg-muted p-4 sm:p-8 flex justify-center items-center">
        <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-lg w-full max-w-md print:shadow-none print:border-none">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-6" />
          <Separator className="my-4" />
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Separator className="my-4" />
          <Skeleton className="h-8 w-1/2 ml-auto mb-6" />
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-muted p-8 flex flex-col justify-center items-center text-center">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Record Not Found</h1>
        <p className="text-muted-foreground mb-6">The ID "{recordId}" (type: {recordTypeParam || 'unknown'}) could not be found.</p>
        <Button onClick={() => router.push('/admin/orders')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: TransactionStatus | AppOrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'Completed' || status === 'Shipped') return 'default';
    if (status === 'Pending' || status === 'In-Store') return 'secondary';
    if (status === 'Cancelled') return 'destructive';
    if (status === 'Pending Checkout') return 'destructive';
    return 'outline';
  };

  return (
    <div id="printable-receipt-area" className="min-h-screen bg-muted p-2 sm:p-4 print:bg-white print:p-0 flex justify-center items-start sm:items-center">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-area, #printable-receipt-area * {
            visibility: visible !important;
          }
          #printable-receipt-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
            border: none !important;
            box-shadow: none !important;
          }
          #printable-receipt-area > div:first-child {
            margin: 0.5in !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            width: auto !important;
            max-width: calc(100% - 1in) !important;
            font-size: 10pt !important;
            line-height: 1.4 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0; 
            size: letter portrait;
          }
          #printable-receipt-area, #printable-receipt-area * {
            color: #000000 !important;
            background-color: transparent !important;
            border-color: #cccccc !important;
          }
          #printable-receipt-area .text-primary {
             color: #000000 !important;
          }
          #printable-receipt-area .text-muted-foreground {
            color: #333333 !important;
          }
        }
      `}</style>
      <div className="bg-white p-6 shadow-2xl rounded-lg w-full max-w-sm print:shadow-none print:border-none print:max-w-full print:rounded-none">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-cursive text-primary">GreenLeaf Guide</h1>
          <p className="text-xl font-semibold uppercase">{record.recordType} Details</p>
        </header>
        <Separator className="my-4 border-dashed" />
        <section className="text-sm space-y-1 mb-4">
          <div className="flex justify-between"><span>{record.identifierLabel}:</span> <strong className="font-mono">{record.id}</strong></div>
          <div className="flex justify-between"><span>Date:</span> <strong>{new Date(record.date).toLocaleString()}</strong></div>
          <div className="flex justify-between"><span>Customer:</span> <strong>{record.customerName}</strong></div>
          <div className="flex justify-between"><span>Status:</span> <Badge variant={getStatusBadgeVariant(record.status)} className="capitalize">{record.status}</Badge></div>
        </section>
        <Separator className="my-4" />
        <section className="mb-4">
          <h2 className="font-semibold text-sm mb-1 flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-primary" />Items:</h2>
          <div className="space-y-1.5 text-xs">
            {record.items.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-2 py-1 border-b border-border/50 last:border-b-0">
                {(item as OrderItem).image && (
                  <Image
                    src={(item as OrderItem).image}
                    alt={item.name}
                    width={30}
                    height={30}
                    className="rounded object-cover"
                    data-ai-hint={(item as OrderItem).hint}
                  />
                )}
                <div className="flex-grow grid grid-cols-[1fr_auto_auto] gap-x-2 items-center">
                    <span className="truncate">{item.name} (x{((item as OrderItem).quantity || (item as TransactionItem).qty)})</span>
                    <span className="text-right text-muted-foreground">${(item as OrderItem).price.toFixed(2)} ea.</span>
                    <span className="text-right font-medium">${((item as OrderItem).price * ((item as OrderItem).quantity || (item as TransactionItem).qty)).toFixed(2)}</span>
                </div>
              </div>
            ))}
             {record.items.length === 0 && <p className="text-muted-foreground text-center py-2">No items in this {record.recordType.toLowerCase()}.</p>}
          </div>
        </section>
        <Separator className="my-4" />
        <section className="text-right space-y-1 mb-6">
          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>TOTAL:</span>
            <span>{record.totalAmountDisplay}</span>
          </div>
        </section>
        <Separator className="my-4 border-dashed" />
        <footer className="text-center text-xs text-muted-foreground">
          <p>Thank you for your business!</p>
          <p>Questions? Call (555) 123-4567</p>
        </footer>
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 no-print">
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
            <XCircle className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <PrinterIcon className="mr-2 h-4 w-4" /> Print Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PrintableReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Skeleton className="h-64 w-96" /></div>}>
      <PrintableReceiptContent />
    </Suspense>
  );
}
