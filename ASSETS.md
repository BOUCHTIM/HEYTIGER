# Asset intake

How a design drop gets from the designer into the site without breaking production.

## The four bugs this process prevents

| Bug | Why it bites | Guard |
|---|---|---|
| Wrong path / typo | 404, broken image | `npm run assets:check` |
| `HERO.png` vs `hero.png` | macOS is case-insensitive, Vercel's Linux filesystem is not — works locally, 404s live | `assets:check` resolves case-exact |
| File excluded by `.vercelignore` | Ships in dev, missing in production | `assets:check` compares against `.vercelignore` |
| 10 MB PNG straight from Figma | Slow LCP, blown bandwidth | `npm run assets:optimize` |

## Receiving a drop

1. Put the raw folder anywhere **outside `public/`** — e.g. `HEYTIGER NEW ASSETS/`.
   Those intake folder names are already in `.gitignore`, so raw originals never
   get committed.

2. Convert into the site:

   ```bash
   npm run assets:optimize -- --in "HEYTIGER NEW ASSETS" --section venue
   ```

   This writes kebab-cased `.webp` files into `public/images/venue/`, capped at
   2400px wide, and drops `_venue.generated.txt` containing paste-ready JSX with
   the **exact intrinsic width/height** for every image.

   Flags: `--width 2400` `--quality 82` `--dry` (preview, writes nothing).

3. Paste the generated `<Image …>` lines into the component. Always keep the
   generated `width`/`height` — that is what stops layout shift.

4. Verify:

   ```bash
   npm run assets:check
   ```

   Errors fail `npm run build` too (wired via `prebuild`), so a bad path cannot
   reach production.

## Rules for `public/`

- **Lowercase kebab-case only**: `venue-terrace-night.webp`, never
  `Venue Terrace NIGHT.PNG`.
- **`.webp` for photography**, `.svg` for logos and icons. No TIFF/PSD/HEIC —
  browsers cannot render them.
- **Under 2 MB per image.** Over that, re-run the optimizer with a lower
  `--width`.
- **One folder per section**: `public/images/<section>/`.
- Never commit `.DS_Store` (globally gitignored; `npm run assets:clean` sweeps).

## `.vercelignore` — read before adding to `public/images/brand/`

These directories are deliberately excluded from deployment because they are
large reference material, not site assets:

```
public/textures
public/images/brand/{art-direction,deck,greenery,interiors,materials,moodboard,signage}
public/images/brand-boards
public/menu/reference
```

A file placed in one of those and then referenced from a component **renders
locally and 404s in production.** If a brand image is genuinely needed on the
site, run it through `assets:optimize --section <name>` so a light copy lands in
a deployed folder — do not un-ignore the whole directory.
