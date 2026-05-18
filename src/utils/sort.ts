import type { Part } from '../types';

export type SortKey = keyof Pick<Part, 'partNumber' | 'quantity' | 'name' | 'vendor' | 'location' | 'createdAt'>;
export type SortDir = 'asc' | 'desc';

export function sortParts(parts: Part[], key: SortKey | null, dir: SortDir): Part[] {
  if (!key) return parts;
  return [...parts].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp =
      typeof av === 'string' && typeof bv === 'string'
        ? av.localeCompare(bv, undefined, { sensitivity: 'base' })
        : (av as number) - (bv as number);
    return dir === 'asc' ? cmp : -cmp;
  });
}
