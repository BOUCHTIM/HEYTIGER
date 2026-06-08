'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Ticker from '@/components/Ticker';

const C = {
  cream:   'var(--clr-cream)',   // unified cream — used everywhere in footer
  cream2:  'var(--clr-cream)',   // same cream, no variation
  ink:     'var(--clr-void)',
  red:     'var(--clr-red)',
  redDim:  'var(--clr-red-60)',
  border:  'rgba(18,13,20,0.12)',
  muted:   'var(--clr-ink-65)',
  faint:   'rgba(18,13,20,0.18)',
  // Computed filter → var(--clr-red) from a white/transparent source logo
  logoRed: 'brightness(0) invert(26%) sepia(73%) saturate(2049%) hue-rotate(347deg) brightness(95%) contrast(96%)',
} as const;

const HOURS = [
  { day: 'MON',       time: 'CLOSED'          },
  { day: 'TUE – FRI', time: '6PM – 2AM'       },
  { day: 'SATURDAY',  time: '11AM – 2AM'      },
  { day: 'SUNDAY',    time: '11AM – MIDNIGHT'  },
];

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com/heytigerdubai' },
  { label: 'TikTok',    href: 'https://tiktok.com/@heytigerdubai'   },
];

export default function Footer({ onReserve }: { onReserve: () => void }) {
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const reduceMotion = !!useReducedMotion();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const subscribe  = () => { if (!emailValid) return; setSubscribed(true); };

  return (
    <footer id="contact" style={{ background: C.cream }}>

      <Ticker backgroundColor="var(--clr-red)" />

      {/* ── TOP: reserve + newsletter ── */}
      <div
        className="ht-footer-top"
        style={{ display: 'grid', gridTemplateColumns: '1fr clamp(300px, 32vw, 440px)', borderBottom: `1px solid ${C.border}` }}
      >
        {/* Left — reserve CTA */}
        <div style={{ padding: 'var(--space-section-y) var(--space-section-x)', borderRight: `1px solid ${C.border}` }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: 'var(--tracking-ultra)', color: C.redDim, fontWeight: 700 }}>
              RESERVE A TABLE · <span lang="ja">ご予約</span> · MOTOR CITY
            </span>
          </div>

          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-heading-xl)', lineHeight: 0.94, letterSpacing: 'var(--tracking-tight)', color: C.red, display: 'inline-block', animation: reduceMotion ? 'none' : 'neonFlickerRed 5s infinite 0.3s' }}>
            RESERVE<br />
            <span style={{ color: C.ink }}>YOUR TABLE.</span>
          </h2>

          <div lang="ja" style={{ marginTop: 'clamp(16px, 2vw, 28px)', fontFamily: 'var(--font-jp)', fontSize: 'var(--text-jp-display)', fontWeight: 700, color: C.red, letterSpacing: '0.08em' }}>
            次回のご予約
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', letterSpacing: '0.02em', lineHeight: 1.8, color: C.muted, margin: 'clamp(18px, 2vw, 26px) 0 clamp(28px, 4vw, 48px)' }}>
            Motor City Club House. 47 sake labels. Open till 2AM.
          </p>

          <button
            onClick={onReserve}
            aria-label="Book a table"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(-4deg) scale(1.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
          >
            <Image src="/sticker2.png" alt="Hey Tiger — Book a table" width={220} height={220} unoptimized
              style={{ display: 'block', width: 'clamp(160px, 15vw, 220px)', height: 'auto' }} />
          </button>
        </div>

        {/* Right — newsletter */}
        <div style={{ padding: 'var(--space-section-y) clamp(28px, 4vw, 52px)', display: 'flex', flexDirection: 'column', gap: 'var(--space-content-y)', background: C.cream2 }}>
          {/* U1+U2: visible label, aria-live on wrapper, role=status on success */}
          <div aria-live="polite" aria-atomic="true">
            {/* U1: visible <label> for cognitive accessibility / speech input */}
            <label
              htmlFor="newsletter-email"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, display: 'block', margin: '0 0 16px' }}
            >
              STAY IN THE LOOP
            </label>
            {subscribed ? (
              <div role="status" style={{ border: `1px solid ${C.red}`, padding: '20px', background: 'rgba(200,61,32,0.06)' }}>
                <p lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'var(--text-body)', letterSpacing: 'var(--tracking-wide)', color: C.red, margin: '0 0 6px' }}>ようこそ</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', letterSpacing: 'var(--tracking-tight)', color: C.ink, margin: '0 0 6px' }}>YOU&apos;RE IN.</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', letterSpacing: '0.04em', color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  We&apos;ll reach you at <strong style={{ color: C.red, fontWeight: 700 }}>{email}</strong>. Late-night updates only.
                </p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); subscribe(); }} style={{ border: `1px solid ${C.border}` }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                  <input
                    id="newsletter-email"
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email" aria-label="Email address for newsletter"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '14px', letterSpacing: '0.04em', color: C.ink }}
                  />
                </div>
                <button type="submit" disabled={!emailValid}
                  style={{ width: '100%', padding: '14px 20px', background: 'transparent', border: 'none', cursor: emailValid ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900, letterSpacing: '0.4em', color: emailValid ? C.red : 'rgba(200,61,32,0.4)', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', transition: 'color var(--dur-fast) var(--ease-standard)', opacity: emailValid ? 1 : 0.6 }}
                >→ SUBSCRIBE</button>
              </form>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.04em', color: C.muted, margin: '10px 0 0' }}>Events, sake drops, late-night news. Nothing else.</p>
          </div>

          {/* Social */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: 'var(--tracking-ultra)', color: C.redDim, margin: '0 0 14px' }}>FOLLOW</p>
            <div style={{ display: 'flex', gap: '14px' }}>
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-link"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900, letterSpacing: '0.3em', color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, transition: 'color 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderBottomColor = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderBottomColor = C.border; }}
                >{s.label}</a>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.7 }}>
            <Image src="/heytiger-logo.png" alt="Hey Tiger" width={200} height={90} unoptimized
              style={{ height: '70px', width: 'auto', objectFit: 'contain', filter: C.logoRed }} />
            <div style={{ width: '1px', height: '40px', background: C.border }} />
            <Image src="/BMH-logo.png" alt="Brass Monkey Hospitality" width={140} height={90} unoptimized
              style={{ height: '64px', width: 'auto', objectFit: 'contain', filter: C.logoRed }} />
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Hours + Location ── */}
      <div className="ht-footer-mid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
        {/* Hours */}
        <div style={{ padding: 'var(--space-content-y) var(--space-section-x)', borderRight: `1px solid ${C.border}`, background: C.cream }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, margin: '0 0 20px' }}>HOURS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {HOURS.map(h => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${C.faint}`, paddingBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: 'var(--tracking-wide)', color: h.time === 'CLOSED' ? 'var(--clr-ink-25)' : C.ink }}>{h.day}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: '0.1em', color: h.time === 'CLOSED' ? 'rgba(18,13,20,0.2)' : C.red }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div style={{ padding: 'var(--space-content-y) var(--space-section-x)', background: C.cream2 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, margin: '0 0 20px' }}>FIND US</p>
          <address style={{ fontStyle: 'normal', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: 'var(--tracking-tight)', color: C.ink, lineHeight: 1.2, margin: '0 0 10px' }}>
              MOTOR CITY<br />CLUB HOUSE
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', letterSpacing: '0.02em', color: C.muted, lineHeight: 1.8, margin: 0 }}>
              Motor City Club House, Dubai
            </p>
          </address>
          <a href="mailto:hello@heytiger.ae"
            className="footer-contact-link"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 900, letterSpacing: '0.26em', color: C.redDim, textDecoration: 'none', borderBottom: `1px solid rgba(200,61,32,0.3)`, transition: 'color var(--dur-fast) var(--ease-standard)' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.redDim; }}
          >hello@heytiger.ae</a>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="ht-footer-bottom" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '24px', padding: 'clamp(18px, 2vw, 26px) var(--space-section-x)', background: C.ink }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'rgba(240,235,216,0.35)', margin: 0 }}>
          © 2026 Hey Tiger · A Brass Monkey Hospitality Venue
        </p>
        <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '14px', color: 'var(--clr-red-60)', letterSpacing: '0.18em', textAlign: 'center', fontWeight: 700 }}>おいトラ</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* R3: real hrefs; aria-disabled until pages exist */}
          <a href="/privacy" aria-label="Privacy Policy"
            className="footer-utility-link"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'var(--clr-cream-30)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-standard)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--clr-red)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-cream-30)'; }}
          >Privacy Policy</a>
          <a href="/terms" aria-label="Terms and conditions"
            className="footer-utility-link"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'var(--clr-cream-30)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-standard)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--clr-red)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-cream-30)'; }}
          >Terms</a>
        </div>
      </div>


      <style>{`
        @media (max-width: 900px) {
          .ht-footer-top  { grid-template-columns: 1fr !important; }
          .ht-footer-mid  { grid-template-columns: 1fr !important; }
          .ht-footer-bottom { grid-template-columns: 1fr !important; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
