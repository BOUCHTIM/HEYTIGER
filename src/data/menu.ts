import type { MenuCategory, MenuItem } from '@/types/menu';

export const menuCategories: MenuCategory[] = [
  {
    id: 'robata',
    slug: 'robata',
    titleEn: 'ROBATA',
    titleJp: '炉端焼き',
    description: 'Charcoal-grilled skewers and small plates, cooked over binchotan.',
    chapterNumber: 1,
    order: 1,
    sectionType: 'food',
  },
  {
    id: 'izakaya',
    slug: 'izakaya',
    titleEn: 'IZAKAYA',
    titleJp: '居酒屋',
    description: 'Sharing plates designed for late-night revelry.',
    chapterNumber: 2,
    order: 2,
    sectionType: 'food',
  },
  {
    id: 'sushi-bar',
    slug: 'sushi-bar',
    titleEn: 'SUSHI BAR',
    titleJp: '寿司屋',
    description: 'Fresh nigiri, sashimi, and signature rolls.',
    chapterNumber: 3,
    order: 3,
    sectionType: 'food',
  },
  {
    id: 'ramen',
    slug: 'ramen',
    titleEn: 'RAMEN',
    titleJp: 'ラーメン',
    description: 'Rich tonkotsu and shoyu broths, made in-house daily.',
    chapterNumber: 4,
    order: 4,
    sectionType: 'food',
  },
  {
    id: 'cocktails',
    slug: 'cocktails',
    titleEn: 'COCKTAILS',
    titleJp: 'カクテル',
    description: 'Japanese-inspired cocktails, highballs, and a 47-label sake list.',
    chapterNumber: 5,
    order: 5,
    sectionType: 'drink',
  },
  {
    id: 'desserts',
    slug: 'desserts',
    titleEn: 'DESSERTS',
    titleJp: 'デザート',
    description: 'Sweet endings to your night.',
    chapterNumber: 6,
    order: 6,
    sectionType: 'dessert',
  },
  {
    id: 'brunch',
    slug: 'brunch',
    titleEn: 'BRUNCH',
    titleJp: '朝食',
    description: 'Weekend brunch. Saturday & Sunday, 11AM – 4PM.',
    chapterNumber: 7,
    order: 7,
    sectionType: 'food',
  },
];

export const menuItems: MenuItem[] = [
  // ROBATA
  { id: 'robata-1', categoryId: 'robata', name: 'YAKITORI', subtitle: 'Negima', description: 'Charcoal-grilled chicken thigh with scallion.', priceAED: 45, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'robata-2', categoryId: 'robata', name: 'TSUKUNE', subtitle: 'Chicken Meatball', description: 'Hand-rolled chicken meatball with tare and egg yolk.', priceAED: 55, tags: ['signature', 'chef-pick'], isAvailable: true, featured: true },
  { id: 'robata-3', categoryId: 'robata', name: 'BEEF TONGUE', subtitle: 'Gyutan', description: 'Thinly sliced beef tongue with yuzu kosho.', priceAED: 75, tags: [], isAvailable: true, featured: false },
  { id: 'robata-4', categoryId: 'robata', name: 'PORK BELLY', subtitle: 'Butabara', description: 'Crispy pork belly skewer with tare glaze.', priceAED: 50, tags: [], isAvailable: true, featured: false },
  { id: 'robata-5', categoryId: 'robata', name: 'KING OYSTER MUSHROOM', subtitle: 'Eringi', description: 'Grilled eringi with garlic butter and soy.', priceAED: 38, tags: ['vegetarian'], isAvailable: true, featured: false },
  { id: 'robata-6', categoryId: 'robata', name: 'ASPARAGUS', subtitle: 'Bacon-Wrapped', description: 'Asparagus wrapped in pork belly.', priceAED: 42, tags: [], isAvailable: true, featured: false },
  { id: 'robata-7', categoryId: 'robata', name: 'QUAIL EGG', subtitle: 'Umame', description: 'Skewered quail egg wrapped in pork.', priceAED: 35, tags: [], isAvailable: true, featured: false },
  { id: 'robata-8', categoryId: 'robata', name: 'SCALLOP', subtitle: 'Hotate', description: 'Grilled Hokkaido scallop with butter.', priceAED: 85, tags: ['signature'], isAvailable: true, featured: true },

  // IZAKAYA
  { id: 'izakaya-1', categoryId: 'izakaya', name: 'TIGER TATAKI', subtitle: 'Beef', description: 'Seared A5 wagyu tataki with ponzu and grated daikon.', priceAED: 120, tags: ['signature', 'chef-pick'], isAvailable: true, featured: true },
  { id: 'izakaya-2', categoryId: 'izakaya', name: 'EDAMAME', subtitle: 'Truffle & Salt', description: 'Steamed edamame with truffle salt.', priceAED: 28, tags: ['vegan', 'vegetarian'], isAvailable: true, featured: false },
  { id: 'izakaya-3', categoryId: 'izakaya', name: 'GYOZA', subtitle: 'Pork', description: 'Pan-fried pork dumplings with chili oil.', priceAED: 48, tags: [], isAvailable: true, featured: false },
  { id: 'izakaya-4', categoryId: 'izakaya', name: 'KARAAGE', subtitle: 'Chicken', description: 'Crispy Japanese fried chicken.', priceAED: 58, tags: [], isAvailable: true, featured: true },
  { id: 'izakaya-5', categoryId: 'izakaya', name: 'OKONOMIYAKI', subtitle: 'Osaka Style', description: 'Savory pancake with cabbage and pork.', priceAED: 78, tags: [], isAvailable: true, featured: false },
  { id: 'izakaya-6', categoryId: 'izakaya', name: 'TAKOYAKI', subtitle: 'Octopus Balls', description: 'Osaka-style takoyaki with okonomiyaki sauce.', priceAED: 52, tags: [], isAvailable: true, featured: false },
  { id: 'izakaya-7', categoryId: 'izakaya', name: 'CHASHU DON', subtitle: 'Pork Bowl', description: 'Braised pork belly over rice.', priceAED: 72, tags: [], isAvailable: true, featured: false },
  { id: 'izakaya-8', categoryId: 'izakaya', name: 'AGE DASHI TOFU', subtitle: 'Fried Tofu', description: 'Crispy fried tofu in dashi broth.', priceAED: 42, tags: ['vegetarian', 'vegan'], isAvailable: true, featured: false },

  // SUSHI BAR
  { id: 'sushi-1', categoryId: 'sushi-bar', name: 'SASHIMI PLATTER', subtitle: 'Chef\'s Selection', description: 'Chef\'s daily selection of 8 pieces of sashimi.', priceAED: 160, tags: ['signature', 'chef-pick'], isAvailable: true, featured: true },
  { id: 'sushi-2', categoryId: 'sushi-bar', name: 'TIGER ROLL', subtitle: 'Spicy Salmon', description: 'Spicy salmon, tempura flakes, tobiko.', priceAED: 75, tags: ['signature', 'spicy'], isAvailable: true, featured: true, spiceLevel: 2 },
  { id: 'sushi-3', categoryId: 'sushi-bar', name: 'NIGIRI SELECTION', subtitle: '6 Pieces', description: 'Tuna, salmon, yellowtail, sea bream, prawn, scallop.', priceAED: 110, tags: [], isAvailable: true, featured: false },
  { id: 'sushi-4', categoryId: 'sushi-bar', name: 'TUNA TATAKI', subtitle: 'Seared', description: 'Seared tuna with sesame, ponzu, spring onion.', priceAED: 88, tags: [], isAvailable: true, featured: false },
  { id: 'sushi-5', categoryId: 'sushi-bar', name: 'CALIFORNIA ROLL', subtitle: 'Classic', description: 'Crab, avocado, cucumber, tobiko.', priceAED: 58, tags: [], isAvailable: true, featured: false },
  { id: 'sushi-6', categoryId: 'sushi-bar', name: 'SALMON NIGIRI', subtitle: '2 Pieces', description: 'Fresh Scottish salmon.', priceAED: 42, tags: [], isAvailable: true, featured: false },
  { id: 'sushi-7', categoryId: 'sushi-bar', name: 'TUNA NIGIRI', subtitle: '2 Pieces', description: 'Bluefin tuna akami.', priceAED: 52, tags: [], isAvailable: true, featured: false },
  { id: 'sushi-8', categoryId: 'sushi-bar', name: 'DYNAMITE ROLL', subtitle: 'Spicy Scallop', description: 'Spicy scallop tempura, avocado, spicy mayo.', priceAED: 68, tags: ['spicy'], isAvailable: true, featured: false, spiceLevel: 1 },

  // RAMEN
  { id: 'ramen-1', categoryId: 'ramen', name: 'TONKOTSU RAMEN', subtitle: 'Classic', description: 'Rich pork bone broth, chashu, ajitama, menma, negi.', priceAED: 78, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'ramen-2', categoryId: 'ramen', name: 'SHOYU RAMEN', subtitle: 'Soy Sauce', description: 'Clear soy sauce broth, chicken chashu, negi.', priceAED: 68, tags: [], isAvailable: true, featured: false },
  { id: 'ramen-3', categoryId: 'ramen', name: 'MISO RAMEN', subtitle: 'Hokkaido Style', description: 'Rich miso broth, corn, butter, bean sprouts.', priceAED: 72, tags: [], isAvailable: true, featured: false },
  { id: 'ramen-4', categoryId: 'ramen', name: 'SPICY TONKOTSU', subtitle: 'Tiger Style', description: 'Spicy pork bone broth, ground pork, chili oil.', priceAED: 82, tags: ['signature', 'spicy'], isAvailable: true, featured: true, spiceLevel: 2 },
  { id: 'ramen-5', categoryId: 'ramen', name: 'VEGETARIAN RAMEN', subtitle: 'Miso', description: 'Miso vegetable broth, mushrooms, bamboo shoots, corn.', priceAED: 65, tags: ['vegetarian', 'vegan'], isAvailable: true, featured: false },
  { id: 'ramen-6', categoryId: 'ramen', name: 'TSUKEMEN', subtitle: 'Dipping Noodles', description: 'Thick noodles served with rich dipping broth.', priceAED: 75, tags: [], isAvailable: true, featured: false },
  { id: 'ramen-7', categoryId: 'ramen', name: 'KAARAGE DON', subtitle: 'Rice Bowl', description: 'Crispy fried chicken over rice with pickles.', priceAED: 58, tags: [], isAvailable: true, featured: false },
  { id: 'ramen-8', categoryId: 'ramen', name: 'EXTRA AJITAMA', subtitle: 'Marinated Egg', description: 'Soy-marinated soft-boiled egg.', priceAED: 12, tags: [], isAvailable: true, featured: false },

  // COCKTAILS
  { id: 'cocktail-1', categoryId: 'cocktails', name: 'TIGER\'S BLOOD', subtitle: 'Signature', description: 'Yuzu, shiso, vodka, hibiscus, soda.', priceAED: 58, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'cocktail-2', categoryId: 'cocktails', name: 'HIGH BALL', subtitle: 'Whisky & Soda', description: 'Nikka whisky, soda water, lemon twist.', priceAED: 48, tags: [], isAvailable: true, featured: false },
  { id: 'cocktail-3', categoryId: 'cocktails', name: 'SAKURA MARTINI', subtitle: 'Vodka', description: 'Vodka, cherry blossom liqueur, yuzu.', priceAED: 62, tags: [], isAvailable: true, featured: false },
  { id: 'cocktail-4', categoryId: 'cocktails', name: 'NEGRONI', subtitle: 'Japanese', description: 'Japanese gin, campari, sweet vermouth.', priceAED: 55, tags: [], isAvailable: true, featured: false },
  { id: 'cocktail-5', categoryId: 'cocktails', name: 'MATCHA ESPRESSO MARTINI', subtitle: 'Caffeinated', description: 'Vodka, coffee liqueur, matcha, espresso.', priceAED: 65, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'cocktail-6', categoryId: 'cocktails', name: 'APEROL SPRITZ', subtitle: 'Classic', description: 'Aperol, prosecco, soda.', priceAED: 52, tags: [], isAvailable: true, featured: false },
  { id: 'cocktail-7', categoryId: 'cocktails', name: 'YUZU SOUR', subtitle: 'Cocktail', description: 'Japanese whisky, yuzu juice, simple syrup, egg white.', priceAED: 60, tags: [], isAvailable: true, featured: false },
  { id: 'cocktail-8', categoryId: 'cocktails', name: 'GINGER MULE', subtitle: 'Japanese', description: 'Japanese vodka, ginger beer, lime.', priceAED: 55, tags: [], isAvailable: true, featured: false },

  // DESSERTS
  { id: 'dessert-1', categoryId: 'desserts', name: 'MOCHI ICE CREAM', subtitle: 'Assorted', description: 'Green tea, strawberry, chocolate mochi.', priceAED: 38, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'dessert-2', categoryId: 'desserts', name: 'MATCHA TIRAMISU', subtitle: 'Japanese Twist', description: 'Matcha mascarpone, ladyfingers, red bean.', priceAED: 48, tags: [], isAvailable: true, featured: false },
  { id: 'dessert-3', categoryId: 'desserts', name: 'TEMPURA ICE CREAM', subtitle: 'Vanilla', description: 'Vanilla ice cream wrapped in tempura, served hot.', priceAED: 45, tags: ['signature'], isAvailable: true, featured: true },
  { id: 'dessert-4', categoryId: 'desserts', name: 'DORAYAKI', subtitle: 'Red Bean', description: 'Red bean paste pancake sandwich.', priceAED: 35, tags: ['vegetarian'], isAvailable: true, featured: false },
  { id: 'dessert-5', categoryId: 'desserts', name: 'BLACK SESAME Panna Cotta', subtitle: 'Creamy', description: 'Black sesame panna cotta with honey.', priceAED: 42, tags: [], isAvailable: true, featured: false },
  { id: 'dessert-6', categoryId: 'desserts', name: 'FRUIT PLATTER', subtitle: 'Seasonal', description: 'Seasonal Japanese fruits.', priceAED: 58, tags: ['vegan', 'vegetarian'], isAvailable: true, featured: false },
  { id: 'dessert-7', categoryId: 'desserts', name: 'YOGURT PARFAIT', subtitle: 'Granola', description: 'Japanese yogurt, granola, fruit, honey.', priceAED: 40, tags: ['vegetarian'], isAvailable: true, featured: false },
  { id: 'dessert-8', categoryId: 'desserts', name: 'CHEESECAKE', subtitle: 'Japanese Style', description: 'Light and fluffy Japanese cheesecake.', priceAED: 45, tags: [], isAvailable: true, featured: false },

  // BRUNCH — Sat & Sun 11AM–4PM
  { id: 'brunch-1', categoryId: 'brunch', name: 'TEISHOKU SET',     subtitle: 'Morning Classic',  description: 'Rice, miso soup, grilled fish, seasonal pickles.',           priceAED: 85,  tags: ['signature'],               isAvailable: true, featured: true  },
  { id: 'brunch-2', categoryId: 'brunch', name: 'TAMAGOYAKI',       subtitle: 'Rolled Omelette',  description: 'Dashi-sweet rolled egg, daikon radish.',                    priceAED: 42,  tags: ['vegetarian'],              isAvailable: true, featured: false },
  { id: 'brunch-3', categoryId: 'brunch', name: 'MATCHA PANCAKES',  subtitle: 'Ceremonial Grade', description: 'Ceremonial matcha pancakes with red bean cream.',           priceAED: 68,  tags: ['vegetarian', 'signature'], isAvailable: true, featured: true  },
  { id: 'brunch-4', categoryId: 'brunch', name: 'CHIRASHI BOWL',    subtitle: 'Market Fish',      description: 'Market fish over seasoned sushi rice with tamago.',        priceAED: 128, tags: ['chef-pick'],               isAvailable: true, featured: true  },
  { id: 'brunch-5', categoryId: 'brunch', name: 'MORNING RAMEN',    subtitle: 'Shoyu',            description: 'Light shoyu broth with chashu and soft-boiled egg.',       priceAED: 72,  tags: [],                          isAvailable: true, featured: false },
  { id: 'brunch-6', categoryId: 'brunch', name: 'WAGYU BENEDICT',   subtitle: 'Luxury Brunch',    description: 'A5 wagyu, poached egg, miso hollandaise.',                  priceAED: 145, tags: ['signature', 'chef-pick'],  isAvailable: true, featured: false },
  { id: 'brunch-7', categoryId: 'brunch', name: 'MENTAIKO TOAST',   subtitle: 'Spicy Roe',        description: 'Thick-cut brioche, spicy cod roe butter, pickled cucumber.',priceAED: 62,  tags: ['spicy'],                   isAvailable: true, featured: false },
  { id: 'brunch-8', categoryId: 'brunch', name: 'ONSEN TAMAGO',     subtitle: 'Slow Egg',         description: 'Temperature-controlled egg, dashi, truffle oil, rice.',    priceAED: 48,  tags: ['vegetarian'],              isAvailable: true, featured: false },
];

export const getMenuItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.categoryId === categoryId);
};
