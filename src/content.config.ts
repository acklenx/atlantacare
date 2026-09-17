import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// One markdown file per page. Nested folders become nested URLs
// (services/free-ultrasound.md -> /services/free-ultrasound/).
const section = z.discriminatedUnion('_template', [
  z.object({
    _template: z.literal('callout'),
    heading: z.string(),
    text: z.string().optional(),
    button_label: z.string().optional(),
    button_url: z.string().optional(),
  }),
  z.object({
    _template: z.literal('text'),
    body: z.string(),
    background_image: z.string().optional(),
    columns: z.number().optional(),
    button_label: z.string().optional(),
    button_url: z.string().optional(),
  }),
  z.object({
    _template: z.literal('two_column'),
    left: z.string().optional(),
    left_image: z.string().optional(),
    left_image_alt: z.string().optional(),
    right: z.string().optional(),
    right_image: z.string().optional(),
    right_image_alt: z.string().optional(),
  }),
  z.object({
    _template: z.literal('cards'),
    items: z.array(z.object({
      title: z.string(),
      text: z.string().optional(),
      image: z.string().optional(),
      image_alt: z.string().optional(),
      link_label: z.string().optional(),
      link_url: z.string().optional(),
    })),
  }),
  z.object({
    _template: z.literal('faq'),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  z.object({ _template: z.literal('contact_info') }),
]);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    heading: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    sections: z.array(section).default([]),
  }),
});

const singles = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/singles' }),
  schema: z.any(),
});

export const collections = { pages, singles };
