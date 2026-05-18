import { describe, it, expect } from 'vitest';
import { sortParts } from './sort';
import type { Part } from '../types';

const makePart = (overrides: Partial<Part>): Part => ({
  id: 1, partNumber: 'X', quantity: 0, name: null, vendor: null,
  location: null, notes: null,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const parts = [
  makePart({ id: 1, partNumber: 'C', quantity: 10 }),
  makePart({ id: 2, partNumber: 'A', quantity: 5 }),
  makePart({ id: 3, partNumber: 'B', quantity: 0 }),
];

describe('sortParts', () => {
  it('returns parts unchanged when key is null', () => {
    const result = sortParts(parts, null, 'asc');
    expect(result.map(p => p.id)).toEqual([1, 2, 3]);
  });

  it('sorts by partNumber ascending', () => {
    const result = sortParts(parts, 'partNumber', 'asc');
    expect(result.map(p => p.partNumber)).toEqual(['A', 'B', 'C']);
  });

  it('sorts by partNumber descending', () => {
    const result = sortParts(parts, 'partNumber', 'desc');
    expect(result.map(p => p.partNumber)).toEqual(['C', 'B', 'A']);
  });

  it('sorts by quantity ascending', () => {
    const result = sortParts(parts, 'quantity', 'asc');
    expect(result.map(p => p.quantity)).toEqual([0, 5, 10]);
  });

  it('sorts by quantity descending', () => {
    const result = sortParts(parts, 'quantity', 'desc');
    expect(result.map(p => p.quantity)).toEqual([10, 5, 0]);
  });

  it('sorts null values to the bottom in ascending order', () => {
    const withNull = [
      makePart({ id: 1, name: 'B' }),
      makePart({ id: 2, name: null }),
      makePart({ id: 3, name: 'A' }),
    ];
    const result = sortParts(withNull, 'name', 'asc');
    expect(result.map(p => p.id)).toEqual([3, 1, 2]);
  });

  it('sorts null values to the bottom in descending order', () => {
    const withNull = [
      makePart({ id: 1, name: 'B' }),
      makePart({ id: 2, name: null }),
      makePart({ id: 3, name: 'A' }),
    ];
    const result = sortParts(withNull, 'name', 'desc');
    expect(result.map(p => p.id)).toEqual([1, 3, 2]);
  });

  it('does not mutate the original array', () => {
    const ids = parts.map(p => p.id);
    sortParts(parts, 'partNumber', 'asc');
    expect(parts.map(p => p.id)).toEqual(ids);
  });

  it('returns empty array when input is empty', () => {
    expect(sortParts([], 'partNumber', 'asc')).toEqual([]);
  });
});
