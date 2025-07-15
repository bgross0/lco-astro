import { defineCollection, z } from 'astro:content';

const hero = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    backgroundImage: z.string(),
    services: z.array(z.object({
      name: z.string(),
    })),
    ctaButton: z.object({
      text: z.string(),
      phone: z.string(),
    }),
    trustIndicators: z.array(z.object({
      number: z.string(),
      text: z.string(),
    })),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    image: z.string(),
    icon: z.string(),
    order: z.number().default(0),
    features: z.array(z.object({
      feature: z.string(),
    })),
    gallery: z.array(z.string()).optional(),
  }),
});

const testimonials = defineCollection({
  type: 'content', 
  schema: z.object({
    author: z.string(),
    company: z.string().optional(),
    service: z.string(),
    rating: z.number().min(1).max(5),
    date: z.date(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    yearsExperience: z.number(),
    image: z.string(),
    highlights: z.array(z.object({
      highlight: z.string(),
    })),
  }),
});

export const collections = {
  hero,
  services,
  testimonials,
  about,
};