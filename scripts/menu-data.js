/**
 * Carte Street Food Vla — source de vérité
 * Reconstituée fidèlement depuis la page Uber Eats du restaurant.
 *
 * ⚠ Les prix proviennent d'Uber Eats (ils incluent la majoration plateforme).
 *   Ajuste-les si tu veux afficher les prix sur place.
 *
 * Utilisé par scripts/seed.js (install) et scripts/refresh-menu.js (mise à jour).
 */

const categories = [
  {
    slug: 'burgers',
    name_fr: 'Burgers 🍔', name_en: 'Burgers 🍔', name_it: 'Burger 🍔',
    description_fr: 'Buns brioché, double steak smash, viande française. Tout est préparé minute.',
    description_en: 'Brioche buns, double smash patty, French beef. Made to order.',
    description_it: 'Pane brioche, doppio hamburger smash, manzo francese. Preparato al momento.',
    display_order: 1,
  },
  {
    slug: 'tacos',
    name_fr: 'Tacos', name_en: 'Tacos', name_it: 'Tacos',
    description_fr: 'Galette, viandes au choix, fromage, sauces maison et accompagnements.',
    description_en: 'Tortilla, your choice of meat, cheese, house sauces and sides.',
    description_it: 'Tortilla, carne a scelta, formaggio, salse fatte in casa e contorni.',
    display_order: 2,
  },
  {
    slug: 'box',
    name_fr: 'Nos box 🔥', name_en: 'Our boxes 🔥', name_it: 'Le nostre box 🔥',
    description_fr: 'À grignoter ou à partager.',
    description_en: 'To snack on or to share.',
    description_it: 'Da sgranocchiare o da condividere.',
    display_order: 3,
  },
  {
    slug: 'salades',
    name_fr: '💚 Salades 🥗', name_en: '💚 Salads 🥗', name_it: '💚 Insalate 🥗',
    description_fr: 'Pour les amateurs de fraîcheur.',
    description_en: 'For those who love it fresh.',
    description_it: 'Per chi ama il fresco.',
    display_order: 4,
  },
  {
    slug: 'desserts',
    name_fr: 'Desserts 🍰', name_en: 'Desserts 🍰', name_it: 'Dessert 🍰',
    description_fr: 'Pour finir en douceur.',
    description_en: 'To finish on a sweet note.',
    description_it: 'Per finire in dolcezza.',
    display_order: 5,
  },
  {
    slug: 'boissons',
    name_fr: 'Boissons 🧃', name_en: 'Drinks 🧃', name_it: 'Bevande 🧃',
    description_fr: 'Canettes 33 cl.',
    description_en: '33 cl cans.',
    description_it: 'Lattine 33 cl.',
    display_order: 6,
  },
];

const items = [
  // ─── Burgers ───────────────────────────────────────────────────────────────
  {
    cat: 'burgers', name_fr: 'Street Smash', name_en: 'Street Smash', name_it: 'Street Smash',
    desc_fr: 'Double steak smash, cheddar maturé, oignon blanc, pickles, sauce maison.',
    desc_en: 'Double smash patty, matured cheddar, white onion, pickles, house sauce.',
    desc_it: 'Doppio hamburger smash, cheddar stagionato, cipolla bianca, pickles, salsa della casa.',
    price: '11,80 €', featured: 1, order: 1,
  },
  {
    cat: 'burgers', name_fr: 'Signature', name_en: 'Signature', name_it: 'Signature',
    desc_fr: 'Double steak smash, oignon confit au thym et au miel, cheddar maturé, salade, crème à la truffe.',
    desc_en: 'Double smash patty, thyme & honey caramelized onion, matured cheddar, lettuce, truffle cream.',
    desc_it: 'Doppio hamburger smash, cipolla confit al timo e miele, cheddar stagionato, insalata, crema al tartufo.',
    price: '15,60 €', featured: 1, order: 2,
  },
  {
    cat: 'burgers', name_fr: 'Daily Street Smash', name_en: 'Daily Street Smash', name_it: 'Daily Street Smash',
    desc_fr: 'Le burger du Chef, il change tous les mois.',
    desc_en: 'The Chef\'s burger, it changes every month.',
    desc_it: 'Il burger dello Chef, cambia ogni mese.',
    price: '16,90 €', featured: 1, order: 3,
  },
  {
    cat: 'burgers', name_fr: 'Street Vegan', name_en: 'Street Vegan', name_it: 'Street Vegan',
    desc_fr: 'Champignon portobello, cheddar maturé, tomate confite, sauce maison.',
    desc_en: 'Portobello mushroom, matured cheddar, confit tomato, house sauce.',
    desc_it: 'Fungo portobello, cheddar stagionato, pomodoro confit, salsa della casa.',
    price: '15,80 €', veggie: 1, order: 4,
  },

  // ─── Tacos ───────────────────────────────────────────────────────────────
  {
    cat: 'tacos', name_fr: 'Tacos L', name_en: 'Tacos L', name_it: 'Tacos L',
    desc_fr: '1 galette, 1 viande, 1 fromage, 2 sauces fromagères et 1 sauce au choix. Servi avec 3 accompagnements au choix.',
    desc_en: '1 tortilla, 1 meat, 1 cheese, 2 cheese sauces and 1 sauce of your choice. Served with 3 sides of your choice.',
    desc_it: '1 tortilla, 1 carne, 1 formaggio, 2 salse al formaggio e 1 salsa a scelta. Servito con 3 contorni a scelta.',
    price: '11,57 €', order: 1,
  },
  {
    cat: 'tacos', name_fr: 'Tacos XL', name_en: 'Tacos XL', name_it: 'Tacos XL',
    desc_fr: '1 galette, 2 viandes, 1 fromage, 2 sauces fromagères et 1 sauce au choix. Servi avec 3 accompagnements au choix.',
    desc_en: '1 tortilla, 2 meats, 1 cheese, 2 cheese sauces and 1 sauce of your choice. Served with 3 sides of your choice.',
    desc_it: '1 tortilla, 2 carni, 1 formaggio, 2 salse al formaggio e 1 salsa a scelta. Servito con 3 contorni a scelta.',
    price: '14,17 €', featured: 1, order: 2,
  },
  {
    cat: 'tacos', name_fr: 'Tacos XXL', name_en: 'Tacos XXL', name_it: 'Tacos XXL',
    desc_fr: '2 galettes, 3 viandes, 1 fromage, 2 sauces fromagères et 1 sauce au choix.',
    desc_en: '2 tortillas, 3 meats, 1 cheese, 2 cheese sauces and 1 sauce of your choice.',
    desc_it: '2 tortillas, 3 carni, 1 formaggio, 2 salse al formaggio e 1 salsa a scelta.',
    price: '16,77 €', order: 3,
  },

  // ─── Nos box ───────────────────────────────────────────────────────────────
  {
    cat: 'box', name_fr: 'Frite de panisse x5 🍟', name_en: 'Panisse fries x5 🍟', name_it: 'Panisse fritte x5 🍟',
    desc_fr: '5 bâtons de panisse (farine de pois chiches).',
    desc_en: '5 panisse sticks (chickpea flour).',
    desc_it: '5 bastoncini di panisse (farina di ceci).',
    price: '5,10 €', veggie: 1, featured: 1, order: 1,
  },
  {
    cat: 'box', name_fr: 'Tenders maison', name_en: 'Homemade tenders', name_it: 'Tenders fatti in casa',
    desc_fr: 'Lot de 3 tenders frits maison.',
    desc_en: 'Pack of 3 homemade fried tenders.',
    desc_it: 'Confezione di 3 tenders fritti fatti in casa.',
    price: '6,40 €', order: 2,
  },
  {
    cat: 'box', name_fr: 'Sticks Mozzarella', name_en: 'Mozzarella sticks', name_it: 'Sticks di mozzarella',
    desc_fr: '', desc_en: '', desc_it: '',
    price: '5,85 €', veggie: 1, order: 3,
  },
  {
    cat: 'box', name_fr: 'Nuggets', name_en: 'Nuggets', name_it: 'Nuggets',
    desc_fr: '', desc_en: '', desc_it: '',
    price: '4,55 €', order: 4,
  },
  {
    cat: 'box', name_fr: 'Chilli Cheese 🌶️', name_en: 'Chilli Cheese 🌶️', name_it: 'Chilli Cheese 🌶️',
    desc_fr: 'x4.', desc_en: 'x4.', desc_it: 'x4.',
    price: '3,90 €', veggie: 1, order: 5,
  },
  {
    cat: 'box', name_fr: 'Onion rings', name_en: 'Onion rings', name_it: 'Onion rings',
    desc_fr: '', desc_en: '', desc_it: '',
    price: '3,25 €', veggie: 1, order: 6,
  },

  // ─── Salades ───────────────────────────────────────────────────────────────
  {
    cat: 'salades', name_fr: 'Salade César', name_en: 'Caesar Salad', name_it: 'Insalata Cesar',
    desc_fr: 'Salade du maraîcher, tomates, croûtons à l\'ail, copeaux de parmesan et viande au choix.',
    desc_en: 'Market greens, tomatoes, garlic croutons, parmesan shavings and your choice of meat.',
    desc_it: 'Insalata dell\'ortolano, pomodori, crostini all\'aglio, scaglie di parmigiano e carne a scelta.',
    price: '11,57 €', order: 1,
  },

  // ─── Desserts ────────────────────────────────────────────────────────────────
  {
    cat: 'desserts', name_fr: 'Smash Nut 🤎🍫', name_en: 'Smash Nut 🤎🍫', name_it: 'Smash Nut 🤎🍫',
    desc_fr: 'Smash sucré au Nutella.',
    desc_en: 'Sweet smash with Nutella.',
    desc_it: 'Smash dolce alla Nutella.',
    price: '3,90 €', veggie: 1, order: 1,
  },

  // ─── Boissons ────────────────────────────────────────────────────────────────
  {
    cat: 'boissons', name_fr: 'Coca-Cola', name_en: 'Coca-Cola', name_it: 'Coca-Cola',
    desc_fr: '33 cl.', desc_en: '33 cl.', desc_it: '33 cl.',
    price: '2,73 €', order: 1,
  },
  {
    cat: 'boissons', name_fr: 'Coca-Cola Cherry', name_en: 'Coca-Cola Cherry', name_it: 'Coca-Cola Cherry',
    desc_fr: '33 cl.', desc_en: '33 cl.', desc_it: '33 cl.',
    price: '2,73 €', order: 2,
  },
  {
    cat: 'boissons', name_fr: 'Orangina 💛', name_en: 'Orangina 💛', name_it: 'Orangina 💛',
    desc_fr: '33 cl.', desc_en: '33 cl.', desc_it: '33 cl.',
    price: '2,73 €', order: 3,
  },
  {
    cat: 'boissons', name_fr: 'Oasis tropical 🧡', name_en: 'Tropical Oasis 🧡', name_it: 'Oasis tropical 🧡',
    desc_fr: '33 cl.', desc_en: '33 cl.', desc_it: '33 cl.',
    price: '2,73 €', order: 4,
  },
  {
    cat: 'boissons', name_fr: 'Ice tea', name_en: 'Ice tea', name_it: 'Ice tea',
    desc_fr: '33 cl.', desc_en: '33 cl.', desc_it: '33 cl.',
    price: '2,73 €', order: 5,
  },
];

module.exports = { categories, items };
