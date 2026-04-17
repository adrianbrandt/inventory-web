// inventory-web/src/api/stats.ts
import { api } from './client';
import type { Stats } from '../types';

export const getStats = () => api.get<Stats>('/api/stats');
