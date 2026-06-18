/**
 * Generates the Hey Tiger "call to book" SFX as real 16-bit PCM WAV files.
 * No ffmpeg/sox — writes WAV bytes directly. Run: `node scripts/gen-audio.mjs`.
 * Output: public/audio/*.wav
 *
 * Tones are modelled on real telephony so the call reads as authentic:
 *  - dialtone : Japan continuous 400 Hz
 *  - ring     : ringback, 1s on / 2s off, 400 Hz with 16 Hz tremolo
 *  - key      : DTMF dual-tone (digit "5": 770 + 1336 Hz)
 *  - pickup   : receiver-lift click (filtered noise burst)
 *  - connect  : warm two-note "line open" chime
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(OUT, { recursive: true });

/* Build a mono Float32 buffer from a per-sample generator. */
const make = (seconds, fn) => {
  const n = Math.floor(RATE * seconds);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = fn(i / RATE, i, n) || 0;
  return buf;
};

const sine = (t, f) => Math.sin(2 * Math.PI * f * t);

/* Short raised-cosine fades kill click/pop at edges. */
const fade = (buf, ms = 6) => {
  const f = Math.min(Math.floor((ms / 1000) * RATE), Math.floor(buf.length / 2));
  for (let i = 0; i < f; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / f);
    buf[i] *= g;
    buf[buf.length - 1 - i] *= g;
  }
  return buf;
};

/* Float32 [-1,1] -> 16-bit PCM WAV Buffer. */
const toWav = (buf) => {
  const data = Buffer.alloc(buf.length * 2);
  for (let i = 0; i < buf.length; i++) {
    const s = Math.max(-1, Math.min(1, buf[i]));
    data.writeInt16LE((s < 0 ? s * 0x8000 : s * 0x7fff) | 0, i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);        // PCM
  header.writeUInt16LE(1, 22);        // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32);        // block align
  header.writeUInt16LE(16, 34);       // bits
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

const save = (name, buf) => {
  writeFileSync(join(OUT, name), toWav(buf));
  console.log('wrote', name, `(${(buf.length / RATE).toFixed(2)}s)`);
};

/* ── dialtone — steady 400 Hz, loopable ── */
save('dialtone.wav', fade(make(2.0, (t) => 0.22 * sine(t, 400)), 8));

/* ── ring — ringback: 1s tone / 2s silence, 16 Hz tremolo ── */
save('ring.wav', make(3.0, (t) => {
  if (t > 1.0) return 0;                       // 2s silent gap
  const env = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(t, 1) / 0.04 % Math.PI); // soft attack
  const trem = 0.85 + 0.15 * sine(t, 16);      // characteristic warble
  const edge = t < 0.02 ? t / 0.02 : t > 0.98 ? (1 - t) / 0.02 : 1;
  return 0.24 * sine(t, 400) * trem * edge * (env ? 1 : 1);
}));

/* ── key — DTMF "5" (770 + 1336 Hz), 130ms ── */
save('key.wav', fade(make(0.13, (t) => 0.16 * (sine(t, 770) + sine(t, 1336))), 8));

/* ── pickup — receiver-lift click: filtered noise + low thunk ── */
save('pickup.wav', fade(make(0.14, (t) => {
  const noise = (Math.random() * 2 - 1) * Math.exp(-t * 55);
  const thunk = sine(t, 140) * Math.exp(-t * 30);
  return 0.5 * noise + 0.3 * thunk;
}), 4));

/* ── connect — warm two-note "line open" (587 -> 880 Hz) ── */
save('connect.wav', fade(make(0.55, (t) => {
  const a = sine(t, 587) * Math.exp(-t * 4) * (t < 0.26 ? 1 : 0);
  const b = sine(t, 880) * Math.exp(-(t - 0.26) * 4) * (t >= 0.26 ? 1 : 0);
  return 0.26 * (a + b);
}), 8));

console.log('done ->', OUT);
