
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QrScanner } from './qr-scanner';


interface QrScannerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onResult: (result: string) => void;
}

export function QrScannerDialog({ isOpen, onOpenChange, onResult }: QrScannerDialogProps) {

  const handleScanSuccess = (decodedText: string) => {
    onResult(decodedText);
    onOpenChange(false); // Close the dialog on successful scan
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Customer's Order QR</DialogTitle>
          <DialogDescription>
            Point your camera at the QR code on the customer's device.
          </DialogDescription>
        </DialogHeader>
        <div className='p-4'>
           {isOpen && <QrScanner onScanSuccess={handleScanSuccess} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
