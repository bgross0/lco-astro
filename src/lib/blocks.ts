import { getEntry } from 'astro:content';
import { getPage, getServiceGroups, getServices, serviceUrl } from './content';
import { blockImage } from './images';
import type { FeatureTab } from '../components/shadcn-studio/blocks/features-section-15/features-section-15';

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The four service categories as features-15 tabs, one card per service. */
export async function serviceTabs(): Promise<FeatureTab[]> {
  const groups = await getServiceGroups();
  return Promise.all(
    groups.map(async (group) => ({
      name: group.category,
      value: slug(group.category),
      cards: await Promise.all(
        group.services.map(async (service) => ({
          title: service.data.title,
          summary: service.data.summary,
          href: serviceUrl(service),
          image: await blockImage(service.data.hero.image, ''),
        })),
      ),
    })),
  );
}

/**
 * Supporting photos for service pages, by category: one beside the intro,
 * one next to the FAQs and one in the closing call to action. All are the
 * site's own job and fleet photos. Each slot lists candidates; the first one
 * that is not the page's own hero photo is used.
 */
const CATEGORY_PHOTOS: Record<string, { about: string[]; faq: string[]; cta: string[] }> = {
  'Landscape Services': {
    about: ['/images/home/experience.jpg'],
    faq: ['/images/gallery/photo-12.jpg'],
    cta: ['/images/gallery/photo-06.jpg'],
  },
  'Excavation & Build': {
    about: ['/images/gallery/photo-10.jpg'],
    faq: ['/images/gallery/photo-04.jpg'],
    cta: ['/images/gallery/photo-11.jpg'],
  },
  'Property Maintenance': {
    about: ['/images/home/crew.jpg'],
    faq: ['/images/gallery/photo-09.jpg'],
    cta: ['/images/gallery/photo-01.jpg'],
  },
  'Tree Services': {
    about: ['/images/gallery/photo-02.jpg'],
    faq: ['/images/services/tree-removal.jpg', '/images/services/tree-trimming.jpg'],
    cta: ['/images/gallery/photo-11.jpg'],
  },
};

/** A site photo with its alt text from the gallery, a service hero or the homepage. */
export async function sitePhoto(src: string) {
  const gallery = (await getPage('gallery')).data.images ?? [];
  const home = (await getEntry('homepage', 'home'))!.data;
  const services = await getServices();
  const alt =
    gallery.find((photo) => photo.image === src)?.alt ??
    services.find((service) => service.data.hero.image === src)?.data.hero.imageAlt ??
    [home.about, ...home.highlights.items].find((item) => item.image === src)?.imageAlt ??
    '';
  return blockImage(src, alt);
}

export async function categoryPhotos(category: string, heroImage?: string) {
  const photos = CATEGORY_PHOTOS[category] ?? CATEGORY_PHOTOS['Property Maintenance'];
  const pick = (candidates: string[]) => sitePhoto(candidates.find((src) => src !== heroImage) ?? candidates[0]);
  return { about: await pick(photos.about), faq: await pick(photos.faq), cta: await pick(photos.cta) };
}
