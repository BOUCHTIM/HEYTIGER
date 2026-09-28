// Make near-white/cream backgrounds transparent (used for line-art illustrations).
import sharp from 'sharp';
const [,, inFile, outFile] = process.argv;
const { data, info } = await sharp(inFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const light = min >= 215, flat = (max - min) <= 40;
  if (light && flat) data[i + 3] = 0;
  else if (min >= 190 && flat) data[i + 3] = Math.round(255 * (215 - min) / 25);
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(outFile);
console.log('ok', info.width, info.height);
