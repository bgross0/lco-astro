import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    order: z.number().optional(),
    subtitle: z.string().optional(),
    images: z.array(z.string()).optional(),
    hero: z.object({
      subtitle: z.string().optional(),
      backgroundImage: z.string().optional(),
    }).optional(),
    pricing: z.array(z.object({
      title: z.string(),
      description: z.string(),
      featured: z.boolean().optional(),
    })).optional(),
    equipment: z.array(z.object({
      number: z.number(),
      label: z.string(),
    })).optional(),
    features: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),
    services: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      items: z.array(z.string()),
    })).optional(),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeyword: z.string().optional(),
      canonicalUrl: z.string().optional(),
      schemaType: z.enum(['Service', 'Product', 'LocalBusiness', 'Article']).optional(),
    }).optional(),
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
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeyword: z.string().optional(),
    }).optional(),
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
    hero: z.object({
      images: z.array(z.object({
        src: z.string(),
        alt: z.string(),
      })).optional(),
    }).optional(),
    about: z.object({
      title: z.string().optional(),
      paragraphs: z.array(z.string()).optional(),
      images: z.array(z.object({
        src: z.string(),
        alt: z.string(),
      })).optional(),
      features: z.array(z.object({
        icon: z.string(),
        text: z.string(),
      })).optional(),
      buttonText: z.string().optional(),
      buttonLink: z.string().optional(),
    }).optional(),
    clientSatisfaction: z.object({
      title: z.string().optional(),
      paragraphs: z.array(z.string()).optional(),
      experienceTitle: z.string().optional(),
      experienceText: z.string().optional(),
      highlight: z.string().optional(),
    }).optional(),
    equipment: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      stats: z.array(z.object({
        number: z.number(),
        label: z.string(),
      })).optional(),
    }).optional(),
    cta: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      backgroundImage: z.string().optional(),
      primaryButton: z.object({
        text: z.string(),
        link: z.string(),
      }).optional(),
      secondaryButton: z.object({
        text: z.string(),
        link: z.string(),
      }).optional(),
    }).optional(),
    reviews: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      rating: z.number().optional(),
      reviewCount: z.number().optional(),
      googleBusinessUrl: z.string().optional(),
      shapoWidgetId: z.string().optional(),
    }).optional(),
  }),
});

const pages = defineCollection({
  type: 'data',
  schema: z.object({
    hero: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
    }).optional(),
    form: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      submitButtonText: z.string().optional(),
      fields: z.array(z.record(z.unknown())).optional(),
    }).optional(),
    info: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      emergencyText: z.string().optional(),
      emailResponseTime: z.string().optional(),
      serviceAreaNote: z.string().optional(),
    }).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    title: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    primaryCities: z.array(z.object({
      name: z.string(),
      responseTime: z.string().optional(),
      note: z.string().optional(),
    })).optional(),
    additionalCities: z.array(z.string()).optional(),
    serviceMap: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      radius: z.number().optional(),
    }).optional(),
  }),
});

export const collections = {
  services,
  testimonials,
  blog,
  homepage,
  pages,
};