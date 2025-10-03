# Fichier: backend/Dockerfile (Version DÉVELOPPEMENT à utiliser)

FROM node:20-alpine

WORKDIR /usr/src/app

# Copier le manifeste des paquets
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
# (le .dockerignore empêchera la copie de node_modules)
COPY . .

# Générer le client Prisma pour que l'app le trouve au démarrage
RUN npx prisma generate

# Exposer le port de l'application
EXPOSE 3000

# La commande qui lance le serveur en mode développement (hot-reload)
CMD ["npm", "run", "start:dev"]