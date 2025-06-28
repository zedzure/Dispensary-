
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    DollarSign, Users, Package, LayoutDashboard, UserPlus, PackageSearch, ListChecks, FileText, Settings, RefreshCw, Eye, Printer, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, UserProfile, InventoryItem, OrderItem, TransactionType, TransactionStatus } from '@/types/pos';
import { generateInitialMockOrders } from '@/lib/mockOrderData';
import { generateMockInventory } from '@/lib/mockInventory';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/lib/mockCustomers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { OrderReceiptModal } from '@/components/order-receipt-modal';

// --- STORAGE KEYS ---
const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';
const INVENTORY_STORAGE_KEY = 'silzeyPosInventory';
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';

// --- HELPERS ---
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const isToday = (isoDateString?: string) => {
  if (!isoDateString) return false;
  try {
    return new Date(isoDateString).toISOString().split('T')[0] === getTodayDateString();
  } catch (e) {
    return false; 
  }
};

const convertOrdersToTransactions = (orders: Order[]): TransactionType[] => {
  if (!orders || orders.length === 0) {
    return [];
  }
  return orders.map(order => ({
    id: `TRX-ORD-${order.id.substring(order.id.length - 7)}`,
    originalOrderId: order.id,
    originalOrderType: 'order',
    customer: order.customerName,
    date: order.processedAt || order.orderDate,
    amount: `$${order.totalAmount.toFixed(2)}`,
    status: 'Completed', 
    items: order.items.map((item: OrderItem) => ({
      id: item.id,
      name: item.name,
      qty: item.quantity,
      price: item.price,
    })),
  }));
};

const convertToCSV = (data: TransactionType[]) => {
  const headers = ['Transaction ID', 'Original Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Items (Name|Qty|Price;...)'];
  const csvRows = [
    headers.join(','),
    ...data.map(transaction =>
      [
        transaction.id,
        transaction.originalOrderId || '',
        `"${transaction.customer.replace(/"/g, '""')}"`,
        new Date(transaction.date).toLocaleDateString(),
        transaction.amount.replace('$', ''),
        transaction.status,
        `"${transaction.items.map(item => `${item.name}|${item.qty}|${item.price}`).join(';')}"`
      ].join(',')
    )
  ];
  return csvRows.join('\n');
};

const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert("CSV download is not supported in your browser.");
  }
};

const getStatusBadgeVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Pending': return 'secondary';
        case 'Failed': return 'destructive';
        default: return 'default';
    }
};


// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon: Icon, description }: { title: string; value: string; icon: React.ElementType; description: string; }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function LoadingStatCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  );
}

function RecentTransactionsTable() {
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    let completedOrdersFromStorage: Order[] = [];
    try {
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        completedOrdersFromStorage = JSON.parse(completedOrdersRaw);
      }
    } catch (e) {
      console.error("Error parsing completed dashboard orders from localStorage in RTT:", e);
      completedOrdersFromStorage = [];
    }

    if (completedOrdersFromStorage && completedOrdersFromStorage.length > 0) {
      const converted = convertOrdersToTransactions(completedOrdersFromStorage);
      setAllTransactions(converted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setAllTransactions([]);
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } catch (error) {
        console.error("Error during initial data load for RTT:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialLoad();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error during data refresh for RTT:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const customerMatch = filterCustomer ? transaction.customer.toLowerCase().includes(filterCustomer.toLowerCase()) : true;
      return customerMatch;
    });
  }, [allTransactions, filterCustomer]);

  const handleDownload = () => {
    if (filteredTransactions.length === 0) {
        toast({ variant: 'destructive', title: "No transactions to download."});
        return;
    }
    const csvString = convertToCSV(filteredTransactions);
    downloadCSV(csvString, 'recent_transactions_from_pos.csv');
  };

  const handleShowOrderReceipt = (transaction: TransactionType) => {
    if (!transaction.originalOrderId) {
      toast({ variant: 'destructive', title: "Cannot view details: Original order ID not found for this transaction."});
      return;
    }
    try {
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        const completedOrders: Order[] = JSON.parse(completedOrdersRaw);
        const orderToShow = completedOrders.find(o => o.id === transaction.originalOrderId);
        if (orderToShow) {
          setSelectedOrderForModal(orderToShow);
          setIsReceiptModalOpen(true);
        } else {
          toast({ variant: 'destructive', title: `Original order (${transaction.originalOrderId}) not found.`});
        }
      } else {
        toast({ variant: 'destructive', title: "No completed orders found in storage."});
      }
    } catch (e) {
      console.error("Error loading order for modal:", e);
      toast({ variant: 'destructive', title: "Error loading order details."});
    }
  };

  const handleCloseOrderReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedOrderForModal(null);
  };

  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="py-4 border-y border-border">
                 <Skeleton className="h-9 w-full" />
            </CardContent>
            <CardContent className="pt-4">
                 <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-cursive text-primary">Recent POS Transactions</CardTitle>
            <CardDescription>Transactions from completed POS checkouts. Refresh to see new ones.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto" disabled={filteredTransactions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>

        <CardContent className="py-4 border-y border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow sm:flex-1 min-w-[150px] sm:min-w-[200px]">
              <Label htmlFor="filterCustomerRTT" className="text-xs text-muted-foreground block mb-1">Filter by Customer</Label>
              <Input
                id="filterCustomerRTT"
                placeholder="Customer name..."
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 md:self-end w-full md:w-auto" disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                {isRefreshing ? 'Refreshing...' : 'Refresh List'}
            </Button>
          </div>
        </CardContent>

        <CardContent className="pt-4">
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium" title={transaction.originalOrderId ? `Orig. Order: ${transaction.originalOrderId}` : ''}>
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{transaction.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="capitalize">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`View Details for Order ${transaction.originalOrderId}`}
                          aria-label={`View details for order ${transaction.originalOrderId}`}
                          onClick={() => handleShowOrderReceipt(transaction)}
                          disabled={!transaction.originalOrderId}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`Print Receipt for Order ${transaction.originalOrderId}`}
                          aria-label={`Print receipt for order ${transaction.originalOrderId}`}
                          onClick={() => {
                            if (transaction.originalOrderId && transaction.originalOrderType === 'order') {
                              const url = `/admin/print/receipt/${transaction.originalOrderId}?type=order`;
                              window.open(url, '_blank');
                            } else {
                               toast({ variant: 'destructive', title: 'Cannot print receipt: Original order ID not found.'});
                            }
                          }}
                          disabled={!transaction.originalOrderId}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions found. Process orders from the Live POS Queue to see them here.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      {selectedOrderForModal && (
        <OrderReceiptModal
          order={selectedOrderForModal}
          isOpen={isReceiptModalOpen}
          onClose={handleCloseOrderReceiptModal}
        />
      )}
    </>
  );
}


// --- MAIN DASHBOARD COMPONENT ---

function AdminDashboard() {
  const [stats, setStats] = useState({
    todaysRevenue: 0,
    newCustomersToday: 0,
    totalProducts: 0,
    productsInStock: 0,
    openOrdersCount: 0,
    revenueChange: 0,
    newCustomerChange: 0,
  });
  const [salesData, setSalesData] = useState<{name: string; sales: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (!isMounted) return;

      let allCompletedOrders: Order[] = [];
      let allUsers: UserProfile[] = [...mockCustomers];
      let allInventory: InventoryItem[] = generateMockInventory();
      let pendingOrders: Order[] = [];

      try {
        const storedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
        const staticOrders = generateInitialMockOrders();
        const storedOrders = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
        const combined = [...storedOrders, ...staticOrders];
        allCompletedOrders = Array.from(new Map(combined.map(order => [order.id, order])).values());
      } catch(e) { console.error("Error loading completed orders", e); }
      
      try {
        const storedUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        if(storedUsersRaw) {
          const storedUsers = JSON.parse(storedUsersRaw);
          const userMap = new Map(allUsers.map(u => [u.id, u]));
          storedUsers.forEach((u: UserProfile) => userMap.set(u.id, u));
          allUsers = Array.from(userMap.values());
        }
      } catch(e) { console.error("Error loading users", e); }

      try {
        allInventory = generateMockInventory();
      } catch (e) { console.error("Error loading inventory", e); }

      try {
        const storedPendingRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
        pendingOrders = storedPendingRaw ? JSON.parse(storedPendingRaw) : [];
      } catch (e) { console.error("Error loading pending orders", e); }

      const todaysRevenue = allCompletedOrders
        .filter(o => o.processedAt && isToday(o.processedAt))
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const newCustomersToday = allUsers
        .filter(u => u.memberSince && isToday(u.memberSince))
        .length;
      
      const totalProducts = allInventory.length;
      const productsInStock = allInventory.filter(i => i.stock > 0).length;
      
      const openOrdersCount = pendingOrders.length;
      
      const salesByMonth: { [key: string]: number } = {};
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      allCompletedOrders.forEach(order => {
          const date = new Date(order.processedAt || order.orderDate);
          const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.totalAmount;
      });
      const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
      });
      const monthlySales = sortedMonths.slice(-12).map(monthKey => ({
          name: monthKey.split(' ')[0],
          sales: salesByMonth[monthKey]
      }));

      setStats({
        todaysRevenue,
        newCustomersToday,
        totalProducts,
        productsInStock,
        openOrdersCount,
        revenueChange: Math.floor(Math.random() * 30 - 10),
        newCustomerChange: Math.floor(Math.random() * 5 - 2),
      });
      setSalesData(monthlySales);
      setIsLoading(false);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  
  const formatRevenueChange = (change: number) => `${change >= 0 ? '+' : ''}${change}% from yesterday`;
  const formatCustomerChange = (change: number) => `${change >= 0 ? '+' : ''}${change} today`;

  const chartConfigSales = { sales: { label: "Sales", color: "hsl(var(--primary))" } } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <LoadingStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><Skeleton className="h-[450px] w-full" /></div>
            <div className="space-y-8 lg:col-span-1"><Skeleton className="h-[200px] w-full" /><Skeleton className="h-[200px] w-full" /></div>
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Revenue" value={`$${stats.todaysRevenue.toFixed(2)}`} icon={DollarSign} description={formatRevenueChange(stats.revenueChange)} />
        <StatCard title="New Customers" value={stats.newCustomersToday.toString()} icon={UserPlus} description={formatCustomerChange(stats.newCustomerChange)} />
        <StatCard title="Total Products" value={stats.totalProducts.toString()} icon={PackageSearch} description={`${stats.productsInStock} in stock`} />
        <StatCard title="Open Orders" value={stats.openOrdersCount.toString()} icon={ListChecks} description={`${stats.openOrdersCount} require attention`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="font-cursive text-primary">Sales Overview</CardTitle>
                    <CardDescription>Monthly sales data for the last 6 months (mock data).</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfigSales} className="w-full h-[350px]">
                    <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) >= 1000 ? `${Number(value)/1000}k` : value}`} />
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-cursive text-primary">
                <FileText className="mr-2 h-5 w-5" /> Quick Reports
              </CardTitle>
              <CardDescription>View detailed analytics reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/sales">Sales Reports</Link></Button>
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/inventory">Inventory Reports</Link></Button>
              <Button asChild className="w-full" variant="outline"><Link href="/admin/reports/customer-insights">Customer Insights</Link></Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-cursive text-primary">
                <Settings className="mr-2 h-5 w-5" /> Management
              </CardTitle>
              <CardDescription>Access key management areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/products">Manage Inventory</Link></Button>
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/users">View Customer List</Link></Button>
              <Button asChild className="w-full" variant="secondary"><Link href="/admin/settings">Store Settings</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <RecentTransactionsTable />

    </div>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
