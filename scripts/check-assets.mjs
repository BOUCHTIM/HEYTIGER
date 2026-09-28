#!/usr/bin/env node
/**
 * Asset integrity check.
 *
 * Catches the four ways a new design drop breaks the site:
 *   1. Referenced file does not exist   -> 404 everywhere
 *   2. Case mismatch (HERO.png vs hero.png) -> works on macOS, 404 on Vercel (Linux)
 *   3. File exists but is excluded by .vercelignore -> works in dev, 404 in production
 *   4. Junk / oversized / non-web files shipped by accident
 *
 * Usage:
 *   node scripts/check-assets.mjs            # errors fail the build
 *   node scripts/check-assets.mjs --warn-only
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const SRC = join(ROOT, 'src');

const WARN_ONLY = process.argv.includes('--warn-only');

const ASSET_EXT = /\.(png|jpe?g|webp|avif|gif|svg|mp4|webm|mov|wav|mp3|ogg|pdf|woff2?|otf|ttf|json|glb|gltf|hdr|exr)$/i;
const WEB_SAFE_IMAGE = /\.(webp|avif|jpe?g|png|svg)$/i;
const JUNK = /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini|\._.*)$/;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB served to a browser is already a lot

const errors = [];
const warnings = [];

/* ------------------------------------------------------------------ *
 * 1. Walk source for asset references                                 *
 * ------------------------------------------------------------------ */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const sourceFiles = walk(SRC).filter((f) => /\.(tsx?|jsx?|css|mjs)$/.test(f));

// "/images/foo.png"  '/fonts/x.woff2'  url(/cursors/y.svg)
const REF_RE = /["'(](\/[A-Za-z0-9_\-./@% ]+?\.[A-Za-z0-9]{2,5})["')]/g;

/** @type {Map<string, string[]>} path -> files that reference it */
const refs = new Map();

for (const file of sourceFiles) {
  const text = readFileSync(file, 'utf8');
  for (const [, ref] of text.matchAll(REF_RE)) {
    if (!ASSET_EXT.test(ref)) continue;
    if (ref.startsWith('//')) continue; // protocol-relative URL
    const list = refs.get(ref) ?? [];
    list.push(relative(ROOT, file));
    refs.set(ref, list);
  }
}

/* ------------------------------------------------------------------ *
 * 2. Case-exact resolution (macOS lies, Vercel does not)              *
 * ------------------------------------------------------------------ */

const dirCache = new Map();
function entriesOf(dir) {
  if (!dirCache.has(dir)) {
    try {
      dirCache.set(dir, readdirSync(dir));
    } catch {
      dirCache.set(dir, null);
    }
  }
  return dirCache.get(dir);
}

/** Returns 'ok' | 'missing' | the case-correct path if only case differs. */
function resolveExact(relPath) {
  const segments = decodeURIComponent(relPath).split('/').filter(Boolean);
  let current = PUBLIC;
  const rebuilt = [];
  for (const segment of segments) {
    const entries = entriesOf(current);
    if (!entries) return 'missing';
    if (entries.includes(segment)) {
      rebuilt.push(segment);
    } else {
      const ci = entries.find((e) => e.toLowerCase() === segment.toLowerCase());
      if (!ci) return 'missing';
      rebuilt.push(ci);
    }
    current = join(current, rebuilt[rebuilt.length - 1]);
  }
  const actual = '/' + rebuilt.join('/');
  return actual === decodeURIComponent(relPath) ? 'ok' : actual;
}

/* ------------------------------------------------------------------ *
 * 3. .vercelignore parity — the "works in dev, 404 in prod" trap      *
 * ------------------------------------------------------------------ */

const ignorePatterns = existsSync(join(ROOT, '.vercelignore'))
  ? readFileSync(join(ROOT, '.vercelignore'), 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#') && l.startsWith('public/'))
      .map((l) => l.replace(/\/+$/, ''))
  : [];

function isExcludedFromDeploy(relPath) {
  const asRepoPath = 'public' + relPath;
  return ignorePatterns.find(
    (p) => asRepoPath === p || asRepoPath.startsWith(p + '/')
  );
}

/* ------------------------------------------------------------------ *
 * 4. Validate every reference                                         *
 * ------------------------------------------------------------------ */

for (const [ref, usedIn] of [...refs].sort()) {
  const where = usedIn.join(', ');
  const result = resolveExact(ref);

  if (result === 'missing') {
    errors.push(`missing file      ${ref}\n     referenced by ${where}`);
    continue;
  }
  if (result !== 'ok') {
    errors.push(
      `case mismatch     ${ref}  ->  on disk it is ${result}\n     referenced by ${where}\n     (macOS resolves this, Vercel's Linux filesystem will 404)`
    );
    continue;
  }
  const excluded = isExcludedFromDeploy(ref);
  if (excluded) {
    errors.push(
      `not deployed      ${ref}\n     referenced by ${where}\n     .vercelignore excludes "${excluded}" — file works locally, 404s in production`
    );
  }
}

/* ------------------------------------------------------------------ *
 * 5. Hygiene scan of public/ (warnings only)                          *
 * ------------------------------------------------------------------ */

if (existsSync(PUBLIC)) {
  for (const file of walk(PUBLIC)) {
    const rel = '/' + relative(PUBLIC, file).split(sep).join('/');
    if (JUNK.test(rel)) {
      warnings.push(`junk file         public${rel}  (delete it — it gets deployed)`);
      continue;
    }
    if (isExcludedFromDeploy(rel)) continue; // not shipped, size/format irrelevant

    const base = rel.split('/').pop();
    if (/[\s#?%&]/.test(base)) {
      warnings.push(`unsafe URL name   public${rel}  (rename to kebab-case — spaces and #?%& break URLs)`);
    }

    if (/\.(png|jpe?g|gif|tiff?|bmp|psd)$/i.test(base)) {
      const { size } = statSync(file);
      if (size > MAX_IMAGE_BYTES) {
        warnings.push(
          `heavy image       public${rel}  ${(size / 1024 / 1024).toFixed(1)} MB  (run: npm run assets:optimize)`
        );
      }
    }
    if (!WEB_SAFE_IMAGE.test(base) && /\.(tiff?|bmp|psd|ai|eps|heic)$/i.test(base)) {
      warnings.push(`browser cannot render  public${rel}  (convert: npm run assets:optimize)`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 6. Report                                                           *
 * ------------------------------------------------------------------ */

const checked = refs.size;

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} warning(s)\n`);
  for (const w of warnings) console.log('  ' + w);
}

if (errors.length) {
  console.log(`\n✖  ${errors.length} error(s)\n`);
  for (const e of errors) console.log('  ' + e + '\n');
  console.log(`Checked ${checked} asset reference(s) across ${sourceFiles.length} source files.\n`);
  if (!WARN_ONLY) process.exit(1);
} else {
  console.log(`\n✓  ${checked} asset reference(s) resolve, case-exact, and deploy.\n`);
}
