export interface Drop {
  name: string;
  image: string;
  price: string;
  rarity: number;
  code?: string;
}

export interface BoxData {
  title: string;
  image: string;
  description: string;
  normalPrice: string;
  salePrice: string;
  drops: Drop[];
} 