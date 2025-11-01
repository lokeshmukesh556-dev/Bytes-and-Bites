import { AppHeader } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { meals, snacks, type MenuItem } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={item.image.imageUrl}
          alt={item.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={item.image.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <p className="text-lg font-bold text-primary">{item.price.toFixed(2)}</p>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meals.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="snacks">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {snacks.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
