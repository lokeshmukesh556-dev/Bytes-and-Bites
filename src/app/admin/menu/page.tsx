
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
import {
  type MenuItemData,
  type MenuItemWithId,
  useMenu,
} from '@/context/MenuContext';
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
import { useFirebaseApp } from '@/firebase';

export default function MenuManagementPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isLoading } =
    useMenu();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemWithId | null>(null);
  
  const handleOpenDialog = (item: MenuItemWithId | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleSaveItem = async (
    itemData: Omit<MenuItemData, 'imageHint'>,
    id?: string
  ) => {
    handleCloseDialog();
    
    let finalImageUrl = itemData.imageUrl;

    // If no image URL is provided for a new item, use a placeholder.
    if (!finalImageUrl && !id) {
        finalImageUrl = `https://picsum.photos/seed/${Math.random()}/600/400`;
    }

    const dataToSave = {
        ...itemData,
        description: itemData.description || '',
        imageUrl: finalImageUrl || (id ? menuItems.find(item => item.id === id)?.imageUrl : '') || '',
    };
    
    if (id) {
        // Ensure imageUrl is not an empty string if it was not provided and the item is being edited.
        if (!dataToSave.imageUrl) {
            const currentItem = menuItems.find(item => item.id === id);
            dataToSave.imageUrl = currentItem?.imageUrl || '';
        }
      updateMenuItem(id, dataToSave);
    } else {
      addMenuItem({
          ...dataToSave,
          imageHint: 'food placeholder' // default hint for new items
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteMenuItem(itemId);
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading menu...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={item.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={item.imageUrl}
                        width="64"
                        data-ai-hint={item.imageHint}
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
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(item)}
                          >
                            Edit
                          </DropdownMenuItem>
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
