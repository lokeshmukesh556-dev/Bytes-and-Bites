'use client';
import { SalesChart } from '@/components/admin/sales-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, ShoppingBag, Utensils, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RevenuePieChart } from '@/components/admin/revenue-pie-chart';
import { useCollection, useFirestore } from '@/firebase';
import { collection, collectionGroup, query } from 'firebase/firestore';
import { useMemo } from 'react';
import { useMenu } from '@/context/MenuContext';
import { useMemoFirebase } from '@/firebase/provider';
import type { OrderItemData } from '@/components/admin/order-details-dialog';
import { OrderData } from '../orders/page';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'orders')) : null),
    [firestore]
  );
  const { data: orders, isLoading: isLoadingOrders } =
    useCollection<OrderData>(ordersQuery);

  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  const { menuItems, isLoading: isLoadingMenu } = useMenu();

  const orderItemsQuery = useMemoFirebase(
    () =>
      firestore ? query(collectionGroup(firestore, 'order_items')) : null,
    [firestore]
  );
  const { data: orderItems, isLoading: isLoadingOrderItems } =
    useCollection<OrderItemData>(orderItemsQuery);

  const dashboardStats = useMemo(() => {
    if (!orders || !users || !menuItems) {
      return {
        revenue: 0,
        orders: 0,
        customers: 0,
        menuItems: 0,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter(
      (order) => new Date(order.orderDate) >= today
    );

    const todaysRevenue = todaysOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return {
      revenue: todaysRevenue,
      orders: todaysOrders.length,
      customers: users.length, // Assuming all users are customers for this view
      menuItems: menuItems.length,
    };
  }, [orders, users, menuItems]);

  const topSellingItems = useMemo(() => {
    if (!orderItems || !menuItems) return [];
    const itemSales: Record<string, { count: number; name: string }> = {};

    for (const orderItem of orderItems) {
      if (!itemSales[orderItem.menuItemId]) {
        const menuItem = menuItems.find((mi) => mi.id === orderItem.menuItemId);
        if (menuItem) {
          itemSales[orderItem.menuItemId] = {
            count: 0,
            name: menuItem.name,
          };
        }
      }
      if (itemSales[orderItem.menuItemId]) {
        itemSales[orderItem.menuItemId].count += orderItem.quantity;
      }
    }

    return Object.values(itemSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orderItems, menuItems]);

  const stats = [
    {
      title: "Today's Revenue",
      value: dashboardStats.revenue.toFixed(2),
      icon: DollarSign,
      change: '',
    },
    {
      title: "Today's Orders",
      value: dashboardStats.orders.toString(),
      icon: ShoppingBag,
      change: '',
    },
    {
      title: 'Total Customers',
      value: dashboardStats.customers.toString(),
      icon: Users,
      change: '',
    },
    {
      title: 'Menu Items',
      value: dashboardStats.menuItems.toString(),
      icon: Utensils,
      change: '',
    },
  ];

  const isLoading =
    isLoadingOrders ||
    isLoadingUsers ||
    isLoadingMenu ||
    isLoadingOrderItems;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your canteen's performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart orders={orders} isLoading={isLoadingOrders} />
        <RevenuePieChart orders={orders} isLoading={isLoadingOrders} />
      </div>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Number of Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSellingItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
