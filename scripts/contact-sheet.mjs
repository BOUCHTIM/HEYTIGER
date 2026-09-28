import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2], out = process.argv[3];
const files = readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f)).sort();
const COLS = 5, CELL = 300, LBL = 28, PER = 30;
for (let s = 0; s * PER < files.length; s++) {
  const chunk = files.slice(s * PER, (s + 1) * PER);
  const rows = Math.ceil(chunk.length / COLS);
  const W = COLS * CELL, H = rows * (CELL + LBL);
  const comps = [];
  for (let i = 0; i < chunk.length; i++) {
    const f = chunk[i]; const x = (i % COLS) * CELL, y = Math.floor(i / COLS) * (CELL + LBL);
    const meta = await sharp(join(dir, f)).metadata();
    const buf = await sharp(join(dir, f)).resize(CELL - 8, CELL - 8, { fit: 'inside' }).png().toBuffer();
    const m = await sharp(buf).metadata();
    comps.push({ input: buf, left: x + 4 + Math.floor((CELL - 8 - m.width) / 2), top: y + 4 + Math.floor((CELL - 8 - m.height) / 2) });
    const label = `${s * PER + i + 1}. ${f.slice(0, 6)} ${meta.width}x${meta.height}`;
    const svg = Buffer.from(`<svg width="${CELL}" height="${LBL}"><rect width="100%" height="100%" fill="#222"/><text x="6" y="19" font-family="Helvetica, Arial" font-size="15" fill="#fff">${label}</text></svg>`);
    comps.push({ input: svg, left: x, top: y + CELL });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#888' } }).composite(comps).jpeg({ quality: 80 }).toFile(`${out}-${s + 1}.jpg`);
  console.log(`${out}-${s + 1}.jpg`, chunk.length);
}
