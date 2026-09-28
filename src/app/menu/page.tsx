import type { Metadata } from 'next';
import MenuShell from './MenuShell';

export const metadata: Metadata = {
  title: 'Menu — メニュー',
  description:
    'Starters, sushi, robata, ramen and late-night plates. Highballs, cocktails and sake. Hey Tiger, Motor City Dubai — kitchen until 2AM.',
};

export default function MenuPage() {
  return <MenuShell />;
}
