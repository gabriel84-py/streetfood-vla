/**
 * Refresh menu — remplace TOUTE la carte (catégories + plats) par les données
 * de scripts/menu-data.js, sans toucher au reste (admin, settings, avis, etc.).
 *
 * Contrairement à seed.js (idempotent, ne réécrit pas), ce script écrase
 * délibérément menu_categories + menu_items. À lancer après une mise à jour
 * de la carte.
 *
 * Usage : node scripts/refresh-menu.js   (ou npm run refresh-menu)
 */

require('dotenv').config();
const db = require('../src/db/database');
const { categories, items } = require('./menu-data');

const insertCat = db.prepare(`
  INSERT INTO menu_categories (slug, name_fr, name_en, name_it, description_fr, description_en, description_it, display_order, is_visible)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const insertItem = db.prepare(`
  INSERT INTO menu_items
    (category_id, name_fr, name_en, name_it, description_fr, description_en, description_it, price, is_veggie, is_featured, is_visible, display_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
`);

const tx = db.transaction(() => {
  // menu_items a une FK ON DELETE CASCADE vers menu_categories : on vide les deux.
  db.prepare('DELETE FROM menu_items').run();
  db.prepare('DELETE FROM menu_categories').run();

  const catBySlug = {};
  categories.forEach((c) => {
    const r = insertCat.run(
      c.slug, c.name_fr, c.name_en, c.name_it,
      c.description_fr, c.description_en, c.description_it,
      c.display_order
    );
    catBySlug[c.slug] = r.lastInsertRowid;
  });

  items.forEach((i) => {
    const catId = catBySlug[i.cat];
    if (!catId) {
      console.warn(`  ⚠ Catégorie "${i.cat}" introuvable, skip "${i.name_fr}"`);
      return;
    }
    insertItem.run(
      catId,
      i.name_fr, i.name_en, i.name_it,
      i.desc_fr, i.desc_en, i.desc_it,
      i.price,
      i.veggie ? 1 : 0,
      i.featured ? 1 : 0,
      i.order || 0
    );
  });
});

tx();

console.log(`✓ Carte rafraîchie : ${categories.length} catégories, ${items.length} plats.`);
process.exit(0);
