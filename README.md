# Street Food Vla — Site vitrine

Site officiel du restaurant **Street Food Vla** (Villeneuve-lès-Avignon).
Smash burgers, tacos & spécialités provençales.

## ✨ Fonctionnalités

- **Public** : Hero animé, carte multilingue (FR/EN/IT), galerie, avis clients, page contact avec carte, badge ouvert/fermé en temps réel, bouton flottant Uber Eats sur mobile.
- **Admin** : CRUD complet sur le menu, horaires, galerie, avis et tous les contenus textuels. Upload d'images avec conversion WebP automatique. Logs d'activité. Bandeau d'annonce activable.
- **Sécurité** : helmet (CSP), sessions httpOnly + sameSite=strict, bcrypt 12 rounds, rate-limit sur le login, protection contre les timing attacks.
- **Stack légère** : Node + Express + EJS + SQLite. Pas de build step, pas de framework lourd. Démarre en 200 ms.

## 🚀 Installation

### Prérequis
- Node.js ≥ 18
- npm

### Setup
```bash
# 1. Installer les dépendances
npm install

# 2. Copier la config et l'éditer
cp .env.example .env
# Génère un secret de session fort :
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Colle le résultat dans SESSION_SECRET dans .env
# Définis aussi ADMIN_USERNAME et ADMIN_PASSWORD

# 3. Initialiser la base avec les données du restaurant
npm run seed

# 4. Démarrer
npm run dev    # mode développement (avec rechargement auto)
# ou
npm start      # mode production
```

Le site est ensuite accessible sur :
- **Public** : http://localhost:3000
- **Admin** : http://localhost:3000/admin/login

⚠ **Première connexion** : changez immédiatement le mot de passe sur `/admin/account`.

## 📂 Structure

```
streetfood-vla/
├── src/
│   ├── server.js                  # entrée Express
│   ├── db/database.js             # schema SQLite
│   ├── middleware/                # auth, i18n, upload (sharp)
│   ├── routes/                    # public, admin-auth, admin
│   └── utils/                     # logger, settings, hours
├── views/
│   ├── layouts/                   # public.ejs, admin.ejs, admin-bare.ejs
│   ├── partials/                  # header, footer, etc.
│   ├── public/                    # home, menu, gallery, reviews, contact, legal, 404
│   └── admin/                     # dashboard, settings, hours, menu, gallery, reviews, logs, account
├── public/
│   ├── css/                       # public.css, admin.css
│   ├── js/                        # public.js, admin.js
│   ├── images/                    # logo, etc.
│   └── uploads/                   # images uploadées via l'admin (WebP auto)
├── locales/                       # fr.json, en.json, it.json (UI strings)
├── scripts/
│   ├── seed.js                    # initialisation des données
│   ├── backup.js                  # sauvegarde DB + uploads
│   └── create-admin.js            # CLI pour créer/réinit un admin
├── data/                          # streetfood.db (créé au seed)
└── backups/                       # archives .tar.gz (créées par npm run backup)
```

## 🔐 Configuration (.env)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` ou `production` |
| `PORT` | Port d'écoute (défaut : 3000) |
| `SESSION_SECRET` | **Obligatoire en prod, min 32 caractères**. Générez avec la commande ci-dessus. |
| `COOKIE_SECURE` | `true` en HTTPS, `false` en local HTTP |
| `ADMIN_USERNAME` | Login admin initial (utilisé au seed uniquement) |
| `ADMIN_PASSWORD` | Mot de passe admin initial (à changer après) |
| `PUBLIC_URL` | URL publique du site (utilisée pour OG / JSON-LD) |

## 🛠 Scripts npm

| Commande | Effet |
|----------|-------|
| `npm start` | Démarre le serveur (mode prod) |
| `npm run dev` | Démarre avec nodemon (rechargement auto) |
| `npm run seed` | Initialise / réinitialise les données du restaurant |
| `npm run backup` | Crée une archive `backups/streetfood-YYYY-MM-DDTHH-MM.tar.gz` |
| `npm run create-admin` | CLI pour ajouter un admin ou changer un mot de passe |

## 🌐 Déploiement (VPS + Nginx + PM2)

### 1. Sur le serveur
```bash
# Installer Node 20 (nvm recommandé) et PM2
npm install -g pm2

# Cloner et installer
git clone <votre-repo> /var/www/streetfood-vla
cd /var/www/streetfood-vla
npm ci --omit=dev
cp .env.example .env
nano .env   # remplir SESSION_SECRET + ADMIN_PASSWORD + COOKIE_SECURE=true + PUBLIC_URL

npm run seed

# Lancer avec PM2
pm2 start src/server.js --name streetfood --time
pm2 save
pm2 startup    # suivre les instructions pour démarrage auto
```

### 2. Nginx (reverse proxy + HTTPS)
Exemple de bloc serveur (`/etc/nginx/sites-available/streetfood`) :
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name streetfoodvla.fr www.streetfoodvla.fr;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name streetfoodvla.fr www.streetfoodvla.fr;

    ssl_certificate /etc/letsencrypt/live/streetfoodvla.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/streetfoodvla.fr/privkey.pem;

    # Tailles utiles
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/streetfood-access.log;
    error_log  /var/log/nginx/streetfood-error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache long sur les assets statiques
    location ~* \.(jpg|jpeg|png|gif|webp|css|js|ico|svg|woff2?)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/streetfood /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Certificat Let's Encrypt
certbot --nginx -d streetfoodvla.fr -d www.streetfoodvla.fr
```

### 3. Backups automatiques (cron)
Ajoutez à crontab :
```bash
# Backup quotidien à 4h du matin, conserve 14 jours
0 4 * * * cd /var/www/streetfood-vla && /usr/bin/npm run backup >/dev/null 2>&1
0 5 * * * find /var/www/streetfood-vla/backups -name "*.tar.gz" -mtime +14 -delete
```

## 🔒 Notes de sécurité

- Helmet est configuré avec une CSP stricte (CSP nonces possibles à ajouter si besoin de pousser plus loin).
- Les sessions sont stockées en SQLite (pas en mémoire) → résistantes aux redémarrages PM2.
- Cookies `httpOnly + sameSite=strict + secure` (en prod). Pas de CSRF token côté form car `sameSite=strict` couvre le cas pour des forms internes ; ajoutez `csurf` si vous exposez l'admin sur un domaine partagé avec d'autres apps.
- Login : rate-limit 8 tentatives / 15 min par IP. Comparaison bcrypt avec hash factice si user inconnu (timing-safe).
- Uploads : limités à 8 MB, MIME vérifié, redimensionnés et convertis en WebP par sharp.
- Logs admin : toute action est tracée (qui, quoi, quand, IP).

## 🧪 Tester en local

```bash
npm run dev
# Visiter http://localhost:3000
# Admin : http://localhost:3000/admin/login (admin / le mdp défini dans .env)
```

## 📝 Modifier le contenu

Tout est éditable via l'admin :
- **Contenu général** (`/admin/settings`) : hero, à propos, contact, réseaux sociaux, bandeau d'annonce — chaque champ disponible en FR / EN / IT.
- **Menu** (`/admin/menu`) : catégories, plats, prix, photos, marquage végé / coup de cœur.
- **Horaires** (`/admin/hours`) : créneaux midi/soir par jour.
- **Galerie** (`/admin/gallery`) : import multiple, drag & drop pour réordonner.
- **Avis** (`/admin/reviews`) : verbatims libres, multilingues.
- **Compte** (`/admin/account`) : changer son mot de passe.

Pas besoin de redéploiement pour changer le contenu — tout est en DB.

## 📜 Licence

Site sur mesure. Tous droits réservés au restaurant Street Food Vla.
# streetfood-vla
