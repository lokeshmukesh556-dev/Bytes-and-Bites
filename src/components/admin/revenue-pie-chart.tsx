'use client';
import { Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { OrderWithId } from '@/app/admin/orders/page';
import { useMemo } from 'react';
import { useMenu } from '@/context/MenuContext';
import { useCollection, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collectionGroup, query } from 'firebase/firestore';
import type { OrderItemData } from './order-details-dialog';

const chartConfig = {
  revenue: {
    label: 'Revenue',
  },
  meal: {
    label: 'Meals',
    color: 'hsl(var(--chart-1))',
  },
  snack: {
    label: 'Snacks',
    color: 'hsl(var(--chart-2))',
  },
  fees: {
    label: 'Fees',
    color: 'hsl(var(--chart-3))',
  },
};

interface RevenuePieChartProps {
  orders: OrderWithId[] | null;
  isLoading: boolean;
}

export function RevenuePieChart({ orders, isLoading: isLoadingOrders }: RevenuePieChartProps) {
    const firestore = useFirestore();
    const { menuItems, isLoading: isLoadingMenu } = useMenu();

    const orderItemsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collectionGroup(firestore, 'order_items'))
        : null,
    [firestore]
  );

  const { data: orderItems, isLoading: isLoadingOrderItems } =
    useCollection<OrderItemData>(orderItemsQuery);

  const revenueData = useMemo(() => {
    if (!orders || !orderItems || !menuItems) return [];
    
    const menuItemsMap = new Map(menuItems.map(item => [item.id, item]));

    const revenueByCategory = {
        meal: 0,
        snack: 0,
        fees: 0
    };

    orderItems.forEach(orderItem => {
        const menuItem = menuItemsMap.get(orderItem.menuItemId);
        if (menuItem) {
            revenueByCategory[menuItem.category] += orderItem.price * orderItem.quantity;
        }
    });

    orders.forEach(order => {
        revenueByCategory.fees += order.convenienceFee;
    });

    return [
        { category: 'meal', revenue: revenueByCategory.meal, fill: 'var(--color-meal)' },
        { category: 'snack', revenue: revenueByCategory.snack, fill: 'var(--color-snack)' },
        { category: 'fees', revenue: revenueByCategory.fees, fill: 'var(--color-fees)' },
    ];
    
  }, [orders, orderItems, menuItems]);

  const isLoading = isLoadingOrders || isLoadingMenu || isLoadingOrderItems;

  if (isLoading) {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By Category</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
                    Loading chart data...
                </div>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>By Category - All Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="revenue" hideLabel />}
            />
            <Pie data={revenueData} dataKey="revenue" nameKey="category" />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
