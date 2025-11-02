'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';
import type { OrderWithId } from '@/app/admin/orders/page';
import {
  useCollection,
  useFirestore,
  useUser,
  type WithId,
} from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { useMenu, type MenuItemWithId } from '@/context/MenuContext';

// Matches OrderItem entity in backend.json
export interface OrderItemData {
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
}
export type OrderItemWithId = WithId<OrderItemData>;

interface OrderDetailsDialogProps {
  order: OrderWithId;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function OrderItemsTable({ order }: { order: OrderWithId }) {
  const firestore = useFirestore();
  const { menuItems, isLoading: isMenuLoading } = useMenu();

  const orderItemsQuery = useMemoFirebase(
    () =>
      firestore
        ? collection(
            firestore,
            `users/${order.userId}/orders/${order.id}/order_items`
          )
        : null,
    [firestore, order]
  );

  const { data: orderItems, isLoading: areOrderItemsLoading } =
    useCollection<OrderItemData>(orderItemsQuery);

  if (areOrderItemsLoading || isMenuLoading) {
    return <p>Loading items...</p>;
  }

  if (!orderItems || !menuItems) {
    return <p>Could not load order items.</p>;
  }

  const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));

  const fullOrderItems = orderItems.map((orderItem) => ({
    ...orderItem,
    menuItem: menuItemsById.get(orderItem.menuItemId),
  }));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fullOrderItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.menuItem?.name || 'Item not found'}</TableCell>
            <TableCell className="text-center">{item.quantity}</TableCell>
            <TableCell className="text-right">
              {item.price.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {(item.price * item.quantity).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const subtotal = order.totalAmount - order.convenienceFee;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information for order {order.id}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-muted-foreground">Customer ID:</p>
            <p className="font-mono text-xs">{order.userId}</p>

            <p className="text-muted-foreground">Order ID:</p>
            <p className="font-mono text-xs">{order.id}</p>

            <p className="text-muted-foreground">Date:</p>
            <p>{new Date(order.orderDate).toLocaleString()}</p>

            <p className="text-muted-foreground">Status:</p>
            <p>
              <Badge>{order.status}</Badge>
            </p>
          </div>

          <Separator />

          <h4 className="font-semibold">Items Ordered</h4>
          <OrderItemsTable order={order} />

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Convenience Fee</p>
              <p>{order.convenienceFee.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <p>Grand Total</p>
            <p>{order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
