

# Pokedex

Un projet éducatif combinant frontend et backend pour créer une application de Pokédex.

## Description

Cette application permet de visualiser des informations détaillées sur les Pokémon, telles que leurs noms, types, statistiques et autres caractéristiques importantes. Elle utilise Docker pour isoler les environnements backend et frontend, garantissant une configuration simplifiée et reproductible.

## Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript.
- **Backend** : Node.js.
- **Conteneurisation** : Docker et Docker Compose.

---

## Structure des fichiers Docker

### Dockerfile (Backend)
Ce fichier configure l'environnement nécessaire pour exécuter le backend :
```dockerfile
# Utilisation d'une image Node.js officielle
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste des fichiers
COPY . .

# Exposer le port utilisé par le serveur
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
```

### Docker Compose
Le fichier `docker-compose.yml` orchestre plusieurs services (frontend et backend) :
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./BACKEND
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./BACKEND:/app
    environment:
      - NODE_ENV=development

  frontend:
    build:
      context: ./FRONTEND
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    volumes:
      - ./FRONTEND:/usr/share/nginx/html
    depends_on:
      - backend
```

---

## Installation et conteneurisation

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/Souyakoff/Pokedex.git
   cd Pokedex
   ```

2. **Construisez les images Docker** :
   ```bash
   docker-compose build
   ```

3. **Démarrez les conteneurs** :
   ```bash
   docker-compose up
   ```

4. **Accédez à l'application** :
   - Backend : `http://localhost:3000`.
   - Frontend : `http://localhost:8080`.

5. **Arrêtez les conteneurs** :
   ```bash
   docker-compose down
   ```

---

## Fonctionnalités

- **Consulter les Pokémon** : Visualisez les Pokémon avec leurs informations essentielles.
- **Recherche** : Trouvez un Pokémon spécifique grâce à une barre de recherche.
- **Navigation fluide** : Parcourez les listes avec un affichage optimisé.
- **Interface utilisateur moderne** : Design simple et efficace pour une meilleure expérience.

---

Tu peux remplacer les exemples si ton projet a des configurations ou ports spécifiques. Si tu as besoin de plus de détails sur la création ou modification des fichiers Docker, fais-le-moi savoir ! 😊
