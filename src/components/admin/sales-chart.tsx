'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
} from '@/components/ui/chart';
import { useMemo } from 'react';
import type { OrderWithId } from '@/app/admin/orders/page';

const chartConfig = {
  totalSales: {
    label: 'Total Sales',
    color: 'hsl(var(--primary))',
  },
};

interface SalesChartProps {
  orders: OrderWithId[] | null;
  isLoading: boolean;
}

export function SalesChart({ orders, isLoading }: SalesChartProps) {
  const salesData = useMemo(() => {
    if (!orders) return [];

    const monthlySales: Record<string, number> = {};
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Initialize all months of the current year to 0
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
        const monthKey = `${currentYear}-${i}`;
        monthlySales[monthKey] = 0;
    }


    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const year = date.getFullYear();
      if(year === currentYear) {
        const month = date.getMonth();
        const key = `${year}-${month}`;
        monthlySales[key] = (monthlySales[key] || 0) + order.totalAmount;
      }
    });

    return Object.entries(monthlySales).map(([key, totalSales]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: monthNames[month],
        totalSales,
      };
    }).sort((a,b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
  }, [orders]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Statistics</CardTitle>
          <CardDescription>Last 12 Months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Statistics</CardTitle>
        <CardDescription>This Year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={salesData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `${Number(value) / 1000}k`}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="totalSales"
              fill="var(--color-totalSales)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
