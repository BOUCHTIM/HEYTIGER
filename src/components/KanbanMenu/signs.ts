/**
 * Kanban menu — single source of truth for tokens, types and all sign/menu data.
 * Everything visual (colour, position, rotation, size) and every menu item lives
 * here so components stay declarative. Colours come from TOKENS — never hardcode.
 */

/* Brand palette for the menu wall (several boards use colours with no global
   CSS-token equivalent, so the Kanban palette is owned here). */
export const TOKENS = {
  void: '#0a0a08',
  cream: '#f2e4cc',
  red: '#c0271a',
  navy: '#1a2e4a',
  kraft: '#b08050',
  dark: '#1c1008',
  orange: '#e8521a',
  gold: '#c8a96e',
  crimson: '#8b1a1a',
} as const;

export type MenuTag = "CHEF'S PICK" | 'NEW' | 'SPICY' | 'SEASONAL';

export interface MenuItem {
  jpName: string; // kanji / kana name
  enName: string; // English name (uppercase)
  description: string; // one short line
  price: number; // AED
  tag?: MenuTag;
}

export interface SignData {
  id: string;
  kanji: string; // single large character
  reading?: string; // small Japanese reading
  en: string; // English category name
  sub: string; // tiny tracked sub-line
  bg: string; // board background (TOKENS)
  color: string; // board text colour (TOKENS)
  accent?: string; // override colour for the big kanji
  rotation: number; // resting rotation, deg
  width: number; // px (desktop)
  height: number; // px (desktop)
  top: string; // % within the wall
  left: string; // %
  kanjiSize: string; // big-kanji font-size on the board
  tier: 1 | 2 | 3; // depth plane: 1 = front (tight dark shadow), 3 = back (soft, smaller)
  worn?: 'tr' | 'bl'; // chipped corner (top-right / bottom-left clip)
  aged?: boolean; // older board — slightly darkened
  items: MenuItem[]; // empty for the contact card
  /* Private Events only — shown instead of an item list */
  note?: string;
  capacity?: string;
  contact?: string;
}

export const SIGNS: SignData[] = [
  {
    id: 'izakaya',
    kanji: '食',
    reading: '居酒屋料理',
    en: 'IZAKAYA FARE',
    sub: 'YAKITORI · KUSHIKATSU · WAGYU GYOZA',
    bg: TOKENS.cream,
    color: TOKENS.void,
    rotation: -4,
    width: 260,
    height: 320,
    top: '8%',
    left: '4%',
    kanjiSize: 'clamp(3.2rem, 6vw, 4rem)',
    tier: 1,
    items: [
      { jpName: '鶏串', enName: 'YAKITORI', description: 'Charcoal-grilled chicken skewer', price: 45 },
      { jpName: '和牛餃子', enName: 'WAGYU GYOZA', description: 'Pan-seared, yuzu ponzu', price: 68, tag: "CHEF'S PICK" },
      { jpName: '串揚げ', enName: 'KUSHIKATSU', description: 'Deep-fried skewers, tonkatsu sauce', price: 52 },
      { jpName: '唐揚げ', enName: 'TRUFFLE KARAAGE', description: 'Japanese fried chicken, black truffle', price: 58, tag: 'NEW' },
      { jpName: '枝豆', enName: 'EDAMAME', description: 'Sea salt & togarashi', price: 28 },
      { jpName: '刺身盛り', enName: 'SASHIMI PLATTER', description: "Chef's selection, 12 pieces", price: 145, tag: "CHEF'S PICK" },
    ],
  },
  {
    id: 'sake',
    kanji: '酒',
    reading: '酒蔵',
    en: 'SAKE CELLAR',
    sub: '47 LABELS · JUNMAI TO DAIGINJO',
    bg: TOKENS.navy,
    color: TOKENS.cream,
    accent: TOKENS.gold,
    rotation: 4,
    width: 250,
    height: 300,
    top: '8%',
    left: '37%',
    kanjiSize: 'clamp(2.8rem, 5vw, 3.4rem)',
    tier: 2,
    items: [
      { jpName: '獺祭', enName: 'DASSAI 45', description: 'Junmai daiginjo, floral & clean', price: 85 },
      { jpName: '八海山', enName: 'HAKKAISAN', description: 'Junmai ginjo, crisp mountain water', price: 72 },
      { jpName: '黒龍', enName: 'KOKURYU', description: 'Junmai, full-bodied, earthy', price: 95, tag: 'SEASONAL' },
      { jpName: '醸し人九平次', enName: 'KUHEIJI', description: 'Yamadanishiki, silky & long', price: 110, tag: "CHEF'S PICK" },
      { jpName: '飛露喜', enName: 'HIROKI', description: 'Tokubetsu junmai, fruity & bright', price: 88 },
    ],
  },
  {
    id: 'late-nights',
    kanji: '夜',
    reading: '深夜',
    en: 'LATE NIGHTS',
    sub: 'OPEN TILL 2AM · THE DEN',
    bg: TOKENS.red,
    color: TOKENS.cream,
    rotation: -6,
    width: 230,
    height: 280,
    top: '8%',
    left: '70%',
    kanjiSize: 'clamp(2.6rem, 4.8vw, 3.1rem)',
    tier: 1,
    items: [
      { jpName: 'おつまみ盛り', enName: 'SNACK BOARD', description: 'Izakaya bites for the table', price: 95 },
      { jpName: '明太子パスタ', enName: 'MENTAIKO PASTA', description: 'Spicy cod roe, butter, nori', price: 62, tag: 'SPICY' },
      { jpName: '牛タン', enName: 'BEEF TONGUE', description: 'Thinly sliced, yuzu kosho', price: 88 },
      { jpName: '夜ラーメン', enName: 'MIDNIGHT RAMEN', description: 'Tonkotsu broth, chashu, egg', price: 72, tag: 'NEW' },
    ],
  },
  {
    id: 'brunch',
    kanji: '朝',
    reading: '週末の朝',
    en: 'WEEKEND BRUNCH',
    sub: 'SAT & SUN · 11AM – 4PM',
    bg: TOKENS.kraft,
    color: TOKENS.void,
    rotation: 3,
    width: 250,
    height: 280,
    top: '56%',
    left: '4%',
    kanjiSize: 'clamp(2.2rem, 4vw, 2.6rem)',
    tier: 3,
    worn: 'tr',
    aged: true,
    items: [
      { jpName: '朝定食', enName: 'TEISHOKU SET', description: 'Rice, miso, grilled fish, pickles', price: 85 },
      { jpName: '玉子焼き', enName: 'TAMAGOYAKI', description: 'Rolled omelette, dashi-sweet', price: 42 },
      { jpName: '抹茶パンケーキ', enName: 'MATCHA PANCAKES', description: 'Ceremonial grade, red bean cream', price: 68, tag: 'NEW' },
      { jpName: '海鮮丼', enName: 'CHIRASHI BOWL', description: 'Market fish over sushi rice', price: 128, tag: "CHEF'S PICK" },
    ],
  },
  {
    id: 'cocktails',
    kanji: '炎',
    reading: '焔',
    en: 'COCKTAILS',
    sub: 'JAPANESE WHISKY · SHOCHU SOURS',
    bg: TOKENS.dark,
    color: TOKENS.gold,
    accent: TOKENS.orange,
    rotation: -3,
    width: 240,
    height: 300,
    top: '54%',
    left: '37%',
    kanjiSize: 'clamp(2.4rem, 4.5vw, 2.9rem)',
    tier: 2,
    items: [
      { jpName: '虎の爪', enName: 'TIGER CLAW', description: 'Yuzu vodka, shiso, ginger beer', price: 65, tag: "CHEF'S PICK" },
      { jpName: '火炎', enName: 'KAEN NEGRONI', description: 'Japanese whisky, campari, sake vermouth', price: 72 },
      { jpName: '桜吹雪', enName: 'SAKURA STORM', description: 'Gin, sakura liqueur, elderflower foam', price: 68 },
      { jpName: '焦がし醤油', enName: 'BURNT SHOYU SOUR', description: 'Bourbon, charred soy, egg white', price: 70, tag: 'NEW' },
      { jpName: '抹茶マティーニ', enName: 'MATCHA MARTINI', description: 'Vodka, ceremonial matcha, oat milk', price: 68 },
    ],
  },
  {
    id: 'events',
    kanji: '縁',
    reading: '貸切',
    en: 'PRIVATE EVENTS',
    sub: 'FULL BUYOUT · CONTACT US',
    bg: TOKENS.cream,
    color: TOKENS.void,
    rotation: 6,
    width: 220,
    height: 260,
    top: '58%',
    left: '70%',
    kanjiSize: 'clamp(2.1rem, 3.8vw, 2.5rem)',
    tier: 3,
    worn: 'bl',
    items: [],
    note: 'Full venue buyout for corporate events, birthdays, and exclusive dinners.',
    capacity: 'Capacity: up to 120 guests · Bespoke menus available',
    contact: 'events@heytiger.ae',
  },
];
