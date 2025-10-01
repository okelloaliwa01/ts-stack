import { z } from 'zod';

export interface ButtonConfig {
  type: 'button';
  text?: string;
  icon?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

export const ButtonSchema = z.object({
  type: z.enum(['button']),
  text: z.optional(z.string()),
  icon: z.optional(z.enum([''])),
  variant: z
    .enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'])
    .default('default'),
  size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
  disabled: z.optional(z.boolean()).default(false),
});
