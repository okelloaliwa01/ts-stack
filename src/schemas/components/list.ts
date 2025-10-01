import { type ComponentConfig, ComponentSchema } from '../index.js';
import { z } from 'zod';

export interface ListConfig {
  type: 'list';
  source: string; // TODO validate if the source name exists in sources
  items: {
    components: ComponentConfig[];
  };
}

export const ListSchema: z.ZodType<ListConfig> = z.lazy(() =>
  z.object({
    type: z.literal('list'),
    source: z.string(),
    items: z.object({
      components: z.array(ComponentSchema),
    }),
  })
);
