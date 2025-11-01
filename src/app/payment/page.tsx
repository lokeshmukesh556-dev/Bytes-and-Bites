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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentPage() {
  const { total } = useCart();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setOrderId(`VB${Date.now()}`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              Choose your payment method. Total: {total.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup defaultValue="upi" className="space-y-2">
              <Label className="flex items-center space-x-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                <RadioGroupItem value="upi" id="upi" />
                <span>UPI / QR Code</span>
              </Label>
              <Label className="flex items-center space-x-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <span>Credit / Debit Card</span>
              </Label>
              <Label className="flex items-center space-x-3 p-4 border rounded-md has-[input:checked]:border-primary cursor-pointer">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <span>Net Banking</span>
              </Label>
            </RadioGroup>

            <div className="space-y-2">
              <p className="text-sm font-medium">Link Bank Account</p>
              <p className="text-xs text-muted-foreground">
                For a faster checkout next time, link your bank account. This is
                a one-time setup.
              </p>
              <Button variant="outline" className="w-full">
                Connect Bank Account
              </Button>
            </div>

            <Button asChild className="w-full text-lg py-6" disabled={total === 0 || !orderId}>
              <Link href={`/order-confirmation/${orderId}`}>Pay Now</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
