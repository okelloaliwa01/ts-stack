import { describe, expect,it } from 'vitest';

import card from './card.js';

describe('card', () => {
  describe('getComponents', () => {
    it('card header', () => {
      const result = card.getComponents({ type: 'card', header: {} });
      expect(result).toStrictEqual(expect.arrayContaining([]));
    });

    it('card header action', () => {
      const result = card.getComponents({
        type: 'card',
        header: { action: { components: [{ type: 'button' }] } },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'button' })])
      );
    });

    it('card content', () => {
      const result = card.getComponents({
        type: 'card',
        content: { components: [{ type: 'button' }] },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'button' })])
      );
    });

    it('card empty footer', () => {
      const result = card.getComponents({ type: 'card' });
      expect(result).toStrictEqual(expect.arrayContaining([]));
    });

    it('card footer with button', () => {
      const result = card.getComponents({
        type: 'card',
        footer: { components: [{ type: 'button' }] },
      });
      expect(result).toStrictEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'button' })])
      );
    });
  });
});
