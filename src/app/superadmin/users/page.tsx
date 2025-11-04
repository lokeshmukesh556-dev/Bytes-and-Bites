import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Browse and manage all registered users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>User management interface will be here.</p>
      </CardContent>
    </Card>
  );
}
