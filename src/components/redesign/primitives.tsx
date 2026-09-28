'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { FOOTER } from '@/data/site';

/* ── Arrow used in every CTA (long shaft, small head) ─────────── */
export function Arrow({ className = 'rd-btn__arrow' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 10" fill="none" aria-hidden="true">
      <path d="M0 5h24M20 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

type Variant = 'red' | 'ivory' | 'outline-red' | 'outline-ivory';

type ButtonProps = { variant?: Variant; children: ReactNode; className?: string } & (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
);

/* ── Button / link with the design's arrow tail ───────────────── */
export function RdButton({ variant = 'outline-red', children, className = '', ...rest }: ButtonProps) {
  const cls = `rd-btn rd-btn--${variant} ${className}`.trim();
  if ('href' in rest && rest.href) {
    const { href, ...a } = rest as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = /^https?:/.test(href);
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noopener noreferrer" {...a}>
          <span>{children}</span><Arrow />
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...a}>
        <span>{children}</span><Arrow />
      </Link>
    );
  }
  const b = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={cls} {...b}>
      <span>{children}</span><Arrow />
    </button>
  );
}

/* ── Wordmark: tiger mark + "HEY, TIGER" + tag lines ──────────── */
export function Logo({ href = '/', tone = 'red' }: { href?: string; tone?: 'red' | 'ivory' }) {
  return (
    <Link href={href} className="rd-nav__logo" aria-label="Hey Tiger — home">
      {/* horizontal lockup as in the frame: tiger mark · HEY, TIGER · SOCIAL HOUSE / EST. 2024 */}
      <Image
        src={`/images/logos/tiger-mark-${tone}.png`}
        alt=""
        width={735}
        height={525}
        className="rd-logo__mark"
        priority
      />
      <span className="rd-logo__word">HEY, TIGER</span>
      <span className="rd-logo__meta" aria-hidden="true">
        <span>{FOOTER.tag}</span>
        <span>{FOOTER.est}</span>
      </span>
    </Link>
  );
}
