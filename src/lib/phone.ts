import settings from '../data/settings.json';

export interface Phone {
  label: string;
  display: string;
  href: string;
}

// settings.json stores numbers as "Label - (612) 655-0648" so editors control
// the display text; derive the dialable link from the digits only.
function parsePhone(raw: string): Phone {
  const separator = raw.indexOf(' - ');
  const label = separator === -1 ? '' : raw.slice(0, separator).trim();
  const display = (separator === -1 ? raw : raw.slice(separator + 3)).trim();
  const digits = display.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  return { label, display, href: `tel:+1${digits}` };
}

export const officePhone = parsePhone(settings.cellphone);
export const fieldPhone = parsePhone(settings.phone);
