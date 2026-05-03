import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', true && 'text-white', false && 'text-black')).toBe('bg-red-500 text-white');
  });

  it('should handle twMerge tailwind class overrides', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle arrays and objects', () => {
    expect(cn(['bg-red-500', 'text-white'])).toBe('bg-red-500 text-white');
    expect(cn({ 'bg-red-500': true, 'text-white': false })).toBe('bg-red-500');
  });
});
