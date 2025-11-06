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
import { useEffect } from 'react';
import Image from 'next/image';

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const { cartItems, subtotal, convenienceFee, total, clearCart } = useCart();
  
  // This effect now correctly clears the cart *after* the confirmation page has loaded.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(params.id)}`;

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
                alt={`QR Code for Order ID ${params.id}`}
                width={150}
                height={150}
              />
            </div>
            <div className="p-4 border bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-lg">{params.id}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-4xl font-bold">{total.toFixed(2)}</p>
            </div>
            
            <Separator />

            <h3 className="font-semibold text-center">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map(item => (
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
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>{convenienceFee.toFixed(2)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>Total Paid</span>
              <span>{total.toFixed(2)}</span>
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
