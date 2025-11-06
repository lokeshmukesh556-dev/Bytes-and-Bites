
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
  sendPasswordReset,
} from '@/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (user && !user.isAnonymous) {
      router.push('/menu');
    }
  }, [user, router]);

  useEffect(() => {
    if (auth && !user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  const handleCustomerLogin = () => {
    if (auth) {
      initiateEmailSignIn(auth, customerEmail, customerPassword);
    }
  };

  const handleAdminLogin = () => {
    if (
      adminEmail === 'watson777@gmail.com' &&
      adminPassword === 'watson777'
    ) {
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

  const handlePasswordReset = () => {
    if (auth && resetEmail) {
      sendPasswordReset(auth, resetEmail);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${resetEmail}, you will receive an email with instructions. Please check your spam folder if you do not see it.`,
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } else {
       toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
    }
  };

  if (isUserLoading || (user && !user.isAnonymous)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <Card>
                {isSigningUp ? (
                  <>
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
                      <div className="space-y-2 relative">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-1 right-1 h-7 w-7"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        onClick={handleCustomerSignUp}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Create Account
                      </Button>
                      <p className="text-center text-sm">
                        Already have an account?{' '}
                        <button
                          onClick={() => setIsSigningUp(false)}
                          className="font-medium text-primary hover:underline"
                        >
                          Login
                        </button>
                      </p>
                    </CardContent>
                  </>
                ) : (
                  <>
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
                      <div className="space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="customer-password">Password</Label>
                          <AlertDialogTrigger asChild>
                             <button
                                className="text-xs font-medium text-primary hover:underline"
                                onClick={() => {
                                  setResetEmail(customerEmail);
                                }}
                              >
                                Forgot Password?
                              </button>
                          </AlertDialogTrigger>
                        </div>

                        <Input
                          id="customer-password"
                          type={showPassword ? 'text' : 'password'}
                          value={customerPassword}
                          onChange={(e) =>
                            setCustomerPassword(e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-1 right-1 h-7 w-7"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        onClick={handleCustomerLogin}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Login
                      </Button>
                      <p className="text-center text-sm">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setIsSigningUp(true)}
                          className="font-medium text-primary hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                    </CardContent>
                  </>
                )}
              </Card>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Your Password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter your email address below and we'll send you a link to reset
                    your password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="user@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePasswordReset}>
                    Send Reset Link
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                <div className="space-y-2 relative">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
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
                <div className="space-y-2 relative">
                  <Label htmlFor="superadmin-password">Password</Label>
                  <Input
                    id="superadmin-password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-7 w-7"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
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

    