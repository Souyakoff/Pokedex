/**
* Serveur Backend Pokedex
*/
//console.log ("Hello World!");


// Définir l'emplacement des fichiers bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
// Définir l'emplacement des images
const IMAGES_SRC = "./FILES/images";
// Emplacement du fichier de types
const TYPES_SRC = "./DATA/types.json";

// Définir un port
const PORT = 5003;
// ************************************************
// Lancer un serveur express sur un port défini
const fs = require('fs');
// npm install express
const express = require('express');
const app = express();

// Servir les fichiers statiques du dossier IMAGES_SRC
app.use('/images', express.static(IMAGES_SRC));

// Fonction pour convertir l'ID en 3 chiffres
function formatId(id) {
    return id.toString().padStart(3, '0');
}

function findAllPokemon(request, response) {
    
    //lis les données du fichier pokedex.JSON
    let data = fs.readFileSync(POKEDEX_SRC);

    //Analyse le Json 
    let pokedex = JSON.parse(data);

    response.send(pokedex);
}


// Route pour afficher tout le Pokédex (appel de la fonction findAllPokemon)
app.get('/', findAllPokemon);


function randomPokemon(request, response) {
    //Lis les données du fichier pokedex.JSON
    let data = fs.readFileSync(POKEDEX_SRC);

    //Analyse le Json
    let pokedex = JSON.parse(data);

    //Retourne l'id d'un pokemon entre 0 et 809 (nb total de pokemeon présent dans le pokedex)
    let randomIndex = Math.floor(Math.random() * 810);

    //Renvoie un Pokémon aléatoire grace a l'id trouvée
    response.send(pokedex[randomIndex]);
}

app.get('/hasard', randomPokemon)

function PokemonName(request, response){

 // Récupère la langue et le nom du Pokémon depuis les paramètres de l'URL
 let language = request.params.language.toLowerCase(); 
 let pokemonName = request.params.name.toLowerCase(); 

 // Lis les données du fichier pokedex.json
 let data = fs.readFileSync(POKEDEX_SRC);

 // Analyse le JSON
 let pokedex = JSON.parse(data);

 // Recherche un Pokémon avec le nom correspond dans la langue spécifiée
 let pokemon = pokedex.find(p => {
     // Vérification que p.name existe et que la langue est valide
     return p.name && p.name[language] && p.name[language].toLowerCase() === pokemonName;
 });

 if (pokemon) {
    let formattedId = formatId(pokemon.id);
    pokemon.image = `${request.protocol}://${request.get('host')}/images/${formattedId}.png`;
     // Si le Pokémon existe, on le renvoie
     response.send(pokemon);
 } else {
     // Si le Pokémon n'est pas trouvé, on renvoie une erreur 404
     response.status(404).send({ error: `Pokémon '${pokemonName}' non trouvé en ${language}.` });
    }
}

// Route pour obtenir un Pokémon par nom
app.get('/pokemon/:language/:name', PokemonName);

function getPokemonById(request, response) {
    // Récupère l'ID du Pokémon depuis les paramètres de l'URL
    let pokemonId = parseInt(request.params.id);

    // Lis les données du fichier pokedex.json
    let data = fs.readFileSync(POKEDEX_SRC);

    // Analyse le JSON
    let pokedex = JSON.parse(data);

    // Recherche un Pokémon dont l'ID correspond
    let pokemon = pokedex.find(p => p.id === pokemonId);

    if (pokemon) {
        let formattedId = formatId(pokemon.id);
        pokemon.image = `${request.protocol}://${request.get('host')}/images/${formattedId}.png`;
        // Si le Pokémon existe, on le renvoie
        response.send(pokemon);
    } else {
        // Si le Pokémon n'est pas trouvé, on renvoie une erreur 404
        response.status(404).send({ error: `Pokémon avec l'ID '${pokemonId}' non trouvé.` });
    }
}
// Route pour obtenir un Pokémon par id
app.get('/pokemon/:id', getPokemonById);

function PokemonByType(request, response) {
    // Récupère la langue et le type du Pokémon depuis les paramètres de l'URL
    let language = request.params.language.toLowerCase();
    let pokemonType = request.params.type.toLowerCase();

    // Lis les données des fichiers
    let typeData = fs.readFileSync(TYPES_SRC);
    let pokedexData = fs.readFileSync(POKEDEX_SRC);

    let types = JSON.parse(typeData);
    let pokedex = JSON.parse(pokedexData);

    // Trouver le type en anglais correspondant à la langue et au type fournis
    let englishType = types.find(t => t[language] && t[language].toLowerCase() === pokemonType);

    if (!englishType) {
        return response.status(404).send({ error: `Type '${pokemonType}' non trouvé en ${language}.` });
    }

    // Filtrer les Pokémon qui possèdent ce type
    let matchingPokemon = pokedex.filter(p => 
        p.type && p.type.some(t => t.toLowerCase() === englishType.english.toLowerCase())
    );

    if (matchingPokemon.length > 0) {
        // Retourne la liste des Pokémon
        response.send(matchingPokemon);
    } else {
        response.status(404).send({ error: `Aucun Pokémon trouvé avec le type '${pokemonType}' en ${language}.` });
    }
}

// Route pour obtenir les Pokémon par type et langue
app.get('/pokemon/type/:language/:type', PokemonByType);


function PokemonByHP(request, response) {
    // Récupère les points de vie minimum depuis les paramètres de l'URL
    let minHP = parseInt(request.params.hp);

    if (isNaN(minHP) || minHP < 0) {
        return response.status(400).send({ error: "Le paramètre HP doit être un nombre valide supérieur ou égal à 0." });
    }

    // Lis les données du fichier pokedex.json
    let data = fs.readFileSync(POKEDEX_SRC);
    let pokedex = JSON.parse(data);

    // Filtrer les Pokémon dont le HP est supérieur ou égal à minHP
    let matchingPokemon = pokedex.filter(p => p.base.HP && p.base.HP >= minHP);

    if (matchingPokemon.length > 0) {
        // Retourne la liste des Pokémon
        response.send(matchingPokemon);
    } else {
        response.status(404).send({ error: `Aucun Pokémon trouvé avec HP >= ${minHP}.` });
    }
}

// Route pour obtenir les Pokémon par HP
app.get('/pokemon/hp/:hp', PokemonByHP);

function PokemonByAttack(request, response) {
    let minAttack = parseInt(request.params.Attack);

    if (isNaN(minAttack) || minAttack < 0) {
        return response.status(400).send({ error: "Le paramètre Attack doit être un nombre valide supérieur ou égal à 0." });
    }

    let data = fs.readFileSync(POKEDEX_SRC);
    let pokedex = JSON.parse(data);

    let matchingPokemon = pokedex.filter(p => p.base.Attack && p.base.Attack >= minAttack);

    if (matchingPokemon.length > 0) {
        response.send(matchingPokemon);
    } else {
        response.status(404).send({ error: `Aucun Pokémon trouvé avec Attack >= ${minAttack}.` });
    }
}

// Route pour obtenir les Pokémon par attaque
app.get('/pokemon/attack/:attack', PokemonByAttack);

function PokemonByDefense(request, response) {
    let minDefense = parseInt(request.params.defense);

    if (isNaN(minDefense) || minDefense < 0) {
        return response.status(400).send({ error: "Le paramètre Defense doit être un nombre valide supérieur ou égal à 0." });
    }

    let data = fs.readFileSync(POKEDEX_SRC);
    let pokedex = JSON.parse(data);

    let matchingPokemon = pokedex.filter(p => p.base.Defense && p.base.Defense >= minDefense);

    if (matchingPokemon.length > 0) {
        response.send(matchingPokemon);
    } else {
        response.status(404).send({ error: `Aucun Pokémon trouvé avec Defense >= ${minDefense}.` });
    }
}

// Route pour obtenir les Pokémon par défense
app.get('/pokemon/defense/:defense', PokemonByDefense);

function PokemonBySpeed(request, response) {
    let minSpeed = parseInt(request.params.speed);

    if (isNaN(minSpeed) || minSpeed < 0) {
        return response.status(400).send({ error: "Le paramètre Speed doit être un nombre valide supérieur ou égal à 0." });
    }

    let data = fs.readFileSync(POKEDEX_SRC);
    let pokedex = JSON.parse(data);

    let matchingPokemon = pokedex.filter(p => p.base.Speed && p.base.Speed >= minSpeed);

    if (matchingPokemon.length > 0) {
        response.send(matchingPokemon);
    } else {
        response.status(404).send({ error: `Aucun Pokémon trouvé avec Speed >= ${minSpeed}.` });
    }
}

// Route pour obtenir les Pokémon par vitesse
app.get('/pokemon/speed/:speed', PokemonBySpeed);





// Lancement du serveur et attendre
app.listen(
 PORT, 
 '0.0.0.0', 
 () => {
 console.log('Server Pokedex is listening on ' + PORT);
 }
)
