// inventory-web/src/types/index.ts
export interface Part {
  id: number;
  partNumber: string;
  quantity: number;
  name: string | null;
  vendor: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePart {
  partNumber: string;
  quantity: number;
  name?: string;
  vendor?: string;
  location?: string;
  notes?: string;
}

export interface UpdatePart {
  partNumber?: string;
  quantity?: number;
  name?: string | null;
  vendor?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface Stats {
  total: number;
  outOfStock: number;
  vendors: number;
  totalUnits: number;
}

export interface Filters {
  q?: string;
  vendor?: string[];
  location?: string[];
  stock?: 'empty' | 'stocked';
}

export interface AuthUser {
  username: string;
}
