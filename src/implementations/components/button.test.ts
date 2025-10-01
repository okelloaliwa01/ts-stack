import { describe, it, expect } from 'vitest';
import button from './button.js';

describe('button', () => {
  describe('getComponents', () => {
    it('empty', () => {
      const result = button.getComponents({ type: 'button' });
      expect(result).toStrictEqual(expect.arrayContaining([]));
    });
  });
});
