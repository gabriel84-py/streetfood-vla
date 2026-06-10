/**
 * Import images — télécharge les photos des plats depuis des URLs, les convertit
 * en WebP (même pipeline que les uploads admin) et les associe aux plats en base.
 *
 * Source des URLs : scripts/image-urls.json  (clé = name_fr exact, valeur = URL).
 * Les plats dont l'URL est vide sont ignorés.
 *
 * Idempotent : si un plat a déjà une image, son ancien fichier est supprimé
 * avant d'enregistrer le nouveau.
 *
 * Usage : node scripts/import-images.js   (ou npm run import-images)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const db = require('../src/db/database');
const { deleteUpload, UPLOAD_DIR } = require('../src/middleware/upload');

const URLS_FILE = path.join(__dirname, 'image-urls.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!fs.existsSync(URLS_FILE)) {
    console.error(`❌ Fichier introuvable : ${URLS_FILE}`);
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(URLS_FILE, 'utf8'));

  const findItem = db.prepare('SELECT id, image_path FROM menu_items WHERE name_fr = ?');
  const updateItem = db.prepare('UPDATE menu_items SET image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

  let ok = 0, skipped = 0, failed = 0;

  for (const [name, url] of Object.entries(map)) {
    if (name.startsWith('_') || !url || !url.trim()) { skipped++; continue; }

    const item = findItem.get(name);
    if (!item) {
      console.warn(`  ⚠ Plat introuvable en base : "${name}" — skip`);
      failed++;
      continue;
    }

    try {
      const buf = await download(url.trim());
      const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.webp`;
      const filepath = path.join(UPLOAD_DIR, filename);

      await sharp(buf)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(filepath);

      if (item.image_path) deleteUpload(item.image_path); // remplace l'ancienne
      updateItem.run(`/uploads/${filename}`, item.id);
      console.log(`  ✓ ${name} → /uploads/${filename}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${name} : ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✓ Import terminé : ${ok} image(s) importée(s), ${skipped} vide(s) ignorée(s), ${failed} échec(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
