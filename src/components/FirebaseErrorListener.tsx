
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { AuthError } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/email-already-in-use':
      return 'This email is already in use by another account.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
        return 'The email address is not valid.';
    // This error is often a transient issue on initial load and should not be shown to the user.
    case 'auth/operation-not-allowed':
        return 'An internal authentication error occurred. Please try again later.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
}

/**
 * An invisible component that listens for globally emitted errors.
 * For Firestore permission errors, it throws them to be caught by Next.js's overlay.
 * For Auth errors, it displays a user-friendly toast notification, unless it's a silent-fail error.
 */
export function FirebaseErrorListener() {
  const [permissionError, setPermissionError] = useState<FirestorePermissionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      setPermissionError(error);
    };

    const handleAuthError = (error: AuthError) => {
      // Don't show a toast for errors that should fail silently,
      // like the initial anonymous auth setup which can sometimes fail on first load.
      if (error.code === 'auth/operation-not-allowed') {
        console.warn('Silent auth error:', error.message);
        return;
      }
      
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: getAuthErrorMessage(error.code),
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    errorEmitter.on('auth-error', handleAuthError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
      errorEmitter.off('auth-error', handleAuthError);
    };
  }, [toast]);

  if (permissionError) {
    throw permissionError;
  }

  return null;
}
