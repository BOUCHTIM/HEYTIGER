export type SectionType = 'food' | 'drink' | 'dessert';

export interface MenuCategory {
  id: string;
  slug: string;
  titleEn: string;
  titleJp: string;
  description: string;
  chapterNumber: number;
  order: number;
  sectionType: SectionType;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  subtitle?: string;
  description?: string;
  priceAED: number;
  tags: string[];
  dietaryInfo?: string[];
  spiceLevel?: number; // 0-3
  image?: string;
  isAvailable: boolean;
  featured: boolean;
}
