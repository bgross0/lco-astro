import settings from '../data/settings.json';

export function getSettings() {
  return settings;
}

export function getPhone() {
  return settings.phone || '(612) 655-0648';
}

export function getPhoneLink() {
  const phone = getPhone();
  return `tel:${phone.replace(/[^0-9]/g, '')}`;
}

export function getEmail() {
  return settings.email || 'info@lakecountyoutdoors.com';
}

export function getAddress() {
  return settings.address || 'Lake County, Illinois';
}

export function getSocial() {
  return settings.social || {};
}