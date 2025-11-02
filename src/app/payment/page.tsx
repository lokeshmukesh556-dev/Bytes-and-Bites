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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentPage() {
  const { total } = useCart();
  const router = useRouter();

  useEffect(() => {
    // This page is now effectively deprecated in favor of the cart page's direct checkout.
    // Redirect back to the cart.
    router.replace('/cart');
  }, [router]);

  // Render a loading state or null while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Redirecting to your cart...</p>
    </div>
  );
}
