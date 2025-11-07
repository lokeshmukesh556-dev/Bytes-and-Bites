
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

const QR_READER_ID = "qr-code-reader-element";

export function QrScanner({ onScanSuccess }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure this only runs on the client
        if (typeof window === 'undefined') return;

        scannerRef.current = new Html5Qrcode(QR_READER_ID, /* verbose= */ false);
        let scannerInstance = scannerRef.current;

        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 }
        };

        const successCallback = (decodedText: string, result: Html5QrcodeResult) => {
            onScanSuccess(decodedText);
        };

        const errorCallback = (errorMessage: string, errorInfo: Html5QrcodeError) => {
            // We can ignore most errors as the library tries to scan continuously.
            // console.warn(`QR Code no longer visible or scan error: ${errorMessage}`);
        };

        Html5Qrcode.getCameras().then(cameras => {
            if (cameras && cameras.length) {
                scannerInstance.start(
                    { facingMode: "environment" },
                    config,
                    successCallback,
                    errorCallback
                ).catch((err: any) => {
                    if (err.name === 'NotAllowedError') {
                        setError('Camera permission is required to scan QR codes. Please enable it in your browser settings.');
                    } else {
                        setError('Failed to start the camera.');
                        console.error("Failed to start scanner:", err);
                    }
                });
            } else {
                setError("No cameras found on this device.");
            }
        }).catch(err => {
            setError("Could not get camera permissions.");
            console.error("Error getting cameras:", err);
        });

        return () => {
            // Cleanup function to stop the scanner
            if (scannerInstance && scannerInstance.isScanning) {
                scannerInstance.stop().catch(err => {
                    console.error("Failed to stop the scanner on cleanup:", err);
                });
            }
        };
    }, [onScanSuccess]);

    return (
        <>
            {error ? (
                 <Alert variant="destructive">
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : (
                <div id={QR_READER_ID} className="w-full"></div>
            )}
        </>
    );
}
