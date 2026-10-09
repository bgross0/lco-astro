import { getCollection, type CollectionEntry } from 'astro:content';
import { SERVICE_CATEGORIES } from '../content.config';

export type Service = CollectionEntry<'services'>;
export type Review = CollectionEntry<'reviews'>;

export const serviceUrl = (service: Service) => `/services/${service.id}/`;
export const areaUrl = (area: CollectionEntry<'serviceAreas'>) => `/service-areas/${area.id}/`;
export const projectUrl = (project: CollectionEntry<'projects'>) => `/projects/${project.id}/`;

export async function getServices(): Promise<Service[]> {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

/** Services grouped by category, in the category order editors see in the CMS. */
export async function getServiceGroups() {
  const services = await getServices();
  return SERVICE_CATEGORIES
    .map((category) => ({ category, services: services.filter((s) => s.data.category === category) }))
    .filter((group) => group.services.length > 0);
}

export async function getReviews(): Promise<Review[]> {
  return (await getCollection('reviews')).sort((a, b) => a.data.order - b.data.order);
}

export async function getReviewSummary() {
  const reviews = await getReviews();
  const average = reviews.reduce((sum, r) => sum + r.data.rating, 0) / Math.max(reviews.length, 1);
  return { count: reviews.length, average: Math.round(average * 10) / 10 };
}

/**
 * Every city served (the list on the Service Areas page), linked to its own
 * page when one exists in the serviceAreas collection.
 */
export async function getAreas() {
  const page = (await getCollection('pages')).find((p) => p.id === 'service-areas');
  const withPages = await getCollection('serviceAreas');
  return (page?.data.cities ?? []).map((city) => {
    const entry = withPages.find((a) => a.data.city.toLowerCase() === city.toLowerCase());
    return { city, label: `${city}, MN`, href: entry ? areaUrl(entry) : undefined };
  });
}

export async function getPage(id: string) {
  const page = (await getCollection('pages')).find((p) => p.id === id);
  if (!page) throw new Error(`Missing src/content/pages/${id}.md`);
  return page;
}
