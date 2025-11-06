
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';

interface QrScannerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onResult: (result: string) => void;
}

const QR_READER_ID = "qr-code-reader";

export function QrScannerDialog({ isOpen, onOpenChange, onResult }: QrScannerDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      // Initialize scanner
      const scanner = new Html5Qrcode(QR_READER_ID);
      scannerRef.current = scanner;

      const startScanner = async () => {
        try {
          await scanner.start(
            { facingMode: "environment" },
            { 
              fps: 10, 
              qrbox: { width: 250, height: 250 }
            },
            (decodedText: string, result: Html5QrcodeResult) => {
              onResult(decodedText);
              if (scannerRef.current && scannerRef.current.isScanning) {
                 scannerRef.current.stop().catch(console.error);
              }
            },
            (errorMessage: string, error: Html5QrcodeError) => {
              // This is the error callback, but we will handle major errors in the catch block
            }
          );
        } catch (err: any) {
           if (err.name === 'NotAllowedError') {
             setError('Camera permission is required to scan QR codes. Please enable it in your browser settings.');
           } else if (err.name === 'NotFoundError') {
              setError('No camera found on this device.');
           }
           else {
             console.error('QR Scanner Error:', err);
             setError('An error occurred while trying to access the camera.');
           }
        }
      };

      startScanner();
    } else {
      // Cleanup when dialog closes
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
            // stopping the scanner can throw errors if it's already stopped.
            // console.error("Error stopping scanner:", err);
        });
      }
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
            // console.error("Cleanup error stopping scanner:", err);
        });
      }
    };
  }, [isOpen, onResult]);

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
            {error ? (
                 <Alert variant="destructive">
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ): (
                 <div id={QR_READER_ID} className="w-full"></div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
