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

export const collections = {
  services,
  testimonials,
};