import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    order: z.number().optional(),
  }),
});

const testimonials = defineCollection({
  type: 'content', 
  schema: z.object({
    author: z.string(),
    company: z.string().optional(),
    service: z.string(),
    rating: z.number().min(1).max(5),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Lake County Outdoors'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  services,
  testimonials,
  blog,
};