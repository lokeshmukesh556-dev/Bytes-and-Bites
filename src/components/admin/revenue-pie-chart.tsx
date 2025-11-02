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

const revenueData = [
  { category: 'Meals', revenue: 6500, fill: 'var(--color-meals)' },
  { category: 'Snacks', revenue: 2500, fill: 'var(--color-snacks)' },
  { category: 'Fees', revenue: 500, fill: 'var(--color-fees)' },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
  },
  meals: {
    label: 'Meals',
    color: 'hsl(var(--chart-1))',
  },
  snacks: {
    label: 'Snacks',
    color: 'hsl(var(--chart-2))',
  },
  fees: {
    label: 'Fees',
    color: 'hsl(var(--chart-3))',
  },
};

export function RevenuePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>By Category - Last 30 Days</CardDescription>
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
