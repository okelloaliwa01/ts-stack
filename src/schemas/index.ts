import { z } from 'zod';

import { type ButtonConfig, ButtonSchema } from './components/button.js';
import { type CardConfig, CardSchema } from './components/card.js';
import { type ListConfig, ListSchema } from './components/list.js';
import { type InlineConfig, InlineSchema } from './sources/inline.js';
import { type LocalConfig, LocalSchema } from './sources/local.js';
import { type RemoteConfig, RemoteSchema } from './sources/remote.js';

export type ComponentConfig = ButtonConfig | CardConfig | ListConfig;

export const SchemaSchema = z.record(z.string(), z.enum(['string', 'number']));

export type SourceConfig = InlineConfig | RemoteConfig | LocalConfig;

export const SourceSchema = z.union([InlineSchema, RemoteSchema, LocalSchema]);

export const ComponentSchema: z.ZodType<ComponentConfig> = z.lazy(() =>
  z.union([ButtonSchema, CardSchema, ListSchema])
);

export const PageSchema = z.object({
  name: z.string(),
  components: z.array(ComponentSchema),
  icon: z.string(), // TODO validate icons
});

export const AppSchema = z
  .object({
    schemas: z.record(z.string(), SchemaSchema),
    sources: z.record(z.string(), SourceSchema),
    pages: z.array(PageSchema),
  })
  .superRefine((value, ctx) => {
    const checkedSourcesNames = [];
    for (const [sourceName, sourceConfig] of Object.entries(value.sources)) {
      if (checkedSourcesNames.includes(sourceName)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate source name ${sourceName}`,
          input: value.sources,
        });
      }

      checkedSourcesNames.push(sourceName);
      if (!value.schemas[sourceConfig.schema]) {
        ctx.addIssue({
          code: 'custom',
          message: `Missing schema ${sourceConfig.schema}`,
          input: sourceConfig,
        });
      }

      const sourceZodSchema = z.array(
        z
          .object(
            Object.fromEntries(
              Object.entries(value.schemas[sourceConfig.schema]).map(
                ([propertyName, propertyType]) => {
                  switch (propertyType) {
                    case 'string':
                      return [propertyName, z.string()];
                    case 'number':
                      return [propertyName, z.number()];
                  }
                }
              )
            )
          )
          .strict()
      );

      if (sourceConfig.type === 'inline') {
        const { error } = sourceZodSchema.safeParse(sourceConfig.items);
        if (error) {
          ctx.addIssue({
            code: 'custom',
            message: z.prettifyError(error),
          });
        }
      }
    }
    // check sources usage
  });
