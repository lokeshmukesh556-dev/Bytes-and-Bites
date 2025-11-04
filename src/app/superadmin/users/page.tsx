'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, type WithId } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection }from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

// Matches the User entity in backend.json
export interface UserData {
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export type UserWithId = WithId<UserData>;

function getRoleBadgeVariant(role: UserData['role']) {
  switch (role) {
    case 'admin':
      return 'default';
    case 'user':
      return 'secondary';
    default:
      return 'outline';
  }
}


export default function UsersPage() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users, isLoading } = useCollection<UserData>(usersQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Browse and manage all registered users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            )}
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
