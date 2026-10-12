import navigation from '../data/navigation.json';
import settings from '../data/settings.json';
import { getServiceGroups, serviceUrl } from './content';
import { phones } from './phone';
import { addressLines, hours, mapsUrl } from './site';

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
import type { NavigationSection } from '../components/shadcn-studio/blocks/menu-navigation';
import type { FooterData } from '../components/shadcn-studio/blocks/footer-component-03/footer-component-03';

/**
 * Menu for the site header (hero-section-21's header): the services menu
 * lists the snow services, one link per category and the full list, so the
 * dropdown stays short; other entries come from navigation.json.
 */
export async function getHeaderMenu(): Promise<NavigationSection[]> {
  const groups = await getServiceGroups();
  const snow = groups
    .flatMap((group) => group.services)
    .filter((service) => /snow|ice/i.test(service.data.title))
    .sort((a, b) => Number(/ice/i.test(a.data.title)) - Number(/ice/i.test(b.data.title)));
  const inServicesMenu = new Set(snow.map((service) => serviceUrl(service)));
  // Top-level links already in the services dropdown are dropped so the bar fits on one line.
  return navigation.mainMenu.filter((item) => !inServicesMenu.has(item.href)).map((item) => {
    if ('servicesMenu' in item && item.servicesMenu) {
      return {
        title: item.label,
        items: [
          ...snow.map((service) => ({ title: service.data.title, href: serviceUrl(service) })),
          ...groups.map((group) => ({ title: group.category, href: `${item.href}#${slug(group.category)}` })),
          { title: 'All services', href: item.href },
        ],
      };
    }
    if ('dropdown' in item && item.dropdown) {
      return { title: item.label, items: item.dropdown.map((link) => ({ title: link.label, href: link.href })) };
    }
    return { title: item.label, href: item.href };
  });
}

/** Footer: a column per service category plus the company links; no city list (it lives on /service-areas). */
export async function getFooterData(): Promise<FooterData> {
  const groups = await getServiceGroups();
  return {
    name: settings.site_title,
    description: settings.site_description,
    columns: [
      ...groups.map((group) => ({
        title: group.category,
        links: group.services.map((service) => ({ title: service.data.title, href: serviceUrl(service) })),
      })),
      { title: 'Company', links: navigation.footerCompany.map((link) => ({ title: link.label, href: link.href })) },
    ],
    phones,
    email: settings.email,
    address: { lines: addressLines, mapsUrl },
    hours: hours.map((row) => ({ label: row.label, text: row.text })),
    social: { instagram: settings.social.instagram || undefined, facebook: settings.social.facebook || undefined },
    credit: { label: 'Axsys', href: 'https://axsys.dev' },
  };
}
