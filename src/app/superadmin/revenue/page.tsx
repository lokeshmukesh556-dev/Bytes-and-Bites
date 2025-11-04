import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RevenuePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          View detailed revenue analytics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Revenue details and charts will be here.</p>
      </CardContent>
    </Card>
  );
}
