'use client';

import { Button } from '@/components/ui/button';
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
import { menuItems as initialMenuItems, type MenuItem } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { MenuItemFormDialog } from '@/components/admin/menu-item-form-dialog';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleOpenDialog = (item: MenuItem | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(false);
  }

  const handleSaveItem = (itemData: Omit<MenuItem, 'id' | 'image' | 'description'> & { imageUrl?: string }, id?: string) => {
    const { imageUrl, ...restData } = itemData;
    
    if (id) {
      // Editing existing item
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { 
            ...item, 
            ...restData,
            image: {
              ...item.image,
              imageUrl: imageUrl || item.image.imageUrl
            }
          } : item
        )
      );
    } else {
      // Adding new item
      const newMenuItem: MenuItem = {
        ...restData,
        id: `item-${Date.now()}`,
        description: '', // Add an empty description
        // For simplicity, using a placeholder image if no URL is provided.
        image: {
          id: `new-${Date.now()}`,
          imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`,
          imageHint: 'food placeholder',
          description: 'A new menu item',
        },
      };
      setMenuItems((prev) => [...prev, newMenuItem]);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Menu Management</CardTitle>
            <CardDescription>
              Add, edit, or remove items from your canteen's menu.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={item.image.imageUrl}
                      width="64"
                      data-ai-hint={item.image.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <MenuItemFormDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </>
  );
}
