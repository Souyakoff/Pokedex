document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'http://localhost:5001';
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const randomButton = document.getElementById('random-button');
    const searchTypeSelect = document.getElementById('search-type');

    // Récupération d'un Pokémon au hasard
    const fetchRandomPokemon = () => {
        fetch(`${BACKEND_URL}/hasard`)
            .then(response => response.json())
            .then(data => displayPokemon([data]))
            .catch(error => console.error('Erreur:', error));
    };

    // Récupération selon le type de recherche
    const fetchPokemon = (searchType, query) => {
        let url = '';
        switch (searchType) {
            case 'name': url = `${BACKEND_URL}/pokemon/name/${encodeURIComponent(query)}`; break;
            case 'id': url = `${BACKEND_URL}/pokemon/${encodeURIComponent(query)}`; break;
            case 'type': url = `${BACKEND_URL}/pokemon/type/${encodeURIComponent(query)}`; break;
            case 'hp': url = `${BACKEND_URL}/pokemon/hp/${encodeURIComponent(query)}`; break;
            case 'attack': url = `${BACKEND_URL}/pokemon/attack/${encodeURIComponent(query)}`; break;
            case 'defense': url = `${BACKEND_URL}/pokemon/defense/${encodeURIComponent(query)}`; break;
            case 'spattack': url = `${BACKEND_URL}/pokemon/spattack/${encodeURIComponent(query)}`; break;
            case 'speed': url = `${BACKEND_URL}/pokemon/speed/${encodeURIComponent(query)}`; break;
            default: alert('Type de recherche non valide'); return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Aucun Pokémon trouvé');
                return response.json();
            })
            .then(data => Array.isArray(data) ? displayPokemon(data) : displayPokemon([data]))
            .catch(error => alert(error.message));
    };

    // Afficher les Pokémon
    const displayPokemon = (pokemonList) => {
        pokemonContainer.innerHTML = ''; // Nettoyer les anciens résultats
        pokemonList.forEach((pokemon, index) => {
            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.style.animationDelay = `${index * 0.1}s`;

            const formatId = id => id.toString().padStart(3, '0');

            // Image du Pokémon
            const img = document.createElement('img');
            const formattedId = formatId(pokemon.id);
            img.src = `${BACKEND_URL}/pokemon/image/${formattedId}`;
            img.onerror = () => { img.src = 'placeholder.png'; };
            card.appendChild(img);

            // Informations
            const info = document.createElement('div');
            info.classList.add('pokemon-info');

            const name = document.createElement('h2');
            name.textContent = `${pokemon.name.french} (#${pokemon.id})`;
            info.appendChild(name);

            const typeContainer = document.createElement('div');
            pokemon.type.forEach(type => {
                const typeBadge = document.createElement('span');
                typeBadge.classList.add('type-badge', `type-${type}`);
                typeBadge.textContent = type;
                typeContainer.appendChild(typeBadge);
            });
            info.appendChild(typeContainer);

            const stats = document.createElement('p');
            stats.innerHTML = `
                <strong>PV:</strong> ${pokemon.base.HP}<br>
                <strong>Attaque:</strong> ${pokemon.base.Attack}<br>
                <strong>Défense:</strong> ${pokemon.base.Defense}<br>
                <strong>Attaque Spéciale:</strong> ${pokemon.base['Sp. Attack']}<br>
                <strong>Défense Spéciale:</strong> ${pokemon.base['Sp. Defense']}<br>
                <strong>Vitesse:</strong> ${pokemon.base.Speed}
            `;
            info.appendChild(stats);

            card.appendChild(info);
            pokemonContainer.appendChild(card);
        });
    };

    // Événements
    searchButton.addEventListener('click', () => {
        const query = searchBar.value.trim();
        const searchType = searchTypeSelect.value;
        if (query) fetchPokemon(searchType, query);
    });

    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchButton.click();
    });

    randomButton.addEventListener('click', fetchRandomPokemon);

    // Charger un Pokémon au hasard au démarrage
    fetchRandomPokemon();
});
