'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';

/** Initiate anonymous sign-in (non-blocking). This function will not show an error to the user if it fails. */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error: AuthError) => {
    // Log this error silently to the console for debugging, but do not show a user-facing error.
    console.warn("Silent anonymous sign-in error:", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .catch((error: AuthError) => {
      errorEmitter.emit('auth-error', error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error: AuthError) => {
      errorEmitter.emit('auth-error', error);
    });
}
