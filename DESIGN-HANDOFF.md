# Hey Tiger — Design Handoff: Typography & Font System
**Source:** GC HT MOODBOARD.ai · Ghost Camo Creative Studio  
**Project:** Hey Tiger, Motor City Dubai — `heytigerdubai.com`  
**Stack:** Next.js 16 · TypeScript · Framer Motion · CSS Custom Properties

---

## 1. Typography System Overview

The moodboard defines **three distinct type personalities** that mirror the brand's dual identity (family by day / after-hours by night).

```
┌──────────────────────┬────────────────────────────────────────────────┐
│ ROLE                 │ FONT                                           │
├──────────────────────┼────────────────────────────────────────────────┤
│ Display / Headlines  │ TAN Nimbus                                     │
│ Body / UI / Labels   │ Jandus RD. 20 (Regular, Italic, Bold)          │
│ Wide sub-headlines   │ Jandus RD Extended / Jandus RD Extended Depth  │
│ Compact labels       │ Jandus RD Condensed                            │
│ Japanese (brand)     │ Dela Gothic One — katakana pop-culture style   │
│ Japanese (street)    │ TA Kakugo — rough / cinematic / attitude       │
└──────────────────────┴────────────────────────────────────────────────┘
```

---

## 2. Font Files (all in `/public/fonts/`)

| File | Family | Weight | Style | Usage |
|------|--------|--------|-------|-------|
| `TAN-NIMBUS.otf` | TAN Nimbus | 100–900 | normal | Primary display |
| `TAN-Nimbus.woff2` | TAN Nimbus | 100–900 | normal | Primary display (web) |
| `TAN-Nimbus.woff` | TAN Nimbus | 100–900 | normal | Primary display (legacy) |
| `JandusRoadRegular.otf` | Jandus RD | 400 | normal | Body text, labels |
| `JandusRD20-Regular.woff2` | Jandus RD | 400 | normal | Body text (web) |
| `JandusRD20-Regular.woff` | Jandus RD | 400 | normal | Body text (legacy) |
| `JandusRoadOblique.otf` | Jandus RD | 400 | italic | Emphasis, pull-quotes |
| `JandusRoadDepth.otf` | Jandus RD | 700 | normal | Bold labels, nav, CTAs |
| `JandusRD20-Bold.woff2` | Jandus RD | 700 | normal | Bold labels (web) |
| `JandusRD20-Bold.woff` | Jandus RD | 700 | normal | Bold labels (legacy) |
| `JandusRoadCondensed.otf` | Jandus RD Condensed | 400 | normal | Compact tickers, tags |
| `JandusRoadExtended.otf` | Jandus RD Extended | 400 | normal | Wide sub-headlines |
| `JandusRoadExtendedDepth.otf` | Jandus RD Extended | 700 | normal | Wide impactful heads |
| `DelaGothicOne-Regular.ttf` | Dela Gothic One | 400 | normal | Japanese (katakana) |
| `TA_kakugo_gf_01.ttf` | TA Kakugo | 400 | normal | Japanese (street/attitude) |

---

## 3. CSS Custom Properties (source of truth)

Defined in `src/app/globals.css`. Use these tokens in **every** component — never hardcode font names or values.

```css
/* ─── Font stacks ───────────────────────────────────────────────────── */
--font-display:   'TAN Nimbus', 'Fraunces', 'Georgia', serif;
--font-body:      'Jandus RD', 'DM Sans', system-ui, sans-serif;
--font-extended:  'Jandus RD Extended', 'Jandus RD', 'DM Sans', system-ui, sans-serif;
--font-condensed: 'Jandus RD Condensed', 'Jandus RD', 'DM Sans', system-ui, sans-serif;
--font-jp:        'Dela Gothic One', 'Noto Sans JP', sans-serif;      /* ヘイ、タイガー — brand */
--font-jp-rough:  'TA Kakugo', 'Dela Gothic One', 'Noto Sans JP', sans-serif; /* おいトラ — street */
```

---

## 4. Typography Scale (per section)

### 4.1 Hero Section (`#hero`)
| Element | Font Token | Size (clamp) | Weight | Color | Letter-spacing |
|---------|-----------|-------------|--------|-------|----------------|
| Eyebrow ("MOTOR CITY · DUBAI…") | `--font-body` | `11px` fixed | 700 | `#f24133` | `0.46em` |
| "HEY," headline | `--font-display` | `clamp(80px, 15vw, 210px)` | 900 | `#ede7c9` | `-0.03em` |
| "TIGER" headline | `--font-display` | `clamp(80px, 15vw, 210px)` | 900 | `#f24133` | `-0.03em` |
| Tagline body | `--font-body` | `clamp(12px, 1.1vw, 14px)` | 400 | `rgba(237,231,201,0.52)` | `0.08em` |
| CTA button text | `--font-body` | `11px` fixed | 800 | `#ede7c9` | `0.32em` |
| Ghost outline CTA | `--font-body` | `11px` fixed | 700 | `rgba(237,231,201,0.5)` | `0.30em` |
| Japanese accent (ヘイ、タイガー) | `--font-jp` | `clamp(22px, 3vw, 36px)` | — | `rgba(237,231,201,0.18)` | `0.2em` |
| Ticker strip — EN | `--font-display` | `11px` fixed | 900 | varies (see ticker) | `0.34em` |
| Ticker strip — JP | `--font-jp` | `15px` fixed | 900 | varies (see ticker) | `0.2em` |

**Ticker colour rule:** Every 4th item → `rgba(242,65,51,0.7)`, others → `rgba(237,231,201,0.2)`.  
Line-height on display headline: `0.88`. Overflow clipping required (word-reveal animation).

---

### 4.2 Story Section (`#story`)
| Element | Font Token | Size (clamp) | Weight | Color | Letter-spacing |
|---------|-----------|-------------|--------|-------|----------------|
| Eyebrow ("EPISODE 01 — ORIGIN") | `--font-body` | `11px` | 700 | `#f24133` | `0.44em` |
| Headline ("WHEN THE WEST MEETS THE EAST") | `--font-display` | `clamp(40px, 7vw, 88px)` | 900 | `#ede7c9` | `-0.03em` |
| "WEST" (accent word) | `--font-display` | (inherits) | 900 | `#f24133` | (inherits) |
| Narrative lines | `--font-body` | `clamp(12px, 1.1vw, 14px)` | 600 | `rgba(237,231,201,0.72)` | `0.12em` |
| Blockquote ("HEY, TIGER…") | `--font-display` | `clamp(22px, 3.5vw, 42px)` | 900 | `#f24133` | `-0.02em` |
| Blockquote sub-label | `--font-body` | `11px` | 700 | `rgba(237,231,201,0.45)` | `0.26em` |
| Keyword pills | `--font-body` | `11px` | 700 | `rgba(237,231,201,0.45)` | `0.28em` |
| Ghost "EPISODE 1" watermark | `--font-display` | `clamp(140px, 22vw, 320px)` | 900 | `rgba(242,65,51,0.055)` | `-0.04em` |
| Photo JP overlay (ヘイ、タイガー) | `--font-jp` | `48px` fixed | — | `rgba(237,231,201,0.22)` | `0.1em` |

Headline line-height: `0.9`. Blockquote has `border-left: 3px solid #f24133`.

---

### 4.3 Menu Section (`#menu`)
| Element | Font Token | Size (clamp) | Weight | Color | Letter-spacing |
|---------|-----------|-------------|--------|-------|----------------|
| Eyebrow ("THE MENU — 食") | `--font-body` | `11px` | 700 | `#f24133` | `0.44em` |
| Section headline | `--font-display` | `clamp(48px, 8vw, 100px)` | 900 | `#1b0e1d` | `-0.03em` |
| Body intro text | `--font-body` | `clamp(13px, 1.2vw, 15px)` | 400 | `rgba(26,12,6,0.6)` | `0.06em` |
| Filter pill labels | `--font-body` | `11px` | 800 | active=`#ede7c9` / inactive=`rgba(26,12,6,0.5)` | `0.24em` |
| Card dish name (EN) | `--font-display` | `clamp(18px, 2.2vw, 24px)` | 900 | `#ede7c9` | `-0.01em` |
| Card dish name (JP) | `--font-jp` | `12px` | — | `#f24133` | `0.16em` |
| Card description | `--font-body` | `12px` | 400 | `rgba(237,231,201,0.55)` | `0.04em` |
| Card price | `--font-body` | `13px` | 800 | `#faaf40` | `0.1em` |
| Card badge | `--font-body` | `9px` | 800 | `#ede7c9` | `0.3em` |
| Ghost 食 watermark | `--font-jp` | `clamp(200px, 32vw, 520px)` | 900 | `rgba(26,12,6,0.06)` | — |

---

### 4.4 Space Section (`#space`)
| Element | Font Token | Size (clamp) | Weight | Color | Letter-spacing |
|---------|-----------|-------------|--------|-------|----------------|
| Eyebrow | `--font-body` | `11px` | 700 | `#f24133` | `0.44em` |
| Section headline | `--font-display` | `clamp(48px, 8vw, 100px)` | 900 | `#ede7c9` | `-0.03em` |
| Sub-text | `--font-body` | `clamp(13px, 1.2vw, 15px)` | 400 | `rgba(237,231,201,0.5)` | `0.06em` |
| Tab: room tag | `--font-body` | `10px` | 800 | active=`rgba(237,231,201,0.7)` / inactive=`rgba(237,231,201,0.3)` | `0.32em` |
| Tab: room name | `--font-display` | `clamp(14px, 1.8vw, 18px)` | 900 | active=`#ede7c9` / inactive=`rgba(237,231,201,0.5)` | `-0.01em` |
| Photo overlay: room name | `--font-display` | `clamp(24px, 3.5vw, 44px)` | 900 | `#ede7c9` | `-0.02em` |
| Photo overlay: description | `--font-body` | `clamp(12px, 1.1vw, 14px)` | 400 | `rgba(237,231,201,0.65)` | `0.06em` |
| Photo overlay: JP kanji | `--font-jp` | `clamp(28px, 4vw, 48px)` | — | `rgba(242,65,51,0.65)` | `0.12em` |

---

### 4.5 Contact Section (`#contact`)
| Element | Font Token | Size (clamp) | Weight | Color | Letter-spacing |
|---------|-----------|-------------|--------|-------|----------------|
| Eyebrow ("FIND US — 来る") | `--font-body` | `11px` | 700 | `rgba(26,12,6,0.6)` | `0.44em` |
| Main headline ("COME IN.") | `--font-display` | `clamp(56px, 10vw, 130px)` | 900 | `#ede7c9` | `-0.03em` |
| Column labels (ADDRESS, HOURS…) | `--font-body` | `10px` | 800 | `rgba(26,12,6,0.55)` | `0.38em` |
| Address venue name | `--font-display` | `clamp(18px, 2.2vw, 26px)` | 900 | `#1b0e1d` | `-0.01em` |
| Address street text | `--font-body` | `13px` | 400 | `rgba(26,12,6,0.7)` | `0.08em` |
| Hours day label | `--font-body` | `11px` | 700 | see CLOSED rule | `0.22em` |
| Hours time label | `--font-body` | `11px` | 700 | see CLOSED rule | `0.12em` |
| Social / contact links | `--font-body` | `13px` | 700 | `#1b0e1d` | `0.12em` |
| Footer copyright | `--font-body` | `10px` | 700 | `rgba(26,12,6,0.45)` | `0.28em` |
| Footer JP (おいトラ) | `--font-jp` | `16px` | — | `rgba(26,12,6,0.5)` | `0.16em` |
| Back to top | `--font-body` | `10px` | 800 | `#f24133` | `0.32em` |
| Ghost 来 watermark | `--font-jp` | `clamp(200px, 36vw, 580px)` | 900 | `rgba(26,12,6,0.08)` | — |

**CLOSED rule:** `color: rgba(26,12,6,0.4)` / `0.3` — slightly dimmed compared to open days.

---

### 4.6 Navigation (`NewNav`)
| Element | Font Token | Size | Weight | Color | Letter-spacing |
|---------|-----------|------|--------|-------|----------------|
| Nav links | `--font-body` | `11px` | 700 | `rgba(237,231,201,0.7)` | `0.3em` |
| Nav links (scrolled / active) | `--font-body` | `11px` | 700 | `#ede7c9` | `0.3em` |
| BOOK A TABLE button | `--font-body` | `11px` | 800 | `#1b0e1d` | `0.28em` |
| Mobile nav links | `--font-display` | `clamp(28px, 6vw, 48px)` | 900 | `#ede7c9` | `-0.02em` |

---

## 5. Brand Colour Tokens

```css
/* ── Core (use these in components, not hex) ────────────────────────── */
--ht-red:     #C8452A;   /* Tiger Red — brand / roar */
--ht-cream:   #E8DFC8;   /* Warm cream — primary light text */
--ht-void:    #1A1510;   /* Deep plum-void — primary BG */
--ht-amber:   #D94020;   /* Warm amber — hover / CTA alt */

/* ── Semantic (always use these in new code) ────────────────────────── */
--clr-red:    var(--ht-red);    /* CTA, eyebrows, accents */
--clr-cream:  var(--ht-cream);  /* Primary text on dark backgrounds */
--clr-void:   var(--ht-void);   /* Default dark background */
--clr-amber:  var(--ht-amber);  /* Hover states, price tags */
--clr-gold:   var(--jp-kin);    /* Price labels, premium accents → #E8D5A8 */
```

> ⚠️ **Known inconsistency:** Most components currently use `#f24133` (a brighter red) instead of the token `var(--clr-red)` (`#C8452A`). Until this is reconciled, use `#f24133` to match the existing rendered output — but the long-term target is to replace all hardcoded reds with `var(--clr-red)`.

### Section Backgrounds (hardcoded — intentional)
| Section | Background |
|---------|-----------|
| Hero | `#0e0b08` |
| Story | `#1b0e1d` |
| Menu | `#ede7c9` (cream) |
| Space | `#120f0a` |
| Contact | `#f24133` (Tiger Red) |

---

## 6. Typography Rules — Do & Don't

### ✅ DO
- Use `font-family: var(--font-display)` for ALL section headlines (h2, h3)
- Use `font-family: var(--font-body)` for ALL labels, body copy, navigation, buttons
- Use `font-family: var(--font-jp)` for Japanese Katakana brand accents (ヘイ、タイガー)
- Use `font-family: var(--font-jp-rough)` for street/attitude Japanese (おいトラ)
- Set `line-height: 0.88–0.9` on display headlines (tight — part of the brand look)
- Set `letter-spacing: -0.03em` on large display text (negative — tightens the wide glyphs)
- Set `letter-spacing: 0.28em–0.46em` on ALL-CAPS label/eyebrow text
- Set `font-weight: 900` on TAN Nimbus headlines, `700–800` on Jandus RD labels
- Wrap display headlines in `overflow: hidden` containers for word-reveal animations

### ❌ DON'T
- Never use `text-shadow`, `WebkitTextStroke`, `filter: drop-shadow` on display headlines
- Never apply `font-style: italic` (use Jandus Oblique explicitly via CSS if needed)
- Never use `font-weight` values that aren't in the loaded font faces (400, 700 for Jandus; 900 for TAN Nimbus)
- Never mix display font for body copy or body font for headlines
- Never use `--font-extended` or `--font-condensed` for hero/section headlines
- Never hardcode font names — always reference a CSS custom property

---

## 7. Japanese Typography Guide

The moodboard explicitly defines two Japanese voices:

### Voice 1 — ヘイ、タイガー (Katakana Cool)
- **Font:** `var(--font-jp)` → Dela Gothic One
- **Character:** Pop-culture, brand-like, modern, stylish
- **Usage:** Photo overlays, hero accent, section watermarks, branding moments
- **Example sizes:** `48px` (photo overlay), `clamp(22px, 3vw, 36px)` (hero accent), `16px` (footer)
- **Colour:** Semi-transparent cream `rgba(237,231,201,0.18–0.22)` for ghost effect

### Voice 2 — おいトラ (Street / Attitude)
- **Font:** `var(--font-jp-rough)` → TA Kakugo
- **Character:** Rough, street, cinematic, "Oi Tora" = "Hey, Tiger!" with attitude
- **Usage:** Ticker strip, aggressive accent moments, rooftop/night vibes
- **Example:** Hero ticker (alternating with EN headline)
- **Colour:** `rgba(237,231,201,0.2)` for subtle strip use; brighter for feature moments

### Rule
Always add `lang="ja"` attribute to Japanese text elements for correct screen reader pronunciation:
```tsx
<p lang="ja" style={{ fontFamily: 'var(--font-jp)' }}>ヘイ、タイガー</p>
<span lang="ja" style={{ fontFamily: 'var(--font-jp-rough)' }}>おいトラ</span>
```

---

## 8. Animation — Typography Motion

### Hero Headline Reveal
- **Type:** Word-by-word slide up from clipped overflow container
- **"HEY,":** `y: '105%' → 0`, duration `0.75s`, delay `0.22s`, ease `[0.16, 1, 0.3, 1]`
- **"TIGER":** `y: '105%' → 0`, duration `0.75s`, delay `0.34s`, ease `[0.16, 1, 0.3, 1]`
- **Reduced motion:** Skip entirely (use `reduceMotion ? {} : { y: '105%' }`)

### Section Entry (whileInView)
- **Default:** `opacity: 0, y: 20 → opacity: 1, y: 0`, duration `0.55s`
- **Staggered items:** `delay: index × 0.05s`
- **viewport:** `{ once: true, amount: 0.3 }`

### Ticker Strip
```css
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.ticker-track { animation: ticker 22s linear infinite; }
```
Duplicate content array (×8) so strip loops seamlessly.

### Menu Filter Pill
- **Type:** Framer Motion `layoutId="menu-filter-bg"` spring transition
- `type: 'spring', stiffness: 380, damping: 30`

---

## 9. Responsive Typography Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| `> 1024px` | Full clamp scale, negative letter-spacing active |
| `768–1024px` | clamp naturally scales, story/space grids shift to adjusted columns |
| `540–768px` | Grid collapses to 1 column, hero font scales down via clamp |
| `< 540px` | **Override:** `letter-spacing: 0em !important` on h1/h2/h3 — prevents glyph collision |
| `< 380px` | `letter-spacing: 0.01em !important` on all headings (iPhone SE) |

**Why:** TAN Nimbus has very curvy, wide glyphs. At `-0.03em` tracking they collide on narrow screens. The mobile override in `globals.css` relaxes tracking automatically.

---

## 10. Accessibility Notes

| Requirement | Implementation |
|-------------|---------------|
| Minimum touch target | `minHeight: 44px` on all buttons/links |
| Minimum label size | `11px` (WCAG 2.1 AA, upgraded from 10px) |
| Focus ring | `outline: 2px solid var(--clr-amber); outline-offset: 3px` on `:focus-visible` |
| Skip link | `.sr-only-focusable` — appears on keyboard focus, jumps to `#hero` |
| Screen reader headings | `<h1 className="sr-only">` in page, visible `<h2>` in each section |
| Japanese text | `lang="ja"` on all Japanese text elements |
| Reduced motion | All animations disabled via `prefers-reduced-motion: reduce` |
| Ghost/decorative text | `aria-hidden="true"` on all watermarks and ghost kanji |

---

## 11. Fallback Stack Behaviour

| Primary | Fallback 1 | Fallback 2 | System |
|---------|-----------|-----------|--------|
| TAN Nimbus | Fraunces 900 (Google) | Georgia | serif |
| Jandus RD | DM Sans (Google) | system-ui | sans-serif |
| Dela Gothic One | Noto Sans JP (Google) | Hiragino Kaku Gothic Pro | sans-serif |
| TA Kakugo | Dela Gothic One | Noto Sans JP | sans-serif |

All fallbacks are loaded via Google Fonts import in `globals.css` as `font-display: swap`.

---

## 12. Implementation Checklist for New Components

- [ ] Section headline uses `var(--font-display)` at `font-weight: 900`
- [ ] All labels/CTAs/body use `var(--font-body)`
- [ ] Japanese text uses `var(--font-jp)` or `var(--font-jp-rough)` (not the other way around)
- [ ] `lang="ja"` attribute on all Japanese text
- [ ] `aria-hidden="true"` on all decorative ghost/watermark text
- [ ] `letter-spacing: 0.28em–0.46em` on ALL-CAPS labels
- [ ] `letter-spacing: -0.03em` on large display headlines
- [ ] `line-height: 0.88–0.9` on display headlines
- [ ] No `text-shadow` or stroke effects on display font
- [ ] Animated headlines have overflow clipping container
- [ ] `reduceMotion ? {} : { ...animation }` guard on all Framer Motion props
- [ ] `minHeight: 44px` on all interactive elements
- [ ] Section gets `id` matching nav scroll targets (`hero`, `story`, `menu`, `space`, `contact`)
