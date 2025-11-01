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
import type { Order } from '@/lib/data';
import { Separator } from '../ui/separator';

interface OrderDetailsDialogProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );
  const convenienceFee = order.total - subtotal;

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
            <p className="text-muted-foreground">Customer:</p>
            <p className="font-semibold">{order.customerName}</p>

            <p className="text-muted-foreground">Order ID:</p>
            <p className="font-mono text-xs">{order.id}</p>

            <p className="text-muted-foreground">Date:</p>
            <p>{order.date.toLocaleString()}</p>

            <p className="text-muted-foreground">Status:</p>
            <p>
              <Badge>{order.status}</Badge>
            </p>
          </div>

          <Separator />

          <h4 className="font-semibold">Items Ordered</h4>
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
              {order.items.map((item) => (
                <TableRow key={item.menuItem.id}>
                  <TableCell>{item.menuItem.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.menuItem.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.menuItem.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator />
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Convenience Fee</p>
              <p>{convenienceFee.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <p>Grand Total</p>
            <p>{order.total.toFixed(2)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
