# Étape de base avec une image légère Node.js
FROM node:22-alpine

# Création du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances (npm install aura besoin de ceux-ci)
COPY package*.json tsconfig.json ./

# Installation des dépendances (dev + prod)
RUN npm install

# Copie du code source
COPY . .

# Compilation TypeScript -> JavaScript
RUN npm run build

EXPOSE 3000

# Commande pour démarrer l'app (attention : il faut que dist/index.js existe)
CMD node dist/index.js & node dist/Consumer.js