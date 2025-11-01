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
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-12 flex justify-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
            <CardDescription>
              Thank you for your order. Here is your bill.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-left space-y-4">
            <div className="p-4 border bg-muted/50 rounded-lg">
              <p className="font-semibold">
                Order ID: <span className="font-mono">{params.id}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date().toLocaleString()}
              </p>
            </div>

            <h3 className="font-semibold pt-4">Items Ordered</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Royal Biryani (x1)</span>
                <span>₹150.00</span>
              </div>
              <div className="flex justify-between">
                <span>Filter Coffee (x2)</span>
                <span>₹50.00</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹200.00</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>₹1.00</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>Total Paid</span>
              <span>₹201.00</span>
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
