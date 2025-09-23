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

const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).optional(),
    bottomServices: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),
    sections: z.array(z.any()).optional(),
    features: z.array(z.any()).optional(),
    showcase: z.any().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  services,
  testimonials,
  blog,
  homepage,
  pages,
};