
'use client';

import { AppHeader } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useMenu, type MenuItemWithId } from '@/context/MenuContext';
import { Skeleton } from '@/components/ui/skeleton';

function MenuItemCard({ item }: { item: MenuItemWithId }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item.id);
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={item.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2">{item.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <p className="text-lg font-bold text-primary">{item.price.toFixed(2)}</p>
        <Button size="sm" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden shadow-md">
          <Skeleton className="w-full h-48" />
          <CardContent className="p-4 flex-grow space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-9 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function MenuPage() {
  const { getMeals, getSnacks, isLoading } = useMenu();
  const meals = getMeals();
  const snacks = getSnacks();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
            Today's Menu
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Freshly prepared, just for you.
          </p>
        </div>
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-8">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="snacks">Snacks & Beverages</TabsTrigger>
          </TabsList>
          <TabsContent value="meals">
            {isLoading ? (
              <MenuSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {meals.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="snacks">
            {isLoading ? (
              <MenuSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {snacks.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
