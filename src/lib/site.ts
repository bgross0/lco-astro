import settings from '../data/settings.json';

const { address } = settings;

export const addressLines = [address.street, `${address.city}, ${address.region} ${address.postalCode}`];
export const addressText = addressLines.join(', ');
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;

/** "07:00" -> "7:00 AM" */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const hours = settings.hours.map((row) => ({
  ...row,
  text: `${formatTime(row.opens)} – ${formatTime(row.closes)}`,
}));

const DAY_NAMES: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
};
const DAY_ORDER = Object.keys(DAY_NAMES);

/** Settings hours as schema.org OpeningHoursSpecification objects. */
export const openingHoursSpecification = settings.hours.map((row) => {
  const [from, to = from] = row.days.split('-');
  const days = DAY_ORDER.slice(DAY_ORDER.indexOf(from), DAY_ORDER.indexOf(to) + 1);
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days.map((day) => `https://schema.org/${DAY_NAMES[day]}`),
    opens: row.opens,
    closes: row.closes,
  };
});
