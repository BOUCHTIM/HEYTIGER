'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  dietary: string[];
  occasion: string;
  smsOpt: boolean;
  agree: boolean;
}

const TIMES = [
  '18:00','18:15','18:30','18:45',
  '19:00','19:15','19:30','19:45',
  '20:00','20:15','20:30','20:45',
  '21:00','21:15','21:30','21:45',
  '22:00','22:15','22:30','22:45',
  '23:00','23:30','00:00','00:30',
  '01:00','01:30','02:00',
];

const PREMIUM_TIMES = ['21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:30','00:00'];

const DIETARY = ['Vegetarian','Vegan','Gluten-free','Nut allergy','Halal','No restrictions'];
const OCCASIONS = ['','Birthday','Anniversary','Date night','Business dinner','Team outing','Just because — that\'s enough'];

const defaultForm: FormData = {
  date: '', time: '19:00', guests: 2,
  name: '', email: '', phone: '',
  dietary: [], occasion: '', smsOpt: false, agree: false,
};

/* ── Validation helpers ─────────────────────────────────────────── */
// Stricter than the basic pattern: no leading/trailing dots, valid TLD ≥2 letters,
// rejects spaces and stray characters like the trailing backtick bug.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const isValidEmail = (v: string) => {
  const e = v.trim();
  return EMAIL_RE.test(e) && !e.includes('..') && !/^\.|\.$/.test(e.split('@')[0]);
};
// Phone: strip spaces/dashes/parens; require optional + then 7–15 digits.
const isValidPhone = (v: string) => {
  const cleaned = v.replace(/[\s\-().]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
};
// Local record of reservations to prevent a double-booking for the same slot.
type StoredReservation = { email: string; date: string; time: string; ref: string };
const RES_KEY = 'ht_reservations';
const readReservations = (): StoredReservation[] => {
  try { return JSON.parse(localStorage.getItem(RES_KEY) || '[]'); } catch { return []; }
};
const hasDuplicate = (email: string, date: string, time: string) =>
  readReservations().some(r => r.email.toLowerCase() === email.trim().toLowerCase() && r.date === date && r.time === time);
const saveReservation = (r: StoredReservation) => {
  try { localStorage.setItem(RES_KEY, JSON.stringify([...readReservations(), r])); } catch {}
};

export default function ReservationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]   = useState<Step>(1);
  const [form, setForm]   = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [confirmationNum, setConfirmationNum] = useState('');

  // Reset form state when modal closes
  const handleClose = () => {
    setStep(1);
    setForm(defaultForm);
    setErrors({});
    setConfirmationNum('');
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  // ── A11y plumbing: focus trap, ESC, body-scroll lock, return focus ──
  const modalRef     = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Remember whoever opened the modal so we can return focus on close
    returnFocusRef.current = document.activeElement as HTMLElement | null;

    // Lock body scroll while the modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first focusable element inside the modal
    const focusTimer = window.setTimeout(() => {
      const root = modalRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 50);

    // ESC closes, Tab cycles inside the modal
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = modalRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'input:not([disabled]), select:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetParent !== null); // visible only
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
      // Return focus to opener — if it still exists in the DOM
      const el = returnFocusRef.current;
      if (el && document.contains(el)) {
        el.focus();
      }
    };
  }, [handleClose]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (step === 1 && !form.date) errs.date = 'Pick a date — we need to save your seat.';
    if (step === 4) {
      if (!form.name.trim())            errs.name  = 'We\'ll need a name for the reservation.';
      if (!isValidEmail(form.email))    errs.email = 'That email doesn\'t look right. Try again.';
      if (!isValidPhone(form.phone))    errs.phone = 'Enter a valid phone number (7–15 digits, e.g. +971 50 000 0000).';
      if (!form.agree)                  errs.agree = 'Please accept the reservation terms to continue.';
      // Prevent the same guest double-booking the same date & time.
      if (isValidEmail(form.email) && form.date && form.time && hasDuplicate(form.email, form.date, form.time)) {
        errs.email = 'You already hold a table for this date & time. One booking per slot — pick another time or date.';
      }
    }
    setErrors(errs as Partial<FormData>);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === 4 && !confirmationNum) {
      const ref = `HT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setConfirmationNum(ref);
      // Record the booking so this guest can't re-book the same slot.
      saveReservation({ email: form.email, date: form.date, time: form.time, ref });
    }
    setStep(s => (s < 5 ? (s + 1) as Step : s));
  };
  const back = () => setStep(s => (s > 1 ? (s - 1) as Step : s));

  return (
    <AnimatePresence>
      <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(21,13,17,0.88)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          ref={modalRef}
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--clr-dark)',
            border: '2px solid var(--clr-amber)',
            borderRadius: 0,
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-modal-title"
        >
          {/* Header */}
          <div style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid rgba(250,175,63,0.15)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            flexShrink: 0,
          }}>
            <div>
              <p lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'var(--text-label)', letterSpacing: '0.22em', color: 'var(--clr-amber)', marginBottom: '4px' }}>おいトラ</p>
              <h2 id="reservation-modal-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'var(--clr-cream)', letterSpacing: 'var(--tracking-tight)' }}>
                The door opens<br />for you.
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close reservation modal"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(245,239,224,0.62)', fontSize: '22px', lineHeight: 1,
                padding: '4px', transition: 'color var(--dur-fast) var(--ease-standard)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--clr-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,239,224,0.4)')}
            >
              ✕
            </button>
          </div>

          {/* Step progress */}
          {step < 5 && (
            <div style={{ padding: '16px 28px 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1,2,3,4].map(s => (
                  <div key={s} style={{
                    flex: 1, height: '3px', borderRadius: 0,
                    background: s < step ? 'var(--clr-amber)' : s === step ? 'var(--clr-red)' : 'rgba(245,239,224,0.1)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--tracking-wide)', color: 'rgba(245,239,224,0.62)' }}>
                  STEP {step} OF 4
                </p>
                {step > 1 && (
                  <p style={{ fontFamily: 'var(--font-jp)', fontSize: '10px', color: 'var(--clr-amber)', letterSpacing: '0.15em' }}>
                    ✓ Step {step - 1} complete
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && <StepWhen form={form} setForm={setForm} today={today} errors={errors} />}
                {step === 2 && <StepTime form={form} setForm={setForm} />}
                {step === 3 && <StepGuests form={form} setForm={setForm} />}
                {step === 4 && <StepInfo form={form} setForm={setForm} errors={errors} />}
                {step === 5 && <StepConfirm form={form} confirmNum={confirmationNum || 'HT-……'} onClose={handleClose} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer buttons */}
          {step < 5 && (
            <div style={{
              padding: '20px 28px 24px',
              borderTop: '1px solid rgba(250,175,63,0.1)',
              display: 'flex', gap: '12px',
              flexShrink: 0,
            }}>
              {step > 1 && (
                <button onClick={back} style={{
                  flex: 1,
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 700, letterSpacing: '0.18em',
                  background: 'transparent', border: '1.5px solid rgba(245,239,224,0.25)',
                  color: 'rgba(245,239,224,0.85)', padding: '14px', borderRadius: '999px', cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-cream)'; e.currentTarget.style.color = 'var(--clr-cream)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,239,224,0.25)'; e.currentTarget.style.color = 'rgba(245,239,224,0.85)'; }}
                >
                  ← BACK
                </button>
              )}
              <button onClick={next} style={{
                flex: 2,
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 800, letterSpacing: '0.18em',
                background: 'var(--clr-amber)', border: 'none',
                color: 'var(--clr-void)', padding: '14px', borderRadius: '999px', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, transform 0.15s',
                boxShadow: '0 6px 18px rgba(250,175,63,0.34)',
                minHeight: '44px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-red)'; e.currentTarget.style.color = 'var(--clr-cream)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-amber)'; e.currentTarget.style.color = 'var(--clr-void)'; e.currentTarget.style.transform = 'none'; }}
              >
                {step === 4 ? 'SECURE MY TABLE →' : 'CONTINUE →'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Step components ─────────────────────────────────────────────── */

function StepWhen({ form, setForm, today, errors }: {
  form: FormData; setForm: (f: FormData) => void; today: string; errors: Partial<FormData>;
}) {
  return (
    <div>
      <h3 style={stepTitle}>Pick your night.</h3>
      <p style={stepSub}>Open Tuesday → Sunday. The broth never stops.</p>
      <input
        type="date"
        min={today}
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        aria-label="Reservation date"
        aria-invalid={errors.date ? true : undefined}
        aria-describedby={errors.date ? 'reservation-date-error' : undefined}
        style={{
          ...inputBase,
          border: errors.date ? '1.5px solid var(--clr-red)' : inputBase.border,
        }}
      />
      {errors.date && <p id="reservation-date-error" role="alert" style={errorText}>{errors.date as string}</p>}
    </div>
  );
}

function StepTime({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  return (
    <div>
      <h3 style={stepTitle}>When should we expect you?</h3>
      <p style={stepSub}>Golden slots glow — rooftop opens at 21:00.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px' }}>
        {TIMES.map(t => (
          <button key={t} onClick={() => setForm({ ...form, time: t })} style={{
            padding: '10px 4px',
            borderRadius: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-label)',
            letterSpacing: '0.08em',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: form.time === t ? 'var(--clr-red)' : PREMIUM_TIMES.includes(t) ? 'rgba(250,175,63,0.08)' : 'rgba(245,239,224,0.04)',
            color: form.time === t ? 'var(--clr-void)' : PREMIUM_TIMES.includes(t) ? 'var(--clr-amber)' : 'rgba(245,239,224,0.55)',
            border: `1px solid ${form.time === t ? 'var(--clr-red)' : PREMIUM_TIMES.includes(t) ? 'rgba(250,175,63,0.2)' : 'rgba(245,239,224,0.08)'}`,
          }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepGuests({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  return (
    <div>
      <h3 style={stepTitle}>How many coming through?</h3>
      <p style={stepSub}>{form.guests >= 7 ? 'Big crew. We\'ll confirm rooftop availability within 24 hours.' : form.guests >= 4 ? 'A proper table. We\'ll make room.' : 'Just the two of you — we know a booth.'}</p>
      <div style={{ margin: '32px 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', marginBottom: '24px' }}>
          <button
            onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
            aria-label="Decrease guests"
            disabled={form.guests <= 1}
            style={guestBtn}
          >−</button>
          <span
            aria-live="polite"
            aria-label={`${form.guests} ${form.guests === 1 ? 'guest' : 'guests'}`}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '64px', color: 'var(--clr-cream)', lineHeight: 1, minWidth: '80px', textAlign: 'center' }}
          >
            {form.guests}
          </span>
          <button
            onClick={() => setForm({ ...form, guests: Math.min(12, form.guests + 1) })}
            aria-label="Increase guests"
            disabled={form.guests >= 12}
            style={guestBtn}
          >+</button>
        </div>
        <input
          type="range" min="1" max="12" value={form.guests}
          onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
          aria-label="Number of guests"
          style={{ width: '100%', accentColor: 'var(--clr-red)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={rangeLabel}>1</span>
          <span style={rangeLabel}>12</span>
        </div>
      </div>
    </div>
  );
}

function StepInfo({ form, setForm, errors }: {
  form: FormData; setForm: (f: FormData) => void; errors: Partial<FormData>;
}) {
  const toggleDietary = (item: string) => {
    const next = form.dietary.includes(item)
      ? form.dietary.filter(d => d !== item)
      : [...form.dietary, item];
    setForm({ ...form, dietary: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={stepTitle}>So we know who to look for.</h3>

      <LabeledInput id="reserve-name" label="Your Name" required type="text" value={form.name}
        onChange={(v) => setForm({ ...form, name: v })} error={errors.name as string} placeholder="First & last name" />

      <LabeledInput id="reserve-email" label="Email Address" required type="email" value={form.email}
        onChange={(v) => setForm({ ...form, email: v })} error={errors.email as string} placeholder="your@email.com" />

      <LabeledInput id="reserve-phone" label="Phone Number" required type="tel" value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone as string} placeholder="+971 50 000 0000" />

      <div>
        <p style={fieldLabel}>Dietary needs — select all that apply</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {DIETARY.map(d => (
            <button key={d} onClick={() => toggleDietary(d)} style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-micro)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: form.dietary.includes(d) ? 'var(--clr-amber)' : 'transparent',
              color: form.dietary.includes(d) ? 'var(--clr-void)' : 'rgba(245,239,224,0.5)',
              border: `1px solid ${form.dietary.includes(d) ? 'var(--clr-amber)' : 'rgba(245,239,224,0.12)'}`,
            }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={fieldLabel}>Any occasion? (optional)</p>
        <select
          value={form.occasion}
          onChange={(e) => setForm({ ...form, occasion: e.target.value })}
          style={{ ...inputBase, appearance: 'none', cursor: 'pointer' }}
          aria-label="Special occasion"
        >
          {OCCASIONS.map(o => <option key={o} value={o} style={{ background: 'var(--clr-void)' }}>{o || 'None'}</option>)}
        </select>
      </div>

      <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={form.smsOpt}
          onChange={(e) => setForm({ ...form, smsOpt: e.target.checked })}
          style={{ marginTop: '2px', accentColor: 'var(--clr-red)', width: '14px', height: '14px' }}
        />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', color: 'rgba(245,239,224,0.62)', lineHeight: 1.5 }}>
          Text me about late-night events and specials — I&apos;m in.
        </span>
      </label>

      {/* Reservation terms — required */}
      <div>
        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            aria-required="true"
            aria-invalid={errors.agree ? true : undefined}
            style={{ marginTop: '2px', accentColor: 'var(--clr-red)', width: '14px', height: '14px' }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', color: 'rgba(245,239,224,0.72)', lineHeight: 1.5 }}>
            I agree to the reservation terms: tables are held 15 minutes past the booking time,
            parties of 7+ may require a deposit, and cancellations should be made at least 24 hours ahead.
            <span aria-hidden="true" style={{ color: 'var(--clr-red)', marginLeft: '4px' }}>*</span>
          </span>
        </label>
        {errors.agree && <p role="alert" style={{ ...errorText, marginLeft: '26px' }}>{errors.agree as unknown as string}</p>}
      </div>
    </div>
  );
}

function StepConfirm({ form, confirmNum, onClose }: {
  form: FormData; confirmNum: string; onClose: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        style={{
          width: '84px', height: '84px',
          borderRadius: '50%',
          background: 'rgba(232,52,26,0.15)',
          border: '2px solid var(--clr-red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}
        aria-hidden="true"
      >
        <Image
          src="/heytiger-logo.png"
          alt="Hey Tiger"
          width={120}
          height={48}
          unoptimized
          style={{ height: '40px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
        />
      </motion.div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px', color: 'var(--clr-cream)', marginBottom: '6px', letterSpacing: '-0.02em', lineHeight: 1 }}>
        You&apos;re in.
      </h3>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'rgba(245,239,224,0.62)', marginBottom: '4px', letterSpacing: '0.04em' }}>
        See you on the other side of that door.
      </p>

      <p lang="ja" style={{ fontFamily: 'var(--font-jp)', fontSize: 'var(--text-body)', letterSpacing: 'var(--tracking-wide)', color: 'var(--clr-amber)', marginBottom: '24px', opacity: 0.7 }}>
        ヘイ、タイガー
      </p>

      <div style={{
        background: 'rgba(232,52,26,0.08)',
        border: '1px solid rgba(232,52,26,0.3)',
        borderRadius: 0,
        padding: '20px',
        marginBottom: '20px',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.38em', color: 'rgba(245,239,224,0.45)', marginBottom: '8px' }}>YOUR RESERVATION</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '28px', color: 'var(--clr-amber)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          {confirmNum}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          {[
            ['Date',   form.date],
            ['Time',   form.time],
            ['Guests', String(form.guests)],
            ['Name',   form.name],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', color: 'rgba(245,239,224,0.62)', letterSpacing: '0.1em' }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', color: 'var(--clr-cream)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'rgba(245,239,224,0.55)', marginBottom: '28px', lineHeight: 1.65 }}>
        Confirmation is on its way to{' '}
        <strong style={{ color: 'var(--clr-amber)', fontWeight: 600 }}>{form.email}</strong>.
        <br />
        Plans change?{' '}
        <a href="mailto:hello@heytigerdubai.com" style={{ color: 'var(--clr-cream-70)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Drop us a line.
        </a>
      </p>

      <button onClick={onClose} style={{
        width: '100%',
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 800, letterSpacing: '0.26em',
        background: 'var(--clr-amber)', border: 'none',
        color: 'var(--clr-void)', padding: '16px', borderRadius: '999px', cursor: 'pointer',
        transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
        minHeight: '44px',
        boxShadow: '0 6px 20px rgba(201,162,39,0.38)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#0d0d0d'; e.currentTarget.style.color = '#faaf3f'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(250,175,63,0.5)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--clr-amber)'; e.currentTarget.style.color = 'var(--clr-void)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,162,39,0.38)'; }}
      >
        BACK TO THE TIGER →
      </button>
    </div>
  );
}

function LabeledInput({ label, type, value, onChange, error, placeholder, required, id }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string;
  required?: boolean; id?: string;
}) {
  // Derive a stable id from the label if none supplied — keeps htmlFor consistent
  const inputId = id ?? `field-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} style={fieldLabel}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'var(--clr-red)', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        style={{ ...inputBase, border: error ? '1.5px solid var(--clr-red)' : inputBase.border }}
      />
      {error && <p id={errorId} role="alert" style={errorText}>{error}</p>}
    </div>
  );
}

/* ── Shared styles — cast to avoid cross-package csstype conflicts ── */
const stepTitle  = { fontFamily:'var(--font-body)', fontSize:'22px', letterSpacing:'0.06em', color:'var(--clr-cream)', marginBottom:'6px' } as React.CSSProperties;
const stepSub    = { fontFamily:'var(--font-body)', fontSize:'12px', color:'rgba(245,239,224,0.62)', marginBottom:'20px', lineHeight:1.5 } as React.CSSProperties;
const inputBase  = { width:'100%', padding:'12px 16px', background:'rgba(245,239,224,0.04)', border:'1px solid rgba(250,175,63,0.2)', borderRadius:'6px', color:'var(--clr-cream)', fontFamily:'var(--font-body)', fontSize:'13px', transition:'border-color 0.2s, box-shadow 0.2s', colorScheme:'dark' } as React.CSSProperties;
const fieldLabel = { fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.2em', color:'rgba(245,239,224,0.62)', marginBottom:'8px', textTransform:'uppercase' as const } as React.CSSProperties;
const errorText  = { fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--clr-red)', marginTop:'4px' } as React.CSSProperties;
const guestBtn   = { width:'44px', height:'44px', borderRadius:'50%', border:'1.5px solid rgba(250,175,63,0.3)', background:'transparent', color:'var(--clr-amber)', fontSize:'22px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-body)', transition:'border-color 0.2s, background 0.2s' } as React.CSSProperties;
const rangeLabel = { fontFamily:'var(--font-body)', fontSize:'10px', color:'rgba(245,239,224,0.62)', letterSpacing:'0.1em' } as React.CSSProperties;
