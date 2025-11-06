
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, QrCode } from 'lucide-react';
import { useState, useMemo } from 'react';
import { OrderDetailsDialog } from '@/components/admin/order-details-dialog';
import { useCollection, useFirestore, useUser, WithId } from '@/firebase';
import { collection, collectionGroup, doc, query, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { QrScannerDialog } from '@/components/admin/qr-scanner-dialog';
import { useToast } from '@/hooks/use-toast';

// Matches the Order entity in backend.json
export interface OrderData {
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  convenienceFee: number;
}
export type OrderWithId = WithId<OrderData>;


function getBadgeVariant(
  status: OrderWithId['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Pending':
      return 'destructive';
    case 'Preparing':
      return 'secondary';
    case 'Ready':
      return 'outline';
    case 'Completed':
      return 'default';
    default:
      return 'default';
  }
}

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const ordersQuery = useMemoFirebase(() => {
    return firestore ? query(collectionGroup(firestore, 'orders')) : null;
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<OrderData>(ordersQuery);

  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const ordersMap = useMemo(() => {
    if (!orders) return new Map();
    return new Map(orders.map(order => [order.id, order]));
  }, [orders]);

  const handleViewDetails = (order: OrderWithId) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };
  
  const handleUpdateStatus = (orderId: string, userId: string, status: OrderWithId['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, `users/${userId}/orders/${orderId}`);
    updateDoc(orderRef, { status: status });
  }

  const handleScanResult = (result: string) => {
    setIsScannerOpen(false);
    const scannedOrder = ordersMap.get(result);

    if (scannedOrder) {
        if (scannedOrder.status === 'Completed') {
            toast({
                variant: 'destructive',
                title: 'Order Already Served',
                description: `This order (${result}) has already been marked as completed.`,
            });
        } else {
            setSelectedOrder(scannedOrder);
            setIsDetailsDialogOpen(true);
        }
    } else {
         toast({
            variant: 'destructive',
            title: 'Order Not Found',
            description: `Could not find an order with the ID: ${result}`,
        });
    }
  }


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>
            Manage and track all customer orders.
          </CardDescription>
          </div>
           <Button onClick={() => setIsScannerOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan Order QR
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              )}
              {orders && orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="font-mono text-xs">{order.userId}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, order.userId, 'Preparing')}>Mark as Preparing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, order.userId, 'Ready')}>Mark as Ready</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, order.userId, 'Completed')}>Mark as Completed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onMarkCompleted={() => handleUpdateStatus(selectedOrder.id, selectedOrder.userId, 'Completed')}
        />
      )}
      <QrScannerDialog 
        isOpen={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onResult={handleScanResult}
      />
    </>
  );
}
