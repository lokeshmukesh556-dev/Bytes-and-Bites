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

export const menuItems: MenuItem[] = [];

export const salesData: { month: string, totalSales: number }[] = [];

export const topSellingItems: { name: string, weekly: number, monthly: number }[] = [];
