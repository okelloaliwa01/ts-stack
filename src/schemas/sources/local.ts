import { z } from 'zod';

export interface LocalConfig {
  type: 'local';
  schema: string;
}

export const LocalSchema = z.object({
  type: z.enum(['local']),
  schema: z.string(),
});
