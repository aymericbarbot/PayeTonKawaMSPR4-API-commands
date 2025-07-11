# PayeTonKawaMSPR4-API-commande

# FICHIER .ENV
## Pour les variables d'environnement, créer un fichier .env à la racine du projet
## et se trourner vers un collaborateur pour les ajouter
## Penser à faire un npm install ensuite pour remettre à jour les dépendances et prendre en compte le .env

# Docker

Ouvrir l'application Docker Desktop

Se placer dans le répertoire du projet, lancer les conteneurs:

docker-compose up --build

(Le service commande est exposé sur le port 3006)

Pour arrêter les conteneurs:

docker compose down

# Local

## Installer les dépendances

npm install

## builder l'app

npm run build

## démarrer l'app

npm run dev
npm run start