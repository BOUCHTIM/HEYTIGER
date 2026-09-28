#!/usr/bin/env node
/**
 * Turn a raw design drop into web-ready assets.
 *
 * Reads every image under an intake folder, and for each one writes a
 * normalised, kebab-cased .webp into public/images/<section>/ plus a line of
 * ready-to-paste JSX with the real intrinsic width/height (so next/image never
 * causes layout shift).
 *
 * Usage:
 *   npm run assets:optimize -- --in "HEYTIGER NEW ASSETS" --section venue
 *   npm run assets:optimize -- --in ./drop --section venue --width 2400 --dry
 *
 * Originals are never modified or deleted.
 */

import { readdirSync, statSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    '\n✖ sharp is not installed.\n  Run:  npm i -D sharp\n'
  );
  process.exit(1);
}

/* ---------------------------- args ---------------------------- */

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const IN_DIR = arg('in');
const SECTION = arg('section');
const MAX_WIDTH = Number(arg('width', 2400));
const QUALITY = Number(arg('quality', 82));
const DRY = Boolean(arg('dry', false));

if (!IN_DIR || !SECTION) {
  console.error(
    '\nUsage: npm run assets:optimize -- --in <folder> --section <name> [--width 2400] [--quality 82] [--dry]\n'
  );
  process.exit(1);
}

const SOURCE = join(ROOT, IN_DIR);
const OUT = join(ROOT, 'public', 'images', SECTION);

if (!existsSync(SOURCE)) {
  console.error(`\n✖ Intake folder not found: ${SOURCE}\n`);
  process.exit(1);
}

/* ---------------------------- helpers ---------------------------- */

const RASTER = /\.(png|jpe?g|tiff?|webp|avif|heic|bmp)$/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (RASTER.test(entry.name)) out.push(full);
  }
  return out;
}

/** "P08 Venue Shot_FINAL v2.PNG" -> "p08-venue-shot-final-v2" */
function slugify(name) {
  return basename(name, extname(name))
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/* ---------------------------- run ---------------------------- */

const files = walk(SOURCE);
if (!files.length) {
  console.log(`\nNo images found in ${IN_DIR}\n`);
  process.exit(0);
}

if (!DRY) mkdirSync(OUT, { recursive: true });

const manifest = [];
let savedBytes = 0;

for (const file of files) {
  const slug = slugify(file);
  const outPath = join(OUT, `${slug}.webp`);
  const publicPath = `/images/${SECTION}/${slug}.webp`;

  const input = sharp(file, { failOn: 'none' }).rotate(); // honours EXIF orientation
  const meta = await input.metadata();
  const targetWidth = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

  if (DRY) {
    console.log(`would write  ${relative(ROOT, outPath)}  (${targetWidth}px wide)`);
    manifest.push({ src: publicPath, width: targetWidth, height: null });
    continue;
  }

  const info = await input
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outPath);

  const before = statSync(file).size;
  savedBytes += before - info.size;

  console.log(
    `${relative(ROOT, outPath).padEnd(52)} ${info.width}x${info.height}  ` +
      `${(before / 1024 / 1024).toFixed(1)}MB -> ${(info.size / 1024 / 1024).toFixed(2)}MB`
  );

  manifest.push({ src: publicPath, width: info.width, height: info.height });
}

if (DRY) {
  console.log(`\nDry run — ${files.length} file(s), nothing written.\n`);
  process.exit(0);
}

/* ---------------------------- emit snippet ---------------------------- */

const snippetPath = join(OUT, `_${SECTION}.generated.txt`);
const snippet = manifest
  .map(
    (m) =>
      `<Image src="${m.src}" width={${m.width}} height={${m.height}} alt="" />`
  )
  .join('\n');
writeFileSync(snippetPath, snippet + '\n');

console.log(
  `\n✓ ${manifest.length} image(s) -> public/images/${SECTION}/` +
    `\n  saved ${(savedBytes / 1024 / 1024).toFixed(1)} MB` +
    `\n  paste-ready JSX with exact dimensions: ${relative(ROOT, snippetPath)}` +
    `\n\nNext: npm run assets:check\n`
);
