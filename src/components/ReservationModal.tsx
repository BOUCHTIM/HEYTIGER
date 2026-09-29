'use client';

import { useEffect, useMemo, useRef, useState, type InputHTMLAttributes } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Arrow } from '@/components/redesign/primitives';
import { restaurantInfo } from '@/data/restaurant';
import type {
  AvailabilityResult, BookingConfig, BookingErrorBody, ReservationRequest, ReservationResult, Slot,
} from '@/lib/booking/types';
import { validateGuest, type FieldErrors } from '@/lib/booking/validation';

/* Reservation form. Talks only to /api/booking/* — the server decides whether that is SevenRooms (live),
   the mock (dev / previews) or offline (production without credentials). Steps: date → guests → time → details. */

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS: Array<{ n: Step; label: string; jp: string }> = [
  { n: 1, label: 'Date', jp: '日付' },
  { n: 2, label: 'Guests', jp: '人数' },
  { n: 3, label: 'Time', jp: '時間' },
  { n: 4, label: 'Details', jp: '詳細' },
];

const DIETARY = ['Vegetarian', 'Vegan', 'Gluten-free', 'Nut allergy', 'Shellfish allergy', 'Halal'];
const OCCASIONS = ['Birthday', 'Anniversary', 'Date night', 'Business dinner', 'Team outing', 'Just because'];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const DEFAULT_CONFIG: BookingConfig = {
  mode: 'mock', fallbackUrl: null, minPartySize: 1, maxPartySize: 12, largePartyThreshold: 8, bookingWindowDays: 60,
};

type Form = Omit<ReservationRequest, 'partySize'> & { partySize: number };

const emptyForm: Form = {
  date: '', time: '', slotId: '', partySize: 2,
  firstName: '', lastName: '', email: '', phone: '',
  dietary: [], occasion: '', notes: '', marketingOptIn: false, agreedToPolicy: false,
};

/* ── Date helpers: ISO strings treated as UTC calendar days, so no time-zone drift ── */
const venueToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date());
const parseISO = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => { const d = parseISO(iso); d.setUTCDate(d.getUTCDate() + n); return toISO(d); };
const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...o, timeZone: 'UTC' }).format(parseISO(iso));
const shortDate = (iso: string) => fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' });

export default function ReservationModal({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const [config, setConfig] = useState<BookingConfig>(DEFAULT_CONFIG);
  const [step, setStep] = useState<Step>(1);
  const [maxStep, setMaxStep] = useState<Step>(1);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReservationResult | null>(null);
  const [avail, setAvail] = useState<{ key: string; slots: Slot[] } | null>(null);
  const [availError, setAvailError] = useState<{ key: string; message: string } | null>(null);

  const [today] = useState(venueToday);
  const lastDay = addDays(today, config.bookingWindowDays);
  const availKey = `${form.date}|${form.partySize}`;

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/booking/config', { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then((c: BookingConfig | null) => c && setConfig(c))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  // Availability for the chosen date + party, fetched when the guest reaches the time step.
  useEffect(() => {
    if (step !== 3 || !form.date || avail?.key === availKey || availError?.key === availKey) return;
    const ctrl = new AbortController();
    fetch(`/api/booking/availability?date=${form.date}&party=${form.partySize}`, { signal: ctrl.signal })
      .then(async r => {
        if (!r.ok) throw new Error(((await r.json().catch(() => null)) as BookingErrorBody | null)?.error.message ?? 'Couldn’t load times.');
        return r.json() as Promise<AvailabilityResult>;
      })
      .then(a => setAvail({ key: availKey, slots: a.slots }))
      .catch(e => { if (!ctrl.signal.aborted) setAvailError({ key: availKey, message: e instanceof Error ? e.message : 'Couldn’t load times.' }); });
    return () => ctrl.abort();
  }, [step, form.date, form.partySize, availKey, avail?.key, availError?.key]);

  const update = (patch: Partial<Form>) => {
    setForm(f => {
      const next = { ...f, ...patch };
      // A new date or party size can invalidate the chosen slot.
      if ((patch.date && patch.date !== f.date) || (patch.partySize && patch.partySize !== f.partySize)) {
        next.time = ''; next.slotId = '';
        setMaxStep(m => (m > 3 ? 3 : m));
      }
      return next;
    });
    setErrors(e => { const n = { ...e }; for (const k of Object.keys(patch)) delete n[k as keyof FieldErrors]; return n; });
    setBanner('');
  };

  const go = (s: Step) => { setStep(s); setMaxStep(m => (s > m ? s : m)); setBanner(''); };

  const canAdvance =
    step === 1 ? !!form.date :
    step === 2 ? form.partySize >= config.minPartySize :
    step === 3 ? !!form.slotId : true;

  const submit = async () => {
    const errs = validateGuest(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setBanner('');
    try {
      const r = await fetch('/api/booking/reservations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setResult(await r.json());
        setStep(5);
        return;
      }
      const body = (await r.json().catch(() => null)) as BookingErrorBody | null;
      const err = body?.error;
      if (err?.code === 'slot_unavailable') {
        setAvail(null);
        update({ time: '', slotId: '' });
        setStep(3);
        setBanner(err.message);
      } else {
        if (err?.fields) setErrors(err.fields);
        setBanner(err?.message ?? 'Something went wrong. Try again.');
      }
    } catch {
      setBanner('No connection. Check your signal and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!canAdvance) return;
    if (step === 4) void submit();
    else go((step + 1) as Step);
  };

  /* ── A11y plumbing: focus trap, ESC, body-scroll lock, return focus ── */
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus], button')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href]',
      )).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const [first, last] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [onClose]);

  const summary = [
    form.date && shortDate(form.date),
    step > 1 && `${form.partySize} ${form.partySize === 1 ? 'guest' : 'guests'}`,
    form.time,
  ].filter(Boolean).join(' · ');

  const slide = reduce ? {} : { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -16 } };

  return (
    <motion.div className="rd-rsv" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        ref={panelRef}
        className="rd-rsv__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsv-title"
        onClick={e => e.stopPropagation()}
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        <header className="rd-rsv__head">
          <div>
            <p className="rd-rsv__jp rd-jp" lang="ja">席を予約する</p>
            <h2 id="rsv-title" className="rd-rsv__title rd-groovy">{step === 5 ? 'You’re in.' : 'Save a seat.'}</h2>
          </div>
          <button type="button" className="rd-rsv__close" onClick={onClose} aria-label="Close reservation">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </header>

        {config.mode === 'offline' ? (
          <Offline config={config} />
        ) : (
          <>
            {step < 5 && (
              <nav className="rd-rsv__steps" aria-label="Booking steps">
                {STEPS.map(s => (
                  <button
                    key={s.n}
                    type="button"
                    className="rd-rsv__step"
                    aria-current={s.n === step ? 'step' : undefined}
                    data-done={s.n < step || undefined}
                    disabled={s.n > maxStep}
                    onClick={() => go(s.n)}
                  >
                    <span className="rd-rsv__step-n">0{s.n}</span>
                    <span className="rd-rsv__step-l">{s.label}</span>
                  </button>
                ))}
              </nav>
            )}

            {config.mode === 'mock' && step < 5 && (
              <p className="rd-rsv__test" role="note">Test mode — bookings are not sent to the venue.</p>
            )}

            <div className="rd-rsv__body">
              {banner && <p className="rd-rsv__banner" role="alert">{banner}</p>}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} {...slide} transition={{ duration: 0.2 }}>
                  {step === 1 && <StepDate value={form.date} today={today} lastDay={lastDay} onPick={d => update({ date: d })} />}
                  {step === 2 && <StepGuests value={form.partySize} config={config} onPick={n => update({ partySize: n })} />}
                  {step === 3 && (
                    <StepTime
                      date={form.date}
                      slots={avail?.key === availKey ? avail.slots : null}
                      error={availError?.key === availKey ? availError.message : ''}
                      selected={form.slotId}
                      fallbackUrl={config.fallbackUrl}
                      onPick={s => update({ time: s.time, slotId: s.slotId })}
                      onChangeDate={() => go(1)}
                    />
                  )}
                  {step === 4 && <StepDetails form={form} errors={errors} config={config} update={update} />}
                  {step === 5 && result && <Confirmed form={form} result={result} mode={config.mode} onClose={onClose} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {step < 5 && (
              <footer className="rd-rsv__foot">
                <p className="rd-rsv__summary" aria-live="polite">{summary || 'Pick a night to start.'}</p>
                <div className="rd-rsv__actions">
                  {step > 1 && (
                    <button type="button" className="rd-btn rd-btn--outline-ivory rd-rsv__back" onClick={() => go((step - 1) as Step)}>
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="rd-btn rd-btn--red rd-rsv__next"
                    onClick={next}
                    disabled={!canAdvance || submitting}
                    aria-busy={submitting || undefined}
                  >
                    <span>{step === 4 ? (submitting ? 'Booking…' : 'Confirm booking') : 'Continue'}</span>
                    <Arrow />
                  </button>
                </div>
              </footer>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Step 1: month calendar ─────────────────────────────────────── */
function StepDate({ value, today, lastDay, onPick }: { value: string; today: string; lastDay: string; onPick: (d: string) => void }) {
  const [month, setMonth] = useState((value || today).slice(0, 7));
  const first = `${month}-01`;
  const offset = (parseISO(first).getUTCDay() + 6) % 7;   // Monday-first grid
  const daysInMonth = new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 0)).getUTCDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => addDays(first, i))];
  const shift = (n: number) => { const d = parseISO(first); d.setUTCMonth(d.getUTCMonth() + n); setMonth(toISO(d).slice(0, 7)); };

  return (
    <div>
      <h3 className="rd-rsv__h">Pick your night.</h3>
      <p className="rd-rsv__sub">Tuesday to Sunday. Late seatings until 1AM.</p>
      <div className="rd-rsv__cal">
        <div className="rd-rsv__cal-head">
          <button type="button" className="rd-rsv__cal-nav" onClick={() => shift(-1)} disabled={month <= today.slice(0, 7)} aria-label="Previous month">‹</button>
          <p className="rd-rsv__cal-month" aria-live="polite">{fmt(first, { month: 'long', year: 'numeric' })}</p>
          <button type="button" className="rd-rsv__cal-nav" onClick={() => shift(1)} disabled={month >= lastDay.slice(0, 7)} aria-label="Next month">›</button>
        </div>
        <div className="rd-rsv__cal-grid" role="grid">
          {WEEKDAYS.map((d, i) => <span key={i} className="rd-rsv__cal-dow" aria-hidden="true">{d}</span>)}
          {cells.map((iso, i) => iso ? (
            <button
              key={iso}
              type="button"
              className="rd-rsv__day"
              aria-pressed={iso === value}
              aria-label={fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })}
              data-today={iso === today || undefined}
              data-autofocus={iso === (value || today) || undefined}
              disabled={iso < today || iso > lastDay}
              onClick={() => onPick(iso)}
            >
              {+iso.slice(8)}
            </button>
          ) : <span key={`pad-${i}`} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: party size ─────────────────────────────────────────── */
function StepGuests({ value, config, onPick }: { value: number; config: BookingConfig; onPick: (n: number) => void }) {
  const sizes = Array.from({ length: config.maxPartySize - config.minPartySize + 1 }, (_, i) => i + config.minPartySize);
  return (
    <div>
      <h3 className="rd-rsv__h">How many coming through?</h3>
      <p className="rd-rsv__sub">
        {value >= config.largePartyThreshold
          ? `Big crew. Groups of ${config.largePartyThreshold}+ may need a deposit — we’ll be in touch.`
          : value >= 4 ? 'A proper table. We’ll make room.' : 'Cosy. We know a booth.'}
      </p>
      <p className="rd-rsv__count rd-groovy" aria-hidden="true">{value}</p>
      <div className="rd-rsv__sizes" role="radiogroup" aria-label="Number of guests">
        {sizes.map(n => (
          <button key={n} type="button" role="radio" aria-checked={n === value} className="rd-rsv__chip rd-rsv__chip--size"
            data-autofocus={n === value || undefined} onClick={() => onPick(n)}>
            {n}
          </button>
        ))}
      </div>
      <p className="rd-rsv__fine">
        More than {config.maxPartySize}? Email <a href={`mailto:${restaurantInfo.reservationsEmail}`}>{restaurantInfo.reservationsEmail}</a>
      </p>
    </div>
  );
}

/* ── Step 3: live availability ──────────────────────────────────── */
function StepTime({ date, slots, error, selected, fallbackUrl, onPick, onChangeDate }: {
  date: string; slots: Slot[] | null; error: string; selected: string; fallbackUrl: string | null;
  onPick: (s: Slot) => void; onChangeDate: () => void;
}) {
  const groups = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots ?? []) { const k = s.area ?? ''; m.set(k, [...(m.get(k) ?? []), s]); }
    return [...m.entries()];
  }, [slots]);

  return (
    <div>
      <h3 className="rd-rsv__h">When should we expect you?</h3>
      <p className="rd-rsv__sub">{shortDate(date)} — times held for this party size.</p>
      {error ? (
        <div className="rd-rsv__empty" role="alert">
          <p>{error}</p>
          {fallbackUrl && <a className="rd-rsv__link" href={fallbackUrl} target="_blank" rel="noopener noreferrer">Book on SevenRooms instead</a>}
        </div>
      ) : !slots ? (
        <div className="rd-rsv__times" aria-busy="true" aria-label="Loading times">
          {Array.from({ length: 12 }, (_, i) => <span key={i} className="rd-rsv__skel" />)}
        </div>
      ) : slots.length === 0 ? (
        <div className="rd-rsv__empty">
          <p>Nothing open that night — we’re either closed or full.</p>
          <button type="button" className="rd-rsv__link" onClick={onChangeDate}>Try another date</button>
        </div>
      ) : (
        groups.map(([area, list]) => (
          <div key={area || 'all'} className="rd-rsv__group">
            {groups.length > 1 && <p className="rd-rsv__label">{area || 'Dining room'}</p>}
            <div className="rd-rsv__times" role="radiogroup" aria-label={area || 'Available times'}>
              {list.map(s => (
                <button key={s.slotId} type="button" role="radio" aria-checked={s.slotId === selected}
                  className="rd-rsv__chip" data-autofocus={s.slotId === selected || undefined} onClick={() => onPick(s)}>
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ── Step 4: guest details ──────────────────────────────────────── */
function StepDetails({ form, errors, config, update }: {
  form: Form; errors: FieldErrors; config: BookingConfig; update: (p: Partial<Form>) => void;
}) {
  const toggle = (d: string) => update({ dietary: form.dietary.includes(d) ? form.dietary.filter(x => x !== d) : [...form.dietary, d] });
  return (
    <div className="rd-rsv__fields">
      <h3 className="rd-rsv__h">So we know who to look for.</h3>
      <div className="rd-rsv__row">
        <Field id="rsv-first" label="First name" autoComplete="given-name" value={form.firstName} error={errors.firstName}
          onChange={v => update({ firstName: v })} autoFocus />
        <Field id="rsv-last" label="Last name" autoComplete="family-name" value={form.lastName} error={errors.lastName}
          onChange={v => update({ lastName: v })} />
      </div>
      <Field id="rsv-email" label="Email" type="email" autoComplete="email" inputMode="email" value={form.email}
        error={errors.email} onChange={v => update({ email: v })} placeholder="you@email.com" />
      <Field id="rsv-phone" label="Mobile" type="tel" autoComplete="tel" inputMode="tel" value={form.phone}
        error={errors.phone} onChange={v => update({ phone: v })} placeholder="+971 50 000 0000" />

      <fieldset className="rd-rsv__set">
        <legend className="rd-rsv__label">Dietary needs</legend>
        <div className="rd-rsv__tags">
          {DIETARY.map(d => (
            <button key={d} type="button" className="rd-rsv__chip rd-rsv__chip--tag" aria-pressed={form.dietary.includes(d)} onClick={() => toggle(d)}>{d}</button>
          ))}
        </div>
      </fieldset>

      <div className="rd-rsv__field">
        <label className="rd-rsv__label" htmlFor="rsv-occasion">Occasion</label>
        <select id="rsv-occasion" className="rd-rsv__input rd-rsv__select" value={form.occasion} onChange={e => update({ occasion: e.target.value })}>
          <option value="">None</option>
          {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="rd-rsv__field">
        <label className="rd-rsv__label" htmlFor="rsv-notes">Anything else?</label>
        <textarea id="rsv-notes" className="rd-rsv__input rd-rsv__textarea" rows={2} maxLength={500} value={form.notes}
          onChange={e => update({ notes: e.target.value })} placeholder="High chair, surprise cake, seat by the DJ…" />
      </div>

      <label className="rd-rsv__check">
        <input type="checkbox" checked={form.marketingOptIn} onChange={e => update({ marketingOptIn: e.target.checked })} />
        <span>Send me late-night events and specials.</span>
      </label>
      <div>
        <label className="rd-rsv__check">
          <input type="checkbox" checked={form.agreedToPolicy} onChange={e => update({ agreedToPolicy: e.target.checked })}
            aria-invalid={!!errors.agreedToPolicy || undefined} aria-describedby={errors.agreedToPolicy ? 'rsv-policy-err' : undefined} />
          <span>Tables are held for 15 minutes. Groups of {config.largePartyThreshold}+ may need a deposit.<b aria-hidden="true"> *</b></span>
        </label>
        {errors.agreedToPolicy && <p id="rsv-policy-err" className="rd-rsv__err rd-rsv__err--check" role="alert">{errors.agreedToPolicy}</p>}
      </div>
    </div>
  );
}

function Field({ id, label, error, onChange, ...input }: {
  id: string; label: string; error?: string; onChange: (v: string) => void; value: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'id'>) {
  return (
    <div className="rd-rsv__field">
      <label className="rd-rsv__label" htmlFor={id}>{label}<b aria-hidden="true"> *</b></label>
      <input id={id} className="rd-rsv__input" required aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-err` : undefined} onChange={e => onChange(e.target.value)} {...input} />
      {error && <p id={`${id}-err`} className="rd-rsv__err" role="alert">{error}</p>}
    </div>
  );
}

/* ── Step 5: the ticket ─────────────────────────────────────────── */
function Confirmed({ form, result, mode, onClose }: { form: Form; result: ReservationResult; mode: BookingConfig['mode']; onClose: () => void }) {
  return (
    <div className="rd-rsv__done">
      <p className="rd-rsv__sub">
        {result.status === 'pending' ? 'Request received — we’ll confirm shortly.' : 'See you on the other side of that door.'}
      </p>
      <div className="rd-rsv__ticket">
        <p className="rd-rsv__label">Reservation</p>
        <p className="rd-rsv__ref">{result.reference}</p>
        <dl className="rd-rsv__ticket-rows">
          <div><dt>Date</dt><dd>{fmt(result.date, { weekday: 'short', day: 'numeric', month: 'long' })}</dd></div>
          <div><dt>Time</dt><dd>{result.time}</dd></div>
          <div><dt>Guests</dt><dd>{result.partySize}</dd></div>
          <div><dt>Name</dt><dd>{form.firstName} {form.lastName}</dd></div>
        </dl>
        <p className="rd-rsv__jp rd-jp rd-rsv__ticket-jp" lang="ja">ヘイ、タイガー</p>
      </div>
      <p className="rd-rsv__fine">
        {mode === 'mock'
          ? 'Test booking — nothing was sent to the venue.'
          : <>Confirmation on its way to <b>{form.email}</b>. Plans change? <a href={`mailto:${restaurantInfo.reservationsEmail}`}>Drop us a line.</a></>}
      </p>
      <button type="button" className="rd-btn rd-btn--red rd-rsv__next" onClick={onClose} data-autofocus>
        <span>Done</span><Arrow />
      </button>
    </div>
  );
}

/* ── Production without SevenRooms credentials ──────────────────── */
function Offline({ config }: { config: BookingConfig }) {
  const phone = restaurantInfo.reservationsPhone ?? restaurantInfo.phone;
  return (
    <div className="rd-rsv__body rd-rsv__offline">
      <h3 className="rd-rsv__h">Book with us direct.</h3>
      <p className="rd-rsv__sub">Online booking is on its way. Until then, we’ll hold your table by phone or email.</p>
      <div className="rd-rsv__actions rd-rsv__actions--stack">
        {config.fallbackUrl && (
          <a className="rd-btn rd-btn--red" href={config.fallbackUrl} target="_blank" rel="noopener noreferrer"><span>Book on SevenRooms</span><Arrow /></a>
        )}
        {phone && (
          <a className="rd-btn rd-btn--outline-ivory" href={`tel:${phone.replace(/[^\d+]/g, '')}`}><span>Call {phone}</span><Arrow /></a>
        )}
        <a className="rd-btn rd-btn--outline-ivory" href={`mailto:${restaurantInfo.reservationsEmail}`}><span>Email us</span><Arrow /></a>
      </div>
    </div>
  );
}
