
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
  initiateEmailSignIn,
  initiateEmailSignUp,
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
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  useEffect(() => {
    // This effect handles automatic redirection if the user is already logged in.
    if (user && !user.isAnonymous) {
      // You might want to differentiate redirection based on user role here in the future
      router.push('/menu');
    }
  }, [user, router]);

  useEffect(() => {
    // This handles the initial anonymous sign-in for guest users or after logout.
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
    if (
      adminEmail === 'watson777@gmail.com' &&
      adminPassword === 'watson777'
    ) {
      // In a real app, you would handle proper Firebase Auth for admins here.
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials for admin.',
      });
    }
  };

  const handleCustomerSignUp = () => {
    if (auth) {
      initiateEmailSignUp(auth, signUpEmail, signUpPassword);
    }
  };

  if (isUserLoading || (user && !user.isAnonymous)) {
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="admin">Canteen</TabsTrigger>
            <TabsTrigger value="superadmin">food court</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
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
                      Sign up to start ordering.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="user@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
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
            </Tabs>
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
