
'use client';

import { AppHeader } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  useCollection,
  useDoc,
  useFirestore,
  useUser,
  type WithId,
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import type { OrderData } from '@/app/admin/orders/page';
import type { OrderItemData } from '@/components/admin/order-details-dialog';
import { useMenu } from '@/context/MenuContext';
import { Skeleton } from '@/components/ui/skeleton';

function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-8 w-3/4 mt-4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-4">
            <Skeleton className="w-[150px] h-[150px]" />
          </div>
          <div className="p-4 border bg-muted/50 rounded-lg text-center space-y-2">
            <Skeleton className="h-4 w-1/4 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-1/4 mx-auto" />
            <Skeleton className="h-10 w-1/2 mx-auto" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="pt-6 flex justify-center">
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params);
  const { clearCart } = useCart();
  const firestore = useFirestore();
  const { user } = useUser();
  const { menuItems, isLoading: isMenuLoading } = useMenu();

  // Clear the cart once when the page loads after a successful order.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, `users/${user.uid}/orders/${id}`) : null),
    [firestore, user, id]
  );
  const { data: order, isLoading: isOrderLoading } = useDoc<OrderData>(orderRef);

  const orderItemsRef = useMemoFirebase(
    () =>
      firestore && user
        ? collection(firestore, `users/${user.uid}/orders/${id}/order_items`)
        : null,
    [firestore, user, id]
  );
  const { data: orderItems, isLoading: areOrderItemsLoading } = useCollection<OrderItemData>(orderItemsRef);
  
  const menuItemsById = useMemo(() => {
    return new Map(menuItems.map((item) => [item.id, item]));
  }, [menuItems]);

  const confirmedOrder = useMemo(() => {
    if (!order || !orderItems || menuItemsById.size === 0) return null;

    const items = orderItems.map(orderItem => {
        const menuItem = menuItemsById.get(orderItem.menuItemId);
        return {
            ...orderItem,
            name: menuItem?.name || 'Unknown Item',
        };
    });

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
        items,
        subtotal,
        convenienceFee: order.convenienceFee,
        total: order.totalAmount,
    };
  }, [order, orderItems, menuItemsById]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(id)}`;

  const isLoading = isOrderLoading || areOrderItemsLoading || isMenuLoading;

  if (isLoading || !confirmedOrder) {
    return <OrderConfirmationSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-12 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
            <CardDescription>
              Show this QR code at the counter to collect your order.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-4">
              <Image
                src={qrCodeUrl}
                alt={`QR Code for Order ID ${id}`}
                width={150}
                height={150}
              />
            </div>
            <div className="p-4 border bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-lg">{id}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-4xl font-bold">{confirmedOrder.total.toFixed(2)}</p>
            </div>

            <Separator />

            <h3 className="font-semibold text-center">Order Summary</h3>
            <div className="space-y-2">
              {confirmedOrder.items.map((item) => (
                <div className="flex justify-between" key={item.id}>
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{confirmedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>{confirmedOrder.convenienceFee.toFixed(2)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>Total Paid</span>
              <span>{confirmedOrder.total.toFixed(2)}</span>
            </div>
            <div className="pt-6 flex justify-center">
              <Button asChild>
                <Link href="/menu">Place Another Order</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    