import { getServiceGroups, serviceUrl } from './content';
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
