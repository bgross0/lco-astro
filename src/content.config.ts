import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Keep every field here in sync with public/admin/config.yml: Decap drops
// keys it does not know about when an editor saves an entry.

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const heading = z.object({
  title: z.string(),
  text: z.string().optional(),
});

const hero = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  text: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
});

const heroWithImage = hero.extend({
  image: z.string(),
  imageAlt: z.string(),
});

// Decap saves a cleared optional number as "", which must mean "not set".
const optionalNumber = z.preprocess((value) => (value === '' || value === null ? undefined : value), z.number().optional());

const step = z.object({
  title: z.string(),
  text: z.string(),
});

export const SERVICE_CATEGORIES = [
  'Landscape Services',
  'Excavation & Build',
  'Property Maintenance',
  'Tree Services',
] as const;

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(SERVICE_CATEGORIES),
    order: z.number().int(),
    seo,
    hero: heroWithImage,
    heading: z.string(),
    process: z.object({
      title: z.string(),
      intro: z.string().optional(),
      steps: z.array(step).min(1),
    }).optional(),
    faq: z.object({
      title: z.string(),
      intro: z.string().optional(),
      items: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
    }).optional(),
    reviews: heading,
    cta: heading,
  }),
});

const serviceAreas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/service-areas' }),
  schema: z.object({
    city: z.string(),
    state: z.string().default('MN'),
    seo,
    hero: heroWithImage,
    heading: z.string(),
    reviews: heading,
    cta: heading,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    summary: z.string(),
    seo,
    image: z.string(),
    imageAlt: z.string(),
    gallery: z.array(z.object({ image: z.string(), alt: z.string() })).optional(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/reviews' }),
  schema: z.object({
    author: z.string(),
    rating: z.number().int().min(1).max(5),
    source: z.string().default('Google'),
    order: z.number().int(),
    // Decap saves a cleared date as "", which must mean "no date".
    date: z.preprocess((value) => (value === '' || value === null ? undefined : value), z.coerce.date().optional()),
    text: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Lake County Outdoors'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeyword: z.string().optional(),
    }).optional(),
  }),
});

const homepage = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/homepage' }),
  schema: z.object({
    seo,
    hero: heroWithImage,
    services: heading,
    shoreline: z.object({
      label: z.string().optional(),
      title: z.string(),
      text: z.string(),
      linkText: z.string(),
      link: z.string(),
    }),
    about: z.object({
      title: z.string(),
      text: z.string(),
      image: z.string(),
      imageAlt: z.string(),
    }),
    highlights: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        image: z.string(),
        imageAlt: z.string(),
        video: z.string().optional(),
        stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
        tags: z.array(z.string()).optional(),
      })),
    }),
    reviews: heading,
    /** Heading over the stats band (10+ years, 100+ properties, Google rating). */
    stats: heading.optional(),
    social: z.object({
      title: z.string(),
      text: z.string().optional(),
      footnote: z.string().optional(),
    }),
    offer: z.object({
      title: z.string(),
      name: z.string(),
      value: z.string(),
      text: z.string(),
      buttonText: z.string(),
      link: z.string(),
    }),
    projects: heading,
    areas: heading,
    featuredReview: z.string().optional(),
    cta: heading,
  }),
});

// One file per page; each page template reads only the fields it renders.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    seo,
    hero,
    heading: z.string().optional(),
    servicesTitle: z.string().optional(),
    logo: z.string().optional(),
    notice: z.object({ label: z.string(), text: z.string() }).optional(),
    form: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      submitButtonText: z.string().optional(),
    }).optional(),
    details: heading.optional(),
    reviews: heading.optional(),
    images: z.array(z.object({ image: z.string(), alt: z.string() })).optional(),
    // Every city served; coordinates (WGS84) place it on the service-area map.
    cities: z.array(z.object({
      city: z.string(),
      latitude: optionalNumber,
      longitude: optionalNumber,
    })).optional(),
    services: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      text: z.string().optional(),
      items: z.array(step),
    }).optional(),
    why: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      text: z.string().optional(),
      points: z.array(z.string()),
      tagline: z.string().optional(),
      buttonText: z.string(),
    }).optional(),
    process: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      intro: z.string().optional(),
      steps: z.array(step),
      buttonText: z.string().optional(),
    }).optional(),
    cta: heading.optional(),
  }),
});

export const collections = {
  services,
  serviceAreas,
  projects,
  reviews,
  blog,
  homepage,
  pages,
};
