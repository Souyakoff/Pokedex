# Image utilisée
FROM node:18

# Création du dossier de travail
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app

# Installation de nodemon globalement
RUN npm install -g nodemon

# Copie des fichiers nécessaires
COPY ./app/package.json /app/package.json

# Installation des dépendances
RUN npm install 

# Copie du reste de l'application
COPY ./app /app

# Attribution des permissions à l'utilisateur 'node'
USER node

# Porte d'écoute
EXPOSE 5001

# Commande de démarrage
CMD ["nodemon", "index.js"]