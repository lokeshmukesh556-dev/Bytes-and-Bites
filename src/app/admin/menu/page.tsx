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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase';

export default function MenuManagementPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isLoading } =
    useMenu();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemWithId | null>(null);
  const firebaseApp = useFirebaseApp();

  const handleOpenDialog = (item: MenuItemWithId | null = null) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleSaveItem = async (
    itemData: Omit<MenuItemData, 'imageUrl' | 'imageHint'> & {
      imageFile?: File;
    },
    id?: string
  ) => {
    const { imageFile, ...restData } = itemData;

    let dataToSave: Partial<MenuItemData> = {
      ...restData,
      description: restData.description || '', // Ensure description is always a string
    };

    if (imageFile) {
      const storage = getStorage(firebaseApp);
      const storageRef = ref(
        storage,
        `menu_items/${Date.now()}_${imageFile.name}`
      );
      const snapshot = await uploadBytes(storageRef, imageFile);
      dataToSave.imageUrl = await getDownloadURL(snapshot.ref);
      // For simplicity, we're not generating a new AI hint for uploaded images
    } else if (!id) {
      // If it's a new item without an image, use a placeholder
      const randomSeed = Math.floor(Math.random() * 1000);
      dataToSave.imageUrl = `https://picsum.photos/seed/${randomSeed}/600/400`;
      dataToSave.imageHint = 'food placeholder';
    }

    if (id) {
      updateMenuItem(id, dataToSave);
    } else {
      // For a new item, we need to ensure all fields for MenuItemData are present
      const finalNewItemData: MenuItemData = {
        name: dataToSave.name!,
        price: dataToSave.price!,
        category: dataToSave.category!,
        description: dataToSave.description!,
        imageUrl: dataToSave.imageUrl || `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`,
        imageHint: dataToSave.imageHint || 'food placeholder',
      };
      addMenuItem(finalNewItemData);
    }
    handleCloseDialog();
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
