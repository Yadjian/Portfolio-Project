# Étape 1 : Build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet et construire l'application
COPY . .
RUN npm run build

# Étape 2 : Production
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Exposer le port utilisé par l'application
EXPOSE 3000

# Ajouter un utilisateur non-root pour des raisons de sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Donner la propriété du dossier de l'application à notre utilisateur
RUN chown -R appuser:appgroup /usr/src/app

# Utiliser notre utilisateur non-root
USER appuser

# Commande pour démarrer l'application
CMD ["node", "dist/main.js"]