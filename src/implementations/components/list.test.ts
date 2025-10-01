import { describe, it, expect } from 'vitest';
import list from './list.js';

describe('list', () => {
  describe('getComponents', () => {
    it('list of buttons', () => {
      const result = list.getComponents({
        type: 'list',
        source: 'test',
        items: { components: [{ type: 'button' }] },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'button' })])
      );
    });

    it('list of empty cards', () => {
      const result = list.getComponents({
        type: 'list',
        source: 'test',
        items: { components: [{ type: 'card' }] },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'card' })])
      );
    });

    it('list of cards with buttons', () => {
      const result = list.getComponents({
        type: 'list',
        source: 'test',
        items: {
          components: [
            { type: 'card', content: { components: [{ type: 'button' }] } },
          ],
        },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'card' }),
          expect.objectContaining({ type: 'button' }),
        ])
      );
    });
  });
});
