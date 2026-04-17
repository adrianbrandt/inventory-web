// inventory-web/src/api/parts.ts
import { api } from './client';
import type { Part, CreatePart, UpdatePart, Filters } from '../types';

function buildQuery(filters: Filters): string {
  const p = new URLSearchParams();
  if (filters.q) p.set('q', filters.q);
  if (filters.vendor?.length) p.set('vendor', filters.vendor.join(','));
  if (filters.location?.length) p.set('location', filters.location.join(','));
  if (filters.stock) p.set('stock', filters.stock);
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

export const getParts = (filters: Filters = {}) =>
  api.get<Part[]>(`/api/parts${buildQuery(filters)}`);

export const createPart = (data: CreatePart) => api.post<Part>('/api/parts', data);

export const updatePart = (id: number, data: UpdatePart) =>
  api.patch<Part>(`/api/parts/${id}`, data);

export const deletePart = (id: number) => api.delete(`/api/parts/${id}`);
