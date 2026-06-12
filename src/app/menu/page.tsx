import type { Metadata } from 'next';
import KanbanMenu from '@/components/KanbanMenu';

export const metadata: Metadata = {
  title: 'Menu — 看板',
  description:
    'The Hey Tiger menu as a wall of hanging izakaya sign boards — izakaya fare, the sake cellar, late nights, weekend brunch, cocktails and private events.',
};

export default function MenuPage() {
  return <KanbanMenu />;
}
