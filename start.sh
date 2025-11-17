#!/bin/bash
# Script de démarrage pour Render

echo "🔧 Génération du client Prisma..."
npx prisma generate

echo "🚀 Démarrage du serveur..."
node src/server.js

