import { z } from 'zod';

export interface InlineConfig {
  type: 'inline';
  schema: string;
  items: Record<string, unknown>[];
}

export const InlineSchema = z.object({
  type: z.enum(['inline']),
  schema: z.string(),
  items: z.array(z.record(z.string(), z.unknown())),
});
