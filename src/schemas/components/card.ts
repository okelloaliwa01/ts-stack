import { type ComponentConfig, ComponentSchema } from '../index.js';
import { z } from 'zod';

export interface CardConfig {
  type: 'card';
  header?: CardHeaderConfig;
  content?: CardContentConfig;
  footer?: CardFooterConfig;
}

export interface CardHeaderConfig {
  title?: string;
  description?: string;
  action?: CardActionConfig;
}

export interface CardActionConfig {
  components?: ComponentConfig[];
}

interface CardPartComponents {
  components: ComponentConfig[];
}

interface CardPartText {
  text: string;
}

export type CardContentConfig = CardPartComponents | CardPartText;

export type CardFooterConfig = CardPartComponents | CardPartText;

export const CardActionSchema = z.lazy(() =>
  z.object({
    components: z.optional(z.array(ComponentSchema)),
  })
);

export const CardHeaderSchema = z.lazy(() =>
  z.object({
    title: z.optional(z.string()),
    description: z.optional(z.string()),
    action: z.optional(CardActionSchema),
  })
);

export const CardContentSchema = z.lazy(() =>
  z.union([
    z.object({
      components: z.array(ComponentSchema),
    }),
    z.object({
      text: z.string(),
    }),
  ])
);

export const CardFooterSchema = z.lazy(() =>
  z.union([
    z.object({
      components: z.array(ComponentSchema),
    }),
    z.object({
      text: z.string(),
    }),
  ])
);

export const CardSchema = z.object({
  type: z.enum(['card']),
  header: z.optional(CardHeaderSchema),
  content: z.optional(CardContentSchema),
  footer: z.optional(CardFooterSchema),
});
