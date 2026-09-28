/**
 * Menu content for the Sep-2026 redesign (Figma HT_MENU_DESKTOP / HT_MENU_MOBILE).
 * Prices in the design are all "AED 90" placeholders — confirm with the kitchen.
 */

export type Dietary =
  | 'dairy' | 'egg' | 'gluten' | 'nuts' | 'sesame' | 'seafood' | 'vegan' | 'vegetarian';

export const DIETARY_LABELS: Record<Dietary, string> = {
  dairy: 'DAIRY', egg: 'EGG', gluten: 'GLUTEN', nuts: 'NUTS',
  sesame: 'SESAME', seafood: 'SEAFOOD', vegan: 'VEGAN', vegetarian: 'VEGETARIAN',
};

export type MenuTab = 'food' | 'drinks';

export interface MenuCategoryR {
  id: string;
  tab: MenuTab;
  en: string;
  jp: string;
}

export const MENU_CATEGORIES: MenuCategoryR[] = [
  { id: 'starters',       tab: 'food',   en: 'STARTERS',        jp: '前菜' },
  { id: 'soups',          tab: 'food',   en: 'SOUPS',           jp: 'スープ' },
  { id: 'tempura',        tab: 'food',   en: 'TEMPURA',         jp: '天ぷら' },
  { id: 'salads',         tab: 'food',   en: 'SALADS',          jp: 'サラダ' },
  { id: 'sushi-sashimi',  tab: 'food',   en: 'SUSHI & SASHIMI', jp: '寿司・刺身' },
  { id: 'maki-rolls',     tab: 'food',   en: 'MAKI / ROLLS',    jp: '巻き寿司' },
  { id: 'dim-sum',        tab: 'food',   en: 'DIM SUM',         jp: '点心' },
  { id: 'wok-mains',      tab: 'food',   en: 'WOK & MAINS',     jp: '炒め物・メイン' },
  { id: 'robata',         tab: 'food',   en: 'ROBATA GRILL',    jp: '炉端焼き' },
  { id: 'rice-noodles',   tab: 'food',   en: 'RICE & NOODLES',  jp: 'ご飯・麺' },
  { id: 'ramen',          tab: 'food',   en: 'RAMEN',           jp: 'ラーメン' },
  { id: 'sides',          tab: 'food',   en: 'SIDES',           jp: 'サイドメニュー' },
  { id: 'dessert',        tab: 'food',   en: 'DESSERT',         jp: 'デザート' },
  { id: 'cocktails',      tab: 'drinks', en: 'COCKTAILS',       jp: 'カクテル' },
  { id: 'highballs',      tab: 'drinks', en: 'HIGHBALLS',       jp: 'ハイボール' },
  { id: 'sake',           tab: 'drinks', en: 'SAKE',            jp: '日本酒' },
  { id: 'beer',           tab: 'drinks', en: 'BEER',            jp: 'ビール' },
  { id: 'wine',           tab: 'drinks', en: 'WINE',            jp: 'ワイン' },
  { id: 'soft',           tab: 'drinks', en: 'SOFT & TEA',      jp: 'ソフトドリンク' },
];

export interface MenuItemR {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceAED: number;
  dietary: Dietary[];
  image?: string; // /images/menu/*.webp — 2048² unless noted
}

const IMG = (f: string) => `/images/menu/${f}.webp`;

export const MENU_ITEMS: MenuItemR[] = [
  // ── STARTERS 前菜 (order matches the Figma 4-col grid, left→right, top→bottom)
  { id: 'edamame', categoryId: 'starters', name: 'EDAMAME', description: 'EDAMAME BEANS, MALDON SALT OR AJI SHIO', priceAED: 90, dietary: ['vegan'], image: IMG('edamame') },
  { id: 'chili-edamame', categoryId: 'starters', name: 'CHILI EDAMAME', description: 'EDAMAME BEANS, CHILI GARLIC SAUCE', priceAED: 90, dietary: ['sesame', 'vegan'], image: IMG('chili-edamame') },
  { id: 'kimchi-trio', categoryId: 'starters', name: 'KIMCHI TRIO', description: 'NAPA CABBAGE, RADISH, GOCHUJANG', priceAED: 90, dietary: ['sesame', 'seafood'], image: IMG('kimchi-trio') },
  { id: 'seabass-papaya', categoryId: 'starters', name: 'SEABASS PAPAYA', description: 'SEA BASS, PAPAYA, CRAB, JALAPENO, TRUFFLE', priceAED: 90, dietary: ['seafood'], image: IMG('seabass-papaya') },
  { id: 'wafu-goma-scallop', categoryId: 'starters', name: 'WAFU GOMA SCALLOP', description: 'SCALLOP, FIG, SESAME, TRUFFLE', priceAED: 90, dietary: ['seafood', 'sesame'], image: IMG('wafu-goma-scallop') },
  { id: 'hiramasa-carpaccio', categoryId: 'starters', name: 'HIRAMASA CARPACCIO', description: 'YELLOWFIN TUNA, CRISPY SUSHI RICE, AVOCADO, KIZAMI WASABI, SWEET SOY', priceAED: 90, dietary: ['seafood', 'gluten'], image: IMG('hiramasa-carpaccio') },
  { id: 'kimchi-chicken-gyoza', categoryId: 'starters', name: 'KIMCHI CHICKEN GYOZA', description: 'CHICKEN, KIMCHI, GARLIC CHIVE, GOCHUGARU, CHILLI OIL', priceAED: 90, dietary: ['gluten', 'sesame'], image: IMG('kimchi-chicken-gyoza') },
  { id: 'wagyu-gyoza', categoryId: 'starters', name: 'WAGYU GYOZA', description: 'CHUCK ROLL, SHIITAKE, WATER CHESTNUT, NAPA CABBAGE, GINGER', priceAED: 90, dietary: ['gluten', 'sesame'], image: IMG('wagyu-gyoza') },
  { id: 'black-cod-gyoza', categoryId: 'starters', name: 'BLACK COD GYOZA', description: 'BLACK COD, PRAWN, WHITE MISO, SHIITAKE', priceAED: 90, dietary: ['gluten', 'seafood'], image: IMG('black-cod-gyoza') },
  { id: 'sweet-and-spicy-shrimp', categoryId: 'starters', name: 'SWEET AND SPICY SHRIMP', description: 'PRAWN, ICEBERG LETTUCE, GINGER, CHILI, SESAME', priceAED: 90, dietary: ['seafood', 'sesame'], image: IMG('sweet-and-spicy-shrimp') },
  { id: 'spiced-tuna-crispy-rice', categoryId: 'starters', name: 'SPICED TUNA CRISPY RICE', description: 'YELLOWTAIL, KIZAMI WASABI, YUZU, BONITO, ARARE RICE CRACKER', priceAED: 90, dietary: ['seafood', 'gluten'], image: IMG('spiced-tuna-crispy-rice') },
  { id: 'fried-calamari', categoryId: 'starters', name: 'FRIED CALAMARI', description: 'SQUID, KIMCHI MAYO', priceAED: 90, dietary: ['seafood', 'egg', 'gluten'], image: IMG('fried-calamari') },
  { id: 'nori-tuna-senbei', categoryId: 'starters', name: 'NORI TUNA SENBEI', description: 'TUNA, AVOCADO CREAM, PICKLED SHALLOT, TRUFFLE, KINOME', priceAED: 90, dietary: ['seafood', 'gluten'], image: IMG('nori-tuna-senbei') },
  { id: 'kfc', categoryId: 'starters', name: 'KFC (KOREAN FRIED CHICKEN)', description: 'GOCHUJANG, YUZU PICKLED RADISH, PISTACHIO, SESAME', priceAED: 90, dietary: ['gluten', 'nuts', 'sesame', 'egg'], image: IMG('kfc-korean-fried-chicken') },
  { id: 'miso-eggplant', categoryId: 'starters', name: 'MISO EGGPLANT', description: 'EGGPLANT, MISO, YUZU, SESAME, CHIVE', priceAED: 90, dietary: ['sesame', 'vegetarian'], image: IMG('miso-eggplant') },
  { id: 'tuna-egg-roll', categoryId: 'starters', name: 'TUNA EGG ROLL', description: 'TUNA, TRUFFLE, YUZU, CARROT, SPRING ONION', priceAED: 90, dietary: ['seafood', 'egg'], image: IMG('tuna-egg-roll') },
  { id: 'agedashi-tofu', categoryId: 'starters', name: 'AGEDASHI TOFU', description: 'TOFU, SOY, MIRIN, SHIITAKE, ENOKI, SHISHITO, SHISO', priceAED: 90, dietary: ['gluten', 'vegetarian'], image: IMG('agedashi-tofu') },
  { id: 'seoul-seafood-pancake', categoryId: 'starters', name: 'SEOUL SEAFOOD PANCAKE', description: 'PRAWN, SQUID, EGG, SEA ASPARAGUS, GARLIC, CHIVE, JALAPENO', priceAED: 90, dietary: ['seafood', 'egg', 'gluten'], image: IMG('seoul-seafood-pancake') },
  { id: 'chinese-eggplant', categoryId: 'starters', name: 'CHINESE EGGPLANT', description: 'EGGPLANT, SWEET CHILLI SOY, GARLIC, GOCHUGARU, CORIANDER', priceAED: 90, dietary: ['gluten', 'vegan'], image: IMG('chinese-eggplant') },
  { id: 'tuna-tataki', categoryId: 'starters', name: 'TUNA TATAKI', description: 'YELLOWFIN TUNA, UMAMI TATAKI, SESAME, FRIED QUINOA, GARLIC CHIPS', priceAED: 90, dietary: ['seafood', 'sesame'], image: IMG('tuna-tataki') },
  { id: 'salmon-tataki', categoryId: 'starters', name: 'SALMON TATAKI', description: 'SALMON, PONZU, RADISH, SPRING ONION', priceAED: 90, dietary: ['seafood', 'gluten'], image: IMG('salmon-tataki') },

  // ── Other categories: carried over from the previous menu until the design covers them
  { id: 'miso-black-cod', categoryId: 'wok-mains', name: 'MISO BLACK COD', description: 'BLACK COD, SAIKYO MISO, GRILLED LEEK, SESAME', priceAED: 160, dietary: ['seafood', 'sesame'], image: IMG('miso-black-cod') },
  { id: 'tonkotsu', categoryId: 'ramen', name: 'TONKOTSU RAMEN', description: 'PORK BONE BROTH, CHASHU, AJITAMA, MENMA, NEGI', priceAED: 78, dietary: ['gluten', 'egg'], image: IMG('ramen-bowl') },
  { id: 'shoyu', categoryId: 'ramen', name: 'SHOYU RAMEN', description: 'CLEAR SOY BROTH, CHICKEN CHASHU, NEGI', priceAED: 68, dietary: ['gluten'] },
  { id: 'spicy-tonkotsu', categoryId: 'ramen', name: 'SPICY TONKOTSU', description: 'SPICY PORK BROTH, GROUND PORK, CHILI OIL', priceAED: 82, dietary: ['gluten', 'egg', 'sesame'] },
  { id: 'veg-ramen', categoryId: 'ramen', name: 'VEGETABLE MISO RAMEN', description: 'MISO VEGETABLE BROTH, MUSHROOMS, BAMBOO, CORN', priceAED: 65, dietary: ['gluten', 'vegan'] },
  { id: 'tigers-blood', categoryId: 'cocktails', name: "TIGER'S BLOOD", description: 'YUZU, SHISO, VODKA, HIBISCUS, SODA', priceAED: 58, dietary: [] },
  { id: 'sakura-martini', categoryId: 'cocktails', name: 'SAKURA MARTINI', description: 'VODKA, CHERRY BLOSSOM LIQUEUR, YUZU', priceAED: 62, dietary: [] },
  { id: 'nikka-highball', categoryId: 'highballs', name: 'NIKKA HIGHBALL', description: 'NIKKA WHISKY, SODA, LEMON TWIST', priceAED: 48, dietary: [] },
  { id: 'yuzu-highball', categoryId: 'highballs', name: 'YUZU HIGHBALL', description: 'SUNTORY TOKI, YUZU, SODA', priceAED: 52, dietary: [] },
];

export const MENU_NOTICE = 'PLEASE NOTIFY OUR TEAM OF ANY FOOD ALLERGIES OR DIETARY REQUIREMENTS';
