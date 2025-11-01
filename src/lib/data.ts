import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const imageMap = new Map<string, ImagePlaceholder>(
  PlaceHolderImages.map((img) => [img.id, img])
);

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'meal' | 'snack';
  image: ImagePlaceholder;
}

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Royal Biryani',
    description: 'Aromatic basmati rice cooked with spices and chicken.',
    price: 150,
    category: 'meal',
    image: imageMap.get('meal-1')!,
  },
  {
    id: '2',
    name: 'South Indian Thali',
    description: 'A complete meal with rice, sambar, rasam, and vegetables.',
    price: 120,
    category: 'meal',
    image: imageMap.get('meal-2')!,
  },
  {
    id: '3',
    name: 'Chilli Garlic Noodles',
    description: 'Stir-fried noodles with a punch of garlic and chili.',
    price: 100,
    category: 'meal',
    image: imageMap.get('meal-3')!,
  },
  {
    id: '4',
    name: 'Punjabi Samosa (2 pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 30,
    category: 'snack',
    image: imageMap.get('snack-1')!,
  },
  {
    id: '5',
    name: 'Filter Coffee',
    description: 'Strong and aromatic South Indian filter coffee.',
    price: 25,
    category: 'snack',
    image: imageMap.get('snack-2')!,
  },
  {
    id: '6',
    name: 'Veg Sandwich',
    description: 'A healthy and fresh sandwich with cucumber, tomato, and lettuce.',
    price: 50,
    category: 'snack',
    image: imageMap.get('snack-3')!,
  },
  {
    id: '7',
    name: 'Bourbon Biscuit',
    description: 'A pack of delicious chocolate cream biscuits.',
    price: 20,
    category: 'snack',
    image: imageMap.get('snack-4')!,
  },
];

export const meals = menuItems.filter((item) => item.category === 'meal');
export const snacks = menuItems.filter((item) => item.category === 'snack');

export interface Order {
  id: string;
  customerName: string;
  items: { menuItem: MenuItem, quantity: number }[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  date: Date;
}

export const orders: Order[] = [
    {
        id: 'ORD001',
        customerName: 'Ankit Sharma',
        items: [{ menuItem: menuItems[0], quantity: 1 }, { menuItem: menuItems[4], quantity: 2 }],
        total: 201, // 150 + 25*2 + 1
        status: 'Ready',
        date: new Date('2024-07-20T12:30:00')
    },
    {
        id: 'ORD002',
        customerName: 'Priya Singh',
        items: [{ menuItem: menuItems[1], quantity: 1 }],
        total: 121, // 120 + 1
        status: 'Preparing',
        date: new Date('2024-07-20T12:35:00')
    },
    {
        id: 'ORD003',
        customerName: 'Rohan Verma',
        items: [{ menuItem: menuItems[3], quantity: 4 }],
        total: 121, // 30*4 + 1
        status: 'Pending',
        date: new Date('2024-07-20T12:40:00')
    }
];

export const salesData = [
  { month: "Jan", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jul", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Aug", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Sep", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Oct", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Nov", totalSales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Dec", totalSales: Math.floor(Math.random() * 5000) + 1000 },
];

export const topSellingItems = [
    { name: 'Royal Biryani', weekly: 120, monthly: 450 },
    { name: 'Filter Coffee', weekly: 300, monthly: 1100 },
    { name: 'Punjabi Samosa', weekly: 250, monthly: 900 },
    { name: 'South Indian Thali', weekly: 90, monthly: 350 },
    { name: 'Chilli Garlic Noodles', weekly: 75, monthly: 280 },
];
