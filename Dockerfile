# Image utilisée
FROM node:18

# Création du dossier de travail
RUN mkdir -p /BACKEND/node_modules && chown -R node:node /BACKEND
WORKDIR /BACKEND

# Installation de nodemon globalement
RUN npm install -g nodemon

# Copie des fichiers nécessaires
COPY ./BACKEND/package.json /BACKEND/package.json

# Installation des dépendances
RUN npm install 

# Copie du reste de l'application
COPY ./BACKEND /BACKEND

# Attribution des permissions à l'utilisateur 'node'
USER node

# Porte d'écoute
EXPOSE 5003

# Commande de démarrage
CMD ["nodemon", "index.js"]
