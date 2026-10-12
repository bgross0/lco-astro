import settings from '../data/settings.json';

export interface Phone {
  label: string;
  display: string;
  href: string;
}

// Editors control the display text; the dialable link uses the digits only.
function toPhone({ label, number }: { label: string; number: string }): Phone {
  const digits = number.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  return { label, display: number.trim(), href: `tel:+1${digits}` };
}

/** Every number in Settings, in the order editors listed them. */
export const phones: Phone[] = settings.phones.map(toPhone);

/** The first number: used by every "Call us" button and in structured data. */
export const primaryPhone: Phone = phones[0];
