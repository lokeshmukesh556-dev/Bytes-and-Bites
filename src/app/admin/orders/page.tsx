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
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { OrderDetailsDialog } from '@/components/admin/order-details-dialog';
import { useCollection, useFirestore, useUser, WithId } from '@/firebase';
import { collection, collectionGroup, doc, query, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';

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
  const ordersQuery = useMemoFirebase(() => 
    firestore ? query(collectionGroup(firestore, 'orders')) : null
  , [firestore]);

  const { data: orders, isLoading } = useCollection<OrderData>(ordersQuery);

  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (order: OrderWithId) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  const handleUpdateStatus = (orderId: string, userId: string, status: OrderWithId['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, `users/${userId}/orders/${orderId}`);
    updateDoc(orderRef, { status: status });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>
            Manage and track all customer orders.
          </CardDescription>
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
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
