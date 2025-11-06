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
import { useMenu } from '@/context/MenuContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function StockManagementPage() {
  const { menuItems, updateMenuItem, isLoading } = useMenu();
  const { toast } = useToast();
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (menuItems) {
      const initialStock = menuItems.reduce((acc, item) => {
        acc[item.id] = item.stock;
        return acc;
      }, {} as Record<string, number>);
      setStockLevels(initialStock);
    }
  }, [menuItems]);

  const handleStockChange = (itemId: string, value: string) => {
    const newStock = Number(value);
    if (!isNaN(newStock) && newStock >= 0) {
      setStockLevels((prev) => ({ ...prev, [itemId]: newStock }));
    }
  };

  const handleSaveChanges = () => {
    startTransition(() => {
      const updatePromises = Object.entries(stockLevels).map(([id, stock]) => {
        const originalItem = menuItems.find((item) => item.id === id);
        // Only update if the stock level has changed
        if (originalItem && originalItem.stock !== stock) {
          return updateMenuItem(id, { stock });
        }
        return Promise.resolve();
      });

      Promise.all(updatePromises)
        .then(() => {
          toast({
            title: 'Success',
            description: 'Stock levels updated successfully.',
          });
        })
        .catch(() => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update some stock levels.',
          });
        });
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Stock Management</CardTitle>
          <CardDescription>
            Update the available quantity for each menu item.
          </CardDescription>
        </div>
        <Button onClick={handleSaveChanges} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save All Changes'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[150px]">Available Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading stock...
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={stockLevels[item.id] ?? ''}
                      onChange={(e) => handleStockChange(item.id, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
