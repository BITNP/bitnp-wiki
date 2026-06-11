import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/index.mdx', base: './content' }),
    schema: z.object({
      title: z.string(),
      path: z.string().optional(),
      description: z.string().optional(),
      contentType: z.string().optional(),
      mermaid: z.boolean().optional(),
    }),
  }),
};
