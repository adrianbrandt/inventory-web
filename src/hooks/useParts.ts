// inventory-web/src/hooks/useParts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParts, createPart, updatePart, deletePart } from '../api/parts';
import type { Filters, CreatePart, UpdatePart } from '../types';

export function useParts(filters: Filters) {
  return useQuery({ queryKey: ['parts', filters], queryFn: () => getParts(filters), staleTime: 5 * 60 * 1000 });
}

export function useCreatePart() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreatePart) => createPart(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['parts'] }) });
}

export function useUpdatePart() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: UpdatePart }) => updatePart(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['parts'] }); qc.invalidateQueries({ queryKey: ['stats'] }); } });
}

export function useDeletePart() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => deletePart(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['parts'] }); qc.invalidateQueries({ queryKey: ['stats'] }); } });
}
