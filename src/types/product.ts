
export interface Product {
  id: string;
  name: string;
  category: string;
  type?: 'Sativa' | 'Indica' | 'Hybrid';
  thc?: number;
  price?: number;
  description: string;
  image: string;
  hint: string;
  stock?: number;
  active?: boolean;
  rating?: number;
}
