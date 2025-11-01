import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building, DollarSign, ShoppingBag, Users } from 'lucide-react';

const stats = [
  {
    title: 'Platform Revenue',
    value: '2,54,320',
    icon: DollarSign,
    description: 'All-time revenue from convenience fees',
  },
  {
    title: 'Total Orders',
    value: '15,890',
    icon: ShoppingBag,
    description: 'All-time orders placed across all canteens',
  },
  {
    title: 'Active Canteens',
    value: '23',
    icon: Building,
    description: 'Canteens currently using the service',
  },
  {
    title: 'Total Users',
    value: '4,210',
    icon: Users,
    description: 'Total registered customer accounts',
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Global Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Can add more global charts and tables for app-wide analytics here */}
    </div>
  );
}
