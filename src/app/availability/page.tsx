'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type DayRow = { day: string; jp: string; hours: string };

function formatDubaiTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';

  return { weekday, hour: Number(hour), minute: Number(minute) };
}

function getOpenStatus(now: Date) {
  const { hour, minute } = formatDubaiTime(now);
  const hourDec = hour + minute / 60;

  const dayIndex = (() => {
    const wd = formatDubaiTime(now).weekday;
    const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    return map[wd] ?? 7;
  })();

  const schedule: Array<[number, number] | null> = [
    null, null,
    [18, 26], [18, 26], [18, 26], [18, 26],
    [11, 26], [11, 24],
  ];

  const yesterday = dayIndex === 1 ? 7 : dayIndex - 1;

  let isOpen = false;
  let closesAt: number | null = null;

  const today = schedule[dayIndex];
  if (today && hourDec >= today[0] && hourDec < today[1]) {
    isOpen = true;
    closesAt = today[1];
  } else {
    const prev = schedule[yesterday];
    if (prev && prev[1] > 24 && hourDec < prev[1] - 24) {
      isOpen = true;
      closesAt = prev[1];
    }
  }

  const closesLabel = closesAt
    ? (() => {
        const h = closesAt > 24 ? closesAt - 24 : closesAt;
        const suffix = h < 12 || h === 24 ? 'AM' : 'PM';
        const display = h === 24 ? 12 : h > 12 ? h - 12 : h;
        return `CLOSES ${display}${suffix}`;
      })()
    : 'CLOSED NOW';

  return { isOpen, closesLabel };
}

/* ── Nav links ── */
const NAV_LINKS = [
  { label: '← HOME',       href: '/',              cta: false },
  { label: 'THE MENU',     href: '/menu',           cta: false },
  { label: 'THE SPACE',    href: '/#space',         cta: false },
  { label: 'BOOK A TABLE', href: '/?modal=reserve', cta: true  },
  { label: 'FIND US',      href: '/#contact',       cta: false },
];

export default function AvailabilityPage() {
  const now = useMemo(() => new Date(), []);
  const status = useMemo(() => getOpenStatus(now), [now]);

  const rows: DayRow[] = [
    { day: 'MON',       jp: '月曜日', hours: 'CLOSED'         },
    { day: 'TUE',       jp: '火曜日', hours: '6PM → 2AM'      },
    { day: 'WED',       jp: '水曜日', hours: '6PM → 2AM'      },
    { day: 'THU',       jp: '木曜日', hours: '6PM → 2AM'      },
    { day: 'FRI',       jp: '金曜日', hours: '6PM → 2AM'      },
    { day: 'SAT',       jp: '土曜日', hours: '11AM → 2AM'     },
    { day: 'SUN',       jp: '日曜日', hours: '11AM → MIDNIGHT' },
  ];

  return (
    <main style={{ background: '#1C0808', minHeight: '100vh', color: '#F0EBD8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <a href="#availability-main" className="sr-only-focusable">SKIP TO HOURS</a>

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
          height: 'clamp(72px, 10.5vw, 148px)',
          overflow: 'hidden', gap: '24px',
        }}
      >
        <span lang="ja" style={{
          fontFamily: 'var(--font-jp)', fontSize: 'clamp(44px, 8vw, 116px)',
          fontWeight: 900, color: '#F0EBD8', letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap',
        }}>ヘイ、タイガー</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span lang="ja" style={{
            fontFamily: 'var(--font-jp)', fontSize: 'clamp(12px, 1.1vw, 16px)',
            color: 'rgba(200,61,32,0.45)', letterSpacing: '0.15em',
          }} className="hidden-xs">ご予約</span>
          <div style={{
            background: '#C83D20', color: '#1C0808',
            fontFamily: 'var(--font-body)', fontSize: '9px',
            fontWeight: 900, letterSpacing: '0.4em', borderRadius: 0,
            padding: '5px 10px',
          }}>EST. 2026</div>
        </div>
      </motion.div>

      {/* ══ BAND 2: Bordered nav grid ══ */}
      <nav
        aria-label="Site navigation"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '4px',
          background: '#1C0808',
        }}
        className="ht-avail-nav"
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(9px, 0.82vw, 12px)',
              fontWeight: 900, letterSpacing: '0.36em',
              color: item.cta ? '#1C0808' : 'rgba(240,235,216,0.55)',
              background: item.cta ? '#C83D20' : '#1C0808',
              border: item.cta ? 'none' : '1px solid #2A1F2A',
              padding: 'clamp(12px, 1.6vh, 20px) 8px',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
              borderRadius: 0,
            }}
            onMouseEnter={e => {
              if (item.cta) { (e.currentTarget as HTMLAnchorElement).style.background = '#B22D12'; }
              else { (e.currentTarget as HTMLAnchorElement).style.color = '#C83D20'; }
            }}
            onMouseLeave={e => {
              if (item.cta) { (e.currentTarget as HTMLAnchorElement).style.background = '#C83D20'; }
              else { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,235,216,0.55)'; }
            }}
          >{item.label}</Link>
        ))}
      </nav>

      {/* ══ CONTENT: Hours ══ */}
      <div id="availability-main" style={{ padding: 'clamp(48px, 6vw, 96px) clamp(24px, 5vw, 72px)', background: '#1C0808', flex: 1 }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(9px, 0.75vw, 11px)',
          fontWeight: 900, letterSpacing: '0.52em', textIndent: '0.52em',
          color: 'rgba(200,61,32,0.5)', margin: '0 0 clamp(20px, 2.5vw, 32px)',
        }}>HOURS · 営業時間</p>

        {/* Large JP heading */}
        <h1 lang="ja" style={{
          fontFamily: 'var(--font-jp)',
          fontSize: 'clamp(44px, 7.8vw, 116px)',
          fontWeight: 900, color: '#F0EBD8',
          lineHeight: 1.0, margin: 0,
          letterSpacing: '-0.02em',
          borderBottom: '3px solid #C83D20',
          paddingBottom: 'clamp(18px, 2.2vw, 30px)',
          display: 'inline-block',
        }}>営業時間</h1>

        {/* Status indicator */}
        <div style={{ marginTop: 'clamp(24px, 3vw, 36px)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
            background: status.isOpen ? '#4CAF50' : 'rgba(240,235,216,0.2)',
            boxShadow: status.isOpen ? '0 0 8px rgba(76,175,80,0.6)' : 'none',
          }} aria-hidden="true" />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(9px, 0.82vw, 11px)',
            fontWeight: 900, letterSpacing: '0.38em',
            color: status.isOpen ? '#4CAF50' : 'rgba(240,235,216,0.3)',
          }}>{status.isOpen ? `OPEN NOW · ${status.closesLabel}` : status.closesLabel}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(240,235,216,0.2)' }}>
            · TIMES IN DUBAI (GST)
          </span>
        </div>

        {/* Hours table */}
        <div style={{
          marginTop: 'clamp(28px, 3.5vw, 44px)',
          border: '1px solid #2A1F2A',
          borderRadius: 0,
          overflow: 'hidden',
          maxWidth: '680px',
        }}>
          {rows.map((r, idx) => (
            <div
              key={r.day}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: '16px',
                padding: 'clamp(14px, 1.8vw, 22px) clamp(20px, 2.5vw, 32px)',
                borderBottom: idx === rows.length - 1 ? 'none' : '1px solid rgba(240,235,216,0.05)',
                background: r.hours === 'CLOSED' ? 'transparent' : 'rgba(200,61,32,0.04)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1vw, 14px)',
                fontWeight: 900, letterSpacing: '0.32em',
                color: r.hours === 'CLOSED' ? 'rgba(240,235,216,0.2)' : 'rgba(240,235,216,0.75)',
              }}>{r.day}</div>
              <div lang="ja" style={{
                fontFamily: 'var(--font-jp)', fontSize: '12px',
                letterSpacing: '0.1em',
                color: r.hours === 'CLOSED' ? 'rgba(240,235,216,0.1)' : 'rgba(200,61,32,0.5)',
              }}>{r.jp}</div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1vw, 14px)',
                fontWeight: 700, letterSpacing: '0.18em',
                color: r.hours === 'CLOSED' ? 'rgba(240,235,216,0.15)' : '#C83D20',
                textAlign: 'right',
              }}>{r.hours}</div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p style={{
          marginTop: 'clamp(20px, 2.5vw, 30px)', marginBottom: 0,
          fontFamily: 'var(--font-body)', fontSize: '13px',
          letterSpacing: '0.08em', lineHeight: 1.8,
          color: 'rgba(240,235,216,0.25)', maxWidth: '560px',
        }}>
          For table availability, use BOOK A TABLE above and choose your time. Kitchen and bar hours may vary.
        </p>

        {/* CTA */}
        <Link
          href="/?modal=reserve"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 'clamp(32px, 4vw, 52px)',
            fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: 'clamp(11px, 0.9vw, 13px)', letterSpacing: '0.18em',
            color: '#1C0808', background: '#C83D20',
            borderRadius: 0, border: 'none',
            padding: 'clamp(14px, 1.6vw, 20px) clamp(32px, 4vw, 52px)',
            textDecoration: 'none', transition: 'background 0.15s',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#B22D12'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#C83D20'; }}
        >BOOK YOUR TABLE →</Link>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .ht-avail-nav { grid-template-columns: repeat(3, 1fr) !important; }
          .ht-avail-nav a:nth-child(4),
          .ht-avail-nav a:nth-child(5) { display: none; }
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </main>
  );
}
