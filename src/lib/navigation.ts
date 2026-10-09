import navigation from '../data/navigation.json';
import settings from '../data/settings.json';
import { getServiceGroups, serviceUrl } from './content';
import { phones } from './phone';
import { addressLines, hours, mapsUrl } from './site';
import type { NavigationItem } from '../components/shadcn-studio/blocks/navbar-component-02/navbar-component-02';
import type { FooterData } from '../components/shadcn-studio/blocks/footer-component-03/footer-component-03';

/** Main menu from Settings > Navigation; the services item lists every service by category. */
export async function getMainMenu(): Promise<NavigationItem[]> {
  const groups = await getServiceGroups();
  return navigation.mainMenu.map((item) => {
    if ('servicesMenu' in item && item.servicesMenu) {
      return {
        title: item.label,
        href: item.href,
        groups: groups.map((group) => ({
          title: group.category,
          items: group.services.map((service) => ({ title: service.data.title, href: serviceUrl(service) })),
        })),
      };
    }
    if ('dropdown' in item && item.dropdown) {
      return {
        title: item.label,
        href: item.href,
        items: item.dropdown.map((link) => ({ title: link.label, href: link.href })),
      };
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
