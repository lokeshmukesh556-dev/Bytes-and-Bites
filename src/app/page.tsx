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

export default function LoginPage() {
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
            <TabsTrigger value="superadmin">Service</TabsTrigger>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">Password</Label>
                  <Input id="customer-password" type="password" />
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/menu">Login</Link>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" />
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/admin/dashboard">Login</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="superadmin">
            <Card>
              <CardHeader>
                <CardTitle>Service Admin Login</CardTitle>
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
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
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
