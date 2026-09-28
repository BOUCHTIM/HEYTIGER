/**
 * Site-wide content for the Sep-2026 Figma redesign
 * (Figma: Hey Tiger Website → 02 — WEBSITE DESIGN).
 *
 * Copy is transcribed from the HT_HOMEPAGE_DESKTOP frame. Anything marked
 * `placeholder` was not legible in the design and should be confirmed.
 */

export interface NavItem {
  id: string;
  label: string;
  jp: string;
  href: string;
}

export const NAV: NavItem[] = [
  { id: 'about',    label: 'ABOUT',     jp: 'アバウト',    href: '/#about' },
  { id: 'menu',     label: 'MENU',      jp: 'メニュー',    href: '/menu' },
  { id: 'whats-on', label: "WHAT'S ON", jp: 'イベント',    href: '/#whats-on' },
  { id: 'location', label: 'LOCATION',  jp: 'ロケーション', href: '/#location' },
  { id: 'shop',     label: 'SHOP',      jp: 'ショップ',    href: '/#shop' },
];

export const RESERVE_NAV = { label: 'RESERVE', jp: '予約' };

export const HERO = {
  eyebrowRail: 'WELCOME TO THE FAMILY',
  handleRail: '@HEYTIGER.SOCIALS',
  jpRail: 'おいトラ',
  titleA: 'A SOCIAL HOUSE',
  titleB: 'FOR THE',
  titleAccent: 'UNCOMMON',
  lines: [
    { en: 'CLOCKED IN.',     jp: '出勤。' },
    { en: 'TUNE OUT.',       jp: '雑音を消せ。' },
  ],
  lines2: [
    { en: 'COME AS YOU ARE.', jp: 'ありのままで。' },
  ],
  cta: 'RESERVE A TABLE',
};

export const PILLARS = [
  { en: 'GOOD FOOD.',     jp: '美味しい料理。' },
  { en: 'GREAT DRINKS.',  jp: '最高のドリンク。' },
  { en: 'REAL PEOPLE',    jp: '本物の人々。' },
  { en: 'RAAAR CULTURE.', jp: 'ライブカルチャー。' },
];

export const ABOUT = {
  jp: ['ただのレストランじゃない。', 'カルチャーの交差点。'],
  kicker: 'NOT JUST A RESTAURANT.',
  title: 'A CULTURAL TABLE.',
  body: 'HEY TIGER IS A SOCIAL HOUSE WHERE GOOD FOOD, MUSIC, AND CULTURE MEET. BUILT FOR THE UNCOMMON.',
};

export const MENU_TEASER = {
  intro: 'INSPIRED BY ASIAN SOUL FOOD, GLOBAL INFLUENCES, AND LATE-NIGHT CRAVINGS.',
  jp: 'メニュー',
  titleA: 'BOLD FLAVOURS.',
  titleB: 'MADE TO SHARE.',
  cta: 'EXPLORE OUR MENU',
};

export type EventKind = 'WEEKLY' | 'EVENT';

export interface WhatsOnItem {
  id: string;
  kind: EventKind;
  title: string;
  jp: string;
  description: string;
  when: string;
  image?: string;
  imageW?: number;
  imageH?: number;
}

export const WHATS_ON: WhatsOnItem[] = [
  {
    id: 'highball-hour', kind: 'WEEKLY', title: 'HIGHBALL HOUR', jp: 'ハイボール・アワー',
    description: 'COLD POURS, STRONG SERVES, BETTER PRICES.', when: 'MON–FRI · 4–7PM',
    image: '/images/events/event-highball-hour.webp', imageW: 2286, imageH: 4096,
  },
  {
    id: 'sushi-wednesday', kind: 'WEEKLY', title: 'SUSHI WEDNESDAY', jp: '寿司ウェンズデー',
    description: 'HALF PRICE SELECT ROLLS, ALL NIGHT.', when: 'WEDNESDAYS',
    image: '/images/events/event-sushi-wednesday.webp', imageW: 946, imageH: 1663,
  },
  {
    id: 'late-night-bites', kind: 'WEEKLY', title: 'LATE NIGHT BITES', jp: 'レイトナイト',
    description: 'SMALL PLATES MADE FOR STAYING OUT LATE.', when: 'THU–SAT · FROM 10PM',
    image: '/images/events/event-late-night-bites.webp', imageW: 2286, imageH: 4096,
  },
  {
    id: 'record-night', kind: 'WEEKLY', title: 'RECORD NIGHT', jp: 'レコード・ナイト',
    description: 'VINYL ON ROTATION, DRINKS IN HAND.', when: 'THURSDAYS · FROM 8PM',
    image: '/images/events/event-record-night.webp', imageW: 2286, imageH: 4096,
  },
  {
    id: 'after-hours', kind: 'EVENT', title: 'AFTER HOURS', jp: 'アフターアワーズ',
    description: 'LOW LIGHTS, LATE SETS, LAST CALL AT 2AM.', when: 'SEPTEMBER 8', // placeholder copy
    image: '/images/events/event-after-hours.webp', imageW: 2286, imageH: 4096,
  },
  {
    id: 'tiger-sessions', kind: 'EVENT', title: 'TIGER SESSIONS', jp: 'タイガー・セッション',
    description: 'DJS, SELECTORS, AND SETS WORTH STAYING UP FOR.', when: 'SEPTEMBER 20', // placeholder date
    image: '/images/events/event-tiger-sessions.webp', imageW: 2286, imageH: 4096,
  },
];

export const WHATS_ON_INTRO = {
  lines: ["DROPS, DINNERS, LATE NIGHTS, AND WHATEVER WE'RE INTO RIGHT NOW. NEW THINGS COME AND GO.", "CATCH THEM WHILE THEY'RE HERE."],
};

/** Scooter rider illustration layered over the WHERE WE AT collage (Figma: layer 417 × 686, placed ≈395 wide at (323, 251) on desktop). */
// Source: HEYTIGER NEW ASSETS/figma-2026-09/home/rider-scooter.png (designer exports composited, 2026-09-28).
// Served as rider-scooter-figma.png: the designer's own flattened export, used untouched (new name = fresh cache key).
export const LOCATION_RIDER: string | null = '/images/home/rider-scooter-figma.png';

export const LOCATION = {
  jp: 'ロケーション',
  title: 'WHERE WE AT',
  lead: "WE CAN'T WAIT TO SEE YOU TONIGHT",
  mapCta: 'GOOGLE MAP',
  reminder: "DON'T FORGET TO",
  reserveCta: 'RESERVE A TABLE',
};

export interface ShopItem {
  id: string;
  name: string;
  priceAED: number;
  image?: string;
  tone: 'ivory' | 'night';
}

export const SHOP = {
  jp: 'ショップ',
  title: ['CARRY', 'THE TIGER', 'INSIDE AND', 'OUT'],
  items: [
    { id: 'shisa',    name: 'SHISA',          priceAED: 90, tone: 'ivory', image: '/images/shop/tee-shisa-flat.webp' },
    { id: 'paws-up',  name: 'PAWS UP',        priceAED: 90, tone: 'night', image: '/images/shop/tee-paws-up-flat.webp' },
    { id: 'ht-1998',  name: 'HEY TIGER 1998', priceAED: 90, tone: 'ivory', image: '/images/shop/tee-1998-flat.webp' },
  ] as ShopItem[],
};

export const SAVE_A_SEAT = {
  titleA: 'SAVE',
  titleB: 'A SEAT',
  jp: '席を予約する',
  cta: 'RESERVE A TABLE',
};

export const FOOTER = {
  tag: 'SOCIAL HOUSE',
  est: 'EST. 2024',
  follow: 'FOLLOW US',
};
