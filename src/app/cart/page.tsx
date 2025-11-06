
'use client';

import { AppHeader } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import GooglePayButton from '@google-pay/button-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    convenienceFee,
    total,
  } = useCart();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders the GPay button on the client
    setIsClient(true);
  }, []);

  const handleProceedToPayment = async () => {
    if (!user || !firestore || cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      // 1. Create the main Order document
      const newOrderRef = await addDocumentNonBlocking(
        collection(firestore, `users/${user.uid}/orders`),
        {
          userId: user.uid,
          orderDate: new Date().toISOString(),
          totalAmount: total,
          status: 'Pending',
          convenienceFee: convenienceFee,
        }
      );

      if (!newOrderRef) {
        throw new Error('Failed to create order document.');
      }

      // 2. Create OrderItem documents in the subcollection
      const orderItemsPromises = cartItems.map((item) =>
        addDocumentNonBlocking(
          collection(
            firestore,
            `users/${user.uid}/orders/${newOrderRef.id}/order_items`
          ),
          {
            orderId: newOrderRef.id,
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          }
        )
      );

      await Promise.all(orderItemsPromises);
      
      // 3. Navigate to confirmation page
      router.push(`/order-confirmation/${newOrderRef.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      setIsProcessing(false);
    }
  };

  const paymentRequest = useMemo(() => {
    const baseRequest: Omit<google.payments.api.PaymentDataRequest, 'allowedPaymentMethods'> = {
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: {
            merchantName: 'Violet Bites',
            merchantId: 'BCR2DN6T6N44EPIB',
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: total.toFixed(2),
            currencyCode: 'INR',
            countryCode: 'IN',
        },
    };

    if (isMobile) {
        // UPI configuration for mobile devices
        return {
            ...baseRequest,
            allowedPaymentMethods: [
                {
                    type: 'UPI',
                    parameters: {
                        payeeVpa: '9940918442@upi',
                        payeeName: 'Violet Bites', 
                    },
                     tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                    },
                },
            ],
        };
    } else {
        // Card configuration for desktops
        return {
            ...baseRequest,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                    },
                },
            ],
        };
    }
  }, [total, isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                    data-ai-hint={item.imageHint}
                  />
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Input
                      readOnly
                      value={item.quantity}
                      className="h-8 w-12 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <CardTitle>Your cart is empty</CardTitle>
                <CardDescription className="mt-2">
                  Looks like you haven't added anything to your cart yet.
                </CardDescription>
                <Button asChild className="mt-6">
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your order before payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Convenience Fee</p>
                  <p>{convenienceFee.toFixed(2)}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>{total.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter>
                {isClient && cartItems.length > 0 && (
                  <GooglePayButton
                    environment="TEST"
                    paymentRequest={paymentRequest}
                    onLoadPaymentData={handleProceedToPayment}
                    buttonType="pay"
                    buttonSizeMode="fill"
                    style={{
                      width: '100%',
                    }}
                    disabled={isProcessing}
                  />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
