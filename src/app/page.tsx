
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Link from 'next/link';
import {
  initiateAnonymousSignIn,
  useAuth,
  useUser,
  initiateEmailSignUp,
  initiateEmailSignIn,
} from '@/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // States for form inputs
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    // This effect handles automatic redirection if the user is already logged in.
    if (user && !user.isAnonymous) {
      // You might want to differentiate redirection based on user role here in the future
      router.push('/menu');
    }
  }, [user, router]);

  useEffect(() => {
    // This handles the initial anonymous sign-in for guest users.
    if (auth && !user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  const handleCustomerLogin = () => {
    if (auth) {
      initiateEmailSignIn(auth, customerEmail, customerPassword);
      // onAuthStateChanged will handle the redirect on successful login
    }
  };

  const handleAdminLogin = () => {
    // For now, we will just navigate.
    // In a real app, you would handle email/password login here.
    // We assume admin role is pre-assigned in Firebase Console.
    if (user) {
      router.push('/admin/dashboard');
    }
  };

  const handleCustomerSignUp = () => {
    if (auth) {
      initiateEmailSignUp(auth, signupEmail, signupPassword);
      toast({
        title: 'Account Created',
        description: 'You have been successfully signed up and logged in.',
      });
      // onAuthStateChanged will handle the redirect on successful sign-up
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary font-headline">
            Violet Bites
          </h1>
          <p className="text-muted-foreground">
            Your campus canteen, just a click away.
          </p>
        </div>
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="admin">Canteen</TabsTrigger>
            <TabsTrigger value="superadmin">food court</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Login</CardTitle>
                <CardDescription>
                  Enter your credentials to order your meal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="user@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">Password</Label>
                  <Input
                    id="customer-password"
                    type="password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCustomerLogin}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to start ordering from Violet Bites.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="new.user@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCustomerSignUp}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Canteen Admin Login</CardTitle>
                <CardDescription>
                  Access the canteen management dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@canteen.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAdminLogin}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="superadmin">
            <Card>
              <CardHeader>
                <CardTitle>Food Court Admin Login</CardTitle>
                <CardDescription>
                  Access the application's global data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="superadmin-email">Email</Label>
                  <Input
                    id="superadmin-email"
                    type="email"
                    placeholder="super@violetbites.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superadmin-password">Password</Label>
                  <Input id="superadmin-password" type="password" />
                </div>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Link href="/superadmin/dashboard">Login</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
