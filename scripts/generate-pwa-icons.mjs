// Generates the PWA app icons from the brand mark.
// Run: npm i --no-save sharp && node scripts/generate-pwa-icons.mjs
//   (outputs to public/icons/). sharp isn't a project dependency: the icons are
//   committed, so builds don't need it, only regenerating them does.
//
// The mark is trimmed of its transparent margin, then centred on the dark app
// background (#08080d, the dark --ex-bg) at a size chosen per icon:
// - "any" icons: 72% of the square
// - maskable: 66%, so the rotated mark stays inside the 80% safe circle that
//   Android may crop adaptive icons to (farthest mark pixel: ~194 of 205px)
// - apple-touch-icon: 68% (iOS rounds the corners itself)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "design/brand/examible-main-icon.png";
const OUT = "public/icons";
const BACKGROUND = "#08080d";

const ICONS = [
  { file: "pwa-192x192.png", size: 192, scale: 0.72 },
  { file: "pwa-512x512.png", size: 512, scale: 0.72 },
  { file: "maskable-icon-512x512.png", size: 512, scale: 0.66 },
  { file: "apple-touch-icon-180x180.png", size: 180, scale: 0.68 },
];

await mkdir(OUT, { recursive: true });
const mark = await sharp(SOURCE).trim().toBuffer();

for (const { file, size, scale } of ICONS) {
  const box = Math.round(size * scale);
  const resized = await sharp(mark)
    .resize(box, box, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: resized, gravity: "center" }])
    .flatten({ background: BACKGROUND }) // fully opaque: no transparency anywhere
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${file}`);
  console.log(`${OUT}/${file}  ${size}x${size}  mark ${Math.round(scale * 100)}%`);
}
