
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useState, useMemo } from 'react';
import { OrderDetailsDialog } from '@/components/admin/order-details-dialog';
import { useCollection, useFirestore, WithId } from '@/firebase';
import { collectionGroup, doc, query, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { QrScannerDialog } from '@/components/admin/qr-scanner-dialog';
import { useToast } from '@/hooks/use-toast';
import type { OrderData, OrderWithId } from '@/app/admin/orders/page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function SuperAdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const ordersQuery = useMemoFirebase(() => {
    return firestore ? query(collectionGroup(firestore, 'orders')) : null;
  }, [firestore]);

  const { data: orders } = useCollection<OrderData>(ordersQuery);

  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const ordersMap = useMemo(() => {
    if (!orders) return new Map();
    return new Map(orders.map(order => [order.id, order]));
  }, [orders]);

  const handleUpdateStatus = (orderId: string, userId: string, status: OrderWithId['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, `users/${userId}/orders/${orderId}`);
    updateDoc(orderRef, { status: status });
  }

  const handleScanResult = (result: string) => {
    setIsScannerOpen(false);
    const scannedOrder = ordersMap.get(result);

    if (scannedOrder) {
        if (scannedOrder.status === 'Completed') {
            toast({
                variant: 'destructive',
                title: 'Order Already Served',
                description: `This order (${result}) has already been marked as completed.`,
            });
            // Do not open the dialog if already completed
        } else {
            setSelectedOrder(scannedOrder);
            setIsDetailsDialogOpen(true);
        }
    } else {
         toast({
            variant: 'destructive',
            title: 'Order Not Found',
            description: `Could not find an order with the ID: ${result}`,
        });
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scan & Serve</CardTitle>
          <CardDescription>
            Scan a customer's QR code to retrieve and complete their order.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-6 p-12">
            <QrCode className="size-16 text-muted-foreground" />
             <Alert>
                <AlertTitle>Centralized Order Fulfillment</AlertTitle>
                <AlertDescription>
                    Use this page at the central food court counter to scan any customer QR code, view their order, and mark it as served.
                </AlertDescription>
            </Alert>
           <Button onClick={() => setIsScannerOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan Order QR
            </Button>
        </CardContent>
      </Card>
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onMarkCompleted={() => handleUpdateStatus(selectedOrder.id, selectedOrder.userId, 'Completed')}
        />
      )}
      <QrScannerDialog 
        isOpen={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onResult={handleScanResult}
      />
    </>
  );
}
