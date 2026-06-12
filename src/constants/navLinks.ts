export interface NavLink {
  id: string;
  number: string;
  label: string;
  href: string;
  japanese: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: 'menu',         number: '01', label: 'MENU',         href: '/menu',            japanese: 'メニュー' },
  { id: 'reservations', number: '02', label: 'RESERVATIONS', href: '/#booking-band-1', japanese: '予約'    },
  { id: 'bar',          number: '03', label: 'THE BAR',      href: '/#space',          japanese: 'バー'    },
  { id: 'story',        number: '04', label: 'THE STORY',    href: '/#story',          japanese: '物語'    },
  { id: 'find-us',      number: '05', label: 'FIND US',      href: '/#contact',        japanese: 'アクセス' },
  { id: 'events',       number: '06', label: 'EVENTS',       href: '/#contact',        japanese: 'イベント' },
];
