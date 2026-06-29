export const ADVANTAGE_ICONS = [
  'utensils',
  'coffee',
  'graduation',
  'book',
  'notebook',
  'film',
  'ticket',
  'gift',
  'shopping',
  'tag',
  'pizza',
  'percent',
] as const;

export type AdvantageIcon = (typeof ADVANTAGE_ICONS)[number];
