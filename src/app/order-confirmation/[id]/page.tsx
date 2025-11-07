
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
import { useCart, type CartItem } from '@/context/CartContext';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  // The 'params' object is a Promise-like object in recent Next.js versions.
  // We must use `React.use` to unwrap its value.
  const { id } = React.use(params);
  
  // Get cart data and clearCart function from context
  const { cartItems, subtotal, convenienceFee, total, clearCart } = useCart();
  
  // Create local state to hold a snapshot of the order details.
  const [confirmedOrder, setConfirmedOrder] = useState<{
    items: CartItem[];
    subtotal: number;
    convenienceFee: number;
    total: number;
  } | null>(null);


  useEffect(() => {
    // When the component mounts, if there are items in the cart,
    // save them to the local state and then clear the global cart.
    if (cartItems.length > 0) {
      setConfirmedOrder({
        items: [...cartItems],
        subtotal,
        convenienceFee,
        total,
      });
      clearCart();
    }
  // This effect should only run once when the page loads.
  // clearCart is a stable function, so we only need to depend on the data.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, subtotal, convenienceFee, total]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(id)}`;

  // If the confirmed order data hasn't been set yet (e.g., on first render), show a loading state.
  if (!confirmedOrder) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p>Finalizing your order...</p>
        </div>
    );
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
              {confirmedOrder.items.map(item => (
                <div className="flex justify-between" key={item.id}>
                  <span>{item.name} (x{item.quantity})</span>
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
