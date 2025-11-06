
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { type MenuItemWithId } from '@/context/MenuContext';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { ImageUploader } from './image-uploader';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.enum(['meal', 'snack']),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  imageFile: z.instanceof(File).optional().nullable(),
});

type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (
    item: MenuItemFormValues,
    id?: string
  ) => void;
  item: MenuItemWithId | null;
}

export function MenuItemFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  item,
}: MenuItemFormDialogProps) {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'meal',
      imageUrl: '',
      imageFile: null,
    },
  });

  useEffect(() => {
    // Only reset form when the dialog opens with a new item or for a new entry.
    if (isOpen) {
      if (item) {
        form.reset({
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl || '',
          imageFile: null,
        });
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          category: 'meal',
          imageUrl: '',
          imageFile: null,
        });
      }
    }
  }, [item, isOpen, form]);

  const onSubmit = (values: MenuItemFormValues) => {
    onSave(values, item?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
          <DialogDescription>
            {item
              ? 'Update the details for this item.'
              : 'Fill in the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Veggie Burger" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of the item."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <ImageUploader 
                                onFileChange={(file) => field.onChange(file)}
                                onUrlChange={(url) => form.setValue('imageUrl', url)}
                                currentImageUrl={form.watch('imageUrl')}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {item ? 'Save Changes' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
