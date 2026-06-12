'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

/* ─── Constants ────────────────────────────────────────────────────────── */
const SITE_URL = 'https://heytigerdubai.com/menu';

/* ─── Types ────────────────────────────────────────────────────────────── */
type Tag = 'SIGNATURE' | 'CHEF' | 'NEW' | 'VEGAN' | 'SPICY' | 'PREMIUM';

interface MenuItem {
  name: string;
  jp?: string;
  desc: string;
  price: string;
  tags?: Tag[];
  dietary?: string[]; // V, SP, D, E, G, S, F, N
  note?: string;
  emoji: string;
  gradient: string;
  photo: string;
  subcategory?: string;
}

interface MenuCategory {
  id: string;
  label: string;
  jp: string;
  sub: string;
  accent: string;
  items: MenuItem[];
}



/* ─── Dietary labels styling ───────────────────────────────────────────── */
const DIETARY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  V:  { label: 'PLANT-BASED', color: '#8FA882', bg: 'rgba(74,94,50,0.22)' },
  SP: { label: '🌶 SPICY', color: '#C83D20', bg: 'rgba(200,61,32,0.15)' },
  D:  { label: 'DAIRY', color: '#E5D5B8', bg: 'rgba(240,235,216,0.08)' },
  E:  { label: 'EGG', color: '#C8B890', bg: 'rgba(200,184,144,0.08)' },
  G:  { label: 'GLUTEN', color: '#C17B3F', bg: 'rgba(193,123,63,0.1)' },
  S:  { label: 'SHELLFISH', color: '#5C9EAD', bg: 'rgba(92,158,173,0.1)' },
  F:  { label: 'FISH', color: '#3A86C8', bg: 'rgba(58,134,200,0.1)' },
  N:  { label: 'NUTS', color: '#E8A87C', bg: 'rgba(232,168,124,0.1)' },
};

const CATEGORY_FALLBACK_PHOTOS: Record<string, string> = {
  starters: '/images/spaces/dining.jpg',
  sushi: '/images/spaces/dining-night.jpg',
  dimsum: '/images/spaces/den.jpg',
  robata: '/images/spaces/bar.jpg',
  wokmains: '/images/spaces/terrace-day.jpg',
  ricenoodles: '/images/spaces/rooftop.jpg',
  sides: '/images/spaces/dining.jpg',
  dessert: '/images/spaces/terrace-day.jpg',
  cocktails: '/images/spaces/rooftop.jpg',
  sake: '/images/spaces/bar.jpg',
  noproof: '/images/spaces/dining.jpg',
};

/* ─── Full menu data ───────────────────────────────────────────────────── */
const MENU: MenuCategory[] = [
  /* ── STARTERS ── */
  {
    id: 'starters', label: 'STARTERS', jp: '前菜',
    sub: 'Starters, Tempura, Salads & Soups',
    accent: '#faaf3f',
    items: [
      { name: 'Edamame', jp: '枝豆', price: 'AED 28', subcategory: 'STARTERS', dietary: ['V'],
        emoji: '🫛', gradient: 'radial-gradient(ellipse at 35% 40%, #1A2410 0%, #0E1408 55%, #050803 100%)',
        photo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed young soybeans, lightly salted and finished with a touch of sesame oil.' },
      { name: 'Chili Edamame', jp: 'チリ枝豆', price: 'AED 32', subcategory: 'STARTERS', dietary: ['V', 'SP'],
        emoji: '🌶️', gradient: 'radial-gradient(ellipse at 40% 35%, #2A0C0C 0%, #18080A 55%, #0D0506 100%)',
        photo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80',
        desc: 'Wok-tossed with garlic chili paste and soy glaze. Spicy, sticky, and addictive.' },
      { name: 'Kimchi Trio', jp: 'キムチトリオ', price: 'AED 38', subcategory: 'STARTERS', dietary: ['SP'],
        emoji: '🥬', gradient: 'radial-gradient(ellipse at 42% 38%, #300A0A 0%, #1A0606 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=900&q=80',
        desc: 'House-fermented cabbage, radish & cucumber. Sharp, funky, with traditional spice.' },
      { name: 'Seabass Papaya', jp: 'シーバスパパイヤ', price: 'AED 58', subcategory: 'STARTERS', dietary: ['F', 'SP'],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 38% 42%, #241A08 0%, #140E04 55%, #0B0803 100%)',
        photo: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin-sliced seabass, green papaya salad, chili lime dressing, and fresh herbs.' },
      { name: 'Wafu Goma Scallop', jp: '和風胡麻ホタテ', price: 'AED 72', subcategory: 'STARTERS', dietary: ['S', 'N'],
        emoji: '🫧', gradient: 'radial-gradient(ellipse at 40% 40%, #201A08 0%, #120E04 55%, #0A0C02 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Seared scallops, sesame dressing, finished with a light citrus soy.' },
      { name: 'Spicy Rock Shrimp', jp: 'スパイシーロックシュリンプ', price: 'AED 68', subcategory: 'STARTERS', dietary: ['S', 'E', 'SP'],
        emoji: '🍤', gradient: 'radial-gradient(ellipse at 42% 36%, #2E1A08 0%, #180E04 55%, #0C0702 100%)',
        photo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy shrimp in a spicy mayo glaze. Crunchy with a creamy heat.' },
      { name: 'Calamari', jp: 'カラマリ', price: 'AED 55', subcategory: 'STARTERS', dietary: ['G', 'S'],
        emoji: '🦑', gradient: 'radial-gradient(ellipse at 40% 38%, #1A1820 0%, #0E1018 55%, #060810 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Lightly battered squid rings served with a citrus aioli.' },
      { name: 'Korean Fried Chicken Bites', jp: '韓国風フライドチキン', price: 'AED 62', subcategory: 'STARTERS', dietary: ['G', 'E', 'SP'],
        emoji: '🍗', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1008 0%, #180806 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy chicken glazed in gochujang. Sweet, spicy, and sticky.' },
      { name: 'Agedashi Tofu', jp: '揚げ出し豆腐', price: 'AED 42', subcategory: 'STARTERS', dietary: ['G', 'V'],
        emoji: '🫘', gradient: 'radial-gradient(ellipse at 40% 40%, #1E1A14 0%, #12100C 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy tofu in a warm dashi broth, topped with bonito flakes and spring onion.' },
      { name: 'Seoul Seafood Pancake', jp: 'ソウル海鮮チヂミ', price: 'AED 64', subcategory: 'STARTERS', dietary: ['G', 'S', 'E'],
        emoji: '🥞', gradient: 'radial-gradient(ellipse at 38% 38%, #281C08 0%, #161004 55%, #0C0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy pancake loaded with mixed seafood, served with a tangy soy dipping sauce.' },
      { name: 'Tuna Egg Roll', jp: 'ツナエッグロール', price: 'AED 48', subcategory: 'STARTERS', dietary: ['F', 'E'],
        emoji: '🥚', gradient: 'radial-gradient(ellipse at 40% 38%, #221A0A 0%, #141006 55%, #0C0803 100%)',
        photo: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80',
        desc: 'Soft omelette rolled with a savory tuna mix, finished with a light soy glaze.' },
      { name: 'Ebi Tempura', jp: '海老天ぷら', price: 'AED 68', subcategory: 'TEMPURA', dietary: ['G', 'S'],
        emoji: '🍤', gradient: 'radial-gradient(ellipse at 40% 38%, #28180A 0%, #160E06 55%, #0C0804 100%)',
        photo: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy battered shrimp served with a light tempura dipping sauce.' },
      { name: 'Yasai Tempura', jp: '野菜天ぷら', price: 'AED 48', subcategory: 'TEMPURA', dietary: ['G', 'V'],
        emoji: '🥦', gradient: 'radial-gradient(ellipse at 38% 40%, #1A2410 0%, #0E1408 55%, #050803 100%)',
        photo: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
        desc: 'Seasonal vegetables in a delicate and light crispy batter.' },
      { name: 'Seaweed Salad', jp: '海藻サラダ', price: 'AED 32', subcategory: 'SALADS', dietary: ['V'],
        emoji: '🥗', gradient: 'radial-gradient(ellipse at 35% 40%, #0E1A0C 0%, #081008 55%, #040C04 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Marinated seaweed and sesame seeds. Sweet and packed with umami.' },
      { name: 'Asian Mix Salad', jp: 'アジアンミックスサラダ', price: 'AED 38', subcategory: 'SALADS', dietary: ['N', 'V'],
        emoji: '🥬', gradient: 'radial-gradient(ellipse at 40% 38%, #142010 0%, #0A1408 55%, #050C04 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh greens tossed in a sesame dressing. Crunchy, zesty, and fresh.' },
      { name: 'Sashimi Salad', jp: '刺身サラダ', price: 'AED 65', subcategory: 'SALADS', dietary: ['F'],
        emoji: '🥗', gradient: 'radial-gradient(ellipse at 40% 40%, #0A1A20 0%, #061018 55%, #040C10 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh slices of raw fish served over mixed greens with a citrus soy dressing.' },
      { name: 'King Crab Salad', jp: 'キングクラブサラダ', price: 'AED 78', subcategory: 'SALADS', dietary: ['S', 'D'],
        emoji: '🦀', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1A10 0%, #18100A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet king crab meat, creamy dressing, and crisp garden vegetables.' },
      { name: 'Duck Salad', jp: 'ダックサラダ', price: 'AED 68', subcategory: 'SALADS', dietary: ['G'],
        emoji: '🦆', gradient: 'radial-gradient(ellipse at 40% 38%, #2E1A10 0%, #1A100A 55%, #0E0A06 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Roasted duck slices served over mixed greens with a rich hoisin dressing.' },
      { name: 'Miso Soup', jp: '味噌汁', price: 'AED 22', subcategory: 'SOUPS', dietary: ['V'],
        emoji: '🥣', gradient: 'radial-gradient(ellipse at 38% 38%, #1A140E 0%, #100C08 55%, #0A0804 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Soybean paste broth with silken tofu and seaweed. Light, warm, and comforting.' },
      { name: 'Egg Drop Soup', jp: 'かきたま汁', price: 'AED 24', subcategory: 'SOUPS', dietary: ['E'],
        emoji: '🥣', gradient: 'radial-gradient(ellipse at 40% 40%, #201A0E 0%, #14100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Silky egg ribbons swirled in a rich, savory broth. A comforting classic.' },
      { name: 'Seafood Soup', jp: '海鮮スープ', price: 'AED 38', subcategory: 'SOUPS', dietary: ['S', 'F'],
        emoji: '🥣', gradient: 'radial-gradient(ellipse at 40% 38%, #0C1E2A 0%, #08121A 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Mixed seafood simmered in a rich broth with deep ocean flavors.' },
      { name: 'Hot & Sour Soup', jp: '酸辣湯', price: 'AED 30', subcategory: 'SOUPS', dietary: ['E', 'SP'],
        emoji: '🥣', gradient: 'radial-gradient(ellipse at 42% 38%, #2A0E0C 0%, #1A0A08 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Tangy and spicy broth packed with tofu, mushrooms, and egg ribbons.' },
    ],
  },

  /* ── SUSHI & ROLLS ── */
  {
    id: 'sushi', label: 'SUSHI & ROLLS', jp: '寿司 & 巻物',
    sub: 'Sashimi, Nigiri & Maki Rolls',
    accent: '#E8341A',
    items: [
      { name: 'Tuna (Maguro)', jp: 'マグロ', price: 'AED 42', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #2C0C0C 0%, #1A0808 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Lean bluefin tuna, clean soy finish. Served with wasabi and pickled ginger.' },
      { name: 'Salmon (Sake)', jp: 'サーモン', price: 'AED 38', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 40%, #2A1008 0%, #180A06 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh, buttery Atlantic salmon. Served with wasabi and pickled ginger.' },
      { name: 'Yellowtail (Hamachi)', jp: 'ハマチ', price: 'AED 46', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 42% 36%, #1E1A10 0%, #12100A 55%, #0A0806 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Premium Japanese yellowtail, citrus soy. Served with wasabi and pickled ginger.' },
      { name: 'Sea Bass (Suzuki)', jp: 'スズキ', price: 'AED 40', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #101E20 0%, #0A1218 55%, #060C10 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh sea bass, light ponzu, shiso leaf, and yuzu zest.' },
      { name: 'Scallop (Hotate)', jp: 'ホタテ', price: 'AED 48', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 40%, #14202A 0%, #0A141A 55%, #060C10 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet Japanese scallop, yuzu kosho, and sea salt.' },
      { name: 'Shrimp (Ebi)', jp: 'エビ', price: 'AED 34', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 38% 38%, #2A1A0C 0%, #181008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Poached shrimp over seasoned sushi rice with wasabi and soy glaze.' },
      { name: 'Sweet Shrimp (Botan Ebi)', jp: 'ボタンエビ', price: 'AED 56', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1C10 0%, #18120A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Raw sweet botan ebi with a delicate finish and a fresh lemon squeeze.' },
      { name: 'Fatty Tuna (O-Toro)', jp: '大トロ', price: 'AED 78', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 42% 38%, #3A0E0E 0%, #200808 55%, #100404 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Premium fatty bluefin tuna belly. Rich, buttery, and melt-in-your-mouth.' },
      { name: 'Sea Urchin (Uni)', jp: 'ウニ', price: 'AED 88', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1806 0%, #181004 55%, #0E0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh sea urchin with a rich, creamy ocean brine finish.' },
      { name: 'Salmon Roe (Ikura)', jp: 'イクラ', price: 'AED 58', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #2C0E14 0%, #1C0A0E 55%, #0E0608 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Soy-cured salmon roe. Delicate snaps of deep sea flavor.' },
      { name: 'King Crab (Tarabagani)', jp: 'タラバガニ', price: 'AED 72', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 42% 38%, #2E1A0C 0%, #1A1008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet king crab meat, Japanese mayo, and a light lemon drizzle.' },
      { name: 'Snow Crab (Zuwai Gani)', jp: 'ズワイガニ', price: 'AED 62', subcategory: 'SUSHI & SASHIMI', dietary: ['S'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1E10 0%, #18140A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet snow crab meat, crisp cucumber, and a burst of citrus flavor.' },
      { name: 'Fresh Water Eel (Unagi)', jp: 'うなぎ', price: 'AED 48', subcategory: 'SUSHI & SASHIMI', dietary: ['F', 'G'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 38%, #201A0E 0%, #14100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled water eel, sweet tare glaze, toasted sesame over sushi rice.' },
      { name: 'Tuna Tataki', jp: 'マグロタタキ', price: 'AED 60', subcategory: 'SUSHI & SASHIMI', dietary: ['F', 'G'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 40%, #2E0C0C 0%, #1C0808 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80',
        desc: 'Seared bluefin tuna, ponzu dressing, crispy garlic chips, and spring onion.' },
      { name: 'Salmon Tataki', jp: 'サーモンタタキ', price: 'AED 54', subcategory: 'SUSHI & SASHIMI', dietary: ['F', 'G'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 40% 40%, #2A1408 0%, #1A0E06 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80',
        desc: 'Lightly seared salmon, yuzu ponzu, and crunchy crispy shallots.' },
      { name: 'Hiramasa Carpaccio', jp: 'ヒラマサカルパッチョ', price: 'AED 72', subcategory: 'SUSHI & SASHIMI', dietary: ['F'],
        emoji: '🍣', gradient: 'radial-gradient(ellipse at 42% 38%, #14202A 0%, #0A141A 55%, #060C10 100%)',
        photo: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin-sliced hiramasa, yuzu soy, fresh jalapeño, and aromatic micro herbs.' },
      { name: 'Spiced Tuna Crispy Rice', jp: 'スパイシーツナクリスピーライス', price: 'AED 58', subcategory: 'SUSHI & SASHIMI', dietary: ['F', 'G', 'E', 'SP'],
        emoji: '🍙', gradient: 'radial-gradient(ellipse at 40% 38%, #2A0C0C 0%, #18080A 55%, #0D0506 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy pressed sushi rice cake, spicy tuna, dynamite mayo, and spring onion.' },
      { name: 'Tuna Cracker', jp: 'ツナクラッカー', price: 'AED 52', subcategory: 'SUSHI & SASHIMI', dietary: ['F', 'G', 'E', 'SP'],
        emoji: '🍘', gradient: 'radial-gradient(ellipse at 40% 38%, #2C0C0C 0%, #1A0808 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy cracker topped with chopped spicy tuna, dynamite mayo, sesame, and chives.' },
      { name: 'California Roll', jp: 'カリフォルニアロール', price: 'AED 40', subcategory: 'MAKI / ROLLS', dietary: ['S', 'D', 'E'],
        emoji: '🌀', gradient: 'radial-gradient(ellipse at 40% 40%, #141C2A 0%, #0A1018 55%, #060810 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Crab mix, fresh avocado, cucumber, sesame, and a light Japanese mayo finish.' },
      { name: 'Prawn Tempura Roll', jp: '海老天ぷらロール', price: 'AED 58', subcategory: 'MAKI / ROLLS', dietary: ['G', 'S', 'E'],
        emoji: '🌀', gradient: 'radial-gradient(ellipse at 40% 38%, #241A0E 0%, #14100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy tempura prawn, avocado, sweet soy glaze, finished with a crunch topping.' },
      { name: 'Spicy Salmon Roll', jp: 'スパイシーサーモンロール', price: 'AED 52', subcategory: 'MAKI / ROLLS', dietary: ['F', 'SP'],
        emoji: '🌀', gradient: 'radial-gradient(ellipse at 40% 40%, #2A100A 0%, #180C06 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=crop&w=900&q=80',
        desc: 'Fresh Atlantic salmon, spicy mayo, crisp cucumber, and toasted sesame.' },
      { name: 'Spicy Tuna Roll', jp: 'スパイシーツナロール', price: 'AED 54', subcategory: 'MAKI / ROLLS', dietary: ['F', 'SP'],
        emoji: '🌀', gradient: 'radial-gradient(ellipse at 42% 38%, #2A0C0C 0%, #1A0808 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Chopped bluefin tuna, house spicy mayo, spring onion, and toasted sesame.' },
      { name: 'Veggie Roll', jp: 'ベジタブルロール', price: 'AED 42', subcategory: 'MAKI / ROLLS', dietary: ['V', 'G'],
        emoji: '🥬', gradient: 'radial-gradient(ellipse at 38% 40%, #0E1C0C 0%, #081008 55%, #040C04 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh avocado, cucumber, julienned carrot, sesame, and light soy glaze.' },
      { name: 'Rainbow California Roll', jp: 'レインボーロール', price: 'AED 68', subcategory: 'MAKI / ROLLS', dietary: ['F', 'S', 'G', 'E'],
        emoji: '✨', gradient: 'radial-gradient(ellipse at 40% 40%, #241C2A 0%, #16101A 55%, #0E0A12 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Classic California roll topped with assorted premium sashimi, avocado, and citrus soy.' },
      { name: 'Dragon Roll', jp: 'ドラゴンロール', price: 'AED 72', subcategory: 'MAKI / ROLLS', dietary: ['F', 'G'],
        emoji: '🐉', gradient: 'radial-gradient(ellipse at 40% 38%, #1E1C14 0%, #12100C 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Toasted unagi eel, cucumber, topped with avocado slices, sweet tare, and sesame.' },
      { name: 'Softshell Crab Roll', jp: 'ソフトシェルクラブロール', price: 'AED 64', subcategory: 'MAKI / ROLLS', dietary: ['G', 'S', 'E'],
        emoji: '🦀', gradient: 'radial-gradient(ellipse at 42% 40%, #2A1A0C 0%, #181008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy soft-shell crab, lettuce, Japanese mayo, cucumber, and a tobiko crown.' },
      { name: 'Hey Tiger Roll', jp: 'ヘイタイガーロール', price: 'AED 74', subcategory: 'MAKI / ROLLS', dietary: ['F', 'S', 'G', 'E', 'SP'],
        emoji: '🐅', gradient: 'radial-gradient(ellipse at 40% 40%, #2A1408 0%, #180E04 55%, #0E0802 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy tempura prawn, spicy tuna, tempura crunch, finished with our signature bold sauce.' },
      { name: 'Negi Toro Roll', jp: 'ネギトロロール', price: 'AED 62', subcategory: 'MAKI / ROLLS', dietary: ['F'],
        emoji: '🌀', gradient: 'radial-gradient(ellipse at 40% 38%, #141C24 0%, #0A1018 55%, #060810 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Minced fatty tuna, chopped spring onion, light soy glaze, and toasted sesame.' },
      { name: 'Beef Bulgogi Kimbap Roll', jp: 'プルコギキンパロール', price: 'AED 58', subcategory: 'MAKI / ROLLS', dietary: ['G', 'E'],
        emoji: '🐂', gradient: 'radial-gradient(ellipse at 42% 40%, #241A0E 0%, #16100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Marinated bulgogi beef, pickled vegetables, egg, rolled in sesame oil and seaweed.' },
      { name: 'Tuna Kimbap Roll', jp: 'ツナキンパロール', price: 'AED 52', subcategory: 'MAKI / ROLLS', dietary: [],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 40% 40%, #201A0E 0%, #14120A 55%, #0C0A06 100%)',
        photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
        desc: 'Savory tuna mix, pickled yellow daikon, rolled Korean-style with toasted sesame.' },
    ],
  },

  /* ── DIM SUM ── */
  {
    id: 'dimsum', label: 'DIM SUM', jp: '点心',
    sub: 'Steamed & pan-fried delicacies',
    accent: '#faaf3f',
    items: [
      { name: 'Har Gau', jp: 'ハーガウ', price: 'AED 48', dietary: ['G', 'S'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 35% 40%, #14202A 0%, #0A141A 55%, #060C10 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed shrimp dumplings in a delicate translucent wrapper, served with light soy.' },
      { name: 'Seafood Har Gau', jp: 'シーフードハーガウ', price: 'AED 52', dietary: ['G', 'S'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 40% 35%, #0C1E2A 0%, #08121A 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed mixed seafood dumplings with a savory and aromatic broth filling.' },
      { name: 'Chicken Shumai', jp: 'チキンのシウマイ', price: 'AED 46', dietary: ['G'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1E0E 0%, #18120A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed open-faced dumplings filled with seasoned chicken, toasted sesame, and light soy.' },
      { name: 'Seafood Shumai', jp: 'シーフードシウマイ', price: 'AED 52', dietary: ['G', 'S'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 38% 42%, #0E1C2A 0%, #08101A 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed open-faced dumplings filled with a rich and savory seafood blend.' },
      { name: 'Chicken & Kimchi Gyoza', jp: 'チキンキムチ餃子', price: 'AED 48', dietary: ['G', 'SP'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 40% 40%, #2E1008 0%, #1A0E06 55%, #0D0604 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Pan-fried dumplings stuffed with chicken and spicy house kimchi.' },
      { name: 'Wagyu Gyoza', jp: '和牛餃子', price: 'AED 62', dietary: ['G'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 42% 36%, #2E1A0C 0%, #180E04 55%, #0C0702 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Pan-fried wagyu dumplings with a rich, juicy beef and ginger filling.' },
      { name: 'Black Cod Gyoza', jp: '銀だら餃子', price: 'AED 58', dietary: ['F', 'G'],
        emoji: '🥟', gradient: 'radial-gradient(ellipse at 40% 38%, #101E20 0%, #0A121A 55%, #060C10 100%)',
        photo: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80',
        desc: 'Pan-fried dumplings with sweet black cod filling, served with a light dipping soy.' },
      { name: 'Duck Harumaki', jp: 'ダック春巻き', price: 'AED 54', dietary: ['G'],
        emoji: '🥢', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1A0C 0%, #181008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy fried spring rolls stuffed with aromatic roasted duck, served with a sweet soy dip.' },
    ],
  },

  /* ── ROBATA & BBQ ── */
  {
    id: 'robata', label: 'ROBATA & BBQ', jp: '炉端焼き & バーベキュー',
    sub: 'Charcoal grill, Korean BBQ & Ramen',
    accent: '#E8341A',
    items: [
      { name: 'Wagyu Striploin', jp: '和牛ストリップロイン', price: 'AED 120', subcategory: 'ROBATA GRILL', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 38% 38%, #2E1A0C 0%, #1A1008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled wagyu striploin skewers, sea salt, finished with a light brush of sweet soy.' },
      { name: 'Wagyu Foie Gras', jp: '和牛フォアグラ', price: 'AED 138', subcategory: 'ROBATA GRILL', dietary: ['D'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 42% 36%, #3A0C14 0%, #200A0E 55%, #100608 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled wagyu beef skewers topped with rich foie gras for a buttery, melt-in-mouth finish.' },
      { name: 'Chicken Negima', jp: 'ねぎま', price: 'AED 52', subcategory: 'ROBATA GRILL', dietary: ['G'],
        emoji: '🍢', gradient: 'radial-gradient(ellipse at 40% 40%, #2A1E0C 0%, #181208 55%, #0C0804 100%)',
        photo: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled free-range chicken thigh and spring onion skewers, glazed with sweet tare.' },
      { name: 'Tsukune', jp: 'つくね', price: 'AED 54', subcategory: 'ROBATA GRILL', dietary: ['G', 'E'],
        emoji: '🍢', gradient: 'radial-gradient(ellipse at 40% 38%, #221A0C 0%, #141006 55%, #0C0804 100%)',
        photo: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled minced chicken meatball skewers, sweet tare glaze, served with egg yolk.' },
      { name: 'Jidori Chicken', jp: '地鶏のグリル', price: 'AED 58', subcategory: 'ROBATA GRILL', dietary: ['G'],
        emoji: '🍗', gradient: 'radial-gradient(ellipse at 38% 40%, #281C0C 0%, #161008 55%, #0C0804 100%)',
        photo: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled premium Jidori chicken breast, tare glaze, and fresh garden herbs.' },
      { name: 'Gochujang Miso Chicken', jp: 'コチュジャン味噌チキン', price: 'AED 62', subcategory: 'ROBATA GRILL', dietary: ['G', 'SP'],
        emoji: '🍗', gradient: 'radial-gradient(ellipse at 40% 38%, #2A0E08 0%, #180806 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=900&q=80',
        desc: 'Charcoal-grilled chicken glazed with a spicy gochujang-miso blend.' },
      { name: 'Seabass Kushiyaki', jp: 'スズキ串焼き', price: 'AED 68', subcategory: 'ROBATA GRILL', dietary: ['F'],
        emoji: '🍢', gradient: 'radial-gradient(ellipse at 40% 38%, #0C1E20 0%, #081218 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled seabass skewers, brushed with a light soy glaze and citrus yuzu.' },
      { name: 'Ebi Kushiyaki', jp: '海老串焼き', price: 'AED 72', subcategory: 'ROBATA GRILL', dietary: ['S'],
        emoji: '🍢', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1C0C 0%, #1A1208 55%, #100C06 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled tiger prawn skewers, seasoned with sea salt and fresh citrus lemon.' },
      { name: 'Grilled Hamachi Kama', jp: 'ハマチカマ塩焼き', price: 'AED 78', subcategory: 'ROBATA GRILL', dietary: ['F'],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 40% 38%, #14202A 0%, #0E141C 55%, #0A0C10 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Charred yellowtail collar. Extremely juicy, tender, and seasoned with sea salt.' },
      { name: 'Grilled Seabass', jp: 'スズキの炭火焼き', price: 'AED 88', subcategory: 'ROBATA GRILL', dietary: ['F'],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 40% 38%, #0C1E2A 0%, #08121A 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Charcoal-grilled whole seabass fillet, seasoned simply and drizzled with a light lemon soy.' },
      { name: 'Grilled White Asparagus', jp: '白アスパラガスのグリル', price: 'AED 48', subcategory: 'ROBATA GRILL', dietary: ['V'],
        emoji: '🥦', gradient: 'radial-gradient(ellipse at 38% 40%, #1A2410 0%, #0E1408 55%, #050803 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Charred white asparagus spears, drizzled with olive oil and coarse sea salt.' },
      { name: 'Shiitake Mushroom', jp: '椎茸のグリル', price: 'AED 44', subcategory: 'ROBATA GRILL', dietary: ['V'],
        emoji: '🍄', gradient: 'radial-gradient(ellipse at 40% 38%, #1E1A14 0%, #12100C 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled fresh shiitake mushrooms, brushed with a savory sweet soy glaze.' },
      { name: 'Striploin', jp: 'ストリップロイン', price: 'AED 98', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1410 0%, #180F0A 55%, #0E0B06 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thinly sliced beef striploin, marinated in our signature sweet Korean soy blend.' },
      { name: 'Ribeye Roll', jp: 'リブアイロール', price: 'AED 108', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 42% 38%, #2E1810 0%, #1C100A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin-sliced beef ribeye, lightly seasoned and grilled to bring out rich, marbled flavors.' },
      { name: 'Sesame Soy Marinated Striploin Galbi', jp: 'ガルビ', price: 'AED 112', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 40%, #2E1C10 0%, #1A1208 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin strips of beef striploin marinated in toasted sesame and sweet garlic soy.' },
      { name: 'Chuck Eye Roll', jp: 'チャックアイロール', price: 'AED 92', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 38%, #261610 0%, #16100A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thinly sliced beef chuck eye roll, marinated simply to highlight its beefy profile.' },
      { name: 'Oyster Blade', jp: 'ミスジ', price: 'AED 96', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 38%, #281810 0%, #18100A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin-sliced beef oyster blade. Extremely tender, flavorful, and quick-grilled.' },
      { name: 'Inside Skirt', jp: 'ハラミ', price: 'AED 102', subcategory: 'KOREAN BBQ', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1810 0%, #18100A 55%, #0E0A06 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Tender inside skirt steak slices, char-grilled with a robust soy marinade.' },
      { name: 'Banchan Selection', jp: 'パンチャン盛り合わせ', price: 'AED 38', subcategory: 'KOREAN BBQ', dietary: ['V'],
        emoji: '🥗', gradient: 'radial-gradient(ellipse at 38% 40%, #1A2410 0%, #0E1408 55%, #050803 100%)',
        photo: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=900&q=80',
        desc: "A chef's selection of traditional Korean side dishes: pickled, fermented, and seasoned veggies." },
      { name: 'Tan Tan Ramen', jp: '担々麺', price: 'AED 68', subcategory: 'RAMEN', dietary: ['G', 'E', 'SP'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 40% 38%, #2C1808 0%, #180E04 55%, #0E0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=900&q=80',
        desc: 'Spicy sesame broth, savory minced beef, ramen noodles, soft egg, and chili oil.' },
      { name: 'Shio Paitan Ramen', jp: '塩白湯ラーメン', price: 'AED 64', subcategory: 'RAMEN', dietary: ['G', 'E'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 42% 36%, #221A0E 0%, #14100A 55%, #0A0806 100%)',
        photo: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=900&q=80',
        desc: 'Creamy, rich chicken bone broth, wheat noodles, tender chashu, and a jammy egg.' },
      { name: 'Bulgogi Kimchi Ramen', jp: 'プルコギキムチラーメン', price: 'AED 72', subcategory: 'RAMEN', dietary: ['G', 'SP'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 40% 40%, #2E0C0C 0%, #1A0808 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
        desc: 'Ramen noodles in a rich beef bulgogi and spicy house kimchi broth.' },
      { name: 'Shojin Vegetarian Ramen', jp: '精進ベジタリアンラーメン', price: 'AED 58', subcategory: 'RAMEN', dietary: ['G', 'V'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 38% 40%, #101808 0%, #0A1006 55%, #060C04 100%)',
        photo: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=900&q=80',
        desc: 'Clear vegetable broth, seasonal greens, silken tofu, and fresh shiitake mushrooms.' },
    ],
  },

  /* ── WOK & MAINS ── */
  {
    id: 'wokmains', label: 'WOK & MAINS', jp: '中華鍋 & 主菜',
    sub: 'Wok tossed & signature mains',
    accent: '#faaf3f',
    items: [
      { name: 'Seafood Treasure', jp: 'シーフードトレジャー', price: 'AED 88', dietary: ['S', 'F'],
        emoji: '🐙', gradient: 'radial-gradient(ellipse at 35% 40%, #0A1E2A 0%, #06121C 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=900&q=80',
        desc: 'A bounty of mixed fresh seafood, wok-tossed with a rich garlic soy sauce.' },
      { name: 'Chili Garlic Prawn', jp: 'チリガーリックプローン', price: 'AED 78', dietary: ['G', 'S', 'SP'],
        emoji: '🍤', gradient: 'radial-gradient(ellipse at 40% 35%, #2A0C0C 0%, #18080A 55%, #0D0506 100%)',
        photo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
        desc: 'Wok-fried prawns tossed in a bold chili garlic sauce. Rich, spicy, and satisfying.' },
      { name: 'Lobster Kung Pao', jp: 'ロブスタークンパオ', price: 'AED 118', dietary: ['S', 'SP', 'N'],
        emoji: '🦞', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1006 0%, #180A04 55%, #0C0602 100%)',
        photo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80',
        desc: 'Succulent chunks of fresh lobster, wok-fried with dry red chilies, bell peppers, and peanuts.' },
      { name: "Devil's King Crab", jp: 'デビルズキングクラブ', price: 'AED 128', dietary: ['S', 'SP'],
        emoji: '🦀', gradient: 'radial-gradient(ellipse at 38% 42%, #320A0C 0%, #1C0608 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: "King crab legs wok-tossed in our fiery chef's special chili sauce. Rich and intense." },
      { name: 'Wagyu Black Pepper', jp: '和牛黒胡椒炒め', price: 'AED 110', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 40%, #281A10 0%, #16100A 55%, #0C0804 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Tender slices of A4 wagyu beef, wok-tossed in a robust cracked black pepper sauce.' },
      { name: 'Crispy Beef', jp: 'クリスピービーフ', price: 'AED 78', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 42% 36%, #2C1808 0%, #1A0E04 55%, #0E0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: 'Thinly sliced, crispy-fried beef strips tossed in a sweet and sticky soy glaze.' },
      { name: 'Braised Short Rib', jp: 'ショートリブ煮込み', price: 'AED 96', dietary: ['G'],
        emoji: '🥩', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1008 0%, #180806 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
        desc: '12-hour slow-cooked beef short rib, falling off the bone, in a sweet soy-garlic reduction.' },
      { name: 'Buldak Chicken', jp: 'ブルダックチキン', price: 'AED 72', dietary: ['SP'],
        emoji: '🍗', gradient: 'radial-gradient(ellipse at 40% 38%, #300A0A 0%, #1A0606 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80',
        desc: "Wok-tossed chicken chunks in a fiery Korean gochujang sauce. Level 3 heat." },
      { name: 'Chicken Sweet & Sour', jp: '酢豚風チキン', price: 'AED 68', dietary: ['G'],
        emoji: '🍗', gradient: 'radial-gradient(ellipse at 38% 38%, #2A180E 0%, #18100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80',
        desc: "Crispy-fried chicken pieces, bell peppers, pineapple, tossed in a classic sweet and sour sauce." },
      { name: 'Black Cod', jp: '銀だらの西京焼き', price: 'AED 115', dietary: ['F'],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 40% 40%, #101E2A 0%, #08121A 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1559847844-d05c5fdf78d2?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet white miso marinated black cod, caramelized over fire for a melt-in-mouth finish.' },
      { name: 'Grilled Seabass', jp: 'スズキのグリル', price: 'AED 66', dietary: ['F'],
        emoji: '🐟', gradient: 'radial-gradient(ellipse at 40% 38%, #0A1E2A 0%, #06121C 55%, #040A10 100%)',
        photo: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=900&q=80',
        desc: 'Whole grilled seabass fillet, seasoned simply and drizzled with a light lemon soy.' },
      { name: 'Chili Miso Tofu', jp: 'チリ味噌豆腐', price: 'AED 56', dietary: ['V', 'SP'],
        emoji: '🫘', gradient: 'radial-gradient(ellipse at 40% 40%, #1E1C14 0%, #12100C 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
        desc: 'Crispy tofu blocks tossed with a savory and spicy chili miso glaze, topped with green onions.' },
    ],
  },

  /* ── RICE & NOODLES ── */
  {
    id: 'ricenoodles', label: 'RICE & NOODLES', jp: '飯 & 麺',
    sub: 'Sizzling hot pots, udon & fried rice',
    accent: '#E8341A',
    items: [
      { name: 'Sizzling Bibimbap Hot Pot', jp: '石焼きビビンバ', price: 'AED 58', dietary: ['G', 'E', 'SP'],
        emoji: '🍲', gradient: 'radial-gradient(ellipse at 40% 38%, #2A140E 0%, #180F08 55%, #0C0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=900&q=80',
        desc: 'Seasoned rice, mixed vegetables, fried egg, served sizzling in a hot stone pot with gochujang.' },
      { name: 'Mushroom Takikomi Gohan', jp: 'きのこの炊き込みご飯', price: 'AED 54', dietary: ['V'],
        emoji: '🍲', gradient: 'radial-gradient(ellipse at 42% 38%, #201A0E 0%, #14100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=900&q=80',
        desc: 'Traditional claypot rice steamed with fresh shiitake, shimeji, and a light soy dashi.' },
      { name: 'XO Udon', jp: 'XOうどん', price: 'AED 66', dietary: ['G', 'S'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 40% 40%, #201E1A 0%, #141210 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=900&q=80',
        desc: 'Thick, chewy udon noodles wok-fried with mixed seafood in our rich house XO sauce.' },
      { name: 'Singapore Noodles', jp: 'シンガポールヌードル', price: 'AED 62', dietary: ['G', 'S'],
        emoji: '🍜', gradient: 'radial-gradient(ellipse at 40% 38%, #241A0E 0%, #14100A 55%, #0C0806 100%)',
        photo: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=900&q=80',
        desc: 'Thin rice vermicelli noodles, stir-fried with curry spice, tiger prawns, and fresh vegetables.' },
      { name: 'Prawn Chahan', jp: '海老チャーハン', price: 'AED 54', dietary: ['S', 'E'],
        emoji: '🍚', gradient: 'radial-gradient(ellipse at 38% 38%, #221A0C 0%, #141008 55%, #0C0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80',
        desc: 'Wok-fried rice with succulent prawns, egg, spring onion, and a light splash of soy.' },
      { name: 'Fried Rice', jp: 'チャーハン', price: 'AED 48', dietary: ['E'],
        emoji: '🍚', gradient: 'radial-gradient(ellipse at 40% 40%, #1E1A0C 0%, #121008 55%, #0A0804 100%)',
        photo: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80',
        desc: 'Classic wok-tossed egg fried rice with spring onion and seasoned soy.' },
      { name: 'Steamed Rice', jp: '白米', price: 'AED 18', dietary: ['V'],
        emoji: '🍚', gradient: 'radial-gradient(ellipse at 35% 40%, #1E1C1A 0%, #121010 55%, #0C0C0C 100%)',
        photo: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed premium Jasmine rice. Light, fluffy, and aromatic.' },
    ],
  },

  /* ── SIDES ── */
  {
    id: 'sides', label: 'SIDES', jp: 'サイドディッシュ',
    sub: 'Vegetables, mushrooms & accompaniments',
    accent: '#faaf3f',
    items: [
      { name: 'Tomorokoshi', jp: 'トモロコシ', price: 'AED 32', dietary: ['D'],
        emoji: '🌽', gradient: 'radial-gradient(ellipse at 40% 38%, #2A2008 0%, #181204 55%, #0E0C02 100%)',
        photo: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80',
        desc: 'Grilled sweet corn wheels brushed with butter and a sweet soy reduction.' },
      { name: 'Umami Bok Choy', jp: '青梗菜の旨煮', price: 'AED 34', dietary: ['V'],
        emoji: '🥬', gradient: 'radial-gradient(ellipse at 35% 40%, #0E1C0C 0%, #081008 55%, #040C04 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Stir-fried baby bok choy in a light garlic soy dressing.' },
      { name: 'Broccoli', jp: 'ブロッコリー', price: 'AED 30', dietary: ['V'],
        emoji: '🥦', gradient: 'radial-gradient(ellipse at 38% 38%, #1A2410 0%, #0E1408 55%, #050803 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Steamed broccoli florets tossed with a light sea salt and sesame seasoning.' },
      { name: 'Spinach', jp: 'ほうれん草ソテー', price: 'AED 30', dietary: ['V'],
        emoji: '🥬', gradient: 'radial-gradient(ellipse at 40% 40%, #0E1C0C 0%, #081008 55%, #040C04 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Sautéed fresh spinach with garlic and a touch of soy sauce.' },
      { name: 'Roasted Sweet Potato', jp: '焼き芋', price: 'AED 34', dietary: ['V'],
        emoji: '🍠', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1A0C 0%, #181008 55%, #0E0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Oven-roasted sweet potato wedges, caramelized with a light honey glaze.' },
      { name: 'Sauteed Mushroom Trio', jp: 'きのこ三種ソテー', price: 'AED 36', dietary: ['V'],
        emoji: '🍄', gradient: 'radial-gradient(ellipse at 40% 38%, #1E1C14 0%, #12100C 55%, #0A0C08 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: "A trio of fresh shiitake, shimeji, and button mushrooms sautéed in a garlic soy glaze." },
      { name: 'Tender Cauliflower', jp: 'カリフラワーのロースト', price: 'AED 34', dietary: ['V'],
        emoji: '🥦', gradient: 'radial-gradient(ellipse at 38% 38%, #222214 0%, #14140C 55%, #0C0A06 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'Roasted cauliflower florets seasoned with mild Japanese curry spices.' },
      { name: 'Egg Souffle', jp: 'ケランジム', price: 'AED 32', dietary: ['E'],
        emoji: '🍳', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1E0E 0%, #18120A 55%, #0E0C06 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: "Steamed, fluffy egg souffle. Soft, airy, and savory. Served hot in a clay bowl." },
      { name: 'Fuji Apple & Potato', jp: 'フジリンゴとポテト', price: 'AED 30', dietary: ['V'],
        emoji: '🥔', gradient: 'radial-gradient(ellipse at 40% 40%, #1E1A10 0%, #12100A 55%, #0A0806 100%)',
        photo: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80',
        desc: 'A sweet and savory mash of Fuji apples and potatoes with a light dressing.' },
    ],
  },

  /* ── DESSERTS ── */
  {
    id: 'dessert', label: 'DESSERTS', jp: '甘味',
    sub: 'Sweet endings — no apologies',
    accent: '#E8341A',
    items: [
      { name: 'Matcha Tiramisu', jp: '抹茶ティラミス', price: 'AED 38', dietary: ['D', 'E', 'G'],
        emoji: '🍵', gradient: 'radial-gradient(ellipse at 40% 40%, #0C180C 0%, #081008 55%, #050C05 100%)',
        photo: 'https://images.unsplash.com/photo-1515467837915-15c4777ba46a?auto=format&fit=crop&w=900&q=80',
        desc: 'Matcha cream, soft sponge cake, light texture, finished with sweet chocolate caviar.' },
      { name: 'Mochi', jp: '餅', price: 'AED 32', dietary: ['D'],
        emoji: '🍡', gradient: 'radial-gradient(ellipse at 40% 38%, #1E1408 0%, #140E04 55%, #0C0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
        desc: 'Soft glutinous rice cakes stuffed with a variety of sweet cream fillings.' },
      { name: 'Soft Serve', jp: 'ソフトクリーム', price: 'AED 28', dietary: ['D'],
        emoji: '🍦', gradient: 'radial-gradient(ellipse at 42% 40%, #1A1215 0%, #100C0E 55%, #0C080A 100%)',
        photo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
        desc: "Creamy house-made soft serve. Ask your server for today's seasonal flavors." },
      { name: 'Mango Sticky Rice', jp: 'マンゴースティッキーライス', price: 'AED 36', dietary: ['D', 'V'],
        emoji: '🥭', gradient: 'radial-gradient(ellipse at 40% 38%, #201608 0%, #140F04 55%, #0E0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
        desc: 'Sweet ripe mango slices, coconut cream-infused sticky rice, classic Thai-style finish.' },
      { name: 'Chocolate Fondant', jp: 'フォンダンショコラ', price: 'AED 42', dietary: ['G', 'E', 'D'],
        emoji: '🍫', gradient: 'radial-gradient(ellipse at 40% 38%, #200C08 0%, #120806 55%, #0C0604 100%)',
        photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
        desc: 'Warm chocolate cake with a rich molten center, served with vanilla bean ice cream.' },
    ],
  },

  /* ── COCKTAILS ── */
  {
    id: 'cocktails', label: 'COCKTAILS', jp: 'カクテル',
    sub: 'Signature pours — every one tells a story',
    accent: '#faaf3f',
    items: [
      { name: 'RAAAAAAR', jp: 'ラー', price: 'AED 145', tags: ['SIGNATURE'],
        emoji: '🍹', gradient: 'radial-gradient(ellipse at 40% 36%, #300808 0%, #1A0606 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80',
        desc: "Suntory Toki, blood orange reduction, cardamom syrup, fresh lime, chili flake salt rim. The drink named after the brand's roar." },
      { name: 'Tokyo Negroni', jp: '東京ネグローニ', price: 'AED 135', tags: ['CHEF'],
        emoji: '🍊', gradient: 'radial-gradient(ellipse at 42% 38%, #2A1008 0%, #180808 55%, #0C0606 100%)',
        photo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
        desc: 'Roku Japanese gin, house sake vermouth, Campari, orange bitters, flamed orange peel. The classic — improved.' },
      { name: "Tiger's Milk Punch", jp: 'タイガーミルクパンチ', price: 'AED 130', tags: ['NEW'],
        emoji: '🥥', gradient: 'radial-gradient(ellipse at 40% 40%, #0A1820 0%, #061018 55%, #040C10 100%)',
        photo: 'https://images.unsplash.com/photo-1587223962930-cb7f31384c19?auto=format&fit=crop&w=900&q=80',
        desc: 'Coconut rum, fresh yuzu, lychee syrup, ginger beer, activated charcoal ice cube that melts into the drink.' },
      { name: 'Sakura Sour', jp: 'サクラサワー', price: 'AED 140', tags: ['SIGNATURE'],
        emoji: '🌸', gradient: 'radial-gradient(ellipse at 40% 38%, #200A12 0%, #140810 55%, #0E060C 100%)',
        photo: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
        desc: 'Nikka Coffey gin, cherry blossom cordial, fresh yuzu, egg white foam, dried edible sakura flowers.' },
      { name: 'The Rooftop', jp: 'ルーフトップ', price: 'AED 130', tags: ['NEW'],
        emoji: '🌿', gradient: 'radial-gradient(ellipse at 42% 40%, #0C1A10 0%, #081010 55%, #050C08 100%)',
        photo: 'https://images.unsplash.com/photo-1607446045710-d5a8b7e76f72?auto=format&fit=crop&w=900&q=80',
        desc: 'Grey Goose vodka, thin-sliced cucumber, ceremonial matcha syrup, Fever-Tree elderflower tonic, lime wheel.' },
      { name: 'Red Lantern', jp: '赤提灯', price: 'AED 145', tags: ['CHEF', 'NEW'],
        emoji: '🏮', gradient: 'radial-gradient(ellipse at 40% 38%, #280A06 0%, #180806 55%, #0E0604 100%)',
        photo: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=900&q=80',
        desc: 'Dark Diplomático rum, house white miso caramel, espresso shot, smoked sweet paprika foam. After midnight energy.' },
      { name: 'VOID', jp: 'ヴォイド', price: 'AED 180', tags: ['PREMIUM', 'SIGNATURE'], note: 'After 10PM only',
        emoji: '⚫', gradient: 'radial-gradient(ellipse at 42% 38%, #140C0E 0%, #0C0808 55%, #080608 100%)',
        photo: 'https://images.unsplash.com/photo-1551751299-1b51b0ae4ac9?auto=format&fit=crop&w=900&q=80',
        desc: 'Suntory Hibiki Harmony, black sesame orgeat, activated charcoal, egg white, 24ct loose gold dust. Late night. Last order. Legend.' },
      { name: 'Yuzu Margarita', jp: 'ゆずマルガリータ', price: 'AED 130', tags: ['CHEF'],
        emoji: '🍋', gradient: 'radial-gradient(ellipse at 40% 38%, #201A06 0%, #141204 55%, #0E0C02 100%)',
        photo: 'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?auto=format&fit=crop&w=900&q=80',
        desc: 'Casamigos Blanco, fresh yuzu juice, yuzu liqueur, Tajín-salt rim, compressed cucumber.' },
    ],
  },

  /* ── SAKE & SPIRITS ── */
  {
    id: 'sake', label: 'SAKE & SPIRITS', jp: '日本酒 & スピリッツ',
    sub: '47 labels — ask your server for the story',
    accent: '#E8341A',
    items: [
      { name: 'Junmai Honjozo', jp: '本醸造', price: 'AED 85 / 155', note: '180ml / 360ml carafe',
        emoji: '🍶', gradient: 'radial-gradient(ellipse at 40% 38%, #1E1408 0%, #120E04 55%, #0C0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?auto=format&fit=crop&w=900&q=80',
        desc: 'Clean, dry, slightly earthy. The everyday sake of Japan — served warm or chilled.' },
      { name: 'Junmai Ginjo', jp: '純米吟醸', price: 'AED 110 / 195', tags: ['CHEF'], note: '180ml / 360ml carafe',
        emoji: '🍶', gradient: 'radial-gradient(ellipse at 42% 36%, #221808 0%, #160E04 55%, #0E0C02 100%)',
        photo: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
        desc: 'Fragrant, fruity, refined. Fermented slower, colder. Niigata prefecture. The one people come back for.' },
      { name: 'Junmai Daiginjo', jp: '純米大吟醸', price: 'AED 145 / 265', tags: ['PREMIUM'], note: '180ml / 360ml carafe',
        emoji: '🍶', gradient: 'radial-gradient(ellipse at 40% 38%, #2A1C08 0%, #1A1204 55%, #100C02 100%)',
        photo: 'https://images.unsplash.com/photo-1582034438086-680c8ffc3f3a?auto=format&fit=crop&w=900&q=80',
        desc: 'The pinnacle. Floral, silky, almost weightless. Kyoto origin. Pair with omakase nigiri and say nothing.' },
      { name: 'Suntory Hibiki Harmony', jp: '響ハーモニー', price: 'AED 145', tags: ['SIGNATURE'], note: '50ml',
        emoji: '🥃', gradient: 'radial-gradient(ellipse at 40% 38%, #241808 0%, #160E04 55%, #0E0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=80',
        desc: 'Malt and grain whiskies blended across five warehouses. Honeyed stone fruit, light smoke.' },
      { name: 'Yamazaki 12yr', jp: '山崎12年', price: 'AED 195', tags: ['PREMIUM', 'CHEF'], note: '50ml',
        emoji: '🥃', gradient: 'radial-gradient(ellipse at 42% 38%, #2C1C08 0%, #1A1006 55%, #100C02 100%)',
        photo: 'https://images.unsplash.com/photo-1614348825020-67afa3e0bb3d?auto=format&fit=crop&w=900&q=80',
        desc: "Single malt. Spanish oak, American oak, Japanese Mizunara. Candied orange, coconut, vanilla. World's most awarded whisky." },
      { name: 'Hakushu 12yr', jp: '白州12年', price: 'AED 185', tags: ['PREMIUM'], note: '50ml',
        emoji: '🌲', gradient: 'radial-gradient(ellipse at 40% 38%, #0C1A0A 0%, #081008 55%, #050C04 100%)',
        photo: 'https://images.unsplash.com/photo-1571691227847-22d8d75a4cf9?auto=format&fit=crop&w=900&q=80',
        desc: 'Highland single malt from the Japanese Alps. Green apple, fresh herbs, light peat smoke. The forest whisky.' },
      { name: 'Nikka from the Barrel', jp: 'ニッカ フロム ザ バレル', price: 'AED 140', tags: ['CHEF'], note: '50ml',
        emoji: '🪵', gradient: 'radial-gradient(ellipse at 40% 38%, #200E06 0%, #140C04 55%, #0C0A02 100%)',
        photo: 'https://images.unsplash.com/photo-1569529787780-cdb12f02c5a8?auto=format&fit=crop&w=900&q=80',
        desc: 'Double distillation, 130+ malt and grain whiskies blended. Rich, powerful, full-proof.' },
    ],
  },

  /* ── NO PROOF ── */
  {
    id: 'noproof', label: 'NO PROOF', jp: 'ノンアルコール',
    sub: 'Zero alcohol — full flavour, full commitment',
    accent: '#faaf3f',
    items: [
      { name: 'Yuzu Zing', jp: 'ゆずジング', price: 'AED 65', tags: ['SIGNATURE', 'VEGAN'],
        emoji: '🍋', gradient: 'radial-gradient(ellipse at 40% 38%, #201C06 0%, #141204 55%, #0C0E02 100%)',
        photo: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
        desc: 'Fresh yuzu juice, house shiso syrup, hand-cut ginger ale, mint sprig, bamboo charcoal salt rim.' },
      { name: 'Sakura Bloom', jp: 'サクラブルーム', price: 'AED 60', tags: ['VEGAN'],
        emoji: '🌸', gradient: 'radial-gradient(ellipse at 42% 38%, #1E0A10 0%, #140810 55%, #0E060C 100%)',
        photo: 'https://images.unsplash.com/photo-1571175351749-e8d8388f9bf3?auto=format&fit=crop&w=900&q=80',
        desc: 'Cold-brew cherry blossom tea, hibiscus, raw honey, fresh lemon, edible flowers.' },
      { name: 'Matcha Tonic', jp: '抹茶トニック', price: 'AED 65', tags: ['VEGAN', 'NEW'],
        emoji: '🍵', gradient: 'radial-gradient(ellipse at 40% 40%, #0C1A08 0%, #081008 55%, #060C04 100%)',
        photo: 'https://images.unsplash.com/photo-1545421478-a7b5e1c4a6c8?auto=format&fit=crop&w=900&q=80',
        desc: 'Ceremonial Uji matcha, elderflower Fever-Tree tonic, fresh lime wheel, thin cucumber ribbon.' },
      { name: 'Tiger Soda', jp: 'タイガーソーダ', price: 'AED 60', tags: ['SIGNATURE', 'VEGAN'],
        emoji: '🔴', gradient: 'radial-gradient(ellipse at 40% 38%, #280808 0%, #180606 55%, #0E0404 100%)',
        photo: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=900&q=80',
        desc: 'Blood orange, black sesame milk wash, cane syrup, Fever-Tree sparkling. The house non-alcoholic signature.' },
      { name: 'Hokkaido Tiger Tea', jp: '北海道タイガーティー', price: 'AED 70', tags: ['CHEF', 'NEW'],
        emoji: '🧋', gradient: 'radial-gradient(ellipse at 42% 38%, #1E1408 0%, #120E04 55%, #0C0A04 100%)',
        photo: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=80',
        desc: 'House-made brown sugar boba, Hokkaido milk, house tiger spice blend — warm or iced.' },
    ],
  },
];

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function MenuPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'starters';
    const h0 = window.location.hash.replace('#', '');
    return h0 && MENU.some((c) => c.id === h0) ? h0 : 'starters';
  });
  const tabsRef = useRef<HTMLDivElement>(null);

  // Read #hash on mount → open the matching category if the user deep-linked
  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h && MENU.some((c) => c.id === h)) setActiveTab(h);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(`[data-id="${activeTab}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const active = MENU.find((c) => c.id === activeTab)!;

  // Group items by subcategory dynamically
  const itemsBySubcategory: Record<string, MenuItem[]> = {};
  active.items.forEach(item => {
    const sub = item.subcategory || '';
    if (!itemsBySubcategory[sub]) itemsBySubcategory[sub] = [];
    itemsBySubcategory[sub].push(item);
  });

  return (
    <section data-texture="on" style={{ background: '#F0EBE0', minHeight: '100vh', color: 'var(--clr-cream)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <a href="#menu-main" className="sr-only-focusable">SKIP TO MENU</a>

      {/* ══ BAND 1: Full-width Japanese header ══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: '#1C0808',
          borderBottom: '4px solid #C83D20',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 64px)',
          height: 'clamp(64px, 9.5vw, 128px)',
          overflow: 'hidden', gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 32px)' }}>
          <Link href="/" aria-label="Hey Tiger — back to home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image
              src="/heytiger-logo.png"
              alt="Hey Tiger"
              width={220}
              height={64}
              priority
              unoptimized
              style={{ height: 'clamp(38px, 5.5vw, 72px)', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
            />
          </Link>
          <span aria-hidden="true" style={{ width: '1px', height: 'clamp(32px, 5vw, 64px)', background: '#2A1F2A', flexShrink: 0 }} />
          <span lang="ja" style={{
            fontFamily: 'var(--font-jp)', fontSize: 'clamp(30px, 5.5vw, 82px)',
            fontWeight: 900, color: '#F0EBD8', letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap',
          }}>ヘイ、タイガー</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span lang="ja" style={{
            fontFamily: 'var(--font-jp)', fontSize: 'clamp(12px, 1.1vw, 16px)',
            color: 'rgba(200,61,32,0.45)', letterSpacing: '0.15em',
          }} className="hidden-xs">メニュー</span>
          <div style={{
            background: '#C83D20', color: '#1C0808',
            fontFamily: 'var(--font-body)', fontSize: '9px',
            fontWeight: 900, letterSpacing: '0.4em', borderRadius: 0,
            padding: '5px 10px',
          }}>EST. 2026</div>
        </div>
      </motion.div>

      {/* ══ BAND 2: Bordered category nav grid — sticky ══ */}
      <div
        role="navigation"
        aria-label="Menu categories"
        style={{ position: 'sticky', top: 0, zIndex: 800, background: '#1C0808' }}
      >
        <div
          ref={tabsRef}
          style={{ display: 'grid', gridTemplateColumns: `repeat(${MENU.length + 1}, 1fr)`, gap: '4px' }}
          className="ht-menu-nav"
        >
          {MENU.map((cat) => {
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                data-id={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(7px, 0.62vw, 10px)',
                  fontWeight: 900, letterSpacing: '0.26em',
                  color: isActive ? '#F0EBD8' : 'rgba(240,235,216,0.45)',
                  background: isActive ? '#1A1215' : '#1C0808',
                  border: 'none',
                  borderBottom: isActive ? `2px solid #C83D20` : '2px solid transparent',
                  padding: 'clamp(10px, 1.3vh, 17px) 4px',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) { e.currentTarget.style.color = '#C83D20'; e.currentTarget.style.background = '#1A1215'; }
                }}
                onMouseLeave={e => {
                  if (!isActive) { e.currentTarget.style.color = 'rgba(240,235,216,0.45)'; e.currentTarget.style.background = '#1C0808'; }
                }}
              >{cat.label}</button>
            );
          })}
          {/* RESERVE cell */}
          <Link
            href="/#book"
            style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(7px, 0.62vw, 10px)',
              fontWeight: 900, letterSpacing: '0.26em',
              color: '#1C0808', background: '#C83D20',
              padding: 'clamp(10px, 1.3vh, 17px) 4px',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#B22D12'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#C83D20'; }}
          >RESERVE</Link>
        </div>
      </div>

      {/* ── CATEGORY CONTENT ── */}
      <AnimatePresence mode="wait">
        <motion.div id="menu-main" key={activeTab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32 }} style={{ background: '#1C0808' }}>

          {/* Category header */}
          <div style={{ padding: 'clamp(44px, 5.5vw, 80px) clamp(24px, 5vw, 72px) clamp(28px, 3.5vw, 48px)', borderBottom: `1px solid ${active.accent}18`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-3%', top: '-15%', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(90px, 15vw, 220px)', letterSpacing: '-0.04em', color: 'rgba(200,61,32,0.05)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }} aria-hidden="true">{active.label}</div>
            <span style={{ display: 'block', fontFamily: 'var(--font-jp)', fontSize: '15px', letterSpacing: '0.2em', color: '#C83D20', marginBottom: '12px' }}>{active.jp}</span>
            <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.025em', color: '#C83D20' }}>{active.label}</h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.4vw, 18px)', letterSpacing: '0.02em', color: 'rgba(240,235,216,0.6)', lineHeight: 1.6 }}>{active.sub}</p>
          </div>

          {/* Render Items grouped by subcategory */}
          {Object.entries(itemsBySubcategory).map(([subName, subItems]) => (
            <div key={subName} style={{ display: 'flex', flexDirection: 'column' }}>
              {subName && (
                <div style={{
                  padding: '36px clamp(24px, 5vw, 72px) 16px',
                  borderBottom: `1px solid ${active.accent}18`,
                  background: '#181216',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    color: '#C83D20',
                    margin: 0,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase'
                  }}>{subName}</h3>
                  <span aria-hidden="true" style={{ flex: 1, height: '1px', background: `${active.accent}20` }} />
                </div>
              )}
              {/* Dish grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: `${active.accent}0A` }} className="dish-grid">
                {subItems.map((item, i) => (
                  <DishCard key={i} item={item} index={i} accent={active.accent} categoryId={active.id} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── QR CODE SECTION ── */}
      <QRSection />

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '1px solid rgba(250,175,63,0.1)', padding: 'clamp(36px, 4.5vw, 56px) clamp(24px, 5vw, 72px)', background: '#0d0d0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 36px)', color: 'var(--clr-cream)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Ready to eat?</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', letterSpacing: '0.12em', color: 'rgba(224,211,180,0.62)', margin: 0 }}>All prices VAT inclusive · Allergens on request · Menu changes seasonally</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', letterSpacing: '0.18em', color: 'rgba(224,211,180,0.75)', padding: '14px 24px', borderRadius: '40px', border: '1px solid rgba(224,211,180,0.2)', textDecoration: 'none', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>← BACK TO THE STREET</Link>
          <Link href="/#book" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', letterSpacing: '0.18em', fontWeight: 800, color: 'var(--clr-void)', background: 'var(--clr-amber)', padding: '14px 28px', borderRadius: '40px', textDecoration: 'none', boxShadow: '0 6px 18px rgba(250,175,63,0.34)', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>ANSWER THE CALL →</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ht-menu-nav { display: flex !important; overflow-x: auto; scrollbar-width: none; }
          .ht-menu-nav::-webkit-scrollbar { display: none; }
          .ht-menu-nav > * { flex-shrink: 0; min-width: 80px; }
          .hidden-xs { display: none !important; }
        }
        @media (max-width: 560px) { .dish-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── Dish Card ────────────────────────────────────────────────────────── */
function DishCard({ item, index, accent, categoryId }: { item: MenuItem; index: number; accent: string; categoryId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-4% 0px' });
  const [hovered, setHovered] = useState(false);
  // Per-dish photo first; fall back to the category interior only if a dish has none
  const previewPhoto = item.photo || CATEGORY_FALLBACK_PHOTOS[categoryId] || '/images/spaces/dining.jpg';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay: (index % 3) * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'rgba(10,4,2,0.45)', display: 'flex', flexDirection: 'column', cursor: 'default', transition: 'background 0.25s' }}
    >
      {/* ── Real dish photo ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        background: item.gradient,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Real Unsplash photo — lazy + low-priority for below-fold tiles */}
        <Image
          src={previewPhoto}
          alt={item.name}
          fill
          unoptimized
          sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 33vw"
          loading={index < 3 ? 'eager' : 'lazy'}
          fetchPriority={index < 3 ? 'high' : 'low'}
          style={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease, filter 0.4s',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            filter: hovered ? 'brightness(0.92) saturate(1.08)' : 'brightness(0.78) saturate(1)',
          }}
        />

        {/* Warm tonal overlay tied to category accent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${accent}18 0%, transparent 45%, rgba(15,8,4,0.55) 100%)`,
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.32) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.22) 1px, transparent 1px)',
          backgroundSize: '3px 3px, 5px 5px',
          backgroundPosition: '0 0, 1px 1px',
          opacity: 0.16, pointerEvents: 'none', zIndex: 2, mixBlendMode: 'overlay',
        }} />

        {/* Bottom accent bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          opacity: hovered ? 1 : 0.55,
          transition: 'opacity 0.3s',
          zIndex: 4,
        }} />

        {/* Price badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          fontFamily: 'var(--font-body)', fontWeight: 700,
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          color: accent,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(8px)',
          padding: '5px 11px',
          borderRadius: '20px',
          border: `1px solid ${accent}40`,
          zIndex: 5,
          letterSpacing: '0.05em',
          boxShadow: `0 4px 14px rgba(0,0,0,0.4)`,
        }}>
          {item.price}
        </div>

        {/* JP name watermark */}
        {item.jp && (
          <div style={{
            position: 'absolute', bottom: '10px', left: '14px',
            fontFamily: 'var(--font-jp)',
            fontSize: '13px',
            letterSpacing: '0.15em',
            color: 'rgba(245,239,224,0.78)',
            textShadow: '0 2px 8px rgba(0,0,0,0.85)',
            zIndex: 5,
            opacity: 0.85,
          }}>
            {item.jp}
          </div>
        )}
      </div>

      {/* ── Text content ── */}
      <div style={{ padding: 'clamp(16px, 2vw, 24px)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', background: hovered ? 'rgba(20,8,3,0.72)' : 'rgba(12,5,2,0.55)', transition: 'background 0.25s' }}>

        {/* Dietary restriction tags */}
        {item.dietary && item.dietary.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {item.dietary.map((code) => {
              const s = DIETARY_LABELS[code];
              if (!s) return null;
              return (
                <span key={code} style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', fontWeight: 900, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${s.color}1a` }}>
                  {s.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Name + JP */}
        <div>
          <h3 style={{ margin: '0 0 3px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--clr-cream)' }}>
            {item.name}
          </h3>
          {item.jp && (
            <span style={{ fontFamily: 'var(--font-jp)', fontSize: '13px', letterSpacing: '0.1em', color: `${accent}99` }}>{item.jp}</span>
          )}
        </div>

        {/* Description */}
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.6, color: 'rgba(245,239,224,0.65)', flex: 1 }}>
          {item.desc}
        </p>

        {/* Note */}
        {item.note && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(245,239,224,0.4)' }}>
            {item.note}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── QR Section ───────────────────────────────────────────────────────── */
function QRSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65 }}
      style={{
        margin: 'clamp(40px, 5vw, 72px) clamp(24px, 5vw, 72px)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        background: 'rgba(10,4,2,0.5)',
        border: '1px solid rgba(250,175,63,0.18)',
      }}
      className="qr-grid"
    >
      {/* QR Panel */}
      <div style={{
        padding: 'clamp(28px, 4vw, 48px)',
        background: 'rgba(250,175,63,0.06)',
        borderRight: '1px solid rgba(250,175,63,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{
          padding: '16px',
          background: 'var(--clr-cream)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          lineHeight: 0,
        }}>
          <QRCodeCanvas
            value={SITE_URL}
            size={140}
            bgColor="#F5EFE0"
            fgColor="#150D11"
            level="M"
            style={{ display: 'block' }}
          />
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.28em', color: 'rgba(245,239,224,0.62)', textAlign: 'center' }}>
          SCAN TO ACCESS<br />DIGITAL MENU
        </span>
      </div>

      {/* Text content */}
      <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', letterSpacing: '0.32em', color: 'var(--clr-amber)' }}>
          QUICK ACCESS
        </span>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 42px)', lineHeight: 0.92, letterSpacing: '-0.02em', color: 'var(--clr-cream)' }}>
          MENU IN<br />YOUR POCKET.
        </h3>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.72, color: 'rgba(245,239,224,0.62)', maxWidth: '380px' }}>
          Scan this QR code to open the full Hey Tiger menu on your phone. Share it with your table. No app needed.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', letterSpacing: '0.15em', color: 'rgba(245,239,224,0.62)', fontStyle: 'italic' }}>
            {SITE_URL}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .qr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
