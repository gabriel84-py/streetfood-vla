/**
 * Seed script — Initialise la base avec les données du dossier
 * Idempotent : peut être ré-exécuté sans casser les données utilisateur
 *
 * Usage : npm run seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/db/database');
const { setSetting, getSetting } = require('../src/utils/settings');
const { categories: MENU_CATEGORIES, items: MENU_ITEMS } = require('./menu-data');

// ─── 1. ADMIN ────────────────────────────────────────────────────────────────
async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme';

  const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);
  if (existing) {
    console.log(`✓ Admin "${username}" déjà existant — skip`);
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`✓ Admin "${username}" créé`);
  if (password === 'changeme' || password === 'change_this_password_immediately') {
    console.log(`  ⚠  Mot de passe par défaut détecté. Changez-le sur /admin/account dès la première connexion.`);
  }
}

// ─── 2. SETTINGS ─────────────────────────────────────────────────────────────
function seedSettings() {
  // On n'écrase pas les valeurs existantes (sauf premier seed)
  const isFirstSeed = !getSetting('restaurant_name');

  if (!isFirstSeed) {
    console.log('✓ Settings déjà initialisés — skip (pour réinitialiser, supprimez data/streetfood.db)');
    return;
  }

  const settings = {
    restaurant_name: 'Street Food Vla',
    phone: '+33 9 51 74 13 57',
    email: 'streetfood30400@gmail.com',
    address_street: '17 Avenue Gabriel Péri',
    address_postal: '30400',
    address_city: 'Villeneuve-lès-Avignon',
    geo_lat: '43.9615785',
    geo_lng: '4.7995146',
    social_instagram: 'https://www.instagram.com/streetfood_vla/',
    social_facebook: 'https://www.facebook.com/streetfoodvla/',
    social_ubereats: 'https://www.ubereats.com/fr/store/street-food/RCnA9qrbV2q8yLIzRP9vyg',
    social_google_maps: 'https://www.google.com/maps/place/?q=place_id:ChIJ_____STREET_FOOD_VLA', // À mettre à jour avec le vrai place_id
    rating_value: '4.8',
    rating_count: '292',
    announcement_active: '0',
    legal_siret: '',
    legal_host: '',
  };

  for (const [key, value] of Object.entries(settings)) {
    setSetting(key, value);
  }

  // Champs traduits
  setSetting('hero_title', {
    fr: 'Smash burgers, tacos & spécialité provençale',
    en: 'Smash burgers, tacos & Provençal specialty',
    it: 'Smash burger, tacos e specialità provenzale',
  });

  setSetting('hero_subtitle', {
    fr: 'Tout est fait maison, viande Limousine française, frites de panisses. À deux pas du Pont d\'Avignon.',
    en: 'Everything is homemade, French Limousine beef, panisse fries. Steps away from the Pont d\'Avignon.',
    it: 'Tutto è fatto in casa, manzo Limousine francese, panisse fritte. A due passi dal Pont d\'Avignon.',
  });

  setSetting('about_title', {
    fr: 'Le goût du vrai fait maison',
    en: 'Real homemade taste',
    it: 'Il gusto del vero fatto in casa',
  });

  setSetting('about_text', {
    fr: 'Chez Street Food, on aime les bonnes choses. Notre viande est française race Limousine, nos frites sont coupées et dorées maison, nos sauces sont de recette secrète, et même la mousse au chocolat est faite par nos soins.\n\nAvec une touche provençale qu\'on adore — les frites de panisses, à base de farine de pois chiches — on revisite le smash burger avec gourmandise et fraîcheur. Et chaque mois, un nouveau "Daily Street Smash" sort de la cuisine.',
    en: 'At Street Food, we love good food. Our beef is French Limousine breed, our fries are cut and fried in-house, our sauces follow secret recipes, and even the chocolate mousse is made by us.\n\nWith a Provençal touch we adore — panisse fries, made from chickpea flour — we reinvent the smash burger with gourmet flair and freshness. And each month, a new "Daily Street Smash" comes out of the kitchen.',
    it: 'Da Street Food, amiamo il buon cibo. La nostra carne è di razza Limousine francese, le nostre patatine sono tagliate e fritte in casa, le nostre salse seguono ricette segrete, e persino la mousse al cioccolato è fatta da noi.\n\nCon un tocco provenzale che adoriamo — le panisse fritte, a base di farina di ceci — reinventiamo lo smash burger con gusto e freschezza. E ogni mese, un nuovo "Daily Street Smash" esce dalla cucina.',
  });

  setSetting('announcement_text', { fr: '', en: '', it: '' });

  console.log('✓ Settings initialisés');
}

// ─── 3. HORAIRES ─────────────────────────────────────────────────────────────
function seedHours() {
  const count = db.prepare('SELECT COUNT(*) as c FROM opening_hours').get().c;
  if (count > 0) {
    console.log('✓ Horaires déjà présents — skip');
    return;
  }

  // 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
  // Selon dossier :
  // Lundi : midi 11h30-14h30 + soir 18h30-22h
  // Mar-Ven : midi 11h30-14h30 + soir 18h30-22h30
  // Sam-Dim : seulement soir 18h30-22h30
  const hours = [
    // Dimanche
    { d: 0, s: 'lunch', closed: 1, opens: null, closes: null },
    { d: 0, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
    // Lundi
    { d: 1, s: 'lunch', closed: 0, opens: '11:30', closes: '14:30' },
    { d: 1, s: 'dinner', closed: 0, opens: '18:30', closes: '22:00' },
    // Mardi
    { d: 2, s: 'lunch', closed: 0, opens: '11:30', closes: '14:30' },
    { d: 2, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
    // Mercredi
    { d: 3, s: 'lunch', closed: 0, opens: '11:30', closes: '14:30' },
    { d: 3, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
    // Jeudi
    { d: 4, s: 'lunch', closed: 0, opens: '11:30', closes: '14:30' },
    { d: 4, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
    // Vendredi
    { d: 5, s: 'lunch', closed: 0, opens: '11:30', closes: '14:30' },
    { d: 5, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
    // Samedi
    { d: 6, s: 'lunch', closed: 1, opens: null, closes: null },
    { d: 6, s: 'dinner', closed: 0, opens: '18:30', closes: '22:30' },
  ];

  const stmt = db.prepare(`
    INSERT INTO opening_hours (day_of_week, service, opens, closes, is_closed)
    VALUES (?, ?, ?, ?, ?)
  `);
  const tx = db.transaction(() => {
    hours.forEach((h) => stmt.run(h.d, h.s, h.opens, h.closes, h.closed));
  });
  tx();
  console.log(`✓ ${hours.length} créneaux d'horaires créés`);
}

// ─── 4. CATÉGORIES ───────────────────────────────────────────────────────────
function seedCategories() {
  const count = db.prepare('SELECT COUNT(*) as c FROM menu_categories').get().c;
  if (count > 0) {
    console.log('✓ Catégories déjà présentes — skip');
    return null; // signale qu'on ne seed pas non plus les items
  }

  const categories = MENU_CATEGORIES;

  const stmt = db.prepare(`
    INSERT INTO menu_categories (slug, name_fr, name_en, name_it, description_fr, description_en, description_it, display_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  const tx = db.transaction(() => {
    categories.forEach((c) => {
      stmt.run(c.slug, c.name_fr, c.name_en, c.name_it, c.description_fr, c.description_en, c.description_it, c.display_order);
    });
  });
  tx();
  console.log(`✓ ${categories.length} catégories créées`);
  return true;
}

// ─── 5. PLATS ────────────────────────────────────────────────────────────────
function seedItems() {
  const cats = db.prepare('SELECT id, slug FROM menu_categories').all();
  const catBySlug = {};
  cats.forEach((c) => { catBySlug[c.slug] = c.id; });

  // Carte reconstituée fidèlement depuis Uber Eats (cf. scripts/menu-data.js)
  const items = MENU_ITEMS;

  const stmt = db.prepare(`
    INSERT INTO menu_items
      (category_id, name_fr, name_en, name_it, description_fr, description_en, description_it, price, is_veggie, is_featured, is_visible, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);

  const tx = db.transaction(() => {
    items.forEach((i) => {
      const catId = catBySlug[i.cat];
      if (!catId) {
        console.warn(`  ⚠ Catégorie "${i.cat}" introuvable, skip "${i.name_fr}"`);
        return;
      }
      stmt.run(
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
  console.log(`✓ ${items.length} plats créés`);
}

// ─── 6. AVIS ─────────────────────────────────────────────────────────────────
function seedReviews() {
  const count = db.prepare('SELECT COUNT(*) as c FROM reviews').get().c;
  if (count > 0) {
    console.log('✓ Avis déjà présents — skip');
    return;
  }

  // Verbatims du dossier (recensiones récentes Google)
  const reviews = [
    {
      author: 'Camille M.',
      source: 'Google',
      rating: 5,
      content_fr: 'Les meilleurs smash burgers que j\'ai mangé à Avignon. Viande de qualité, frites maison parfaites, et l\'accueil est top. On y retourne !',
      content_en: 'The best smash burgers I\'ve had in Avignon. Quality beef, perfect homemade fries, and the welcome is great. We\'ll be back!',
      content_it: 'I migliori smash burger che abbia mangiato ad Avignone. Carne di qualità, patatine fatte in casa perfette, e l\'accoglienza è top. Torneremo!',
    },
    {
      author: 'Lucas D.',
      source: 'Google',
      rating: 5,
      content_fr: 'Une découverte. Les frites de panisses sont une tuerie, vraiment quelque chose qu\'on ne trouve nulle part ailleurs. Le burger Signature : un vrai régal.',
      content_en: 'A real find. The panisse fries are amazing, really something you don\'t find anywhere else. The Signature burger: pure delight.',
      content_it: 'Una scoperta. Le panisse fritte sono pazzesche, davvero qualcosa che non si trova altrove. Il burger Signature: una vera delizia.',
    },
    {
      author: 'Sarah B.',
      source: 'Google',
      rating: 5,
      content_fr: 'Cuisine fait maison du début à la fin, on le sent. La mousse au chocolat est une dinguerie, je n\'en avais jamais mangé d\'aussi bonne. Service rapide et souriant.',
      content_en: 'Homemade from start to finish, you can taste it. The chocolate mousse is insane, I\'ve never had a better one. Quick and friendly service.',
      content_it: 'Fatto in casa dall\'inizio alla fine, si sente. La mousse al cioccolato è pazzesca, non ne avevo mai mangiata una così buona. Servizio veloce e cordiale.',
    },
    {
      author: 'Thomas P.',
      source: 'Google',
      rating: 5,
      content_fr: 'Le rapport qualité-prix est imbattable. Le tacos XL est largement de quoi caler, les sauces maison font la différence. À recommander !',
      content_en: 'Unbeatable value for money. The XL tacos is more than filling, the homemade sauces make all the difference. Highly recommended!',
      content_it: 'Rapporto qualità-prezzo imbattibile. Il tacos XL è più che sufficiente per saziarsi, le salse della casa fanno la differenza. Da consigliare!',
    },
  ];

  const stmt = db.prepare(`
    INSERT INTO reviews (author, source, rating, content_fr, content_en, content_it, display_order, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  reviews.forEach((r, i) => {
    stmt.run(r.author, r.source, r.rating, r.content_fr, r.content_en, r.content_it, i);
  });
  console.log(`✓ ${reviews.length} avis ajoutés`);
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🍔 Street Food Vla — Seed\n');

  await seedAdmin();
  seedSettings();
  seedHours();
  seedCategories();
  seedItems();
  seedReviews();

  console.log('\n✓ Seed terminé.\n');
  console.log('Étapes suivantes :');
  console.log('  1. Démarrer le serveur : npm run dev (ou npm start en prod)');
  console.log('  2. Visiter le site : http://localhost:3000');
  console.log('  3. Se connecter à l\'admin : http://localhost:3000/admin/login');
  console.log(`     Identifiant : ${process.env.ADMIN_USERNAME || 'admin'}`);
  console.log(`     Mot de passe : voir .env`);
  console.log('  4. ⚠  Changer le mot de passe immédiatement sur /admin/account\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
