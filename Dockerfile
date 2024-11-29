# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /BACKEND

# Copier les fichiers package.json et package-lock.json
#COPY /app/BACKEND/package*.json ./

# Installer les dépendances globales si nécessaire
RUN npm install -g nodemon
RUN npm install express

# Copier le reste des fichiers de l'application
COPY /BACKEND/ .

# Exposer le port sur lequel l'application va tourner
EXPOSE 5003

# La commande CMD est surChargée par le docker-compose
CMD ["nodemon", "index.js"]
