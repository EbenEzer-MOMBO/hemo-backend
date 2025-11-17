# Guide de déploiement Hemo-Backend

## 🏠 Développement local (SQLite)

Votre fichier `.env` local doit contenir :
```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET=votre_secret_jwt_local
```

**IMPORTANT** : Pour le développement local, le `schema.prisma` est configuré pour PostgreSQL.
Si vous voulez continuer avec SQLite en local, vous avez deux options :

### Option A : Garder SQLite en local
1. **NE PAS** modifier `schema.prisma` (laissez PostgreSQL)
2. Développez uniquement avec votre base actuelle `dev.db`
3. Ne faites pas de nouvelles migrations en local
4. Testez les nouvelles migrations directement sur Render

### Option B : Basculer temporairement en SQLite (non recommandé)
1. Changez `provider = "postgresql"` en `provider = "sqlite"` dans `schema.prisma`
2. Faites vos migrations
3. **AVANT de commit**, remettez `provider = "postgresql"`

## 🚀 Production (Render + PostgreSQL)

### Configuration actuelle :
- `schema.prisma` : PostgreSQL ✅
- `render.yaml` : Configuration automatique ✅
- Script `build` : Configuré ✅

### Étapes de déploiement :

1. **Commitez vos changements** :
```bash
git add .
git commit -m "Configuration pour Render"
git push origin main
```

2. **Sur Render.com** :
   - Connectez votre dépôt
   - Choisissez "Blueprint" → Render détectera `render.yaml`
   - Ou créez manuellement :
     - New Web Service
     - Build Command : `npm install && npm run build`
     - Start Command : `npm start`

3. **Variables d'environnement sur Render** :
   - `DATABASE_URL` : Fourni automatiquement par PostgreSQL Render
   - `JWT_SECRET` : Générez-en un nouveau
   - `PORT` : Render l'attribue automatiquement
   - `NODE_ENV` : `production`

### Initialiser les utilisateurs en production :
Après le premier déploiement, exécutez dans le shell Render :
```bash
node src/initusers.js
```

## 🔄 Workflow recommandé

1. **Développez en local** avec votre SQLite existant
2. **Testez vos features** en local
3. **Commitez et pushez** vers Git
4. **Render déploie automatiquement** avec PostgreSQL
5. Les migrations se lancent automatiquement via `npm run build`

## ⚠️ Notes importantes

- SQLite et PostgreSQL ont quelques différences mineures
- Testez bien en production après chaque migration importante
- Le plan gratuit Render dort après 15 min d'inactivité
- Premier démarrage : ~30 secondes

