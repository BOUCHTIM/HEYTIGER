export interface NavLink {
  id: string;
  number: string;
  label: string;
  href: string;
  japanese: string;
}

// 7 items — auspicious count; restructured for logical venue flow.
// Previous 6-item nav: MENU, RESERVATIONS, THE BAR, THE STORY, FIND US, EVENTS.
export const NAV_LINKS: NavLink[] = [
  { id: 'menu',      number: '01', label: 'MENU',      href: '/menu',          japanese: 'メニュー' },
  { id: 'story',     number: '02', label: 'THE STORY', href: '/#story',        japanese: '物語'     },
  { id: 'spaces',    number: '03', label: 'THE SPACES', href: '/#space',       japanese: 'スペース'  },
  { id: 'the-pass',  number: '04', label: 'THE PASS',  href: '/#explore',      japanese: 'キッチン'  },
  { id: 'events',    number: '05', label: 'EVENTS',    href: '/#contact',      japanese: 'イベント'  },
  { id: 'find-us',   number: '06', label: 'FIND US',   href: '/#contact',      japanese: 'アクセス'  },
  { id: 'reserve',   number: '07', label: 'RESERVE',   href: '/#booking-band', japanese: '予約'      },
];
