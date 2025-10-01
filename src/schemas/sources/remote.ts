import { z } from 'zod';

export interface RemoteConfig {
  type: 'remote';
  schema: string;
  url: string;
}

export const RemoteSchema = z.object({
  type: z.enum(['remote']),
  schema: z.string(),
  url: z.url(),
});
