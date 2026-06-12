'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Ticker from '@/components/Ticker';

const C = {
  void: 'var(--clr-void)',
  cream: 'var(--clr-cream)',
  red: 'var(--clr-red)',
  redDim: 'var(--clr-red-60)',
  border: 'rgba(240,235,216,0.12)',
  muted: 'var(--clr-cream-70)',
  faint: 'rgba(240,235,216,0.18)',
};

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
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const reduceMotion = !!useReducedMotion();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const subscribe = () => { if (!emailValid) return; setSubscribed(true); };

  return (
    <footer id="contact" style={{ background: C.void }}>
      <Ticker backgroundColor="var(--clr-red)" />

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: 'clamp(48px, 6vw, 96px) clamp(28px, 4vw, 64px)' }}>
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '48px', borderBottom: `1px solid ${C.border}`, paddingBottom: '48px' }}>
          
          {/* Left Column: Brand & CTA */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <Image src="/heytiger-logo.png" alt="Hey Tiger" width={120} height={60} unoptimized style={{ height: '56px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.2vw, 16px)', letterSpacing: '0.02em', lineHeight: '1.8', color: C.muted, marginBottom: '28px' }}>
              Motor City Club House, Dubai. 47 sake labels. Open till 2AM.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <a href="mailto:hello@heytiger.ae" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.26em', color: C.red, textDecoration: 'none', fontWeight: 900 }}>
                hello@heytiger.ae
              </a>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900, letterSpacing: '0.3em', color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, paddingBottom: '4px', transition: 'color 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderBottomColor = C.red; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderBottomColor = C.border; }}
                >{s.label}</a>
              ))}
            </div>
          </div>

          {/* Middle Column: Hours */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, margin: '0 0 24px', textTransform: 'uppercase' }}>
              Hours
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOURS.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: 'var(--tracking-wide)', color: h.time === 'CLOSED' ? 'var(--clr-cream-30)' : C.cream }}>{h.day}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: '0.1em', color: h.time === 'CLOSED' ? 'rgba(240,235,216,0.3)' : C.red }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Newsletter & Location */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, margin: '0 0 24px', textTransform: 'uppercase' }}>
              Stay in the loop
            </h3>
            
            {subscribed ? (
              <div style={{ border: `1px solid ${C.red}`, padding: '20px', background: 'rgba(200,61,32,0.06)', marginBottom: '28px' }}>
                <p lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '18px', letterSpacing: 'var(--tracking-wide)', color: C.red, margin: '0 0 6px', fontWeight: 700 }}>ようこそ</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', letterSpacing: 'var(--tracking-tight)', color: C.cream, margin: '0 0 6px' }}>YOU&apos;RE IN.</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', letterSpacing: '0.04em', color: C.muted, margin: 0, lineHeight: '1.6' }}>
                  We&apos;ll reach you at <strong style={{ color: C.red, fontWeight: 700 }}>{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); subscribe(); }} style={{ border: `1px solid ${C.border}`, marginBottom: '28px' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                  <input
                    id="newsletter-email"
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email" aria-label="Email address for newsletter"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '14px', letterSpacing: '0.04em', color: C.cream }}
                  />
                </div>
                <button type="submit" disabled={!emailValid}
                  style={{ width: '100%', padding: '14px 20px', background: 'transparent', border: 'none', cursor: emailValid ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 900, letterSpacing: '0.4em', color: emailValid ? C.red : 'rgba(200,61,32,0.4)', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', transition: 'color var(--dur-fast) var(--ease-standard)', opacity: emailValid ? 1 : 0.6 }}
                >→ SUBSCRIBE</button>
              </form>
            )}

            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 900, letterSpacing: '0.48em', color: C.redDim, margin: '0 0 24px', textTransform: 'uppercase' }}>
              Find us
            </h3>
            <address style={{ fontStyle: 'normal' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(18px, 2vw, 24px)', letterSpacing: 'var(--tracking-tight)', color: C.cream, lineHeight: '1.2', margin: '0 0 10px' }}>
                MOTOR CITY<br />CLUB HOUSE
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', paddingTop: '24px', flexWrap: 'wrap' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'rgba(240,235,216,0.35)', margin: 0 }}>
            © 2026 Hey Tiger · A Brass Monkey Hospitality Venue
          </p>
          
          <span lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: '18px', color: 'var(--clr-red-60)', letterSpacing: '0.18em', fontWeight: 700 }}>
            おいトラ
          </span>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" aria-label="Privacy Policy"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'var(--clr-cream-30)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-standard)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--clr-red)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-cream-30)'; }}
            >Privacy Policy</a>
            <a href="/terms" aria-label="Terms and conditions"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', color: 'var(--clr-cream-30)', textDecoration: 'none', transition: 'color var(--dur-fast) var(--ease-standard)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--clr-red)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-cream-30)'; }}
            >Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}